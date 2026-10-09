// Don Chato, the combi driver. One-hit death like Metal Slug.
class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'chato_fwd_stand');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setOrigin(0.5, 1).setDepth(10);
    this.body.setSize(8, 20).setOffset(4, 4);
    this.facing = 1;
    this.aim = 'fwd';
    this.crouching = false;
    this.weapon = 'pistol';
    this.ammo = Infinity;
    this.bombs = CFG.PLAYER.START_BOMBS;
    this.lastShot = 0;
    this.runTime = 0;
    this.alive = true;
    this.invulnUntil = 0;
    this.vehicle = null;
    this.bubbleOffset = 28;
  }

  canBeHit() {
    return this.alive && !this.vehicle && !this.scene.finished && this.scene.time.now > this.invulnUntil;
  }

  setWeapon(name) {
    this.weapon = name;
    this.ammo = CFG.WEAPONS[name].ammo;
  }

  update(time, dt) {
    if (this.vehicle) return;
    const onGround = this.body.blocked.down || this.body.touching.down;
    if (!this.alive) {
      if (onGround) this.setVelocityX(0);
      return;
    }
    const s = this.scene, c = s.ctrl, P = CFG.PLAYER;

    if (c.downP && s.combi && s.combi.canBoard(this)) {
      this.enterVehicle(s.combi);
      return;
    }

    const move = (c.left ? -1 : 0) + (c.right ? 1 : 0);
    if (move) this.facing = move;

    const wasCrouching = this.crouching;
    this.crouching = c.down && onGround;
    if (this.crouching !== wasCrouching) {
      if (this.crouching) this.body.setSize(8, 12).setOffset(4, 12);
      else this.body.setSize(8, 20).setOffset(4, 4);
    }

    this.setVelocityX(move * (this.crouching ? P.SPEED * 0.4 : P.SPEED));
    if (c.jumpP && onGround) {
      this.setVelocityY(-P.JUMP);
      Sfx.jump();
    }

    this.aim = c.up && !this.crouching ? 'up' : 'fwd';
    const w = CFG.WEAPONS[this.weapon];
    if (c.fire && time > this.lastShot + w.delay) this.shoot(time, w);
    if (c.bombP && this.bombs > 0) this.throwGrenade();

    let legs = 'stand';
    if (!onGround) legs = 'jump';
    else if (move) {
      this.runTime += dt;
      legs = RUN_CYCLE[Math.floor(this.runTime / 90) % 4];
    }
    this.setTexture(this.crouching ? 'chato_crouch' : `chato_${this.aim}_${legs}`);
    this.setFlipX(this.facing < 0);
    this.setAlpha(time < this.invulnUntil && Math.floor(time / 80) % 2 ? 0.35 : 1);
  }

  shoot(time, w) {
    this.lastShot = time;
    let x, y, angle;
    if (this.aim === 'up') {
      x = this.x + this.facing * 4;
      y = this.y - 26;
      angle = -Math.PI / 2;
    } else {
      x = this.x + this.facing * 9;
      y = this.y - (this.crouching ? 6 : 13);
      angle = this.facing > 0 ? 0 : Math.PI;
    }
    if (w.spread) angle += Phaser.Math.FloatBetween(-w.spread, w.spread);
    this.scene.firePlayerBullet(x, y, angle, w.speed, w.damage, w.tex);
    Fx.spark(this.scene, x, y);
    if (this.weapon === 'mg') {
      Sfx.mg();
      if (--this.ammo <= 0) this.setWeapon('pistol');
    } else Sfx.shoot();
  }

  throwGrenade() {
    this.bombs--;
    const G = CFG.GRENADE;
    this.scene.throwGrenade(this.x + this.facing * 4, this.y - 18, this.facing * G.vx + this.body.velocity.x * 0.5, G.vy);
    Sfx.throw();
  }

  die() {
    if (!this.canBeHit()) return;
    this.alive = false;
    Sfx.playerDie();
    this.body.setSize(8, 20).setOffset(4, 4);
    this.crouching = false;
    this.setVelocity(-this.facing * 60, -220);
    this.setTexture('chato_fwd_jump').setTint(0xff6666).setAlpha(1);
    this.scene.tweens.add({ targets: this, angle: -this.facing * 90, duration: 400 });
    Fx.say(this.scene, this, '¡Ahhh!', 800);
    this.scene.time.delayedCall(1500, () => this.scene.onPlayerDeath());
  }

  respawn(x) {
    this.alive = true;
    this.setPosition(x, CFG.GROUND_Y - 120);
    this.setVelocity(0, 0);
    this.angle = 0;
    this.clearTint();
    this.setWeapon('pistol');
    this.bombs = CFG.PLAYER.START_BOMBS;
    this.invulnUntil = this.scene.time.now + CFG.PLAYER.INVULN_MS;
  }

  enterVehicle(v) {
    this.vehicle = v;
    this.setVisible(false);
    this.body.enable = false;
    v.board();
  }

  exitVehicle() {
    const v = this.vehicle;
    if (!v) return;
    this.vehicle = null;
    this.setVisible(true);
    this.body.enable = true;
    this.setPosition(v.x, v.y - 34);
    this.setVelocity(0, -260);
    this.invulnUntil = this.scene.time.now + 800;
  }
}
