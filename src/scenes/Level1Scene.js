// Mission 1 — "¡Paga o ya sabes!": paradero in the cono, ends with El Cobrador's mototaxi.
class Level1Scene extends Phaser.Scene {
  constructor() {
    super('Level1');
  }

  create() {
    const L = CFG.LEVEL1;
    this.levelW = L.WIDTH;
    this.arenaX = L.ARENA_X;
    this.viewLeft = 0;
    this.bubbles = [];
    this.bossStarted = false;
    this.finished = false;
    this.boss = null;
    this.copSpoke = false;
    this.registry.set({
      score: 0, lives: CFG.PLAYER.LIVES, arms: '∞', bombs: CFG.PLAYER.START_BOMBS,
      inCombi: false, combiHp: 0, cannon: 0, bossHp: 0, bossMax: 1, bossName: '',
    });

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

    this.player = new Player(this, 60, CFG.GROUND_Y);
    this.combi = new CombiSlug(this, L.COMBI_X, CFG.GROUND_Y);
    this.abuelita = new Abuelita(this, L.ABUELITA_X, CFG.GROUND_Y);
    L.PICKUPS.forEach((p) => this.spawnPickup(p.x, CFG.GROUND_Y - 40, p.kind));
    this.spawns = L.SPAWNS.map((s) => Object.assign({}, s)).sort((a, b) => a.x - b.x);

    this.setupCollisions();
    this.setupInput();
    this.updateCamera();

    this.scene.stop('HUD');
    this.scene.launch('HUD');
    Sfx.startMusic();
    this.events.once('shutdown', () => Sfx.stopMusic());
    this.time.delayedCall(300, () => this.message('MISIÓN 1', '¡PAGA O YA SABES!', 2600));
  }

  // ---------- world building ----------

