// Mission 1 boss: El Cobrador de Cupos in his armored mototaxi (Boss framework, see Boss.js).
// Attacks: bullet spread, money-bag bombs, charge across the arena. Rage phase from RAGE_AT hp: faster, more bullets.
const BOSS1_LINES = ['¡Tu cupo, chofer!', '¡Aquí se paga o se llora!', '¡La comisaría es mía!', '¡Ni el alcalde me toca!'];

class BossCobrador extends Boss {
  constructor(scene, x, y) {
    const B = CFG.BOSS1;
    super(scene, x, y, 'boss_moto', {
      name: 'EL COBRADOR DE CUPOS',
      hp: B.HP,
      score: 5000,
      intro: '¿Así que tú eres el chofer que no quiere pagar?',
      introMs: 2400,
      phases: [
        { below: 1, attacks: ['spread', 'bombs', 'charge'], pause: [900, 1000] },
        { below: B.RAGE_AT / B.HP, attacks: ['spread', 'bombs', 'charge'], pause: [600, 900], speed: 1.3, line: '¡Ahora sí me molesté!' },
      ],
    });
    this.body.setSize(74, 34).setOffset(8, 12);
    this.rider = scene.add.image(x, y, 'cobrador_fwd_stand').setOrigin(0.5, 1).setDepth(10).setCrop(0, 0, 16, 17);
    this.wheels = [0, 1].map(() => scene.add.image(x, y, 'wheel').setScale(1.25).setDepth(10));
    this.leftX = scene.arenaX + 70;
    this.rightX = scene.arenaX + CFG.VIEW_W - 70;
  }

  get rage() {
    return this.phaseIndex > 0;
  }

  enter() {
    this.setVelocityX(-110);
    if (this.x > this.rightX) return false;
    this.x = this.rightX;
    this.setVelocityX(0);
    return true;
  }

  idle() {
    this.setVelocityX(0);
  }

  attack_spread(time) {
    if (Math.random() < 0.6) Fx.say(this.scene, this, Phaser.Utils.Array.GetRandom(BOSS1_LINES), 1300);
    return this.repeat(time, this.rage ? 4 : 3, 280, () => this.fireSpread(this.scene.target(this.x)));
  }

  attack_bombs(time) {
    Fx.say(this.scene, this, '¡Ahí va tu vuelto!', 1200);
    return this.repeat(time, 3, 350, (i) => this.throwBag(this.scene.target(this.x), i));
  }

  // Rev up in place, then charge to the other side of the arena.
  attack_charge(time) {
    const s = this.scene, baseX = this.x, revUntil = time + CFG.BOSS1.CHARGE_REV;
    Sfx.rev();
    Fx.say(s, this, '¡Ahí te voy!', 900);
    this.hitCombi = false;
    return {
      step: (t) => {
        if (t < revUntil) {
          this.x = baseX + Math.sin(t * 0.09) * 1.5;
          this.setTint(Math.floor(t / 110) % 2 ? 0xffffff : 0xffb0b0); // flashing: he's about to charge
          if (Math.random() < 0.3) Fx.puff(s, this.x - this.facing * 46, this.y - 10, 1, 0x777777);
          return false;
        }
        if (!this.charging) {
          this.setTint(this.baseTint || 0xffffff);
          this.body.setSize(50, 22).setOffset(20, 24); // only the low front hurts while charging: you can jump over it
        }
        this.charging = true;
        this.setVelocityX(this.facing * CFG.BOSS1.CHARGE_SPEED * this.sp);
        const done = (this.facing < 0 && this.x <= this.leftX) || (this.facing > 0 && this.x >= this.rightX);
        if (!done) return false;
        this.x = this.facing < 0 ? this.leftX : this.rightX;
        this.setVelocityX(0);
        this.facing *= -1;
        this.charging = false;
        this.body.setSize(74, 34).setOffset(8, 12);
        return true;
      },
    };
  }

  gunPos() {
    return { x: this.rider.x + this.facing * 9, y: this.rider.y - 13 };
  }

  fireSpread(t) {
    const g = this.gunPos(), B = CFG.BOSS1;
    const base = Phaser.Math.Angle.Between(g.x, g.y, t.x, t.y - 12);
    const n = this.rage ? 5 : 3;
    for (let i = 0; i < n; i++) this.scene.enemyShoot(g.x, g.y, base + (i - (n - 1) / 2) * 0.18, this.rage ? B.RAGE_BULLET_SPEED : B.BULLET_SPEED);
    Sfx.enemyShot();
  }

  throwBag(t, i) {
    const off = [-50, 0, 50][i % 3];
    this.scene.enemyLob(this.rider.x, this.rider.y - 20, t.x + off, this.y - 4, 'moneybag', 1.0);
    Sfx.throw();
  }

  sync(time, dt) {
    const f = this.facing;
    this.setFlipX(f > 0);
    if (this.rider.active && !this.riderFree) this.rider.setPosition(this.x - f * 17, this.y - 13).setFlipX(f < 0);
    const spin = (this.body.velocity.x * dt) / 1000 / 8;
    this.wheels[0].setPosition(this.x + f * 31, this.y - 8).rotation += spin;
    this.wheels[1].setPosition(this.x - f * 17, this.y - 8).rotation += spin;
  }

  onPhase() {
    this.baseTint = this.rider.baseTint = 0xff9090;
    this.setTint(this.baseTint);
  }

  flashExtras() {
    Fx.flash(this.rider);
  }

  removeExtras() {
    this.wheels.forEach((w) => w.destroy());
  }

  onDeath() {
    this.charging = false;
    this.scene.time.delayedCall(600, () => this.launchRider());
  }

  // The boss escapes on foot — he'll be back with his friends in uniform.
  launchRider() {
    const s = this.scene, r = this.rider;
    this.riderFree = true;
    r.setCrop().clearTint();
    r.bubbleOffset = 28;
    Fx.say(s, r, '¡Esto no se queda así! ¡Tengo contactos en la comisaría!', 3600);
    s.tweens.chain({
      targets: r,
      tweens: [
        { y: r.y - 90, angle: 360, duration: 500, ease: 'Quad.Out' },
        { y: this.y, angle: 720, duration: 450, ease: 'Quad.In' },
        {
          x: s.viewLeft + CFG.VIEW_W + 40, angle: 720, duration: 1600,
          onStart: () => {
            r.setFlipX(false);
            let i = 0;
            r.runTimer = s.time.addEvent({ delay: 90, loop: true, callback: () => r.active && r.setTexture(`cobrador_fwd_${RUN_CYCLE[i++ % 4]}`) });
          },
          onComplete: () => { r.runTimer && r.runTimer.remove(); r.destroy(); },
        },
      ],
    });
  }
}
