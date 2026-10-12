// Generic run-and-gun level, built from a mission definition in MISSIONS (src/levels/).
// Start with this.scene.start('Level', { mission: index }).
const BOSSES = { cobrador: BossCobrador };

class LevelScene extends Phaser.Scene {
  constructor() {
    super('Level');
  }

  create(data = {}) {
    this.missionIndex = Phaser.Math.Clamp(data.mission || 0, 0, MISSIONS.length - 1);
    const M = (this.mission = MISSIONS[this.missionIndex]);
    this.levelW = M.width;
    this.arenaX = M.arenaX;
    this.viewLeft = 0;
    this.bubbles = [];
    this.named = {};
    this.arenaStarted = false;
    this.waves = null;
    this.finished = false;
    this.frozen = false;
    this.boss = null;
    this.registry.set({ bossHp: 0, bossMax: 1, bossName: '' });
    // Clock and tweens survive a scene restart; make sure a previous freeze doesn't carry over.
    this.time.paused = false;
    this.tweens.resumeAll();

    this.physics.world.setBounds(0, -400, this.levelW, 800);
    this.cameras.main.setZoom(CFG.ZOOM).setRoundPixels(true);
    if (CFG.DEBUG) this.physics.world.createDebugGraphic();

    this.buildBackground();
    this.buildGround();
    this.buildDecor();

    this.enemies = this.physics.add.group();
    this.pickups = this.physics.add.group();
    this.pBullets = this.physics.add.group({ allowGravity: false });
    this.eBullets = this.physics.add.group({ allowGravity: false });
    this.pBombs = this.physics.add.group();
    this.eBombs = this.physics.add.group();

    this.createPlayers();
    this.combi = M.combi ? new CombiSlug(this, M.combi.x, CFG.GROUND_Y) : null;
    this.abuelitas = (M.abuelitas || []).map((a) => new Abuelita(this, a.x, CFG.GROUND_Y));
    (M.pickups || []).forEach((p) => this.spawnPickup(p.x, CFG.GROUND_Y - 40, p.kind));
    this.spawns = (M.spawns || []).map((s) => Object.assign({}, s)).sort((a, b) => a.x - b.x);
    this.triggers = (M.events || []).map((e) => Object.assign({}, e)).sort((a, b) => a.x - b.x);

    this.setupCollisions();
    this.updateCamera();

    this.scene.stop('HUD');
    this.scene.launch('HUD');
    Sfx.startMusic();
    this.events.once('shutdown', () => Sfx.stopMusic());
    const sub = M.subtitle + (M.draft ? '\n(BORRADOR)' : '');
    this.time.delayedCall(300, () => this.message(M.title, sub, 2600));
  }

  // ---------- players ----------

  // Fresh run: characters from the select screen. Next mission: lives, scores and characters carry over
  // (players that were out or still deciding come back as 'inactive' and can rejoin with start).
  createPlayers() {
    const n = Session.numPlayers;
    const saved = Session.run && Session.run.players;
    const c0 = Session.chars[0] || 'chato';
    const c1 = Session.chars[1] || CFG.CHARACTERS.map((c) => c.id).find((id) => id !== c0);
    this.players = [c0, c1].map((ch, i) => {
      const s = saved && saved[i];
      const p = new Player(this, i, s ? s.char : ch, 60 - i * 24, CFG.GROUND_Y);
      if (s) {
        p.score = s.score;
        p.lives = s.lives;
        p.state = s.state;
      } else if (i >= n) p.state = 'inactive';
      if (p.state !== 'play') p.deactivate();
      return p;
    });
    this.setupControls(n);
  }

  savePlayers() {
    Session.run = Session.run || {};
    Session.run.players = this.players.map((p) => ({
      char: p.char,
      score: p.score,
      lives: p.state === 'play' ? p.lives : CFG.CREDITS.LIVES_PER_CREDIT,
      state: p.state === 'play' ? 'play' : 'inactive',
    }));
  }

  // Solo: P1 accepts every key layout. 2P: split keyboard (P1 WASD+F/G/H, P2 arrows+, . /) plus gamepads.
  setupControls(n) {
    const K = CFG.KEYS;
    this.controls = [new Controls(this, n === 1 ? K.solo : K.p1, 0), new Controls(this, K.p2, 1)];
  }

