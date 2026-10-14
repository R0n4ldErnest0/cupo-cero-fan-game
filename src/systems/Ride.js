// Ride mode: the section takes place on top of a moving vehicle (the Metropolitano bus; later the air level).
// The camera stays put; the road, the backgrounds and the scenery rush past at `speed`. Things happen on a timeline
// (seconds since the start); at `seconds` the vehicle brakes, arrives at a station and the section is cleared.
//
// Section data: ride: { speed, seconds, events: [{ at, type, ... }] }
//   type 'grunt'   { x, variant }          a cupero already standing on the roof (drops in from above)
//   type 'jumper'  { from: 'left'|'right', variant, cop }  a biker (or a motorbike cop) rides alongside and jumps on
//   type 'bridge'                          a pedestrian bridge: crouch under it or lose a life (warned first)
// Falling off the bus means being run over (a pit). Bullets fly over the roof as usual.
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

    // Road below the bus (scrolls at full speed) and the bus itself.
    this.road = scene.add.tileSprite(0, R.ROAD_Y, CFG.VIEW_W, scene.levelH - R.ROAD_Y + 8, 'ground').setOrigin(0).setDepth(-4);
    this.bus = scene.add.image(R.BUS_X, R.ROAD_Y + 2, 'metro_bus').setOrigin(0, 1).setDepth(-2);
    // The roof: two cars and the lower accordion joint between them, one-way platforms.
    R.ROOFS.forEach(([x0, x1, dy]) => {
      const z = scene.add.zone(R.BUS_X + (x0 + x1) / 2, R.ROOF_Y + dy + 4, x1 - x0, 8);
      scene.physics.add.existing(z, true);
      z.body.checkCollision.down = z.body.checkCollision.left = z.body.checkCollision.right = false;
      scene.platforms.add(z);
    });
    this.warning = scene.worldText(CFG.VIEW_W - 60, 40, '¡AGÁCHATE! ↓', { color: '#ff5a3a', fontSize: '10px' }).setDepth(60).setVisible(false);
  }

  get roofY() {
    return CFG.RIDE.ROOF_Y;
  }

  update(time, dt) {
    const s = this.scene, R = CFG.RIDE, sec = dt / 1000;
    this.t += sec;
    // Arrival: brake to a stop, then the section is done.
    if (!this.arrived && this.t >= this.def.seconds) {
      this.arrived = true;
      s.message('', 'PRÓXIMA ESTACIÓN...', 1800);
      s.tweens.add({ targets: this, speed: 0, duration: R.BRAKE_MS, ease: 'Quad.Out', onComplete: () => s.sectionCleared() });
    }
    this.dist += this.speed * sec;
    this.road.tilePositionX = Math.round(this.dist);

    while (this.events.length && this.events[0].at <= this.t) this.run(this.events.shift());

    // Lamp posts flying past in front of the background.
    if (this.dist > this.nextPost) {
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

  run(e) {
    const s = this.scene, R = CFG.RIDE;
    if (e.type === 'grunt') {
      const g = s.spawnEnemy({ t: 'grunt', variant: e.variant }, e.x);
      g.y = R.ROOF_Y - 80;
    } else if (e.type === 'jumper') this.jumper(e);
    else if (e.type === 'bridge') this.bridge();
  }

  // A biker rides up next to the bus and the passenger jumps onto the roof.
  jumper(e) {
    const s = this.scene, R = CFG.RIDE, fromLeft = e.from === 'left';
    const startX = fromLeft ? -30 : CFG.VIEW_W + 30;
    const jumpX = fromLeft ? Phaser.Math.Between(80, 150) : Phaser.Math.Between(240, 320);
    const moto = s.add.image(startX, R.ROAD_Y + 4, e.cop ? 'motocop' : 'biker').setOrigin(0.5, 1).setDepth(-1).setFlipX(fromLeft);
    s.tweens.add({
      targets: moto, x: jumpX, duration: 1100, ease: 'Sine.Out',
      onComplete: () => {
        if (!moto.active) return;
        const g = s.spawnEnemy({ t: e.cop ? 'cop' : 'grunt', variant: e.variant }, jumpX);
        g.y = R.ROAD_Y - 12;
        g.setVelocity(fromLeft ? 30 : -30, -340);
        Fx.say(s, g, e.cop ? '¡Alto, papeleta!' : '¡Arriba, causa!', 900);
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
