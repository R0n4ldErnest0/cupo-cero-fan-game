// Flying enemies of the air level (Mission 5). Variants:
//   'polheli' small police helicopter: comes in from the right, hovers on a wave, fires aimed shots.
//   'drone'   serenazgo drone: small, flies straight at you and blows up on contact.
//   'tv'      TV news helicopter: can't be shot down ("¡ESTAMOS EN VIVO!"); it just films you and leaves.
const FLYER_LINES = { polheli: ['¡Aterrice, es una orden!', '¡No tiene permiso de vuelo!'], tv: ['¡EN VIVO! ¡El chofer vuela!', '¡Exclusiva!'] };

class Flyer extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, variant) {
    super(scene, x, y, `flyer_${variant}`);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.variant = variant;
    this.setDepth(7);
    this.body.setAllowGravity(false);
    const F = CFG.FLYERS[variant];
    this.hp = F.hp;
    this.score = F.score;
    this.alive = true;
    this.contactKills = variant === 'drone';
    this.facing = -1;
    this.baseY = y;
    this.born = scene.time.now;
    this.nextShot = scene.time.now + Phaser.Math.Between(900, 1600);
    this.bubbleOffset = 16;
    if (FLYER_LINES[variant] && (variant === 'tv' || Math.random() < CFG.ENEMY.TALK_CHANCE)) Fx.say(scene, this, Phaser.Utils.Array.GetRandom(FLYER_LINES[variant]), 1400);
  }

  update(time) {
    if (!this.alive) return;
    const s = this.scene, F = CFG.FLYERS[this.variant], t = s.target(this.x, this.y);
    const life = (time - this.born) / 1000;
    if (this.variant === 'polheli') {
      const holdX = s.viewLeft + CFG.VIEW_W - 70;
      this.setVelocityX(this.x > holdX ? -F.speed : 0);
      this.y = this.baseY + Math.sin(life * 2) * 18;
      if (time > this.nextShot && this.x <= holdX + 4) {
        this.nextShot = time + Phaser.Math.Between(1500, 2300);
        s.enemyShoot(this.x - 12, this.y + 4, Phaser.Math.Angle.Between(this.x, this.y, t.x, t.y), CFG.ENEMY.BULLET_SPEED + 20);
        Sfx.enemyShot();
      }
      if (life > F.stay) this.setVelocity(-F.speed * 2, -40); // leaves after a while
    } else if (this.variant === 'drone') {
      const a = Phaser.Math.Angle.Between(this.x, this.y, t.x, t.y);
      s.physics.velocityFromRotation(a, F.speed, this.body.velocity);
    } else {
      this.setVelocity(-F.speed, 0);
      this.y = this.baseY + Math.sin(life * 1.5) * 6;
    }
    this.setFlipX(this.body.velocity.x > 0);
    if (this.x < s.viewLeft - 60) this.destroy();
  }

  hit(dmg, explosive, owner) {
    if (!this.alive) return;
    if (this.variant === 'tv') {
      if (Math.random() < 0.3) Fx.say(this.scene, this, '¡No dispare, somos prensa!', 900);
      return;
    }
    this.hp -= dmg;
    Fx.flash(this);
    if (this.hp <= 0) this.die(owner);
  }

  die(owner) {
    const s = this.scene;
    this.alive = false;
    s.addScore(this.score, this.x, this.y - 12, owner);
    s.explodeAt(this.x, this.y, 0, 0, true, this.variant === 'drone' ? 0.6 : 1.1);
    this.destroy();
  }
}
