// Gang foot soldier ("cupero").
const GRUNT_LINES = [
  '¡Paga el cupo, chofer!', '¡Tu cuota, causa!', '¡Paga o ya sabes!',
  '¡Aquí mandamos nosotros!', '¡Ni la policía te salva!', '¡Cupo o plomo!',
];
const GRUNT_BURNT = ['¡Me dejaron como anticucho!', '¡Ayayay, mi polo nuevo!', '¡Bien cocido no, causa!'];
const GRUNT_DEATH = [
  '¡Mamita!', '¡Llama a mi tío el comisario!', '¡Yo solo era el cobrador!', '¡No vale, no vale!', '¡Ayayay!',
];

const KNIFER_LINES = ['¡Ven acá, chofercito!', '¡Te voy a cobrar en persona!', '¡Cupo o chaveta!'];
// Corrupt cops (the 'cop' preset: patrullero).
const COP_LINES = ['¡Colabora pe, chofer!', '¿Cuánto para el cafecito?', '¡Circulen, aquí no pasa nada!', '¡Documentos!', '¡Esto no es cupo, es papeleta!'];
const COP_DEATH = ['¡Llama a mi comisario!', '¡Yo solo cumplía órdenes!', '¡Mi pensión!', '¡Esto va a tu récord!'];

