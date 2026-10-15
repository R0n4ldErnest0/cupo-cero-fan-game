// Flight mode (Mission 5 air level, like Metal Slug 3's last mission): the players fly aircraft freely around the
// screen while the city scrolls by below on its own. Enemies come in on a timeline; at `seconds` the aircraft run
// out of fuel over the plaza and crash-land: the section is cleared.
//
// Section data: flight: { speed, seconds, events: [{ at, type, y }] }
//   type 'polheli' | 'drone' | 'tv'   a flying enemy enters from the right (y: height, default random)
class Flight {
  constructor(scene, def) {
    this.scene = scene;
    this.def = def;
    this.speed = def.speed;
    this.dist = 0;
    this.t = 0;
    this.events = (def.events || []).slice().sort((a, b) => a.at - b.at);
    this.clouds = [];
    this.nextCloud = 0;
    this.landed = false;
    // The city far below: rooftops scrolling at the bottom of the screen.
    this.roofs = scene.add.tileSprite(0, CFG.VIEW_H - 40, CFG.VIEW_W, 60, 'bg_city').setOrigin(0).setDepth(-4).setTint(0x9098a8);
  }

  // Put a player into an aircraft (at the start, and again after losing one).
  board(p) {
    const s = this.scene;
    const a = new Aircraft(s, s.viewLeft + 70 + p.index * 30, s.viewTop + 70 + p.index * 50, p);
    s.aircraft.push(a);
    s.addVehicleColliders(a);
    p.vehicle = a;
    p.setVisible(false);
    p.body.enable = false;
    a.hurtUntil = s.time.now + CFG.PLAYER.INVULN_MS; // a moment of grace when coming back
    return a;
  }

  update(time, dt) {
    const s = this.scene, sec = dt / 1000;
    this.t += sec;
    this.dist += this.speed * sec;
    this.roofs.tilePositionX = Math.round(this.dist * 1.2);
    if (!this.landed && this.t >= this.def.seconds) this.land();
    while (!this.landed && this.events.length && this.events[0].at <= this.t) this.spawn(this.events.shift());
    // Clouds drifting by.
    if (this.dist > this.nextCloud) {
      this.nextCloud = this.dist + Phaser.Math.Between(120, 260);
      const c = s.add.image(CFG.VIEW_W + 40, Phaser.Math.Between(30, 150), 'puff3').setScale(Phaser.Math.FloatBetween(3, 5)).setAlpha(0.35).setDepth(-3);
      this.clouds.push(c);
    }
    this.clouds = this.clouds.filter((c) => {
      c.x -= this.speed * 1.4 * sec;
      if (c.x < -80) { c.destroy(); return false; }
      return true;
    });
    s.aircraft.forEach((a) => a.active && a.update(time, dt));
  }

  spawn(e) {
    const s = this.scene;
    const y = e.y || Phaser.Math.Between(40, CFG.VIEW_H - 80);
    const f = new Flyer(s, s.viewLeft + CFG.VIEW_W + 40, y, e.type);
    s.enemies.add(f);
    f.body.setAllowGravity(false);
  }

  // Out of fuel over the plaza: the aircraft come down and the section ends.
  land() {
    const s = this.scene;
    this.landed = true;
    s.message('¡NOS QUEDAMOS SIN GASOLINA!', '¡Agárrense!', 2200);
    s.aircraft.forEach((a) => {
      a.state = 'landing';
      s.tweens.add({ targets: a, y: CFG.VIEW_H + 40, angle: 25, duration: 2200, ease: 'Quad.In' });
    });
    s.time.delayedCall(2400, () => s.sectionCleared());
  }
}