  takenChars(except) {
    return this.players.filter((o) => o !== except && o.state === 'play').map((o) => o.char);
  }

  nextFreeChar(p, dir) {
    const ids = CFG.CHARACTERS.map((c) => c.id), taken = this.takenChars(p);
    let i = ids.indexOf(p.pendingChar);
    if (dir === 0 && !taken.includes(ids[i])) return ids[i];
    for (let k = 0; k < ids.length; k++) {
      i = (i + (dir || 1) + ids.length) % ids.length;
      if (!taken.includes(ids[i])) return ids[i];
    }
    return p.pendingChar;
  }

  beginContinue(p, joining) {
    p.state = 'continue';
    p.joining = joining;
    p.countdown = CFG.CREDITS.CONTINUE_SECONDS * 1000;
    p.pendingChar = p.char;
    p.pendingChar = this.nextFreeChar(p, 0);
    p.deactivate();
  }

  tryContinue(p) {
    if (!Session.pay(1)) {
      Sfx.hit();
      return;
    }
    p.pendingChar = this.nextFreeChar(p, 0);
    p.setCharacter(p.pendingChar);
    p.lives = CFG.CREDITS.LIVES_PER_CREDIT;
    if (p.joining && Session.numPlayers === 1) {
      Session.numPlayers = 2;
      this.setupControls(2);
      this.message('¡2 JUGADORES!', '1P: WASD + F G H     2P: FLECHAS + , . /', 3500);
    }
    p.joining = false;
    p.respawn(this.viewLeft + 60 + p.index * 24);
    Sfx.pickup();
    Fx.say(this, p, '¡Aquí estoy!', 1200);
  }

  // Continue countdowns, character switching, drop-in join.
  updateSlots(delta) {
    if (this.finished) return;
    for (const p of this.players) {
      const c = p.ctrl;
      if (p.state === 'inactive') {
        if (c.startP) this.beginContinue(p, true);
      } else if (p.state === 'continue') {
        p.countdown -= delta;
        if (c.leftP) p.pendingChar = this.nextFreeChar(p, -1);
        if (c.rightP) p.pendingChar = this.nextFreeChar(p, 1);
        if (c.startP || c.fireP || c.jumpP) this.tryContinue(p);
        else if (p.countdown <= 0) {
          p.state = p.joining ? 'inactive' : 'out';
          p.joining = false;
        }
      }
    }
    if (this.players.every((p) => p.state === 'out' || p.state === 'inactive')) this.gameOver();
  }

  // Like the arcade: when nobody is in play, the action stops during the continue countdown.
  updateFreeze() {
    const anyPlay = this.players.some((p) => p.state === 'play');
    if (!anyPlay && !this.frozen && !this.finished) {
      this.frozen = true;
      this.physics.world.pause();
      this.tweens.pauseAll();
      this.time.paused = true;
    } else if ((anyPlay || this.finished) && this.frozen) {
      this.frozen = false;
      this.physics.world.resume();
      this.tweens.resumeAll();
      this.time.paused = false;
    }
  }

  // ---------- world building ----------

  buildBackground() {
    const bg = this.mission.bg || {};
    this.bgSky = this.add.image(0, 0, 'bg_sky').setOrigin(0).setDepth(-10);
    this.bgHills = this.add.tileSprite(0, 70, CFG.VIEW_W, 150, 'bg_hills').setOrigin(0).setDepth(-9);
    this.bgCity = this.add.tileSprite(0, CFG.GROUND_Y - 170, CFG.VIEW_W, 170, 'bg_city').setOrigin(0).setDepth(-8);
    if (bg.sky) this.bgSky.setTint(bg.sky);
    if (bg.hills) this.bgHills.setTint(bg.hills);
    if (bg.city) this.bgCity.setTint(bg.city);
  }

  updateParallax() {
    const L = Math.round(this.viewLeft);
    this.bgSky.x = L;
    this.bgHills.x = L;
    this.bgHills.tilePositionX = Math.round(L * 0.15);
    this.bgCity.x = L;
    this.bgCity.tilePositionX = Math.round(L * 0.45);
  }

