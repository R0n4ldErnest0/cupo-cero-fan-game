// Generic run-and-gun level, built from a mission definition in MISSIONS (src/levels/).
// Start with this.scene.start('Level', { mission: index, section: index }). A mission can be split into
// `sections` (areas joined by a fade); each one is a fresh scene start with { carry: true }, so players keep
// their lives, weapons, bombs, fat/drunk state and the Combi Slug they're driving.
const BOSSES = { cobrador: BossCobrador, heli: BossHeli, truck: BossTruck, contador: BossContador };

class LevelScene extends Phaser.Scene {
  constructor() {
    super('Level');
  }

  create(data = {}) {
    this.missionIndex = Phaser.Math.Clamp(data.mission || 0, 0, MISSIONS.length - 1);
    const mission = MISSIONS[this.missionIndex], sections = mission.sections || [{}];
    this.sectionIndex = Phaser.Math.Clamp(data.section || 0, 0, sections.length - 1);
    this.lastSection = this.sectionIndex === sections.length - 1;
    // The section's fields (terrain, enemies, arena, exit...) on top of the mission's (title, outro...).
    const M = (this.mission = Object.assign({}, mission, sections[this.sectionIndex]));
    if (M.ride) {
      M.terrain = Array(14).fill('|').join('\n');
      M.width = CFG.VIEW_W;
      M.vehicles = false;
    }
    this.leaving = false;
    this.keepMusic = false;
    this.terrain = new Terrain(this, M);
    this.levelW = M.width || this.terrain.width;
    this.levelH = this.terrain.height;
    this.arenaX = M.arenaX !== undefined ? M.arenaX : this.levelW - CFG.VIEW_W;
    this.viewLeft = 0;
    this.viewTop = Math.max(0, this.levelH - CFG.VIEW_H);
    this.bubbles = [];
    this.named = {};
    this.arenaStarted = false;
    this.waves = null;
    this.finished = false;
    this.frozen = false;
    this.boss = null;
    this.fires = [];
    // Clock and tweens survive a scene restart; make sure a previous freeze doesn't carry over.
    this.time.paused = false;
    this.tweens.resumeAll();

    this.physics.world.setBounds(0, -400, this.levelW, this.levelH + 800);
    this.cameras.main.setZoom(CFG.ZOOM).setRoundPixels(true);
    if (CFG.DEBUG) this.physics.world.createDebugGraphic();

    this.buildBackground();
    this.buildGround();
    this.buildDecor();
    this.ride = M.ride ? new Ride(this, M.ride) : null;

    this.enemies = this.physics.add.group();
    this.pickups = this.physics.add.group();
    this.pBullets = this.physics.add.group({ allowGravity: false });
    this.eBullets = this.physics.add.group({ allowGravity: false });
    this.pBombs = this.physics.add.group();
    this.eBombs = this.physics.add.group();

    // Objects come from the mission lists (x, optional y) and from letter markers in the terrain map.
    const marks = this.terrain.objects;
    const start = marks.find((o) => o.start) || M.start || { x: 60 };
    this.createPlayers(start, data.carry);
    this.combi = null;
    const run = Session.run || {};
    if (data.carry && run.combi && M.vehicles !== false) this.carryCombi(run.combi, start);
    else if (M.mototaxi) this.combi = new MototaxiSlug(this, M.mototaxi.x, this.floorY(M.mototaxi));
    else {
      const combi = M.combi || marks.find((o) => o.combi);
      if (combi) this.combi = new CombiSlug(this, combi.x, this.floorY(combi));
    }
    this.doors = (M.doors || []).concat(marks.filter((o) => o.door)).map((d) => this.buildDoor(d));
    this.abuelitas = (M.abuelitas || []).concat(marks.filter((o) => o.abuelita)).map((a) => new Abuelita(this, a.x, this.floorY(a)));
    this.props = this.physics.add.group({ allowGravity: false, immovable: true });
    (M.props || []).forEach((d) => this.props.add(new Breakable(this, d.x, this.floorY(d), d)));
    this.vendors = (M.vendors || []).map((d) => new Vendor(this, d.x, this.floorY(d), d));
    this.prisoners = this.physics.add.group();
    (M.prisoners || []).concat(marks.filter((o) => o.prisoner)).forEach((d) => this.addPrisoner(d.x, this.floorY(d), d));
    (M.pickups || []).forEach((p) => this.spawnPickup(p.x, this.floorY(p) - 40, p.kind));
    marks.filter((o) => o.pickup).forEach((p) => this.spawnPickup(p.x, p.y - 8, p.pickup));
    this.spawns = (M.spawns || []).concat(marks.filter((o) => o.t)).map((s) => Object.assign({}, s)).sort((a, b) => a.x - b.x);
    this.triggers = (M.events || []).map((e) => Object.assign({}, e)).sort((a, b) => a.x - b.x);

    this.setupCollisions();
    this.updateCamera(true);
    this.updateParallax();

    this.scene.stop('HUD');
    this.scene.launch('HUD');
    Sfx.startMusic();
    this.events.once('shutdown', () => {
      Sfx.rotorStop();
      if (!this.keepMusic) Sfx.stopMusic();
    });
    if (data.carry) this.cameras.main.fadeIn(400, 0, 0, 0);
    else {
      // Arcade banner + announcer, in English like Metal Slug: "MISSION 1 START!" / "MISSION FINAL START!".
      const sub = M.subtitle + (M.draft ? '\n(BORRADOR)' : '');
      this.time.delayedCall(300, () => {
        this.message(`${M.title} START!`, sub, 2600);
        Voice.say(M.final ? 'start_final' : `start_${this.missionIndex + 1}`, `${M.title.toLowerCase()}... start!`, 'en');
      });
    }
  }

