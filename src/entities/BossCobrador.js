// Mission 1 boss: El Cobrador de Cupos in his armored mototaxi.
// Patterns: bullet spread, money-bag bombs, charge. Rage phase under RAGE_AT hp.
const BOSS1_LINES = ['¡Tu cupo, chofer!', '¡Aquí se paga o se llora!', '¡La comisaría es mía!', '¡Ni el alcalde me toca!'];

class BossCobrador extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'boss_moto');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setOrigin(0.5, 1).setDepth(9);
    this.body.setAllowGravity(false).setImmovable(true);
    this.body.setSize(74, 34).setOffset(8, 12);
    this.rider = scene.add.image(x, y, 'cobrador_fwd_stand').setOrigin(0.5, 1).setDepth(10).setCrop(0, 0, 16, 17);
    this.wheels = [0, 1].map(() => scene.add.image(x, y, 'wheel').setScale(1.25).setDepth(10));
    this.maxHp = CFG.BOSS1.HP;
    this.hp = this.maxHp;
    this.alive = true;
    this.rage = false;
    this.facing = -1;
    this.state = 'enter';
    this.stateUntil = 0;
    this.lastAttack = null;
    this.queue = 0;
    this.nextShot = 0;
    this.leftX = scene.arenaX + 70;
    this.rightX = scene.arenaX + CFG.VIEW_W - 70;
    this.bubbleOffset = 48;
    scene.registry.set({ bossMax: this.maxHp, bossHp: this.hp, bossName: 'EL COBRADOR DE CUPOS' });
  }

  toState(name, time, ms) {
    this.state = name;
    this.stateUntil = time + ms;
  }

  update(time, dt) {
    const s = this.scene, t = s.target(), sp = this.rage ? 1.3 : 1;
    switch (this.state) {
      case 'enter':
        this.setVelocityX(-110);
        if (this.x <= this.rightX) {
          this.x = this.rightX;
          this.setVelocityX(0);
          this.toState('intro', time, 2400);
          Fx.say(s, this, '¿Así que tú eres el chofer que no quiere pagar?', 2400);
        }
        break;
      case 'intro':
        if (time > this.stateUntil) this.toState('idle', time, 300);
        break;
      case 'idle':
        this.setVelocityX(0);
        if (time > this.stateUntil) this.pickAttack(time);
        break;
      case 'spread':
        if (this.queue > 0 && time > this.nextShot) {
          this.fireSpread(t);
          this.queue--;
          this.nextShot = time + 280 / sp;
        }
        if (this.queue <= 0 && time > this.nextShot) this.toState('idle', time, this.rage ? 600 : 1000);
        break;
      case 'bombs':
        if (this.queue > 0 && time > this.nextShot) {
          this.throwBag(t, this.queue);
          this.queue--;
          this.nextShot = time + 350;
        }
        if (this.queue <= 0 && time > this.nextShot) this.toState('idle', time, 900);
        break;
      case 'rev':
        this.x = this.baseX + Math.sin(time * 0.09) * 1.5;
        if (Math.random() < 0.3) Fx.puff(s, this.x - this.facing * 46, this.y - 10, 1, 0x777777);
        if (time > this.stateUntil) {
          this.x = this.baseX;
          this.state = 'charge';
          this.hitCombi = false;
        }
        break;
      case 'charge': {
        this.setVelocityX(this.facing * CFG.BOSS1.CHARGE_SPEED * sp);
        const done = (this.facing < 0 && this.x <= this.leftX) || (this.facing > 0 && this.x >= this.rightX);
        if (done) {
          this.x = this.facing < 0 ? this.leftX : this.rightX;
          this.setVelocityX(0);
          this.facing *= -1;
          this.toState('idle', time, 700);
        }
        break;
      }
    }
    this.syncParts(dt);
  }

  pickAttack(time) {
    const opts = ['spread', 'bombs', 'charge'].filter((a) => a !== this.lastAttack);
    const a = Phaser.Utils.Array.GetRandom(opts);
    this.lastAttack = a;
    if (a === 'spread') {
      this.state = 'spread';
      this.queue = this.rage ? 4 : 3;
      this.nextShot = time + 200;
      if (Math.random() < 0.6) Fx.say(this.scene, this, Phaser.Utils.Array.GetRandom(BOSS1_LINES), 1300);
    } else if (a === 'bombs') {
      this.state = 'bombs';
      this.queue = 3;
      this.nextShot = time + 200;
      Fx.say(this.scene, this, '¡Ahí va tu vuelto!', 1200);
    } else {
      this.baseX = this.x;
      this.toState('rev', time, 750);
      Sfx.rev();
    }
  }

  gunPos() {
    return { x: this.rider.x + this.facing * 9, y: this.rider.y - 13 };
  }

  fireSpread(t) {
    const g = this.gunPos();
    const base = Phaser.Math.Angle.Between(g.x, g.y, t.x, t.y - 12);
    const n = this.rage ? 5 : 3;
    for (let i = 0; i < n; i++) this.scene.enemyShoot(g.x, g.y, base + (i - (n - 1) / 2) * 0.18, this.rage ? 185 : 155);
    Sfx.enemyShot();
  }

  throwBag(t, i) {
    const off = [-50, 0, 50][i % 3];
    this.scene.enemyLob(this.rider.x, this.rider.y - 20, t.x + off, CFG.GROUND_Y - 4, 'moneybag', 1.0);
    Sfx.throw();
  }

  syncParts(dt) {
    const f = this.facing;
    this.setFlipX(f > 0);
    this.rider.setPosition(this.x - f * 17, this.y - 13).setFlipX(f < 0);
    const spin = (this.body.velocity.x * dt) / 1000 / 8;
    this.wheels[0].setPosition(this.x + f * 31, this.y - 8).rotation += spin;
    this.wheels[1].setPosition(this.x - f * 17, this.y - 8).rotation += spin;
  }

  hit(dmg) {
    if (!this.alive || this.state === 'enter') return;
    const s = this.scene;
    this.hp = Math.max(0, this.hp - dmg);
    s.registry.set('bossHp', this.hp);
    Fx.flash(this);
    Fx.flash(this.rider);
    if (!this.rage && this.hp <= CFG.BOSS1.RAGE_AT) {
      this.rage = true;
      this.baseTint = this.rider.baseTint = 0xff9090;
      this.setTint(this.baseTint);
      Fx.say(s, this, '¡Ahora sí me molesté!', 1500);
      s.cameras.main.shake(200, 0.006);
    }
    if (this.hp <= 0) this.die();
  }

  die() {
    const s = this.scene;
    this.alive = false;
    this.state = 'dying';
    this.setVelocityX(0);
    s.addScore(5000, this.x, this.y - 50);
    for (let i = 0; i < 12; i++) {
      s.time.delayedCall(i * 170, () =>
        s.explodeAt(this.x + Phaser.Math.Between(-40, 40), this.y - Phaser.Math.Between(5, 40), 0, 0, true, Phaser.Math.FloatBetween(0.6, 1.2)),
      );
    }
    s.time.delayedCall(600, () => this.launchRider());
    s.time.delayedCall(2300, () => {
      s.explodeAt(this.x, this.y - 20, 0, 0, true, 2.2);
      this.wheels.forEach((w) => w.destroy());
      this.setVisible(false);
      this.body.enable = false;
      s.onBossDefeated();
    });
  }

  // The boss escapes on foot — he'll be back with his friends in uniform.
  launchRider() {
    const s = this.scene, r = this.rider;
    r.setCrop().clearTint();
    r.bubbleOffset = 28;
    Fx.say(s, r, '¡Esto no se queda así! ¡Tengo contactos en la comisaría!', 3600);
    s.tweens.chain({
      targets: r,
      tweens: [
        { y: r.y - 90, angle: 360, duration: 500, ease: 'Quad.Out' },
        { y: CFG.GROUND_Y, angle: 720, duration: 450, ease: 'Quad.In' },
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