  buildBackground() {
    this.bgSky = this.add.image(0, 0, 'bg_sky').setOrigin(0).setDepth(-10);
    this.bgHills = this.add.tileSprite(0, 70, CFG.VIEW_W, 150, 'bg_hills').setOrigin(0).setDepth(-9);
    this.bgCity = this.add.tileSprite(0, CFG.GROUND_Y - 170, CFG.VIEW_W, 170, 'bg_city').setOrigin(0).setDepth(-8);
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
    this.ground = this.add.zone(this.levelW / 2, G + 15, this.levelW, 30);
    this.physics.add.existing(this.ground, true);

    // Crates are one-way platforms (stand on top, walk/jump through from below and sides).
    this.platforms = this.physics.add.staticGroup();
    CFG.LEVEL1.CRATES.forEach(({ x, stack }) => {
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
    const G = CFG.GROUND_Y, L = CFG.LEVEL1;
    const graffiti = (x, txt, color) => {
      this.add.image(x, G, 'wall').setOrigin(0.5, 1).setDepth(-3);
      this.add.text(x, G - 24, txt, { fontFamily: FONT, fontSize: '9px', fontStyle: 'bold italic', color, stroke: '#f4efe4', strokeThickness: 3, align: 'center', resolution: 2 })
        .setOrigin(0.5).setRotation(-0.06).setDepth(-2);
    };

    this.worldText(240, 70, 'Los cuperos mataron a tu compadre.\nHoy no se paga. Hoy se cobra.', { fontSize: '10px', color: '#ffe066' });
    this.worldText(240, 104, '←→ MOVER   ↑ APUNTAR   ↓ AGACHARSE\nZ SALTAR   X DISPARAR   C GRANADA');

    this.add.image(150, G, 'paradero').setOrigin(0.5, 1).setDepth(-2);
    graffiti(330, 'LOS CUPEROS\nMANDAN', '#c0282e');
    this.add.image(650, G, 'banner').setOrigin(0.5, 1).setDepth(-2);
    graffiti(1250, 'PAGA O\nYA SABES', '#1b1b22');
    graffiti(2170, '¡PARO DE\nTRANSPORTISTAS!', '#1e5fb4');
    graffiti(3040, 'NO A LA\nEXTORSIÓN', '#2e7d32');

    // A patrol car with a sleeping cop. Foreshadowing.
    this.copCar = this.add.image(L.COP_CAR_X, G, 'policecar').setOrigin(0.5, 1).setDepth(-1);
    this.copCar.bubbleOffset = 30;
    const z = this.worldText(L.COP_CAR_X + 6, G - 34, 'z Z z', { color: '#ffffff', fontSize: '8px' });
    this.tweens.add({ targets: z, y: G - 42, alpha: 0.2, duration: 1200, repeat: -1 });
    this.worldText(L.COP_CAR_X, G - 58, 'DENUNCIAS:\nVUELVA MAÑANA', { backgroundColor: '#2e7d32', strokeThickness: 0, padding: { x: 3, y: 2 } });

    this.worldText(3385, G - 70, 'TERMINAL\nATE — CALLAO', { backgroundColor: '#1e5fb4', strokeThickness: 0, padding: { x: 3, y: 2 } });
  }

  // ---------- setup ----------

  setupCollisions() {
    const solids = [this.ground, this.platforms];
    const pick = (a, b, prop) => (a && a[prop] !== undefined ? a : b);
    const P = this.physics.add;

    P.collider(this.player, solids);
    P.collider(this.enemies, solids);
    P.collider(this.abuelita, this.ground);
    P.collider(this.pickups, solids);
    P.collider(this.pBombs, solids, (a, b) => this.onPlayerBombGround(pick(a, b, 'kind')));
    P.collider(this.eBombs, solids, (a, b) => this.explodeEnemyBomb(pick(a, b, 'isEnemyBomb')));

    P.overlap(this.pBullets, this.enemies, (b, e) => this.bulletHitsEnemy(b, e));
    P.overlap(this.pBombs, this.enemies, (b, e) => e.alive && this.detonate(b));
    P.overlap(this.player, this.eBullets, (p, b) => {
      if (!this.player.canBeHit()) return;
      b.destroy();
      this.player.die();
    });
    P.overlap(this.player, this.eBombs, (p, b) => this.player.canBeHit() && this.explodeEnemyBomb(b));
    P.overlap(this.player, this.enemies, (p, e) => e.alive && e.contactKills && this.player.canBeHit() && this.player.die());
    P.overlap(this.player, this.pickups, (p, k) => k.collect());
    P.overlap(this.player, this.abuelita, () => this.abuelita.free());
    P.overlap(this.abuelita, this.pBullets, (a, b) => {
      if (a.state !== 'tied') return;
      b.destroy();
      a.free();
    });

    const c = this.combi;
    const driven = () => c.active && c.state === 'driven';
    this.combiColliders = [
      P.collider(c, solids),
      P.overlap(c, this.eBullets, (cc, b) => { if (driven()) { b.destroy(); c.damage(1); } }),
      P.overlap(c, this.eBombs, (cc, b) => driven() && this.explodeEnemyBomb(b)),
      P.overlap(c, this.enemies, (cc, e) => { if (driven() && e.alive && e.contactKills) { e.die(true); c.damage(1); } }),
      P.overlap(c, this.pickups, (cc, k) => driven() && k.collect()),
    ];
  }

  setupInput() {
    this.keys = this.input.keyboard.addKeys({
      left: 'LEFT', right: 'RIGHT', up: 'UP', down: 'DOWN', jump: 'Z', jump2: 'SPACE', fire: 'X', bomb: 'C',
      a: 'A', d: 'D', w: 'W', s: 'S', j: 'J', k: 'K', l: 'L',
    });
    this.ctrl = {};
  }

  readControls() {
    const k = this.keys, JD = Phaser.Input.Keyboard.JustDown;
    const j1 = JD(k.jump), j2 = JD(k.jump2), j3 = JD(k.k);
    const b1 = JD(k.bomb), b2 = JD(k.l);
    const d1 = JD(k.down), d2 = JD(k.s);
    this.ctrl = {
      left: k.left.isDown || k.a.isDown,
      right: k.right.isDown || k.d.isDown,
      up: k.up.isDown || k.w.isDown,
      down: k.down.isDown || k.s.isDown,
      fire: k.fire.isDown || k.j.isDown,
      jumpP: j1 || j2 || j3,
      bombP: b1 || b2,
      downP: d1 || d2,
    };
  }

  // ---------- main loop ----------

  update(time, delta) {
    this.readControls();
    if (this.finished) this.ctrl = {};
    this.player.update(time, delta);
    if (this.combi && this.combi.active) this.combi.update(time, delta);

    this.updateCamera();
    this.clampToView();
    this.updateParallax();
    this.checkSpawns();

    this.enemies.getChildren().slice().forEach((e) => {
      if (e.active) e.update(time, delta);
      if (e.active && e.x < this.viewLeft - 80) e.destroy();
    });
    if (this.abuelita.active) this.abuelita.update(time, delta);
    if (this.boss && this.boss.active) this.boss.update(time, delta);

    if (!this.copSpoke && this.player.x > CFG.LEVEL1.COP_CAR_X - 130) {
      this.copSpoke = true;
      Fx.say(this, this.copCar, 'Zzz... yo no he visto nada, causa...', 2600);
    }

    this.cleanupProjectiles();
    Fx.updateBubbles(this, time);
    this.updateHudRegistry();
    if (!this.bossStarted && this.viewLeft >= this.arenaX - 0.5) this.startBoss();
  }

  target() {
    return this.player.vehicle || this.player;
  }

  updateCamera() {
    const f = this.target();
    if (this.player.alive) {
      this.viewLeft = Phaser.Math.Clamp(Math.max(this.viewLeft, f.x - CFG.PLAYER.CAM_LEAD), 0, this.arenaX);
    }
    this.cameras.main.centerOn(this.viewLeft + CFG.VIEW_W / 2, CFG.VIEW_H / 2);
  }

  clampToView() {
    const o = this.target();
    const m = this.player.vehicle ? 32 : 8;
    const min = this.viewLeft + m, max = this.viewLeft + CFG.VIEW_W - m;
    if (o.x < min) { o.x = min; if (o.body.velocity.x < 0) o.body.velocity.x = 0; }
    if (o.x > max) { o.x = max; if (o.body.velocity.x > 0) o.body.velocity.x = 0; }
  }

  checkSpawns() {
    const edge = this.viewLeft + CFG.VIEW_W + 16;
    while (this.spawns.length && this.spawns[0].x <= edge) {
      const s = this.spawns.shift();
      const e = s.t === 'biker'
        ? new Biker(this, this.viewLeft + CFG.VIEW_W + 30, CFG.GROUND_Y)
        : new Grunt(this, s.x, s.y || CFG.GROUND_Y, s);
      this.enemies.add(e);
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
  }

  updateHudRegistry() {
    const p = this.player, r = this.registry;
    r.set('arms', p.weapon === 'mg' ? String(p.ammo) : '∞');
    r.set('bombs', p.bombs);
    r.set('inCombi', !!p.vehicle);
    if (p.vehicle) {
      r.set('combiHp', p.vehicle.hp);
      r.set('cannon', p.vehicle.cannon);
    }
  }

  // ---------- projectiles & damage ----------

  firePlayerBullet(x, y, angle, speed, damage, tex) {
    const b = this.pBullets.create(x, y, tex).setDepth(12).setRotation(angle);
    b.damage = damage;
    this.physics.velocityFromRotation(angle, speed, b.body.velocity);
    return b;
  }

  throwGrenade(x, y, vx, vy) {
    const g = this.pBombs.create(x, y, 'grenade').setDepth(12);
    g.kind = 'grenade';
    g.bounces = 0;
    g.setBounce(0.45).setVelocity(vx, vy).setAngularVelocity(vx >= 0 ? 500 : -500);
    this.time.delayedCall(1600, () => this.detonate(g));
  }

  fireShell(x, y, angle) {
    const s = this.pBombs.create(x, y, 'shell').setDepth(12).setRotation(angle);
    s.kind = 'shell';
    s.body.setAllowGravity(false);
    this.physics.velocityFromRotation(angle, CFG.COMBI.CANNON_SPEED, s.body.velocity);
  }

  throwCup(x, y, vx, vy) {
    const c = this.pBombs.create(x, y, 'cup').setDepth(12);
    c.kind = 'cup';
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
    const { x, y, kind } = b;
    b.destroy();
    if (kind === 'cup') {
      Fx.splash(this, x, y);
      Sfx.splash();
      this.damageEnemiesInRadius(x, y, CFG.ABUELITA.SPLASH, CFG.ABUELITA.DAMAGE, false);
    } else if (kind === 'shell') {
      this.explodeAt(x, y, CFG.COMBI.CANNON_RADIUS, CFG.COMBI.CANNON_DAMAGE, true, 1.1);
    } else {
      this.explodeAt(x, y, CFG.GRENADE.radius, CFG.GRENADE.damage, true, 1);
    }
  }

  explodeEnemyBomb(b) {
    if (!b || !b.active) return;
    const { x, y } = b;
    b.destroy();
    this.explodeAt(x, y, CFG.ENEMY.BOMB_RADIUS, 1, false, 0.7);
  }

  explodeAt(x, y, radius, damage, friendly, scale = 1) {
    Fx.boom(this, x, y, scale);
    Sfx.explode(scale > 1.4);
    this.cameras.main.shake(100, 0.003 * scale);
    if (!damage) return;
    if (friendly) this.damageEnemiesInRadius(x, y, radius, damage, true);
    else this.hurtArea(x, y, radius);
  }

  damageEnemiesInRadius(x, y, r, dmg, explosive) {
    this.enemies.getChildren().slice().forEach((e) => {
      if (e.alive && Phaser.Math.Distance.Between(x, y, e.x, e.y - 12) <= r + 8) e.hit(dmg, explosive);
    });
    const b = this.boss;
    if (b && b.alive && Phaser.Geom.Intersects.CircleToRectangle(new Phaser.Geom.Circle(x, y, r), b.getBounds())) b.hit(dmg);
  }

  hurtArea(x, y, r) {
    const p = this.player;
    if (p.vehicle) {
      if (Phaser.Geom.Intersects.CircleToRectangle(new Phaser.Geom.Circle(x, y, r), p.vehicle.getBounds())) p.vehicle.damage(1);
    } else if (p.canBeHit() && Phaser.Math.Distance.Between(x, y, p.x, p.y - 12) < r + 6) {
      p.die();
    }
  }

  bulletHitsEnemy(b, e) {
    if (!e.alive || !b.active) return;
    Fx.spark(this, b.x, b.y);
    e.hit(b.damage, false);
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

  addScore(n, x, y) {
    this.registry.set('score', this.registry.get('score') + n);
    Fx.floatText(this, x, y, String(n));
  }

  message(title, sub, ms) {
    this.game.events.emit('hud-message', title, sub || '', ms || 2000);
  }

  // ---------- flow ----------

  onPlayerDeath() {
    const lives = this.registry.get('lives') - 1;
    if (lives < 0) return this.gameOver();
    this.registry.set('lives', lives);
    this.player.respawn(this.viewLeft + 60);
  }

  gameOver() {
    this.finished = true;
    Sfx.stopMusic();
    this.time.delayedCall(800, () => {
      this.scene.stop('HUD');
      this.scene.start('GameOver', { score: this.registry.get('score') });
    });
  }

  startBoss() {
    this.bossStarted = true;
    this.message('¡ALERTA!', 'EL COBRADOR DE CUPOS', 2200);
    Sfx.rev();
    const b = (this.boss = new BossCobrador(this, this.levelW + 70, CFG.GROUND_Y));
    const P = this.physics.add;
    P.overlap(b, this.pBullets, (bb, bullet) => {
      if (!b.alive || !bullet.active) return;
      Fx.spark(this, bullet.x, bullet.y);
      bullet.destroy();
      b.hit(bullet.damage);
    });
    P.overlap(b, this.pBombs, (bb, bomb) => b.alive && this.detonate(bomb));
    P.overlap(b, this.player, () => b.alive && this.player.canBeHit() && this.player.die());
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
    this.time.delayedCall(2600, () => this.missionComplete());
  }

  missionComplete() {
    this.finished = true;
    Sfx.stopMusic();
    Sfx.fanfare();
    this.message('¡MISIÓN CUMPLIDA!', '...¿contactos en la comisaría?', 4500);
    this.time.delayedCall(5200, () => {
      this.scene.stop('HUD');
      this.scene.start('Title', { completed: true, score: this.registry.get('score') });
    });
  }
}