  // ---------- players ----------

  // Fresh run: characters from the select screen. Next mission: lives, scores and characters carry over
  // (players that were out or still deciding come back as 'inactive' and can rejoin with start).
  createPlayers(start, carry) {
    const n = Session.numPlayers;
    const saved = Session.run && Session.run.players;
    const c0 = Session.chars[0] || 'chato';
    const c1 = Session.chars[1] || CFG.CHARACTERS.map((c) => c.id).find((id) => id !== c0);
    this.players = [c0, c1].map((ch, i) => {
      const s = saved && saved[i];
      const x = Math.max(16, start.x - i * 24);
      const p = new Player(this, i, s ? s.char : ch, x, this.floorY({ x, y: start.y }));
      if (s) {
        p.score = s.score;
        p.lives = s.lives;
        p.state = s.state;
        p.rescued = s.rescued || 0;
        if (carry && s.kit) this.applyKit(p, s.kit);
      } else if (i >= n) p.state = 'inactive';
      if (p.state !== 'play') p.deactivate();
      return p;
    });
    this.setupControls(n);
  }

  // kit = also carry weapons, bombs and fat/drunk state (between sections; a new mission starts fresh, like
  // the arcade). The driven Combi Slug is carried when `combi` is true.
  savePlayers(kit = false, combi = false) {
    const now = this.time.now;
    Session.run = Session.run || {};
    Session.run.players = this.players.map((p) => ({
      char: p.char,
      score: p.score,
      lives: p.state === 'play' ? p.lives : CFG.CREDITS.LIVES_PER_CREDIT,
      state: p.state === 'play' ? 'play' : 'inactive',
      rescued: p.state === 'play' ? p.rescued : 0,
      kit: kit && p.state === 'play' ? {
        weapon: p.weapon, ammo: p.ammo, bombs: p.bombs, bombType: p.bombType, superBombs: p.superBombs,
        fat: p.fat, fullness: p.fullness, ateAgo: now - p.lastAte, drunkLeft: Math.max(0, p.drunkUntil - now),
      } : null,
    }));
    const c = this.combi;
    Session.run.combi = combi && c && c.active && c.state === 'driven'
      ? Object.assign(c.saveState(), { driver: c.driver.index }) : null;
  }

  applyKit(p, k) {
    const now = this.time.now;
    Object.assign(p, { weapon: k.weapon, ammo: k.ammo, bombs: k.bombs, bombType: k.bombType, superBombs: k.superBombs });
    p.fullness = k.fullness;
    p.lastAte = now - k.ateAgo;
    p.drunkUntil = k.drunkLeft ? now + k.drunkLeft : 0;
    if (k.fat) {
      p.fat = true;
      p.setScale(CFG.FAT.SCALE_X, 1);
    }
  }

  // The vehicle someone drove out of the last section, with its damage and ammo, driver already inside.
  carryCombi(c, start) {
    const p = this.players[c.driver];
    const x = start.x + 30, y = this.floorY({ x, y: start.y });
    const v = (this.combi = c.kind === 'mototaxi' ? new MototaxiSlug(this, x, y) : new CombiSlug(this, x, y));
    v.loadState(c);
    if (p && p.state === 'play') p.enterVehicle(v);
  }

