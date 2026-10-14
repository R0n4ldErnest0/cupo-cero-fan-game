// Mission 2 mid-boss: the Camión Recaudador, the armored truck that collects the day's cupos (Boss framework).
// Attacks: coins spat out in arcs, money bags, and ramming across the warehouse. The turret on its roof is a
// breakable part (3-shot bursts). Angry phase under 50%: faster, more coins.
class BossTruck extends Boss {
  constructor(scene, x, y) {
    const T = CFG.TRUCK;
    super(scene, x, y, 'truck', {
      name: 'CAMIÓN RECAUDADOR',
      hp: T.HP,
      score: 6000,
      intro: '¡Llegó la recaudación del día! ¡Y tú no pagaste!',
      introMs: 2200,
      phases: [
        { below: 1, attacks: ['coins', 'bags', 'ram', 'turret'], pause: [900, 1200] },
        { below: 0.5, attacks: ['coins', 'bags', 'ram', 'turret'], pause: [600, 900], speed: 1.3, line: '¡Pisa el acelerador, que el contador nos mata!' },
      ],
    });
    this.body.setSize(100, 40).setOffset(6, 12);
    this.wheels = [0, 1, 2].map(() => scene.add.image(x, y, 'wheel').setScale(1.4).setDepth(10));
    this.turret = this.addPart('truck_turret', { dx: 30, dy: -56, hp: T.TURRET_HP, attacks: ['turret'], bonus: 8, line: '¡Me tumbaron la torreta!' });
    this.leftX = scene.arenaX + 70;
    this.rightX = scene.arenaX + CFG.VIEW_W - 70;
  }

  get angry() {
    return this.phaseIndex > 0;
  }

  enter() {
    this.setVelocityX(-120);
    Fx.puff(this.scene, this.x + 50, this.y - 8, 0.8, 0x777777);
    if (this.x > this.rightX) return false;
    this.x = this.rightX;
    this.setVelocityX(0);
    return true;
  }

  idle() {
    this.setVelocityX(0);
  }

  // Coins spat out of the slot, landing at different distances.
  attack_coins(time) {
    const s = this.scene, n = this.angry ? 8 : 5;
    Fx.say(s, this, '¡Ahí va tu vuelto, en sencillo!', 1200);
    return this.repeat(time, n, 120, (i) => {
      const t = s.target(this.x, this.y);
      s.enemyLob(this.x + this.facing * 40, this.y - 30, t.x + Phaser.Math.Between(-70, 70), this.y - 4, 'coin', 0.7 + (i % 3) * 0.15);
      Sfx.coin();
    });
  }

  attack_bags(time) {
    const s = this.scene;
    return this.repeat(time, 3, 380, (i) => {
      const t = s.target(this.x, this.y);
      s.enemyLob(this.x, this.y - 50, t.x + (i - 1) * 50, this.y - 4, 'moneybag', 1.0);
      Sfx.throw();
    });
  }

  // Honk, rev, then drive across the warehouse (deadly to touch; dents the combi).
  attack_ram(time) {
    const s = this.scene, revUntil = time + 800, baseX = this.x;
    Sfx.horn();
    Fx.say(s, this, '¡PIIIII! ¡Abran paso!', 800);
    this.hitCombi = false;
    return {
      step: (t) => {
        if (t < revUntil) {
          this.x = baseX + Math.sin(t * 0.08) * 1.5;
          if (Math.random() < 0.3) Fx.puff(s, this.x - this.facing * 55, this.y - 8, 1, 0x666666);
          return false;
        }
        this.charging = true;
        this.setVelocityX(this.facing * CFG.TRUCK.RAM_SPEED * this.sp);
        const done = (this.facing < 0 && this.x <= this.leftX) || (this.facing > 0 && this.x >= this.rightX);
        if (!done) return false;
        this.x = this.facing < 0 ? this.leftX : this.rightX;
        this.setVelocityX(0);
        this.facing *= -1;
        this.charging = false;
        return true;
      },
    };
  }

  // Roof turret: bursts of three aimed shots.
  attack_turret(time) {
    const s = this.scene;
    return this.repeat(time, this.angry ? 3 : 2, 600, () => {
      [0, 110, 220].forEach((d) => s.time.delayedCall(d, () => {
        if (!this.turret.alive || !this.alive) return;
        const t = s.target(this.turret.x, this.turret.y);
        s.enemyShoot(this.turret.x, this.turret.y, Phaser.Math.Angle.Between(this.turret.x, this.turret.y, t.x, t.y - 12), CFG.TRUCK.BULLET_SPEED);
        Sfx.enemyShot();
      }));
    }, 300, 300);
  }

  sync(time, dt) {
    const f = this.facing;
    this.setFlipX(f > 0);
    const spin = (this.body.velocity.x * dt) / 1000 / 9;
    [-38, 10, 36].forEach((dx, i) => this.wheels[i].setPosition(this.x - dx * f, this.y - 9).rotation += spin);
    this.parts.forEach((p) => p.follow());
  }

  removeExtras() {
    this.wheels.forEach((w) => w.destroy());
    this.parts.forEach((p) => p.destroy());
  }

  onDeath() {
    this.charging = false;
    const s = this.scene;
    s.time.delayedCall(500, () => Fx.say(s, this, '¡La recaudación! ¡El contador me va a matar!', 2000));
    // The day's cupos fly everywhere.
    for (let i = 0; i < 6; i++) {
      s.time.delayedCall(300 + i * 150, () => s.addScore(500, this.x + Phaser.Math.Between(-40, 40), this.y - 40));
    }
  }
}