  buildGround() {
    const G = CFG.GROUND_Y;
    this.add.tileSprite(0, G, this.levelW, 30, 'ground').setOrigin(0).setDepth(-5);
    // The solid ground extends past both ends so enemies entering from off-screen land on it.
    this.ground = this.add.zone(this.levelW / 2, G + 15, this.levelW + 400, 30);
    this.physics.add.existing(this.ground, true);

    // Crates are one-way platforms (stand on top, walk/jump through from below and sides).
    this.platforms = this.physics.add.staticGroup();
    (this.mission.crates || []).forEach(({ x, stack }) => {
      for (let i = 0; i < stack; i++) {
        const c = this.platforms.create(x, G - 10 - i * 20, 'crate').setDepth(0);
        c.refreshBody();
        c.body.checkCollision.down = c.body.checkCollision.left = c.body.checkCollision.right = false;
      }
    });
  }

  worldText(x, y, text, style = {}) {
    return this.add
      .text(x, y, text, Object.assign({ fontFamily: FONT, fontSize: '8px', fontStyle: 'bold', color: '#ffffff', stroke: '#000000', strokeThickness: 3, align: 'center', resolution: 2 }, style))
      .setOrigin(0.5)
      .setDepth(-1);
  }

  buildDecor() {
    const G = CFG.GROUND_Y;
    const sign = (x, y, text, bg) => this.worldText(x, y, text, { backgroundColor: bg, strokeThickness: 0, padding: { x: 3, y: 2 } });
    const build = {
      text: (d) => this.worldText(d.x, d.y, d.text, d.style),
      controls: (d) => this.worldText(d.x, d.y, Session.numPlayers === 1
        ? '←→ MOVER   ↑ APUNTAR   ↓ AGACHARSE\nZ SALTAR   X DISPARAR   C GRANADA'
        : '1P: WASD + F DISPARAR  G SALTAR  H GRANADA\n2P: FLECHAS + , DISPARAR  . SALTAR  / GRANADA'),
      image: (d) => this.add.image(d.x, d.y || G, d.key).setOrigin(0.5, 1).setDepth(-2),
      sign: (d) => sign(d.x, d.y, d.text, d.bg || '#1e5fb4'),
      graffiti: (d) => {
        this.add.image(d.x, G, 'wall').setOrigin(0.5, 1).setDepth(-3);
        return this.add.text(d.x, G - 24, d.text, { fontFamily: FONT, fontSize: '9px', fontStyle: 'bold italic', color: d.color, stroke: '#f4efe4', strokeThickness: 3, align: 'center', resolution: 2 })
          .setOrigin(0.5).setRotation(-0.06).setDepth(-2);
      },
      copcar: (d) => {
        const car = this.add.image(d.x, G, 'policecar').setOrigin(0.5, 1).setDepth(-1);
        car.bubbleOffset = 30;
        const z = this.worldText(d.x + 6, G - 34, 'z Z z', { color: '#ffffff', fontSize: '8px' });
        this.tweens.add({ targets: z, y: G - 42, alpha: 0.2, duration: 1200, repeat: -1 });
        if (d.sign) sign(d.x, G - 58, d.sign, '#2e7d32');
        return car;
      },
    };
    (this.mission.decor || []).forEach((d) => {
      const obj = build[d.type](d);
      if (d.id) this.named[d.id] = obj;
    });
  }

  // ---------- setup ----------

