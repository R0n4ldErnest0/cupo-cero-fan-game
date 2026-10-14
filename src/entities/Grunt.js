// Gang foot soldier ("cupero"). Variants: 'gunner' shoots, 'thrower' also lobs molotovs.
const GRUNT_LINES = [
  '¡Paga el cupo, chofer!', '¡Tu cuota, causa!', '¡Paga o ya sabes!',
  '¡Aquí mandamos nosotros!', '¡Ni la policía te salva!', '¡Cupo o plomo!',
];
const GRUNT_BURNT = ['¡Me dejaron como anticucho!', '¡Ayayay, mi polo nuevo!', '¡Bien cocido no, causa!'];
const GRUNT_DEATH = [
  '¡Mamita!', '¡Llama a mi tío el comisario!', '¡Yo solo era el cobrador!', '¡No vale, no vale!', '¡Ayayay!',
];

class Grunt extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, opts = {}) {
    const skin = opts.skin || 'thug';
    super(scene, x, y, `${skin}_fwd_stand`);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.skin = skin;
    this.variant = opts.variant || 'gunner';
    this.setOrigin(0.5, 1).setDepth(6);
    this.body.setSize(8, 20).setOffset(4, 4);
    this.hp = opts.hp || 1;
    this.alive = true;
    this.facing = -1;
    this.score = 100;
    this.contactKills = false;
    this.bubbleOffset = 28;
    const now = scene.time.now;
    this.nextAction = now + Phaser.Math.Between(700, 1500);
    this.nextTalk = now + Phaser.Math.Between(800, 5000);
    this.crouchUntil = 0;
    this.fleeUntil = 0;
    this.walkT = 0;
  }

  update(time, dt) {
    if (!this.alive) return;
    const s = this.scene, t = s.target(this.x, this.y);
    const dx = t.x - this.x, dist = Math.abs(dx);
    const onScreen = s.inView(this.x, this.y - 10, -4);
    const fleeing = time < this.fleeUntil;
    let vx = 0;

    if (fleeing) {
      this.facing = dx < 0 ? 1 : -1;
      vx = this.facing * 75;
    } else {
      this.facing = dx < 0 ? -1 : 1;
      if (time < this.crouchUntil) vx = 0;
      else if (dist > 150) vx = this.facing * CFG.ENEMY.GRUNT_SPEED;
      else if (dist < 55) vx = -this.facing * 30;
      // Comic panic when the driver gets too close
      if (dist < 70 && Math.random() < 0.004) {
        this.fleeUntil = time + 1100;
        Fx.say(s, this, '¡Mamita, el chofer está loco!', 1100);
      }
    }
    // Stay on this floor: don't walk off ledges (crates and the street edge excepted).
    if (vx && this.body.blocked.down && !s.terrain.hasFloor(this.x + Math.sign(vx) * 6, this.y)) vx = 0;
    this.setVelocityX(vx);

    if (onScreen && !fleeing && time > this.nextAction) this.act(time, t);
    if (onScreen && time > this.nextTalk) {
      Fx.say(s, this, Phaser.Utils.Array.GetRandom(GRUNT_LINES), 1500);
      this.nextTalk = time + Phaser.Math.Between(5000, 9000);
    }

    let key;
    if (time < this.crouchUntil) key = `${this.skin}_crouch`;
    else if (!this.body.blocked.down && !this.body.touching.down) key = `${this.skin}_fwd_jump`;
    else if (vx !== 0) {
      this.walkT += dt;
      key = `${this.skin}_fwd_${RUN_CYCLE[Math.floor(this.walkT / 110) % 4]}`;
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
    const crouch = Math.random() < 0.3;
    if (crouch) this.crouchUntil = time + 700;
    // Straight ahead on the same floor; on another floor, aim (up to 45°) at the target.
    const sx = this.x + this.facing * 9, sy = this.y - (crouch ? 6 : 13);
    let angle = this.facing > 0 ? 0 : Math.PI;
    if (Math.abs(t.y - this.y) > 24) {
      const a = Math.atan2(t.y - 12 - sy, (t.x - sx) * this.facing);
      angle = this.facing > 0 ? Phaser.Math.Clamp(a, -0.8, 0.8) : Math.PI - Phaser.Math.Clamp(a, -0.8, 0.8);
    }
    s.enemyShoot(sx, sy, angle);
    Sfx.enemyShot();
    this.nextAction = time + Phaser.Math.Between(1400, 2600);
  }

  hit(dmg, explosive, owner, how) {
    if (!this.alive) return;
    this.hp -= dmg;
    Fx.flash(this);
    if (this.hp <= 0) this.die(explosive, owner, how);
  }

  die(explosive, owner, how) {
    this.alive = false;
    const s = this.scene;
    s.addScore(this.score, this.x, this.y - 26, owner);
    Sfx.scream();
    if (how === 'fire') return this.burn();
    if (Math.random() < 0.4) Fx.say(s, this, Phaser.Utils.Array.GetRandom(GRUNT_DEATH), 1200);
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
