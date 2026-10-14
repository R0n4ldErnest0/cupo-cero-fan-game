// Antimotines: advances slowly behind a riot shield that stops anything coming from the front (bullets, flames,
// the laser, melee). Grenades and other explosions go around it, and so do shots from behind or from well above.
// The shield breaks after CFG.RIOT.SHIELD hits (heavy weapons count double). Now and then he lowers it to shoot,
// and up close he swings his baton (with a wind-up, like the knife).
// { gang: true }: the cupero version, behind a metal shutter ("calamina") with a pipe.
const RIOT_LINES = ['¡Retrocedan!', '¡Dispersen!', '¡Esto es una manifestación ilegal!', '¡Nadie pasa sin colaborar!'];
const SHIELD_THUG_LINES = ['¡Detrás de la calamina no me haces nada!', '¡Paga y te dejo pasar!', '¡Esta azotea es nuestra!'];

class RiotCop extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, opts = {}) {
    const skin = opts.gang ? 'thug2' : 'riot';
    super(scene, x, y, `${skin}_fwd_stand`);
    this.skin = skin;
    this.gang = !!opts.gang;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setOrigin(0.5, 1).setDepth(6);
    this.body.setSize(10, 20).setOffset(3, 4);
    const R = CFG.RIOT;
    this.hp = R.HP;
    this.shield = R.SHIELD;
    this.alive = true;
    this.facing = -1;
    this.score = this.gang ? 250 : 300;
    this.contactKills = false;
    this.bubbleOffset = 28;
    this.walkT = 0;
    this.lowerUntil = 0; // shield lowered (shooting) until then
    this.nextPeek = scene.time.now + Phaser.Math.Between(...R.PEEK_EVERY);
    this.swing = null;
    this.shieldImg = scene.add.image(x, y, this.gang ? 'shutter_shield' : 'riot_shield').setOrigin(0.5, 1).setDepth(7);
    this.nextTalk = scene.time.now + Phaser.Math.Between(1500, 4000);
  }

  get shielded() {
    return this.shield > 0 && this.scene.time.now >= this.lowerUntil;
  }

  update(time, dt) {
    if (!this.alive) return;
    if (time < this.stunUntil) {
      if (this.body.blocked.down) this.setVelocityX(this.body.velocity.x * 0.85);
      this.setAngle(Math.sin(time / 60) * 8);
      return this.placeShield(time);
    }
    this.setAngle(0);
    const s = this.scene, R = CFG.RIOT, t = s.target(this.x, this.y);
    const onScreen = s.inView(this.x, this.y - 10, -4);
    if (!this.swing) this.facing = t.x < this.x ? -1 : 1;
    let vx = 0;

    if (this.swing) this.updateSwing(time);
    else if (time < this.lowerUntil) { /* aiming / shooting from behind the lowered shield */ }
    else {
      const victim = s.players.find((p) => p.state === 'play' && p.alive && !p.vehicle &&
        Math.abs(p.x - this.x) <= R.SWING_RANGE && Math.abs(p.y - this.y) < 16);
      if (victim) this.startSwing(time);
      else if (onScreen && time > this.nextPeek && Math.abs(t.y - this.y) < 40) this.peek(time);
      else if (Math.abs(t.x - this.x) > 14) vx = this.facing * R.SPEED;
    }
    // Walk into view if needed, never off a ledge.
    const left = s.viewLeft + 20, right = s.viewLeft + CFG.VIEW_W - 20;
    if (!this.swing && (this.x < left || this.x > right)) vx = (this.x < left ? 1 : -1) * R.SPEED * 2;
    if (vx && this.body.blocked.down && !s.hasFloor(this.x + Math.sign(vx) * 8, this.y)) vx = 0;
    this.setVelocityX(vx);

    if (onScreen && time > this.nextTalk) {
      Fx.say(s, this, Phaser.Utils.Array.GetRandom(this.gang ? SHIELD_THUG_LINES : RIOT_LINES), 1400);
      this.nextTalk = time + Phaser.Math.Between(6000, 10000);
    }
    if (vx) {
      this.walkT += dt;
      this.setTexture(`${this.skin}_fwd_${RUN_CYCLE[Math.floor(this.walkT / 140) % 4]}`);
    } else this.setTexture(`${this.skin}_fwd_stand`);
    this.setFlipX(this.facing < 0);
    this.placeShield(time);
  }

  placeShield(time) {
    const img = this.shieldImg;
    if (!img.active) return;
    const lowered = time < this.lowerUntil;
    img.setPosition(this.x + this.facing * (lowered ? 2 : 7), this.y + (lowered ? 6 : 0)).setFlipX(this.facing < 0);
    img.setAngle(lowered ? this.facing * 50 : 0);
  }

  // Lower the shield, shoot twice, raise it again: the moment to hit him from the front.
  peek(time) {
    const s = this.scene, R = CFG.RIOT;
    this.lowerUntil = time + R.PEEK_MS;
    this.nextPeek = time + R.PEEK_MS + Phaser.Math.Between(...R.PEEK_EVERY);
    [250, 450].forEach((d) => s.time.delayedCall(d, () => {
      if (!this.alive) return;
      s.enemyShoot(this.x + this.facing * 9, this.y - 13, this.facing > 0 ? 0 : Math.PI);
      Sfx.enemyShot();
    }));
  }

  startSwing(time) {
    const s = this.scene;
    this.swing = { phase: 'windup', at: time + CFG.RIOT.SWING_WINDUP };
    this.baton = s.add.image(this.x, this.y - 22, 'melee_baton').setOrigin(0, 0.5).setDepth(8).setFlipX(this.facing < 0);
    if (this.facing < 0) this.baton.setOrigin(1, 0.5);
    this.baton.setRotation(-1.3 * this.facing);
    Fx.say(s, this, '¡!', CFG.RIOT.SWING_WINDUP);
    Sfx.knifeDraw();
  }

  updateSwing(time) {
    const s = this.scene, sw = this.swing, R = CFG.RIOT, f = this.facing;
    this.baton.setPosition(this.x + f * 4, this.y - 20);
    if (sw.phase === 'windup') {
      if (time < sw.at) return;
      sw.phase = 'strike';
      sw.at = time + 260;
      this.baton.setRotation(0.4 * f);
      Sfx.whack();
      s.players.forEach((p) => {
        const dx = (p.x - this.x) * f;
        if (dx > -6 && dx <= R.SWING_RANGE + 6 && Math.abs(p.y - this.y) < 16 && p.canBeHit()) p.die();
      });
    } else if (time >= sw.at) this.dropBaton();
  }

  dropBaton() {
    if (this.baton) this.baton.destroy();
    this.baton = null;
    this.swing = null;
  }

  // Is the attacker in front of the raised shield? (Not from behind, not from well above.)
  blockedFrom(owner) {
    if (!this.shielded || !owner || owner.x === undefined) return false;
    const src = owner.vehicle || owner;
    if (src.y < this.y - 40) return false;
    return (src.x - this.x) * this.facing > 0;
  }

  hit(dmg, explosive, owner, how) {
    if (!this.alive) return;
    if (!explosive && this.blockedFrom(owner)) {
      const heavy = how === 'laser' || how === 'fire' || dmg >= 3;
      this.shield -= heavy ? 2 : 1;
      Fx.spark(this.scene, this.shieldImg.x, this.y - 12);
      Sfx.ting();
      if (this.shield <= 0) this.breakShield();
      return;
    }
    this.hp -= dmg;
    Fx.flash(this);
    if (this.hp <= 0) this.die(explosive, owner, how);
  }

  breakShield() {
    const s = this.scene, img = this.shieldImg;
    Fx.say(s, this, this.gang ? '¡Mi calamina!' : '¡Mi escudo!', 1000);
    Sfx.crunch();
    s.tweens.add({ targets: img, y: img.y + 10, angle: this.facing * 90, alpha: 0, duration: 400, onComplete: () => img.destroy() });
  }

  die(explosive, owner, how) {
    this.alive = false;
    const s = this.scene;
    this.dropBaton();
    if (this.shieldImg.active) this.breakShield();
    s.addScore(this.score, this.x, this.y - 26, owner);
    Sfx.scream();
    if (how === 'fire') this.setTint((this.baseTint = 0x2b2522));
    this.setVelocity(-this.facing * (explosive ? 110 : 40), explosive ? -260 : -120);
    s.tweens.add({ targets: this, angle: -this.facing * (explosive ? 720 : 90), duration: explosive ? 700 : 300 });
    s.time.delayedCall(1000, () => {
      if (this.active) s.tweens.add({ targets: this, alpha: 0, duration: 400, onComplete: () => this.destroy() });
    });
  }

  destroy(fromScene) {
    if (this.baton) this.baton.destroy();
    if (this.shieldImg && this.shieldImg.active) this.shieldImg.destroy();
    super.destroy(fromScene);
  }
}