  setupCollisions() {
    const solids = [this.ground, this.platforms];
    const pick = (a, b, prop) => (a && a[prop] !== undefined ? a : b);
    const P = this.physics.add;

    P.collider(this.enemies, solids);
    P.collider(this.pickups, solids);
    P.collider(this.pBombs, solids, (a, b) => this.onPlayerBombGround(pick(a, b, 'kind')));
    P.collider(this.eBombs, solids, (a, b) => this.explodeEnemyBomb(pick(a, b, 'isEnemyBomb')));
    P.overlap(this.pBullets, this.enemies, (b, e) => this.bulletHitsEnemy(b, e));
    P.overlap(this.pBombs, this.enemies, (b, e) => e.alive && this.detonate(b));
    this.abuelitas.forEach((ab) => {
      P.collider(ab, this.ground);
      P.overlap(ab, this.pBullets, (a, b) => {
        if (ab.state !== 'tied') return;
        const owner = b.owner;
        b.destroy();
        ab.free(owner);
      });
    });

    this.players.forEach((pl) => {
      P.collider(pl, solids);
      P.overlap(pl, this.eBullets, (p, b) => {
        if (!pl.canBeHit()) return;
        b.destroy();
        pl.die();
      });
      P.overlap(pl, this.eBombs, (p, b) => pl.canBeHit() && this.explodeEnemyBomb(b));
      P.overlap(pl, this.enemies, (p, e) => e.alive && e.contactKills && pl.canBeHit() && pl.die());
      P.overlap(pl, this.pickups, (p, k) => k.collect(pl));
      this.abuelitas.forEach((ab) => P.overlap(pl, ab, () => ab.free(pl)));
    });

    this.combiColliders = [];
    const c = this.combi;
    if (!c) return;
    const driven = () => c.active && c.state === 'driven';
    this.combiColliders = [
      P.collider(c, solids),
      P.overlap(c, this.eBullets, (cc, b) => { if (driven()) { b.destroy(); c.damage(1); } }),
      P.overlap(c, this.eBombs, (cc, b) => driven() && this.explodeEnemyBomb(b)),
      P.overlap(c, this.enemies, (cc, e) => { if (driven() && e.alive && e.contactKills) { e.die(true, c.driver); c.damage(1); } }),
      P.overlap(c, this.pickups, (cc, k) => driven() && k.collect(c.driver)),
    ];
  }

  // ---------- main loop ----------

  update(time, delta) {
    const none = Controls.none();
    this.players.forEach((p, i) => {
      const c = this.controls[i].read();
      p.ctrl = this.finished ? none : c;
    });
    this.updateSlots(delta);
    this.updateFreeze();
    if (this.frozen) {
      Fx.updateBubbles(this, time);
      return;
    }

    this.players.forEach((p) => p.update(time, delta));
    if (this.combi && this.combi.active) this.combi.update(time, delta);

    this.updateCamera();
    this.clampToView();
    this.updateParallax();
    this.checkSpawns();
    this.checkEvents();

    this.enemies.getChildren().slice().forEach((e) => {
      if (e.active) e.update(time, delta);
      // Left behind or fell out of the world: remove, so wave arenas can't wait on them forever.
      if (e.active && (e.x < this.viewLeft - 80 || e.y > CFG.GROUND_Y + 200)) e.destroy();
    });
    this.abuelitas.forEach((a) => a.active && a.update(time, delta));
    if (this.boss && this.boss.active) this.boss.update(time, delta);

    this.cleanupProjectiles();
    Fx.updateBubbles(this, time);
    if (!this.arenaStarted && this.viewLeft >= this.arenaX - 0.5) this.startArena();
    if (this.waves) this.updateWaves();
  }

  // What enemies aim at: the nearest player (or their combi) to x.
  target(x = this.viewLeft + CFG.VIEW_W / 2) {
    let best = null, bd = Infinity;
    for (const p of this.players) {
      if (!p.targetable()) continue;
      const o = p.vehicle || p;
      const d = Math.abs(o.x - x);
      if (d < bd) { bd = d; best = o; }
    }
    return best || this.players[0];
  }

  // The camera only scrolls forward, and never leaves the rear player behind.
  updateCamera() {
    const objs = this.players.filter((p) => p.state === 'play' && (p.alive || p.vehicle)).map((p) => p.vehicle || p);
    if (objs.length) {
      const front = Math.max(...objs.map((o) => o.x)), back = Math.min(...objs.map((o) => o.x));
      const want = Math.min(front - CFG.PLAYER.CAM_LEAD, back - 16);
      this.viewLeft = Phaser.Math.Clamp(Math.max(this.viewLeft, want), 0, this.arenaX);
    }
    this.cameras.main.centerOn(this.viewLeft + CFG.VIEW_W / 2, CFG.VIEW_H / 2);
  }

