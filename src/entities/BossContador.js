// Mission 2 boss: "El Contador", the gang's accountant, in a walking mech built from a safe and two bill-counting
// machines (Boss framework). Attacks: a fan of bills from the front counter, a jumping safe-stomp, a storm of
// boletas (receipts) from the back counter, and (angry, under 50%) the safe opens and rains coins.
// The two counting machines are breakable parts. When he falls, the ledger ("el libro de cupos") flies out.
class BossContador extends Boss {
  constructor(scene, x, y) {
    const C = CFG.CONTADOR;
    super(scene, x, y, 'contador_mech', {
      name: 'EL CONTADOR',
      hp: C.HP,
      score: 10000,
      intro: '¿Sabes cuánto me cuestas, chofer? Ya lo anoté.',
      introMs: 2400,
      deathMs: 2600,
      phases: [
        { below: 1, attacks: ['bills', 'stomp', 'boletas'], pause: [900, 1300] },
        { below: 0.5, attacks: ['bills', 'stomp', 'boletas', 'coins'], pause: [600, 950], speed: 1.25, line: '¡Esto no cuadra! ¡Abran la caja fuerte!' },
      ],
    });
    this.body.setSize(60, 58).setOffset(10, 14);
    this.floor = y;
    this.front = this.addPart('counter', { dx: -38, dy: -44, hp: C.ARM_HP, attacks: ['bills'], bonus: 10, line: '¡Mi contadora de billetes!' });
    this.back = this.addPart('counter', { dx: 36, dy: -50, hp: C.ARM_HP, attacks: ['boletas'], bonus: 10, line: '¡Las boletas no, que son para la SUNAT!' });
    this.leftX = scene.arenaX + 60;
    this.rightX = scene.arenaX + CFG.VIEW_W - 60;
    this.walkT = 0;
  }

  get angry() {
    return this.phaseIndex > 0;
  }

  enter() {
    this.x -= 1;
    this.stepBob();
    if (this.x > this.rightX) return false;
    this.x = this.rightX;
    return true;
  }

  // Lumbers toward the player between attacks.
  idle(time, dt) {
    const t = this.scene.target(this.x, this.y);
    if (Math.abs(t.x - this.x) > 70) {
      this.x = Phaser.Math.Clamp(this.x + Math.sign(t.x - this.x) * CFG.CONTADOR.WALK * this.sp * (dt / 1000), this.leftX, this.rightX);
      this.stepBob();
    }
  }

  stepBob() {
    this.walkT++;
    this.y = this.floor - (Math.floor(this.walkT / 8) % 2) * 2;
  }

  // A fan of bills from the front money counter.
  attack_bills(time) {
    const s = this.scene;
    if (Math.random() < 0.5) Fx.say(s, this, '¡Te pago... en balas!', 1200);
    return this.repeat(time, this.angry ? 4 : 3, 360, () => {
      if (!this.front.alive) return;
      const t = s.target(this.front.x, this.front.y);
      const base = Phaser.Math.Angle.Between(this.front.x, this.front.y, t.x, t.y - 12);
      for (let i = -2; i <= 2; i++) s.enemyShoot(this.front.x, this.front.y, base + i * 0.14, CFG.CONTADOR.BILL_SPEED, 'bill');
      Sfx.coin();
    });
  }

  // Jumps and comes down on the player: a shockwave along the floor (jump to dodge it).
  attack_stomp(time) {
    const s = this.scene, C = CFG.CONTADOR;
    const t = s.target(this.x, this.y);
    const tx = Phaser.Math.Clamp(t.x, this.leftX, this.rightX);
    let landed = false;
    Fx.say(s, this, '¡Caja fuerte va!', 900);
    s.tweens.chain({
      targets: this,
      tweens: [
        { y: this.floor - C.STOMP_HEIGHT, x: (this.x + tx) / 2, duration: 450 / this.sp, ease: 'Quad.Out' },
        { y: this.floor, x: tx, duration: 350 / this.sp, ease: 'Quad.In' },
      ],
      onComplete: () => {
        landed = true;
        s.cameras.main.shake(250, 0.01);
        Sfx.explode(true);
        // The shockwave runs along the floor on both sides: anyone standing on the floor nearby is hit.
        for (let i = 1; i <= 3; i++) {
          s.time.delayedCall(i * 90, () => {
            [-1, 1].forEach((d) => {
              const x = this.x + d * (20 + i * 28);
              Fx.puff(s, x, this.floor - 4, 1.2, 0xb0a090);
              s.players.forEach((p) => p.canBeHit() && Math.abs(p.x - x) < 16 && p.y > this.floor - 6 && p.die());
            });
          });
        }
      },
    });
    let until = 0;
    return { step: (tm) => { if (landed && !until) until = tm + 400; return landed && tm > until; } };
  }

  // A storm of boletas falling from the ceiling.
  attack_boletas(time) {
    const s = this.scene;
    if (!this.back.alive) return this.repeat(time, 0, 0, () => {});
    Fx.say(s, this, '¡Boleta, boleta, boleta!', 1100);
    return this.repeat(time, this.angry ? 12 : 8, 140, () => {
      const x = Phaser.Math.Between(s.viewLeft + 20, s.viewLeft + CFG.VIEW_W - 20);
      s.enemyShoot(x, s.viewTop + 34, Math.PI / 2 + Phaser.Math.FloatBetween(-0.2, 0.2), CFG.CONTADOR.BOLETA_SPEED, 'boleta');
    }, 200, 600);
  }

  // Angry: the safe opens and coins rain in arcs.
  attack_coins(time) {
    const s = this.scene;
    Fx.say(s, this, '¡Todo el cupo del mes! ¡Toma!', 1300);
    return this.repeat(time, 10, 110, () => {
      const t = s.target(this.x, this.y);
      s.enemyLob(this.x, this.y - 50, t.x + Phaser.Math.Between(-90, 90), this.floor - 4, 'coin', Phaser.Math.FloatBetween(0.6, 1.0));
      Sfx.coin();
    });
  }

  sync() {
    if (this.alive && this.state !== 'enter') this.facing = this.scene.target(this.x, this.y).x < this.x ? -1 : 1;
    this.setFlipX(this.facing > 0);
    this.parts.forEach((p) => p.follow());
  }

  removeExtras() {
    this.parts.forEach((p) => p.destroy());
  }

  // The accountant pops out of the cockpit and the ledger flies out of the safe.
  onDeath() {
    const s = this.scene;
    s.tweens.killTweensOf(this);
    s.tweens.add({ targets: this, y: this.floor, duration: 200 });
    s.time.delayedCall(600, () => Fx.say(s, this, '¡El libro no! ¡Ahí está todo... todos!', 2200));
    const book = s.add.image(this.x, this.y - 50, 'ledger_book').setDepth(30);
    s.tweens.chain({
      targets: book,
      tweens: [
        { y: this.y - 120, angle: 540, duration: 700, ease: 'Quad.Out' },
        { y: this.floor - 6, angle: 720, duration: 600, ease: 'Bounce.Out' },
      ],
    });
  }
}
