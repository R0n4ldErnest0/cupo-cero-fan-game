// Extortionist on a motorcycle: rushes in from the right, fires once, runs you over.
class Biker extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'biker');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setOrigin(0.5, 1).setDepth(6);
    this.body.setSize(26, 14).setOffset(3, 10);
    this.hp = 2;
    this.alive = true;
    this.facing = -1;
    this.score = 200;
    this.contactKills = true;
    this.shot = false;
    this.bubbleOffset = 26;
  }

  update() {
    if (!this.alive) return;
    const s = this.scene, t = s.target(this.x);
    this.setVelocityX(-CFG.ENEMY.BIKER_SPEED);
    const onScreen = this.x < s.viewLeft + CFG.VIEW_W - 4;
    if (!this.shot && onScreen && this.x > t.x && this.x - t.x < 220) {
      this.shot = true;
      s.enemyShoot(this.x - 12, this.y - 16, Math.PI);
      Sfx.enemyShot();
      Fx.say(s, this, '¡CUPO!', 700);
    }
  }

  hit(dmg, explosive, owner) {
    if (!this.alive) return;
    this.hp -= dmg;
    Fx.flash(this);
    if (this.hp <= 0) this.die(explosive, owner);
  }

  die(explosive, owner) {
    if (!this.alive) return;
    this.alive = false;
    const s = this.scene;
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