  clampToView() {
    for (const p of this.players) {
      if (p.state !== 'play') continue;
      const o = p.vehicle || p;
      const m = p.vehicle ? 32 : 8;
      const min = this.viewLeft + m, max = this.viewLeft + CFG.VIEW_W - m;
      if (o.x < min) { o.x = min; if (o.body.velocity.x < 0) o.body.velocity.x = 0; }
      if (o.x > max) { o.x = max; if (o.body.velocity.x > 0) o.body.velocity.x = 0; }
    }
  }

  spawnEnemy(s, x) {
    const e = s.t === 'biker'
      ? new Biker(this, this.viewLeft + CFG.VIEW_W + 30, CFG.GROUND_Y)
      : new Grunt(this, x, s.y || CFG.GROUND_Y, s);
    this.enemies.add(e);
    return e;
  }

  checkSpawns() {
    const edge = this.viewLeft + CFG.VIEW_W + 16;
    while (this.spawns.length && this.spawns[0].x <= edge) {
      const s = this.spawns.shift();
      this.spawnEnemy(s, s.x);
    }
  }

  // Scripted moments: fire once when any player in play passes x.
  checkEvents() {
    const front = Math.max(-Infinity, ...this.players.filter((p) => p.targetable()).map((p) => (p.vehicle || p).x));
    while (this.triggers.length && this.triggers[0].x <= front) {
      const e = this.triggers.shift();
      if (e.say) {
        const who = this.named[e.say.who];
        if (who) Fx.say(this, who, e.say.text, e.say.ms || 2500);
      }
      if (e.message) this.message(...e.message);
      if (e.run) e.run(this);
    }
  }

  cleanupProjectiles() {
    // Player shots vanish at the screen edge (no off-screen kills); enemy shots get a margin.
    [[this.pBullets, 0], [this.pBombs, 0], [this.eBullets, 40], [this.eBombs, 40]].forEach(([g, m]) => {
      const minX = this.viewLeft - m, maxX = this.viewLeft + CFG.VIEW_W + m;
      g.getChildren().slice().forEach((b) => {
        if (b.x < minX || b.x > maxX || b.y > 300 || b.y < -150) b.destroy();
      });
    });
    // Bullets stop at the ground (the combi can now shoot down-diagonal).
    [this.pBullets, this.eBullets].forEach((g) =>
      g.getChildren().slice().forEach((b) => {
        if (b.y >= CFG.GROUND_Y + 1) {
          Fx.spark(this, b.x, CFG.GROUND_Y);
          b.destroy();
        }
      }),
    );
  }

  // ---------- projectiles & damage ----------

  firePlayerBullet(x, y, angle, speed, damage, tex, owner) {
    const b = this.pBullets.create(x, y, tex).setDepth(12).setRotation(angle);
    b.damage = damage;
    b.owner = owner;
    this.physics.velocityFromRotation(angle, speed, b.body.velocity);
    return b;
  }

  throwGrenade(x, y, vx, vy, owner) {
    const g = this.pBombs.create(x, y, 'grenade').setDepth(12);
    g.kind = 'grenade';
    g.owner = owner;
    g.bounces = 0;
    g.setBounce(0.45).setVelocity(vx, vy).setAngularVelocity(vx >= 0 ? 500 : -500);
    this.time.delayedCall(1600, () => this.detonate(g));
  }

  fireShell(x, y, angle, owner) {
    const s = this.pBombs.create(x, y, 'shell').setDepth(12).setRotation(angle);
    s.kind = 'shell';
    s.owner = owner;
    s.body.setAllowGravity(false);
    this.physics.velocityFromRotation(angle, CFG.COMBI.CANNON_SPEED, s.body.velocity);
  }

  throwCup(x, y, vx, vy, owner) {
    const c = this.pBombs.create(x, y, 'cup').setDepth(12);
    c.kind = 'cup';
    c.owner = owner;
    c.setVelocity(vx, vy).setAngularVelocity(300);
  }

  enemyShoot(x, y, angle, speed = CFG.ENEMY.BULLET_SPEED) {
    const b = this.eBullets.create(x, y, 'ebullet').setDepth(12);
    this.physics.velocityFromRotation(angle, speed, b.body.velocity);
  }

