// The Mototaxi Slug: light and fast, jumps high, only CFG.MOTOTAXI.HP hits. Fire = machine gun on the canopy,
// aimed like the combi's (8 directions, including down). Grenade button = the passenger throws a grenade;
// ↓ + grenade = ¡BOCINAZO!: the horn stuns and pushes back the enemies in front (charges refill over time).
const MOTO_SPEC = {
  kind: 'mototaxi', name: 'MOTOTAXI SLUG', tex: 'mototaxi', body: [40, 20, 4, 10],
  wheels: [{ dx: 16, dy: -5 }, { dx: -15, dy: -5 }], wheelScale: 0.8, wheelSpin: 5,
  turret: { tex: 'moto_gun', dx: 4, dy: -27, len: 10 }, labelY: 40, hintY: 52,
  wreckLine: '¡Mi mototaxi! ¡Y era alquilado!',
};
const BOCINA_LINES = ['¡Ay, mis oídos!', '¡Qué escándalo!', '¡Bájale, causa!'];

class MototaxiSlug extends CombiSlug {
  constructor(scene, x, y) {
    super(scene, x, y, MOTO_SPEC);
    const M = CFG.MOTOTAXI;
    this.grenades = M.GRENADES;
    this.honks = M.HONKS;
    this.nextHonkRefill = 0;
  }

  hudText() {
    const M = CFG.MOTOTAXI;
    return `MOTOTAXI ${'■'.repeat(Math.max(0, this.hp))}  GRANADAS ${this.grenades}  BOCINA ${'●'.repeat(this.honks)}${'○'.repeat(M.HONKS - this.honks)}`;
  }

  saveState() {
    return { kind: 'mototaxi', hp: this.hp, grenades: this.grenades, honks: this.honks };
  }

  loadState(st) {
    this.hp = st.hp;
    this.grenades = st.grenades;
    this.honks = st.honks;
  }

  bomb(c, time) {
    const s = this.scene, M = CFG.MOTOTAXI;
    if (this.honks < M.HONKS && time > this.nextHonkRefill) {
      this.honks++;
      this.nextHonkRefill = time + M.HONK_REFILL;
    }
    if (!c.bombP) return;
    if (c.down) return this.bocinazo(time);
    if (this.grenades <= 0) return;
    this.grenades--;
    const G = CFG.GRENADE;
    s.throwGrenade(this.x - this.facing * 10, this.y - 26, this.facing * G.vx + this.body.velocity.x * 0.5, G.vy, this.driver);
    Sfx.throw();
  }

  // The horn: stuns and pushes back every enemy in a cone in front.
  bocinazo(time) {
    const s = this.scene, M = CFG.MOTOTAXI, f = this.facing;
    if (this.honks <= 0) return;
    this.honks--;
    this.nextHonkRefill = time + M.HONK_REFILL;
    Sfx.bocina();
    Fx.say(s, this, '¡PIIII PIIII!', 700);
    for (let i = 0; i < 3; i++) {
      const w = s.add.image(this.x + f * 20, this.y - 16, 'honk_wave').setDepth(31).setFlipX(f < 0).setAlpha(0.9);
      s.tweens.add({ targets: w, x: w.x + f * (40 + i * 20), scale: 2 + i, alpha: 0, delay: i * 90, duration: 380, onComplete: () => w.destroy() });
    }
    s.enemies.getChildren().forEach((e) => {
      const dx = (e.x - this.x) * f;
      if (!e.alive || dx < 0 || dx > M.HONK_RANGE || Math.abs(e.y - this.y) > 40) return;
      s.stun(e, f);
    });
  }
}
