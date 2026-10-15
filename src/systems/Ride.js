// Ride mode: the section takes place on top of a moving vehicle (the Metropolitano bus; later the air level).
// The camera stays put; the road, the backgrounds and the scenery rush past at `speed`. Things happen on a timeline
// (seconds since the start); at `seconds` the bus brakes into a station: the section is cleared, or, if the section
// has an `arena`, the bus stops at the terminal (a platform appears around it) and the arena starts (e.g. a boss).
//
// Section data: ride: { speed, seconds, events: [{ at, type, ... }] }
//   type 'grunt'    { x, variant }          a cupero already standing on the roof (drops in from above)
//   type 'jumper'   { from: 'left'|'right', variant, cop }  a biker (or a motorbike cop) rides alongside and jumps on
//   type 'bridge'                           a pedestrian bridge: crouch under it or lose a life (warned first)
//   type 'wave'     { size, cop }               `size` bikers at once from both sides + some cuperos dropping on the roof
//   type 'transfer'                         your bus breaks down ("FUERA DE SERVICIO") and falls behind while the next
//                                           bus pulls up right in front of it: jump across before the gap opens
// Falling off a bus means being run over (a pit). Whoever stands on a bus moves with it.
class Ride {
  constructor(scene, def) {
    this.scene = scene;
    this.def = def;
    this.speed = def.speed;
    this.dist = 0;
    this.t = 0;
    this.events = (def.events || []).slice().sort((a, b) => a.at - b.at);
    this.bridges = [];
    this.scenery = [];
    this.nextPost = 0;
    this.arrived = false;
    const R = CFG.RIDE;

    // Road below the buses (scrolls at full speed).
    this.road = scene.add.tileSprite(0, R.ROAD_Y, CFG.VIEW_W, scene.levelH - R.ROAD_Y + 8, 'ground').setOrigin(0).setDepth(-4);
    this.buses = [this.makeBus(R.BUS_X)];
    const top = scene.levelH - CFG.VIEW_H;
    this.warning = scene.worldText(CFG.VIEW_W - 50, top + 44, '¡AGÁCHATE! ↓', { color: '#ff5a3a', fontSize: '10px' }).setDepth(60).setVisible(false);
  }

  get roofY() {
    return CFG.RIDE.ROOF_Y;
  }

  // A bus at screen x (its left end): the image plus its roof (two cars and the lower accordion), one-way platforms.
  makeBus(x) {
    const s = this.scene, R = CFG.RIDE;
    const bus = { x, vx: 0, img: s.add.image(x, R.ROAD_Y + 2, 'metro_bus').setOrigin(0, 1).setDepth(-2), zones: [] };
    R.ROOFS.forEach(([x0, x1, dy]) => {
      const z = s.add.zone(x + (x0 + x1) / 2, R.ROOF_Y + dy + 4, x1 - x0, 8);
      s.physics.add.existing(z, true);
      z.body.checkCollision.down = z.body.checkCollision.left = z.body.checkCollision.right = false;
      z.dx = (x0 + x1) / 2;
      s.platforms.add(z);
      bus.zones.push(z);
    });
    return bus;
  }

  // Move a bus on screen, and everyone standing on its roof with it.
  moveBus(bus, dx) {
    if (!dx) return;
    const s = this.scene, R = CFG.RIDE;
    const riders = [...s.players.filter((p) => p.state === 'play' && p.alive && !p.vehicle), ...s.enemies.getChildren(), ...s.pickups.getChildren()];
    riders.forEach((o) => {
      if (!o.body || !o.active) return;
      const onIt = o.body.blocked.down && Math.abs(o.body.bottom - (R.ROOF_Y + 4)) <= 6 && o.x >= bus.x && o.x <= bus.x + R.BUS_W;
      if (onIt) o.x += dx;
    });
    bus.x += dx;
    bus.img.x = bus.x;
    bus.zones.forEach((z) => {
      z.x = bus.x + z.dx;
      z.body.updateFromGameObject();
    });
  }

  removeBus(bus) {
    bus.img.destroy();
    bus.zones.forEach((z) => z.destroy());
    this.buses = this.buses.filter((b) => b !== bus);
  }