  // Bocinazo: stun an enemy and push it back (dir = which way). Enemies without a stun just take a hit.
  stun(e, dir) {
    if (e.stunUntil === undefined && !(e instanceof Grunt) && !(e instanceof RiotCop)) return e.hit(1, false, null);
    e.stunUntil = this.time.now + CFG.MOTOTAXI.STUN_MS;
    if (e.dropKnife) e.dropKnife();
    if (e.dropBaton) e.dropBaton();
    e.aimUntil = 0;
    e.setVelocity(dir * 140, -150);
    if (Math.random() < 0.6) Fx.say(this, e, Phaser.Utils.Array.GetRandom(BOCINA_LINES), 1000);
  }

  // ---------- sections ----------

  // A door marker ('>' in the map): walking into it on foot leads to the next section.
  buildDoor(d) {
    const y = this.floorY(d);
    this.add.image(d.x, y, 'door').setOrigin(0.5, 1).setDepth(-1);
    const arrow = this.worldText(d.x, y - 42, '▼ ENTRAR', { color: '#ffe066' });
    this.tweens.add({ targets: arrow, y: y - 46, yoyo: true, repeat: -1, duration: 400 });
    return { x: d.x, y };
  }

  // Leaving a section: 'edge' (walk/drive to the right end of the map, the default) or 'door'.
  checkExit() {
    if (this.lastSection || this.finished || this.mission.arena || this.ride) return;
    const type = (this.mission.exit || {}).type || (this.doors.length ? 'door' : 'edge');
    for (const p of this.players) {
      if (p.state !== 'play' || !(p.alive || p.vehicle)) continue;
      const o = p.vehicle || p;
      if (type === 'edge' && o.x >= this.levelW - (p.vehicle ? 40 : 24)) return this.nextSection();
      if (type === 'door' && !p.vehicle && this.doors.some((d) => Math.abs(p.x - d.x) < 10 && Math.abs(p.y - d.y) < 24)) {
        return this.nextSection(false);
      }
    }
  }

  // Fade out and start the next section. Through a door the combi stays behind.
  nextSection(withCombi = true) {
    if (this.lastSection || this.finished || this.leaving) return;
    const next = this.sectionIndex + 1;
    this.leaving = true;
    this.finished = true; // freezes input and makes everyone untouchable during the fade
    this.savePlayers(true, withCombi);
    this.keepMusic = true;
    this.cameras.main.fadeOut(400, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.restart({ mission: this.missionIndex, section: next, carry: true }));
  }