  enemyLob(x, y, tx, ty, tex, T = 0.9) {
    const b = this.eBombs.create(x, y, tex).setDepth(12);
    b.isEnemyBomb = true;
    const g = CFG.GRAVITY;
    b.setVelocity((tx - x) / T, (ty - y - 0.5 * g * T * T) / T).setAngularVelocity(tx < x ? -400 : 400);
  }

  onPlayerBombGround(b) {
    if (!b || !b.active) return;
    if (b.kind === 'grenade' && ++b.bounces < 2) return;
    this.detonate(b);
  }

  detonate(b) {
    if (!b || !b.active) return;
    const { x, y, kind, owner } = b;
    b.destroy();
    if (kind === 'cup') {
      Fx.splash(this, x, y);
      Sfx.splash();
      this.damageEnemiesInRadius(x, y, CFG.ABUELITA.SPLASH, CFG.ABUELITA.DAMAGE, false, owner);
    } else if (kind === 'shell') {
      this.explodeAt(x, y, CFG.COMBI.CANNON_RADIUS, CFG.COMBI.CANNON_DAMAGE, true, 1.1, owner);
    } else {
      this.explodeAt(x, y, CFG.GRENADE.radius, CFG.GRENADE.damage, true, 1, owner);
    }
  }

  explodeEnemyBomb(b) {
    if (!b || !b.active) return;
    const { x, y } = b;
    b.destroy();
    this.explodeAt(x, y, CFG.ENEMY.BOMB_RADIUS, 1, false, 0.7);
  }

  explodeAt(x, y, radius, damage, friendly, scale = 1, owner = null) {
    Fx.boom(this, x, y, scale);
    Sfx.explode(scale > 1.4);
    this.cameras.main.shake(100, 0.003 * scale);
    if (!damage) return;
    if (friendly) this.damageEnemiesInRadius(x, y, radius, damage, true, owner);
    else this.hurtArea(x, y, radius);
  }

  damageEnemiesInRadius(x, y, r, dmg, explosive, owner) {
    this.enemies.getChildren().slice().forEach((e) => {
      if (e.alive && Phaser.Math.Distance.Between(x, y, e.x, e.y - 12) <= r + 8) e.hit(dmg, explosive, owner);
    });
    const b = this.boss;
    if (b && b.alive && Phaser.Geom.Intersects.CircleToRectangle(new Phaser.Geom.Circle(x, y, r), b.getBounds())) b.hit(dmg, owner);
  }

  hurtArea(x, y, r) {
    const circle = new Phaser.Geom.Circle(x, y, r);
    for (const p of this.players) {
      if (p.vehicle) {
        if (Phaser.Geom.Intersects.CircleToRectangle(circle, p.vehicle.getBounds())) p.vehicle.damage(1);
      } else if (p.canBeHit() && Phaser.Math.Distance.Between(x, y, p.x, p.y - 12) < r + 6) {
        p.die();
      }
    }
  }

  bulletHitsEnemy(b, e) {
    if (!e.alive || !b.active) return;
    Fx.spark(this, b.x, b.y);
    e.hit(b.damage, false, b.owner);
    b.destroy();
  }

  nearestEnemy(x, y, range) {
    let best = null, bestD = range;
    const consider = (ex, ey) => {
      if (ex < this.viewLeft || ex > this.viewLeft + CFG.VIEW_W) return;
      const d = Phaser.Math.Distance.Between(x, y, ex, ey);
      if (d < bestD) { bestD = d; best = { x: ex, y: ey }; }
    };
    this.enemies.getChildren().forEach((e) => e.alive && consider(e.x, e.y - 12));
    const b = this.boss;
    if (b && b.alive && b.state !== 'enter') consider(b.x, b.y - 24);
    return best;
  }

  spawnPickup(x, y, kind) {
    const p = new Pickup(this, x, y, kind);
    this.pickups.add(p);
    return p;
  }