  update(time, dt) {
    const s = this.scene, R = CFG.RIDE, sec = dt / 1000;
    this.t += sec;
    if (!this.arrived && this.t >= this.def.seconds) this.arrive();
    this.dist += this.speed * sec;
    this.road.tilePositionX = Math.round(this.dist);

    while (!this.arrived && this.events.length && this.events[0].at <= this.t) this.run(this.events.shift());
    if (this.transferring) this.updateTransfer(time, sec);

    // Lamp posts flying past in front of the background.
    if (this.speed > 0 && this.dist > this.nextPost) {
      this.nextPost = this.dist + R.POST_EVERY;
      this.scenery.push(s.add.image(CFG.VIEW_W + 10, R.ROAD_Y, 'lamppost').setOrigin(0.5, 1).setDepth(-3));
    }
    const dx = this.speed * sec;
    this.scenery = this.scenery.filter((o) => {
      o.x -= dx;
      if (o.x < -40) { o.destroy(); return false; }
      return true;
    });
    this.updateBridges(dx);
  }

  // Brake into the station. Without an arena the section is done; with one, the bus stops at the terminal: a
  // platform appears at road level around it (no more falling under the wheels) and the arena starts.
  arrive() {
    const s = this.scene, R = CFG.RIDE;
    this.arrived = true;
    const stop = s.mission.arena;
    s.message('', stop ? 'ESTACIÓN TERMINAL' : 'PRÓXIMA ESTACIÓN...', 1800);
    s.tweens.add({
      targets: this, speed: 0, duration: R.BRAKE_MS, ease: 'Quad.Out',
      onComplete: () => {
        if (!stop) return s.sectionCleared();
        const floor = s.add.tileSprite(0, R.ROAD_Y - 6, CFG.VIEW_W, 30, 'ground').setOrigin(0).setDepth(-1);
        floor.tilePositionX = this.dist;
        const z = s.add.zone(CFG.VIEW_W / 2, R.ROAD_Y - 2, CFG.VIEW_W, 8);
        s.physics.add.existing(z, true);
        s.platforms.add(z);
        s.startArena();
      },
    });
  }

  run(e) {
    const s = this.scene, R = CFG.RIDE;
    if (e.type === 'grunt') {
      const g = s.spawnEnemy({ t: 'grunt', variant: e.variant }, e.x);
      g.y = R.ROOF_Y - 80;
    } else if (e.type === 'jumper') this.jumper(e);
    else if (e.type === 'bridge') this.bridge();
    else if (e.type === 'transfer') this.startTransfer();
    else if (e.type === 'wave') this.wave(e);
  }

  // Your bus breaks down and falls behind; the next bus pulls up just ahead of it for a few seconds.
  startTransfer() {
    const s = this.scene, R = CFG.RIDE;
    const old = this.buses[0];
    const next = this.makeBus(CFG.VIEW_W + 20);
    this.buses.push(next);
    this.transferring = { old, next, phase: 'approach' };
    s.message('¡BUS FUERA DE SERVICIO!', '¡SALTA AL SIGUIENTE!', 2200);
    Sfx.horn();
    old.img.setTint(0xb0b0b0);
    this.jumpSign = s.worldText(0, R.ROOF_Y - 40, '¡SALTA! →', { color: '#ffe066', fontSize: '10px' }).setDepth(60);
    s.tweens.add({ targets: this.jumpSign, alpha: 0.3, yoyo: true, repeat: -1, duration: 200 });
  }

  // approach: the next bus catches up until it's right in front of yours (gap TRANSFER_GAP);
  // together: both slide left for TRANSFER_TOGETHER ms (the moment to jump across);
  // settle: the broken bus drops behind and leaves the screen while the new one pulls into place.
  updateTransfer(time, sec) {
    const R = CFG.RIDE, T = this.transferring;
    const front = T.old.x + R.BUS_W;
    if (T.phase === 'approach') {
      this.moveBus(T.next, -Math.min(R.TRANSFER_APPROACH * sec, T.next.x - (front + R.TRANSFER_GAP)));
      if (T.next.x <= front + R.TRANSFER_GAP) {
        T.phase = 'together';
        T.until = time + R.TRANSFER_TOGETHER;
      }
    } else if (T.phase === 'together') {
      this.moveBus(T.old, -R.TRANSFER_SPEED * sec);
      this.moveBus(T.next, -R.TRANSFER_SPEED * sec);
      if (time > T.until) T.phase = 'settle';
    } else {
      this.moveBus(T.old, -R.TRANSFER_SPEED * 3 * sec);
      if (T.next.x > R.BUS_X) this.moveBus(T.next, -Math.min(R.TRANSFER_SETTLE * sec, T.next.x - R.BUS_X));
      if (T.old.x + R.BUS_W < -10 && T.next.x <= R.BUS_X) {
        this.removeBus(T.old);
        this.transferring = null;
        this.jumpSign.destroy();
        return;
      }
    }
    if (this.jumpSign.active) {
      this.jumpSign.setVisible(T.phase !== 'approach' || T.next.x < CFG.VIEW_W);
      this.jumpSign.setPosition(Phaser.Math.Clamp(T.old.x + R.BUS_W + R.TRANSFER_GAP / 2, 30, CFG.VIEW_W - 30), R.ROOF_Y - 40);
    }
  }