  // The section's arena (boss or ambush) is done: next section, or the mission is complete.
  sectionCleared() {
    if (this.lastSection) this.onBossDefeated();
    else this.time.delayedCall(1200, () => this.nextSection());
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
    p.respawn(...this.spawnPoint(p));
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

  // Backgrounds follow the camera; when it climbs, the far layers sink a little (vertical parallax).
  updateParallax() {
    // In a ride the camera stands still and the distance travelled scrolls the backgrounds.
    const L = Math.round(this.viewLeft), top = Math.round(this.viewTop);
    const D = this.ride ? Math.round(this.ride.dist) : L;
    const climb = Math.max(0, this.levelH - CFG.VIEW_H) - top;
    this.bgSky.setPosition(L, top);
    this.bgHills.setPosition(L, top + 70 + Math.round(climb * 0.15));
    this.bgHills.tilePositionX = Math.round(D * 0.15);
    this.bgCity.setPosition(L, top + CFG.GROUND_Y - 170 + Math.round(climb * 0.4));
    this.bgCity.tilePositionX = Math.round(D * 0.45);
  }

  // The terrain tile layer is built by Terrain; crates are extra one-way platforms (sprites).
  buildGround() {
    this.platforms = this.physics.add.staticGroup();
    (this.mission.crates || []).forEach(({ x, stack, y }) => {
      const G = this.floorY({ x, y });
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

  // Decor without a y stands at street level (graffiti, images, the cop car); text and signs need a y.
  buildDecor() {
    const sign = (x, y, text, bg) => this.worldText(x, y, text, { backgroundColor: bg, strokeThickness: 0, padding: { x: 3, y: 2 } });
    const build = {
      text: (d) => this.worldText(d.x, d.y, d.text, d.style),
      controls: (d) => this.worldText(d.x, d.y, Session.numPlayers === 1
        ? '←→ MOVER   ↑ APUNTAR   ↓ AGACHARSE   ↓+Z BAJAR\nZ SALTAR   X DISPARAR   C GRANADA'
        : '1P: WASD + F DISPARAR  G SALTAR  H GRANADA\n2P: FLECHAS + , DISPARAR  . SALTAR  / GRANADA'),
      image: (d) => this.add.image(d.x, this.floorY(d), d.key).setOrigin(0.5, 1).setDepth(-2),
      sign: (d) => sign(d.x, d.y, d.text, d.bg || '#1e5fb4'),
      graffiti: (d) => {
        const G = this.floorY(d);
        this.add.image(d.x, G, 'wall').setOrigin(0.5, 1).setDepth(-3);
        return this.add.text(d.x, G - 24, d.text, { fontFamily: FONT, fontSize: '9px', fontStyle: 'bold italic', color: d.color, stroke: '#f4efe4', strokeThickness: 3, align: 'center', resolution: 2 })
          .setOrigin(0.5).setRotation(-0.06).setDepth(-2);
      },
      copcar: (d) => {
        const G = this.floorY(d);
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
    const solids = [this.terrain.layer, this.platforms];
    // One-way floors are ignored while someone drops through them (↓ + jump).
    const notDropping = (o, t) => !(t && t.oneWay && o.dropUntil > this.time.now);
    const pick = (a, b, prop) => (a && a[prop] !== undefined ? a : b);
    const P = this.physics.add;

    P.collider(this.enemies, solids);
    P.collider(this.pickups, solids);
    P.collider(this.pBombs, solids, (a, b) => this.onPlayerBombGround(pick(a, b, 'kind'), 'ground'));
    P.collider(this.eBombs, solids, (a, b) => this.explodeEnemyBomb(pick(a, b, 'isEnemyBomb')));
    P.overlap(this.pBullets, this.enemies, (b, e) => this.bulletHits(b, e));
    P.overlap(this.pBombs, this.enemies, (b, e) => e.alive && this.detonate(b));
    P.overlap(this.pBullets, this.props, (b, o) => this.bulletHits(b, o));
    P.collider(this.prisoners, solids, null, notDropping);
    P.overlap(this.pBullets, this.prisoners, (b, pr) => {
      if (pr.state !== 'tied' || !b.active) return;
      b.destroy();
      pr.free(b.owner);
    });
    P.overlap(this.pBombs, this.props, (b, o) => o.alive && this.detonate(b));
    this.abuelitas.forEach((ab) => {
      P.collider(ab, solids, null, notDropping);
      P.overlap(ab, this.pBullets, (a, b) => {
        if (ab.state !== 'tied') return;
        const owner = b.owner;
        b.destroy();
        ab.free(owner);
      });
    });

    this.players.forEach((pl) => {
      P.collider(pl, solids, null, notDropping);
      P.overlap(pl, this.eBullets, (p, b) => {
        if (!pl.canBeHit()) return;
        b.destroy();
        pl.die();
      });
      P.overlap(pl, this.eBombs, (p, b) => {
        if (!pl.canBeHit()) return;
        if (b.coin) {
          b.destroy();
          pl.die();
        } else this.explodeEnemyBomb(b);
      });
      P.overlap(pl, this.enemies, (p, e) => e.alive && e.contactKills && pl.canBeHit() && pl.die());
      P.overlap(pl, this.pickups, (p, k) => k.collect(pl));
      this.abuelitas.forEach((ab) => P.overlap(pl, ab, () => ab.free(pl)));
      P.overlap(pl, this.prisoners, (p, pr) => {
        if (!pl.alive || pl.state !== 'play') return;
        if (pr.state === 'tied') pr.free(pl);
        else pr.give();
      });
    });

    this.combiColliders = [];
    const c = this.combi;
    if (!c) return;
    const driven = () => c.active && c.state === 'driven';
    this.combiColliders = [
      P.collider(c, solids, null, (cc, t) => this.vehicleTouchesTile(c, t)),
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

    this.snapToSlopes();
    this.players.forEach((p) => p.update(time, delta));
    if (this.combi && this.combi.active) this.combi.update(time, delta);

    this.checkPits();
    this.updateCamera();
    this.clampToView();
    this.updateParallax();
    this.checkSpawns();
    this.checkEvents();

    this.enemies.getChildren().slice().forEach((e) => {
      if (e.active) e.update(time, delta);
      // Left behind or fell out of the world: remove, so wave arenas can't wait on them forever.
      if (e.active && (e.x < this.viewLeft - 80 || e.y > this.levelH + 40)) e.destroy();
    });
    this.abuelitas.forEach((a) => a.active && a.update(time, delta));
    this.vendors.forEach((v) => v.update(time));
    this.prisoners.getChildren().slice().forEach((pr) => pr.active && pr.update(time, delta));
    this.cameras.main.setRotation(this.players.some((p) => p.state === 'play' && p.alive && p.drunk) ? Math.sin(time / 500) * CFG.DRUNK.SWAY : 0);
    if (this.boss && this.boss.active) this.boss.update(time, delta);
    // Homing rockets, drones, roosters, flames...
    [this.pBullets, this.pBombs].forEach((g) => g.getChildren().slice().forEach((b) => b.active && b.step && b.step(time, delta)));
    Weapons.updateFires(this, time);

    this.cleanupProjectiles();
    Fx.updateBubbles(this, time);
    if (this.ride) this.ride.update(time, delta);
    else if (!this.arenaStarted && this.viewLeft >= this.arenaX - 0.5) this.startArena();
    if (this.waves) this.updateWaves();
    this.checkExit();
  }

  // The combi is 58px wide: it rides on the terrain under its center (so it follows slopes instead of
  // resting on a corner), but anything 2+ tiles taller than its wheels still stops it like a wall.
  vehicleTouchesTile(v, t) {
    if (t.pixelX === undefined) return true; // crates
    const b = v.body, cx = b.center.x;
    if (cx >= t.pixelX && cx < t.pixelX + TILE) return true;
    return t.pixelY < b.bottom - 2 * TILE;
  }

  // Everything that walks gets put back on slope surfaces right after the physics step.
  snapToSlopes() {
    const T = this.terrain;
    this.players.forEach((p) => p.state === 'play' && !p.vehicle && T.snap(p));
    if (this.combi && this.combi.active) T.snap(this.combi);
    this.abuelitas.forEach((a) => a.active && T.snap(a));
    this.enemies.getChildren().forEach((e) => T.snap(e));
    this.pickups.getChildren().forEach((k) => T.snap(k));
    this.pBombs.getChildren().forEach((b) => b.kind === 'rooster' && T.snap(b));
    this.prisoners.getChildren().forEach((pr) => T.snap(pr));
  }

  // What enemies aim at: the nearest player (or their combi) to x (and y, when given).
  target(x = this.viewLeft + CFG.VIEW_W / 2, y) {
    let best = null, bd = Infinity;
    for (const p of this.players) {
      if (!p.targetable()) continue;
      const o = p.vehicle || p;
      const d = Math.abs(o.x - x) + (y === undefined ? 0 : Math.abs(o.y - y));
      if (d < bd) { bd = d; best = o; }
    }
    return best || this.players[0];
  }

  // Horizontally the camera only scrolls forward and never leaves the rear player behind.
  // Vertically it eases toward the players (only matters in maps taller than the screen).
  updateCamera(snap = false) {
    const objs = this.players.filter((p) => p.state === 'play' && (p.alive || p.vehicle)).map((p) => p.vehicle || p);
    const maxTop = Math.max(0, this.levelH - CFG.VIEW_H);
    if (objs.length) {
      const front = Math.max(...objs.map((o) => o.x)), back = Math.min(...objs.map((o) => o.x));
      const want = Math.min(front - CFG.PLAYER.CAM_LEAD, back - 16);
      this.viewLeft = Phaser.Math.Clamp(Math.max(this.viewLeft, want), 0, this.arenaX);
      const avgY = objs.reduce((a, o) => a + Math.min(o.y, this.levelH), 0) / objs.length;
      const wantTop = Phaser.Math.Clamp(avgY - CFG.VIEW_H * 0.68, 0, maxTop);
      this.viewTop = snap ? wantTop : this.viewTop + (wantTop - this.viewTop) * 0.08;
    }
    this.viewTop = Phaser.Math.Clamp(this.viewTop, 0, maxTop);
    this.cameras.main.centerOn(this.viewLeft + CFG.VIEW_W / 2, Math.round(this.viewTop) + CFG.VIEW_H / 2);
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

  // Enemies without a y stand at street level. Bikers always ride in from the right edge.
  // t: 'grunt' | 'biker' | 'shieldthug' (cupero behind a metal shutter) | 'gangsniper' |
  // 'cop' (patrullero) | 'motocop' | 'riot' (antimotines) | 'sniper'.
  // Riders always come in from the right edge.
  spawnEnemy(s, x) {
    if (s.t === 'biker' || s.t === 'motocop') x = this.viewLeft + CFG.VIEW_W + 30;
    const y = this.floorY({ x, y: s.y });
    const make = {
      biker: () => new Biker(this, x, y),
      shieldthug: () => new RiotCop(this, x, y, { gang: true }),
      gangsniper: () => new Sniper(this, x, y, { gang: true }),
      motocop: () => new Biker(this, x, y, { tex: 'motocop', hp: 3, shots: 3, score: 300, shout: '¡PAPELETA!' }),
      cop: () => new Grunt(this, x, y, Object.assign({ skin: 'tombo', hp: 2, burst: 2, cop: true }, s)),
      riot: () => new RiotCop(this, x, y),
      sniper: () => new Sniper(this, x, y),
    };
    const e = (make[s.t] || (() => new Grunt(this, x, y, s)))();
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
      const minY = this.viewTop - 150, maxY = this.viewTop + CFG.VIEW_H + 30;
      g.getChildren().slice().forEach((b) => {
        if (b.x < minX || b.x > maxX || b.y > maxY || b.y < minY) b.destroy();
      });
    });
    // Bullets stop at walls, the ground and slopes (one-way floors let them through).
    const T = this.terrain;
    [this.pBullets, this.eBullets].forEach((g) =>
      g.getChildren().slice().forEach((b) => {
        if (T.isSolid(b.x, b.y)) {
          Fx.spark(this, b.x, b.y);
          b.destroy();
        }
      }),
    );
    // Tile collisions handle flat ground; slopes have no collision, so bombs that sink into one go off here.
    this.pBombs.getChildren().slice().forEach((b) => b.active && T.inSlope(b.x, b.y + 2) && this.onPlayerBombGround(b, 'slope'));
    this.eBombs.getChildren().slice().forEach((b) => b.active && T.inSlope(b.x, b.y + 2) && this.explodeEnemyBomb(b));
  }

  // ---------- projectiles & damage ----------

  firePlayerBullet(x, y, angle, speed, damage, tex, owner) {
    const b = this.pBullets.create(x, y, tex).setDepth(12).setRotation(angle);
    b.damage = damage;
    b.owner = owner;
    this.physics.velocityFromRotation(angle, speed, b.body.velocity);
    return b;
  }

  // kind: 'grenade' (bounces, then a timer), 'molotov' (bursts on landing), 'stones' (fast low throw) or 'super'.
  throwGrenade(x, y, vx, vy, owner, kind = 'grenade') {
    if (kind === 'stones') {
      const st = this.pBombs.create(x, y, 'stone').setDepth(12);
      st.kind = 'stone';
      st.owner = owner;
      st.setVelocity(Math.sign(vx) * CFG.STONE.vx + (vx - Math.sign(vx) * CFG.GRENADE.vx), CFG.STONE.vy).setAngularVelocity(720);
      if (owner && owner.fat) st.setScale(CFG.FAT.BOULDER_SCALE);
      return;
    }
    const g = this.pBombs.create(x, y, kind === 'molotov' ? 'molotov' : 'grenade').setDepth(12);
    g.kind = kind;
    g.owner = owner;
    g.bounces = 0;
    if (kind === 'super') g.setScale(2);
    else if (kind === 'grenade' && owner && owner.fat) g.setScale(CFG.FAT.GRENADE_SCALE);
    if (kind !== 'molotov') g.setBounce(0.45);
    g.setVelocity(vx, vy).setAngularVelocity(vx >= 0 ? 500 : -500);
    this.time.delayedCall(kind === 'molotov' ? 3000 : 1600, () => this.detonate(g));
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

  enemyShoot(x, y, angle, speed = CFG.ENEMY.BULLET_SPEED, tex = 'ebullet') {
    const b = this.eBullets.create(x, y, tex).setDepth(12);
    if (tex !== 'ebullet') b.setRotation(angle);
    this.physics.velocityFromRotation(angle, speed, b.body.velocity);
    return b;
  }

  // Thrown in an arc to land at (tx, ty) after T seconds. Coins hurt in flight but just clink when they land.
  enemyLob(x, y, tx, ty, tex, T = 0.9) {
    const b = this.eBombs.create(x, y, tex).setDepth(12);
    b.isEnemyBomb = true;
    b.coin = tex === 'coin';
    const g = CFG.GRAVITY;
    b.setVelocity((tx - x) / T, (ty - y - 0.5 * g * T * T) / T).setAngularVelocity(tx < x ? -400 : 400);
    return b;
  }

  // Player projectiles that touch the ground or a slope (where: 'ground' | 'slope'); see Weapons.PROJECTILES.
  onPlayerBombGround(b, where) {
    if (!b || !b.active) return;
    const K = Weapons.PROJECTILES[b.kind], fn = K && (K[where] || K.ground);
    if (fn) fn(this, b);
    else this.detonate(b);
  }

  detonate(b) {
    if (!b || !b.active) return;
    Weapons.PROJECTILES[b.kind].burst(this, b);
    if (b.active) b.destroy();
  }

  explodeEnemyBomb(b) {
    if (!b || !b.active) return;
    const { x, y } = b;
    b.destroy();
    if (b.coin) {
      Fx.spark(this, x, y);
      return;
    }
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

  // how: optional cause of death ('fire' chars enemies, 'melee', 'laser').
  damageEnemiesInRadius(x, y, r, dmg, explosive, owner, how) {
    this.enemies.getChildren().slice().forEach((e) => {
      if (e.alive && Phaser.Math.Distance.Between(x, y, e.x, e.y - 12) <= r + 8) e.hit(dmg, explosive, owner, how);
    });
    this.props.getChildren().slice().forEach((o) => {
      if (o.alive && Phaser.Math.Distance.Between(x, y, o.x, o.y - o.height / 2) <= r + o.width / 2) o.hit(dmg, explosive, owner, how);
    });
    const b = this.boss;
    if (b && b.alive && Phaser.Geom.Intersects.CircleToRectangle(new Phaser.Geom.Circle(x, y, r), b.getBounds())) b.hit(dmg, owner);
    if (b) b.parts.forEach((p) => p.alive && Phaser.Geom.Intersects.CircleToRectangle(new Phaser.Geom.Circle(x, y, r), p.getBounds()) && p.hit(dmg, explosive, owner, how));
  }

  hitTarget(t, dmg, explosive, owner, how) {
    if (t === this.boss) t.hit(dmg, owner);
    else t.hit(dmg, explosive, owner, how);
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

  // Piercing shots (flames) hit each target once and keep going.
  bulletHits(b, t) {
    if (!t.alive || !b.active) return;
    if (b.pierce) {
      b.hitSet = b.hitSet || new Set();
      if (b.hitSet.has(t)) return;
      b.hitSet.add(t);
    }
    Fx.spark(this, b.x, b.y);
    this.hitTarget(t, b.damage, false, b.owner, b.how);
    if (!b.pierce) b.destroy();
  }

  // An enemy (or the boss) right in front of the player, close enough for a melee hit.
  meleeTarget(p) {
    const R = CFG.MELEE.RANGE;
    const zone = new Phaser.Geom.Rectangle(p.facing > 0 ? p.x - 4 : p.x - R, p.y - 22, R + 4, 20);
    return Weapons.targets(this).find((t) => Phaser.Geom.Intersects.RectangleToRectangle(zone, t.getBounds())) || null;
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

  addPrisoner(x, y, def) {
    const pr = new Prisoner(this, x, y, def);
    this.prisoners.add(pr);
    return pr;
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
    return this.players.filter((p) => p.state !== 'inactive' || p.score > 0)
      .map((p) => ({ index: p.index, name: p.info.name, score: p.score, rescued: p.rescued, bonus: p.rescueBonus || 0 }));
  }

  // ---------- flow ----------

  onPlayerDeath(p) {
    p.lives--;
    if (p.lives > 0) p.respawn(...this.spawnPoint(p));
    else this.beginContinue(p, false);
  }

  // Players (re)enter by dropping in from the top of the screen, over a column that has a floor in view.
  // Indoors (a ceiling in view) they drop from just under the ceiling instead, never from inside it.
  spawnPoint(p) {
    const T = this.terrain, top = this.viewTop, bottom = this.viewTop + CFG.VIEW_H;
    const want = this.viewLeft + 60 + p.index * 24;
    for (let i = 0; i < 24; i++) {
      for (const x of [want + i * 16, want - i * 16]) {
        if (x < this.viewLeft + 16 || x > this.viewLeft + CFG.VIEW_W - 16) continue;
        const s = T.surfaceBelow(x, top + 24);
        if (s === null || s >= bottom) continue;
        let y = top - 8;
        for (let r = Math.floor(s / TILE) - 1; r * TILE >= top - 40 && r >= 0; r--) {
          if (T.isSolid(x, r * TILE + 8)) {
            y = Math.max(y, (r + 1) * TILE + 26); // the body (20 tall) starts below the ceiling
            break;
          }
        }
        if (y < s - 4) return [x, y];
      }
    }
    return [want, top - 8];
  }

  // Is there something to stand on just ahead (terrain, crates, a bus roof)? Used by enemies to stay on their floor.
  hasFloor(x, footY) {
    if (this.terrain.hasFloor(x, footY)) return true;
    return this.platforms.getChildren().some((c) => {
      const b = c.body;
      return x >= b.left && x <= b.right && Math.abs(footY - b.top) <= 4;
    });
  }

  // Where an object without an explicit y stands: street level at x (or the bottom row over a pit).
  floorY(o) {
    if (o.y !== undefined) return o.y;
    const g = this.terrain.groundY(o.x);
    return g === null ? this.levelH - TILE : g;
  }

  // Falling into a pit costs a life (in the combi too).
  checkPits() {
    const limit = this.levelH + 24;
    for (const p of this.players) {
      if (p.state !== 'play') continue;
      const v = p.vehicle;
      if (v && v.y > limit) {
        v.fellIntoPit();
        p.fallDeath();
      } else if (!v && p.alive && p.y > limit) p.fallDeath();
      // Safety net: stuck at the top edge (e.g. pushed on top of a ceiling; the camera can't follow above the map)
      // for longer than any jump -> drop back in.
      if (!v && p.alive && p.y < this.viewTop + 12) {
        p.aboveSince = p.aboveSince || this.time.now;
        if (this.time.now - p.aboveSince > 1500) {
          p.setPosition(...this.spawnPoint(p));
          p.setVelocity(0, 0);
          p.aboveSince = 0;
        }
      } else p.aboveSince = 0;
    }
  }

  inView(x, y, margin = 0) {
    return x > this.viewLeft - margin && x < this.viewLeft + CFG.VIEW_W + margin && y > this.viewTop - margin && y < this.viewTop + CFG.VIEW_H + margin;
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
    const A = this.mission.arena;
    // No arena: a middle section leaves by its exit; a last section (or a mission without one) just ends here.
    if (!A) {
      if (this.lastSection) this.onBossDefeated();
      return;
    }
    if (A.alert) this.message(A.alert[0], A.alert[1], 2200);
    if (A.boss) this.startBoss(A.boss);
    else if (A.waves) {
      this.waves = { list: A.waves, index: -1, pending: 0 };
      this.time.delayedCall(1200, () => this.nextWave());
    } else this.sectionCleared();
  }

  // Locked-screen ambush: the next wave comes when the current one is dead.
  nextWave() {
    const W = this.waves;
    W.index++;
    const wave = W.list[W.index];
    W.pending = wave.length;
    wave.forEach((s, i) => this.time.delayedCall(i * 450, () => {
      if (this.finished) return;
      // dx past the view means "run in from the right edge" (the view size depends on CFG.ZOOM).
      this.spawnEnemy(s, this.arenaX + Math.min(s.dx, CFG.VIEW_W + 24));
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
      this.sectionCleared();
    }
  }

  startBoss(type) {
    Sfx.rev();
    // In a ride the "floor" is the bus roof (the bus has stopped at the terminal).
    const floor = this.ride ? CFG.RIDE.ROOF_Y : this.floorY({ x: this.levelW - 40 });
    const b = (this.boss = new BOSSES[type](this, this.levelW + 70, floor));
    const P = this.physics.add;
    P.overlap(b, this.pBullets, (bb, bullet) => b.state !== 'enter' && this.bulletHits(bullet, b));
    P.overlap(b, this.pBombs, (bb, bomb) => b.alive && this.detonate(bomb));
    if (b.contactKills !== false) this.players.forEach((pl) => P.overlap(b, pl, () => b.alive && pl.canBeHit() && pl.die()));
    // Breakable parts (gun pods...) are hit like enemies.
    b.parts.forEach((part) => {
      P.overlap(part, this.pBullets, (pp, bullet) => part.alive && b.state !== 'enter' && this.bulletHits(bullet, part));
      P.overlap(part, this.pBombs, (pp, bomb) => part.alive && this.detonate(bomb));
    });
    if (this.combi) {
      this.combiColliders.push(
        P.overlap(b, this.combi, () => {
          const c = this.combi;
          if (!c || c.state !== 'driven' || !b.alive) return;
          if (b.charging && !b.hitCombi) {
            b.hitCombi = true;
            c.damage(2);
            c.setVelocity(b.facing * 200, -180);
          }
        }),
      );
    }
  }

  onBossDefeated() {
    this.time.delayedCall(this.boss ? 2600 : 1200, () => this.missionComplete());
  }

  missionComplete() {
    if (this.finished) return;
    this.finished = true;
    this.updateFreeze();
    Sfx.stopMusic();
    Sfx.fanfare();
    Voice.say('mission_complete', 'Mission complete!', 'en');
    const O = this.mission.outro || {};
    this.message(O.title || 'MISSION COMPLETE!', O.sub || '', 4500);
    // Prisoner bonus, like the arcade's tally: every rescue since your last death counts.
    this.players.forEach((p) => {
      p.rescueBonus = p.state === 'play' ? p.rescued * CFG.PRISONER.BONUS : 0;
      p.score += p.rescueBonus;
    });
    this.savePlayers();
    this.time.delayedCall(5200, () => {
      this.scene.stop('HUD');
      const end = { mission: this.missionIndex, scores: this.scores() };
      if (this.mission.story) this.scene.start('Story', { pages: this.mission.story, next: 'MissionEnd', data: end });
      else this.scene.start('MissionEnd', end);
    });
  }
}
