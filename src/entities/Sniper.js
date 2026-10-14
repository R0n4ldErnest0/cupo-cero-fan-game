// Francotirador: a corrupt cop crouched on a rooftop with a rifle. A red laser follows the nearest player for
// CFG.SNIPER.AIM_MS, then locks (stops following and blinks) for LOCK_MS and fires a fast shot along that line:
// keep moving after the lock and it misses. Doesn't move; one hit kills him, if you can get there.
// { gang: true }: a cupero sniper on the Gamarra rooftops.
class Sniper extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, opts = {}) {
    super(scene, x, y, opts.gang ? 'sniper_thug' : 'sniper');
    this.gang = !!opts.gang;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setOrigin(0.5, 1).setDepth(6);
    this.body.setSize(12, 13).setOffset(2, 11);
    this.hp = 1;
    this.alive = true;
    this.facing = -1;
    this.score = 400;
    this.contactKills = false;
    this.bubbleOffset = 20;
    this.phase = 'wait';
    this.at = scene.time.now + 900;
    this.beam = scene.add.graphics().setDepth(13);
  }

  muzzle() {
    return { x: this.x + this.facing * 13, y: this.y - 9 };
  }

  update(time) {
    if (!this.alive) return;
    const s = this.scene, S = CFG.SNIPER, t = s.target(this.x, this.y);
    const onScreen = s.inView(this.x, this.y - 8, -4);
    if (this.phase !== 'locked') this.facing = t.x < this.x ? -1 : 1;
    this.setFlipX(this.facing < 0);
    const m = this.muzzle();
    this.beam.clear();

    if (this.phase === 'wait') {
      if (onScreen && time > this.at && s.players.some((p) => p.targetable())) {
        this.phase = 'aim';
        this.at = time + S.AIM_MS;
      }
    } else if (this.phase === 'aim') {
      this.aimX = t.x;
      this.aimY = t.y - 12;
      this.drawBeam(m, 0.35);
      if (time > this.at) {
        this.phase = 'locked';
        this.at = time + S.LOCK_MS;
        Sfx.lock();
      }
    } else if (this.phase === 'locked') {
      if (Math.floor(time / 60) % 2) this.drawBeam(m, 0.9);
      if (time > this.at) {
        s.enemyShoot(m.x, m.y, Math.atan2(this.aimY - m.y, this.aimX - m.x), S.BULLET_SPEED);
        Sfx.cannon();
        Fx.spark(s, m.x, m.y);
        this.phase = 'wait';
        this.at = time + Phaser.Math.Between(...S.RELOAD);
      }
    }
  }

  // Red laser from the rifle through the aim point, to the edge of the screen.
  drawBeam(m, alpha) {
    const a = Math.atan2(this.aimY - m.y, this.aimX - m.x);
    const ex = m.x + Math.cos(a) * 500, ey = m.y + Math.sin(a) * 500;
    this.beam.lineStyle(1, 0xff2020, alpha).lineBetween(m.x, m.y, ex, ey);
    this.beam.fillStyle(0xff4040, Math.min(1, alpha + 0.3)).fillCircle(this.aimX, this.aimY, 2);
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
    this.beam.clear();
    s.addScore(this.score, this.x, this.y - 20, owner);
    Sfx.scream();
    if (Math.random() < 0.5) Fx.say(s, this, this.gang ? '¡Me vendieron mala mira!' : '¡Mi puntería de academia!', 1200);
    if (how === 'fire') this.setTint((this.baseTint = 0x2b2522));
    this.setVelocity(-this.facing * 60, -200);
    s.tweens.add({ targets: this, angle: -this.facing * 360, duration: 600 });
    s.time.delayedCall(1000, () => {
      if (this.active) s.tweens.add({ targets: this, alpha: 0, duration: 400, onComplete: () => this.destroy() });
    });
  }

  destroy(fromScene) {
    if (this.beam) this.beam.destroy();
    super.destroy(fromScene);
  }
}
