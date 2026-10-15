// A player's aircraft in a flight section (Mission 5): 1P flies the old police helicopter Don Tito found, 2P a small
// plane. Free movement inside the screen (no gravity) while the scene scrolls on its own; fire = forward machine
// gun, grenade button = a homing rocket (limited). CFG.AIRCRAFT.HP hits; when it goes down, the pilot loses a life
// and comes back in a new one (see Player.respawn).
class Aircraft extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, driver) {
    const plane = driver.index === 1;
    super(scene, x, y, plane ? 'aircraft_plane' : 'aircraft_heli');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.plane = plane;
    this.setDepth(9);
    this.body.setAllowGravity(false).setSize(plane ? 30 : 32, 12).setOffset(plane ? 3 : 4, 6);
    this.state = 'driven';
    this.driver = driver;
    const A = CFG.AIRCRAFT;
    this.hp = A.HP;
    this.rockets = A.ROCKETS;
    this.lastShot = 0;
    this.hurtUntil = 0;
    this.facing = 1;
    this.bubbleOffset = 20;
    this.rotor = plane ? null : scene.add.image(x, y, 'heli_rotor').setScale(0.45, 1).setDepth(10);
  }

  hudText() {
    return `${this.plane ? 'AVIONETA' : 'HELICÓPTERO'} ${'■'.repeat(Math.max(0, this.hp))}  COHETES ${this.rockets}`;
  }

  update(time, dt) {
    if (this.state !== 'driven') return;
    const s = this.scene, c = this.driver.ctrl, A = CFG.AIRCRAFT;
    const sp = this.plane ? A.PLANE_SPEED : A.SPEED;
    const mx = (c.left ? -1 : 0) + (c.right ? 1 : 0), my = (c.up ? -1 : 0) + (c.down ? 1 : 0);
    this.setVelocity(mx * sp, my * sp);
    // Stay inside the screen (above the rooftops at the bottom).
    this.x = Phaser.Math.Clamp(this.x, s.viewLeft + 24, s.viewLeft + CFG.VIEW_W - 24);
    this.y = Phaser.Math.Clamp(this.y, s.viewTop + 34, s.viewTop + CFG.VIEW_H - A.FLOOR_MARGIN);
    this.setAngle(mx * 6 + Math.sin(time / 260) * 2);
    if (this.rotor) this.rotor.setPosition(this.x, this.y - 10).setScale((Math.abs(Math.sin(time / 30)) * 0.4 + 0.05), 1);

    const delay = this.plane ? A.PLANE_DELAY : A.DELAY;
    if (c.fire && time > this.lastShot + delay) {
      this.lastShot = time;
      const offs = this.plane ? [-3, 3] : [0];
      offs.forEach((o) => s.firePlayerBullet(this.x + 18, this.y + 2 + o, Phaser.Math.FloatBetween(-0.03, 0.03), 400, 1, 'mgbullet', this.driver));
      Sfx.mg();
    }
    if (c.bombP && this.rockets > 0) {
      this.rockets--;
      const r = s.pBombs.create(this.x + 10, this.y + 6, 'rocket').setDepth(12);
      r.kind = 'rocket';
      r.owner = this.driver;
      r.body.setAllowGravity(false).setSize(6, 6);
      r.damage = CFG.WEAPONS.rocket.damage;
      r.setVelocity(140, 0);
      r.homeAt = time + 120;
      r.step = (t, d) => Weapons.home(r, CFG.WEAPONS.rocket, t, d);
      Sfx.rocket();
    }
    this.driver.setPosition(this.x, this.y);
  }

  damage(n = 1) {
    const s = this.scene;
    if (this.state !== 'driven' || s.time.now < this.hurtUntil || s.finished) return;
    this.hurtUntil = s.time.now + 600;
    this.hp -= n;
    Fx.flash(this);
    Sfx.hit();
    if (this.hp <= 0) this.crash();
  }

  // Goes down in flames: the pilot loses a life (and comes back in a new aircraft).
  crash() {
    const s = this.scene, d = this.driver;
    this.state = 'wrecked';
    this.setVelocity(60, 160);
    s.tweens.add({ targets: this, angle: 200, duration: 900 });
    s.time.delayedCall(600, () => s.explodeAt(this.x, this.y, 0, 0, true, 1.4));
    s.time.delayedCall(900, () => this.removeAll());
    d.vehicle = null;
    d.alive = true; // so fallDeath() applies
    d.fallDeath();
  }

  removeAll() {
    if (this.rotor) this.rotor.destroy();
    this.scene.aircraft = this.scene.aircraft.filter((a) => a !== this);
    this.destroy();
  }
}
