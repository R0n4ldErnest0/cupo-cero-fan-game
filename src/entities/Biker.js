// Rider on a motorcycle: rushes in from the right, fires, runs you over. Two presets (see LevelScene.spawnEnemy):
// the extortionist ('biker': one shot) and the motorbike cop ('motocop': three shots, tougher, "¡Papeleta!").
class Biker extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, opts = {}) {
    super(scene, x, y, opts.tex || 'biker');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setOrigin(0.5, 1).setDepth(6);
    this.body.setSize(26, 14).setOffset(3, 10);
    this.hp = opts.hp || 2;
    this.shotsLeft = opts.shots || 1;
    this.shout = opts.shout || '¡CUPO!';
    this.alive = true;
    this.facing = -1;
    this.score = opts.score || 200;
    this.contactKills = true;
    this.nextShot = 0;
    this.bubbleOffset = 26;
  }

  update(time) {
    if (!this.alive) return;
    const s = this.scene, t = s.target(this.x);
    this.setVelocityX(-CFG.ENEMY.BIKER_SPEED);
    const onScreen = s.inView(this.x, this.y - 8, -4);
    if (this.shotsLeft > 0 && time > this.nextShot && onScreen && this.x > t.x && this.x - t.x < 220) {
      if (this.nextShot === 0 && Math.random() < CFG.ENEMY.TALK_CHANCE * 2) Fx.say(s, this, this.shout, 700);
      this.shotsLeft--;
      this.nextShot = time + 220;
      s.enemyShoot(this.x - 12, this.y - 16, Math.PI);
      Sfx.enemyShot();
    }
  }

  hit(dmg, explosive, owner, how) {
    if (!this.alive) return;
    this.hp -= dmg;
    Fx.flash(this);
    if (this.hp <= 0) this.die(explosive, owner, how);
  }

  die(explosive, owner, how) {
    if (!this.alive) return;
    this.alive = false;
    const s = this.scene;
    if (how === 'fire') this.setTint((this.baseTint = 0x2b2522));
    s.addScore(this.score, this.x, this.y - 26, owner);
    Sfx.scream();
    this.setVelocity(60, -180);
    s.tweens.add({ targets: this, angle: 360, duration: 600 });
    s.time.delayedCall(600, () => {
      if (!this.active) return;
      s.explodeAt(this.x, this.y - 8, 0, 0, true, 0.7);
      this.destroy();
    });
  }
}