// Variants: 'gunner' stops, aims and shoots; 'thrower' also lobs molotovs; 'knife' runs at you to stab.
// Every grunt pulls a knife when a player gets right next to it (with a short warning, like the arcade).
class Grunt extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, opts = {}) {
    const variant = opts.variant || 'gunner';
    const skin = opts.skin || (variant === 'knife' ? 'thug3' : 'thug');
    super(scene, x, y, `${skin}_fwd_stand`);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.skin = skin;
    this.variant = variant;
    this.setOrigin(0.5, 1).setDepth(6);
    this.body.setSize(8, 20).setOffset(4, 4);
    this.hp = opts.hp || 1;
    this.burst = opts.burst || 1; // shots per attack
    this.cop = !!opts.cop;
    this.alive = true;
    this.facing = -1;
    this.score = this.cop ? 150 : 100;
    this.contactKills = false;
    this.bubbleOffset = 28;
    const now = scene.time.now, E = CFG.ENEMY;
    this.nextAction = now + Phaser.Math.Between(...E.FIRST_SHOT);
    this.nextTalk = now + Phaser.Math.Between(800, 5000);
    this.crouchUntil = 0;
    this.fleeUntil = 0;
    this.aimUntil = 0;
    this.stab = null;
    this.knifeReadyAt = 0;
    this.walkT = 0;
  }

  update(time, dt) {
    if (!this.alive) return;
    const s = this.scene, E = CFG.ENEMY, t = s.target(this.x, this.y);
    const dx = t.x - this.x, dist = Math.abs(dx);
    const onScreen = s.inView(this.x, this.y - 10, -4);

    if (this.stab) return this.updateStab(time);
    if (this.aimUntil) {
      this.setVelocityX(0);
      if (time >= this.aimUntil) this.fire(time);
      return this.pose(time, dt, 0);
    }
    const victim = this.knifeVictim();
    if (victim && time > this.knifeReadyAt) return this.startStab(time, victim);

    const fleeing = time < this.fleeUntil;
    let vx = 0;
    if (fleeing) {
      this.facing = dx < 0 ? 1 : -1;
      vx = this.facing * 75;
    } else {
      this.facing = dx < 0 ? -1 : 1;
      if (this.variant === 'knife') vx = dist > 12 ? this.facing * E.KNIFER_SPEED : 0;
      else if (time < this.crouchUntil) vx = 0;
      else if (dist > 150) vx = this.facing * E.GRUNT_SPEED;
      else if (dist < 55 && this.variant === 'thrower') vx = -this.facing * 30;
      // Comic panic when the driver gets too close
      if (this.variant !== 'knife' && dist < 70 && Math.random() < 0.004) {
        this.fleeUntil = time + 1100;
        Fx.say(s, this, '¡Mamita, el chofer está loco!', 1100);
      }
    }
    // Never wait off-screen (a locked arena would wait for us forever): walk in until well inside the view.
    const left = s.viewLeft + 20, right = s.viewLeft + CFG.VIEW_W - 20;
    if (!fleeing && (this.x < left || this.x > right)) {
      this.facing = this.x < left ? 1 : -1;
      vx = this.facing * E.GRUNT_SPEED * 1.5;
    }
    // Stay on this floor: don't walk off ledges (crates and the street edge excepted).
    if (vx && this.body.blocked.down && !s.hasFloor(this.x + Math.sign(vx) * 6, this.y)) vx = 0;
    this.setVelocityX(vx);

    if (onScreen && !fleeing && this.variant !== 'knife' && time > this.nextAction) this.act(time, t);
    if (onScreen && time > this.nextTalk) {
      Fx.say(s, this, Phaser.Utils.Array.GetRandom(this.cop ? COP_LINES : this.variant === 'knife' ? KNIFER_LINES : GRUNT_LINES), 1500);
      this.nextTalk = time + Phaser.Math.Between(5000, 9000);
    }
    this.pose(time, dt, vx);
  }

  pose(time, dt, vx) {
    let key;
    if (time < this.crouchUntil) key = `${this.skin}_crouch`;
    else if (!this.body.blocked.down && !this.body.touching.down) key = `${this.skin}_fwd_jump`;
    else if (vx !== 0) {
      this.walkT += dt;
      key = `${this.skin}_fwd_${RUN_CYCLE[Math.floor(this.walkT / (this.variant === 'knife' ? 80 : 110)) % 4]}`;
    } else key = `${this.skin}_fwd_stand`;
    this.setTexture(key);
    this.setFlipX(this.facing < 0);
  }

  act(time, t) {
    const s = this.scene;
    if (this.variant === 'thrower' && Math.random() < 0.6) {
      s.enemyLob(this.x, this.y - 20, t.x, t.y - 4, 'molotov', 0.9);
      Sfx.throw();
      this.nextAction = time + Phaser.Math.Between(1800, 2800);
      return;
    }
    // Stop and aim first (the arcade's telegraph), then fire.
    this.aimCrouch = Math.random() < 0.3;
    this.aimUntil = time + CFG.ENEMY.AIM_MS;
    if (this.aimCrouch) this.crouchUntil = this.aimUntil + 300;
    Fx.spark(s, this.x + this.facing * 9, this.y - (this.aimCrouch ? 6 : 13));
  }

  fire(time) {
    const s = this.scene, t = s.target(this.x, this.y);
    this.aimUntil = 0;
    this.facing = t.x < this.x ? -1 : 1;
    // Straight ahead on the same floor; on another floor, aim (up to 45°) at the target.
    const sx = this.x + this.facing * 9, sy = this.y - (this.aimCrouch ? 6 : 13);
    let angle = this.facing > 0 ? 0 : Math.PI;
    if (Math.abs(t.y - this.y) > 24) {
      const a = Math.atan2(t.y - 12 - sy, (t.x - sx) * this.facing);
      angle = this.facing > 0 ? Phaser.Math.Clamp(a, -0.8, 0.8) : Math.PI - Phaser.Math.Clamp(a, -0.8, 0.8);
    }
    s.enemyShoot(sx, sy, angle);
    for (let i = 1; i < this.burst; i++) {
      s.time.delayedCall(i * 160, () => {
        if (!this.alive) return;
        s.enemyShoot(this.x + this.facing * 9, sy, angle);
        Sfx.enemyShot();
      });
    }
    Sfx.enemyShot();
    this.nextAction = time + Phaser.Math.Between(...CFG.ENEMY.SHOT_GAP);
  }

  // ---------- knife ----------

  // A player on foot right next to us, at the same height.
  knifeVictim() {
    const E = CFG.ENEMY;
    return this.scene.players.find((p) => p.state === 'play' && p.alive && !p.vehicle &&
      Math.abs(p.x - this.x) <= E.KNIFE_RANGE && Math.abs(p.y - this.y) < 16) || null;
  }

  // Wind-up (knife raised, "!") -> strike -> recover. The wind-up is the player's chance to jump or hit first.
  startStab(time, victim) {
    const s = this.scene;
    this.facing = victim.x < this.x ? -1 : 1;
    this.setVelocityX(0);
    this.setTexture(`${this.skin}_fwd_stand`).setFlipX(this.facing < 0);
    this.stab = { phase: 'windup', at: time + CFG.ENEMY.KNIFE_WINDUP };
    this.knife = s.add.image(this.x - this.facing * 2, this.y - 22, 'knife').setDepth(7).setFlipX(this.facing < 0).setRotation(-1.2 * this.facing);
    Fx.say(s, this, '¡!', CFG.ENEMY.KNIFE_WINDUP);
    Sfx.knifeDraw();
  }

  updateStab(time) {
    const s = this.scene, st = this.stab, E = CFG.ENEMY, f = this.facing;
    this.setVelocityX(0);
    if (st.phase === 'windup') {
      this.knife.setPosition(this.x - f * 2, this.y - 22);
      if (time < st.at) return;
      st.phase = 'strike';
      st.at = time + 250;
      this.knife.setPosition(this.x + f * 11, this.y - 13).setRotation(0);
      Sfx.slash();
      s.players.forEach((p) => {
        const dx = (p.x - this.x) * f;
        if (dx > -6 && dx <= E.KNIFE_REACH && Math.abs(p.y - this.y) < 16 && p.canBeHit()) p.die();
      });
    } else if (time >= st.at) {
      this.dropKnife();
      this.knifeReadyAt = time + E.KNIFE_COOLDOWN;
    }
  }

  dropKnife() {
    if (this.knife) this.knife.destroy();
    this.knife = null;
    this.stab = null;
  }

  destroy(fromScene) {
    if (this.knife) this.knife.destroy();
    super.destroy(fromScene);
  }

  hit(dmg, explosive, owner, how) {
    if (!this.alive) return;
    this.hp -= dmg;
    Fx.flash(this);
    if (this.hp <= 0) this.die(explosive, owner, how);
  }

  die(explosive, owner, how) {
    this.alive = false;
    this.dropKnife();
    const s = this.scene;
    s.addScore(this.score, this.x, this.y - 26, owner);
    Sfx.scream();
    if (how === 'fire') return this.burn();
    if (Math.random() < 0.4) Fx.say(s, this, Phaser.Utils.Array.GetRandom(this.cop ? COP_DEATH : GRUNT_DEATH), 1200);
    this.setTexture(`${this.skin}_fwd_jump`);
    this.setVelocity(-this.facing * (explosive ? 110 : 40), explosive ? -260 : -120);
    s.tweens.add({ targets: this, angle: -this.facing * (explosive ? 720 : 90), duration: explosive ? 700 : 300 });
    s.time.delayedCall(1000, () => {
      if (this.active) s.tweens.add({ targets: this, alpha: 0, duration: 400, onComplete: () => this.destroy() });
    });
  }

  // Anticuchera / molotov: charred black, smoking, keels over.
  burn() {
    const s = this.scene;
    this.baseTint = 0x2b2522;
    this.setTint(this.baseTint).setTexture(`${this.skin}_fwd_stand`).setVelocity(0, -40);
    if (Math.random() < 0.5) Fx.say(s, this, Phaser.Utils.Array.GetRandom(GRUNT_BURNT), 1200);
    for (let i = 0; i < 5; i++) s.time.delayedCall(i * 160, () => this.active && Fx.puff(s, this.x, this.y - 22, 0.8, 0x555555));
    s.tweens.add({ targets: this, angle: -this.facing * 90, delay: 500, duration: 250 });
    s.time.delayedCall(1300, () => {
      if (this.active) s.tweens.add({ targets: this, alpha: 0, duration: 400, onComplete: () => this.destroy() });
    });
  }
}
