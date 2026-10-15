// The Rochabus: the police water-cannon truck, stolen for the escape from the comisaría (Mission 4).
// Heavy and slow, takes CFG.ROCHABUS.HP hits. Fire = the water cannon on the roof (aimed like the combi's gun):
// a stream that knocks enemies back and stuns them, doing little damage (riot shields stop the damage, not the push).
// Grenade button = the passenger throws the police's own tear gas back at them.
const ROCHA_SPEC = {
  kind: 'rochabus', name: 'ROCHABUS', tex: 'rochabus', body: [70, 30, 4, 10],
  wheels: [{ dx: 26, dy: -6 }, { dx: -6, dy: -6 }, { dx: -26, dy: -6 }], wheelScale: 1.1, wheelSpin: 6,
  turret: { tex: 'water_cannon', dx: -2, dy: -40, len: 14 }, labelY: 50, hintY: 62,
  wreckLine: '¡Se nos acabó el agua... y el rochabus!',
};

class RochabusSlug extends CombiSlug {
  constructor(scene, x, y) {
    super(scene, x, y, ROCHA_SPEC);
    this.grenades = CFG.ROCHABUS.GRENADES;
  }

  hudText() {
    return `ROCHABUS ${'■'.repeat(Math.max(0, this.hp))}  AGUA ∞  GAS ${this.grenades}`;
  }

  saveState() {
    return { kind: 'rochabus', hp: this.hp, grenades: this.grenades };
  }

  loadState(st) {
    this.hp = st.hp;
    this.grenades = st.grenades;
  }

  drive(time, dt) {
    const C = CFG.ROCHABUS, s = this.scene;
    super.drive(time, dt);
    if (this.state !== 'driven') return;
    // The base fires machine-gun bullets on `fire`; the rochabus replaces them with water (see waterShot).
    const c = this.driver.ctrl;
    if (c.fire && time > (this.nextWater || 0)) {
      this.nextWater = time + C.WATER_DELAY;
      const m = this.muzzle();
      const b = s.firePlayerBullet(m.x, m.y, m.angle + Phaser.Math.FloatBetween(-0.06, 0.06), C.WATER_SPEED, C.WATER_DAMAGE, 'water', this.driver);
      b.how = 'water';
      b.body.setAllowGravity(true).setGravityY(C.WATER_DROOP - CFG.GRAVITY); // the jet droops
      b.pushDir = Math.cos(this.aimAngle) >= 0 ? 1 : -1;
      if (Math.random() < 0.3) Sfx.splash();
    }
  }

  // The base machine gun is off: the water cannon (above) is the main weapon.
  get cfg() {
    return this._cfg;
  }

  set cfg(v) {
    this._cfg = Object.assign({}, v, { MG_DELAY: Infinity });
  }

  bomb(c) {
    if (!c.bombP || this.grenades <= 0) return;
    this.grenades--;
    const G = CFG.GRENADE;
    this.scene.throwGrenade(this.x - this.facing * 14, this.y - 34, this.facing * G.vx + this.body.velocity.x * 0.5, G.vy, this.driver);
    Sfx.throw();
  }
}