  wave(e) {
    const s = this.scene, R = CFG.RIDE, n = e.size || 4;
    for (let i = 0; i < n; i++) {
      s.time.delayedCall(i * 380, () => this.jumper({ from: i % 2 ? 'left' : 'right', cop: e.cop && i % 2 === 0, variant: i % 3 === 2 ? 'knife' : undefined }));
    }
    for (let i = 0; i < Math.floor(n / 2); i++) {
      s.time.delayedCall(300 + i * 500, () => {
        const g = s.spawnEnemy({ t: 'grunt', variant: i % 2 ? 'thrower' : undefined }, Phaser.Math.Between(R.BUS_X + 40, R.BUS_X + R.BUS_W - 40));
        g.y = R.ROOF_Y - 90;
      });
    }
  }

  // A biker rides up next to the bus and the passenger jumps onto the roof.
  jumper(e) {
    const s = this.scene, R = CFG.RIDE, fromLeft = e.from === 'left';
    const startX = fromLeft ? -30 : CFG.VIEW_W + 30;
    const jumpX = fromLeft ? Phaser.Math.Between(60, 120) : Phaser.Math.Between(190, 260);
    const moto = s.add.image(startX, R.ROAD_Y + 4, e.cop ? 'motocop' : 'biker').setOrigin(0.5, 1).setDepth(-1).setFlipX(fromLeft);
    s.tweens.add({
      targets: moto, x: jumpX, duration: 1100, ease: 'Sine.Out',
      onComplete: () => {
        if (!moto.active) return;
        const g = s.spawnEnemy({ t: e.cop ? 'cop' : 'grunt', variant: e.variant }, jumpX);
        g.y = R.ROAD_Y - 12;
        g.setVelocity(fromLeft ? 30 : -30, -340);
        if (Math.random() < CFG.ENEMY.TALK_CHANCE) Fx.say(s, g, e.cop ? '¡Alto, papeleta!' : '¡Arriba, causa!', 900);
        moto.setTexture('prop_moto');
        s.tweens.add({ targets: moto, x: fromLeft ? -60 : CFG.VIEW_W + 60, duration: 900, onComplete: () => moto.destroy() });
      },
    });
    Sfx.rev();
  }

  // Pedestrian bridge over the busway, seen side-on: a deck at head height. Warned before it arrives.
  bridge() {
    const s = this.scene, R = CFG.RIDE;
    this.warning.setVisible(true);
    s.tweens.add({ targets: this.warning, alpha: 0.2, yoyo: true, repeat: 5, duration: 130, onComplete: () => this.warning.setVisible(false).setAlpha(1) });
    Sfx.horn();
    const x = CFG.VIEW_W + 30 + this.speed * (R.WARN_MS / 1000);
    const pillar = s.add.image(x, R.ROAD_Y, 'bridge_pillar').setOrigin(0.5, 1).setDepth(-3);
    const deck = s.add.image(x, R.ROOF_Y - R.DUCK_CLEARANCE, 'bridge_deck').setOrigin(0.5, 1).setDepth(15);
    this.bridges.push({ deck, pillar });
  }

  // Anyone standing (or jumping) where the deck passes gets knocked off: players lose a life, cuperos too.
  updateBridges(dx) {
    const s = this.scene;
    this.bridges = this.bridges.filter((b) => {
      b.deck.x -= dx;
      b.pillar.x -= dx;
      if (b.deck.x < -60) { b.deck.destroy(); b.pillar.destroy(); return false; }
      // Physics bodies, not sprite frames: crouching shrinks the body under the deck.
      const r = b.deck.getBounds();
      const hits = (o) => Phaser.Geom.Intersects.RectangleToRectangle(r, new Phaser.Geom.Rectangle(o.body.x, o.body.y, o.body.width, o.body.height));
      for (const p of s.players) if (p.canBeHit() && hits(p)) p.die();
      s.enemies.getChildren().forEach((e) => {
        if (e.alive && hits(e)) e.hit(99, true, null);
      });
      return true;
    });
  }
}