  // Points go to whoever caused them; unattributed points go to the nearest player.
  addScore(n, x, y, owner) {
    let p = owner && owner.index !== undefined ? owner : null;
    if (!p) {
      const t = this.target(x);
      p = this.players.find((pl) => pl === t || pl.vehicle === t) || this.players[0];
    }
    p.score += n;
    Fx.floatText(this, x, y, String(n), p.index ? '#5ad1ff' : '#ffe066');
  }

  message(title, sub, ms) {
    this.game.events.emit('hud-message', title, sub || '', ms || 2000);
  }

  scores() {
    return this.players.filter((p) => p.state !== 'inactive' || p.score > 0).map((p) => ({ index: p.index, name: p.info.name, score: p.score }));
  }

  // ---------- flow ----------

  onPlayerDeath(p) {
    p.lives--;
    if (p.lives > 0) p.respawn(this.viewLeft + 60 + p.index * 24);
    else this.beginContinue(p, false);
  }

  gameOver() {
    if (this.finished) return;
    this.finished = true;
    this.updateFreeze();
    Sfx.stopMusic();
    this.time.delayedCall(800, () => {
      this.scene.stop('HUD');
      this.scene.start('GameOver', { scores: this.scores() });
    });
  }

  startArena() {
    this.arenaStarted = true;
    const A = this.mission.arena || {};
    if (A.alert) this.message(A.alert[0], A.alert[1], 2200);
    if (A.boss) this.startBoss(A.boss);
    else if (A.waves) {
      this.waves = { list: A.waves, index: -1, pending: 0 };
      this.time.delayedCall(1200, () => this.nextWave());
    } else this.onBossDefeated();
  }

  // Locked-screen ambush: the next wave comes when the current one is dead.
  nextWave() {
    const W = this.waves;
    W.index++;
    const wave = W.list[W.index];
    W.pending = wave.length;
    wave.forEach((s, i) => this.time.delayedCall(i * 450, () => {
      if (this.finished) return;
      this.spawnEnemy(s, this.arenaX + s.dx);
      W.pending--;
    }));
  }

  updateWaves() {
    const W = this.waves;
    if (W.index < 0 || W.pending > 0 || W.done) return;
    if (this.enemies.getChildren().some((e) => e.alive)) return;
    if (W.index + 1 < W.list.length) {
      W.pending = 1; // hold until the next wave is queued
      this.time.delayedCall(900, () => { W.pending = 0; this.nextWave(); });
    } else {
      W.done = true;
      this.onBossDefeated();
    }
  }

  startBoss(type) {
    Sfx.rev();
    const b = (this.boss = new BOSSES[type](this, this.levelW + 70, CFG.GROUND_Y));
    const P = this.physics.add;
    P.overlap(b, this.pBullets, (bb, bullet) => {
      if (!b.alive || !bullet.active) return;
      Fx.spark(this, bullet.x, bullet.y);
      const owner = bullet.owner;
      bullet.destroy();
      b.hit(bullet.damage, owner);
    });
    P.overlap(b, this.pBombs, (bb, bomb) => b.alive && this.detonate(bomb));
    this.players.forEach((pl) => P.overlap(b, pl, () => b.alive && pl.canBeHit() && pl.die()));
    if (this.combi) {
      this.combiColliders.push(
        P.overlap(b, this.combi, () => {
          const c = this.combi;
          if (!c || c.state !== 'driven' || !b.alive) return;
          if (b.state === 'charge' && !b.hitCombi) {
            b.hitCombi = true;
            c.damage(2);
            c.setVelocity(b.facing * 200, -180);
          }
        }),
      );
    }
  }

  onBossDefeated() {
    this.registry.set('bossHp', 0);
    this.time.delayedCall(this.boss ? 2600 : 1200, () => this.missionComplete());
  }

  missionComplete() {
    if (this.finished) return;
    this.finished = true;
    this.updateFreeze();
    Sfx.stopMusic();
    Sfx.fanfare();
    const O = this.mission.outro || { title: '¡MISIÓN CUMPLIDA!', sub: '' };
    this.message(O.title, O.sub, 4500);
    this.savePlayers();
    this.time.delayedCall(5200, () => {
      this.scene.stop('HUD');
      this.scene.start('MissionEnd', { mission: this.missionIndex, scores: this.scores() });
    });
  }
}
