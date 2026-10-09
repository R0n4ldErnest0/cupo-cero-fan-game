// The Combi Slug — our "Metal Slug" tank. Board with ↓, exit with ↓+jump.
// X = roof machine gun (aims with ↑), C = cannon. Route stickers = HP.
class CombiSlug extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'combi');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setOrigin(0.5, 1).setDepth(9);
    this.body.setSize(58, 26).setOffset(3, 8);
    this.wheels = [0, 1].map(() => scene.add.image(x, y, 'wheel').setDepth(10));
    this.turret = scene.add.image(x, y, 'cannon').setOrigin(0.2, 0.5).setDepth(10);
    this.label = scene.add
      .text(x, y - 44, 'COMBI SLUG', {
        fontFamily: FONT, fontSize: '8px', fontStyle: 'bold', color: '#111111', backgroundColor: '#f2c94c', padding: { x: 3, y: 1 }, resolution: 2,
      })
      .setOrigin(0.5, 1)
      .setDepth(30);
    this.hint = scene.add
      .text(x, y - 56, '↓ ¡SÚBETE!', {
        fontFamily: FONT, fontSize: '8px', fontStyle: 'bold', color: '#ffe066', stroke: '#000000', strokeThickness: 3, resolution: 2,
      })
      .setOrigin(0.5, 1)
      .setDepth(30)
      .setVisible(false);
    scene.tweens.add({ targets: this.hint, y: '-=4', yoyo: true, repeat: -1, duration: 300 });

    this.state = 'parked';
    this.hp = CFG.COMBI.HP;
    this.cannon = CFG.COMBI.CANNON_AMMO;
    this.facing = 1;
    this.aimAngle = 0;
    this.lastMg = 0;
    this.hurtUntil = 0;
    this.nextSmoke = 0;
    this.bubbleOffset = 44;
  }

  canBoard(p) {
    return this.state === 'parked' && Math.abs(p.x - this.x) < 40 && Math.abs(p.y - this.y) < 36;
  }

  board() {
    this.state = 'driven';
    if (this.label) { this.label.destroy(); this.label = null; }
    Sfx.horn();
    this.scene.message('¡COMBI SLUG!', '', 1200);
  }

  update(time, dt) {
    const s = this.scene, p = s.player;
    if (this.state === 'driven') this.drive(time, dt);
    else if (this.state === 'parked') this.setVelocityX(0);

    const near = this.state === 'parked' && p.alive && !p.vehicle && Math.abs(p.x - this.x) < 110;
    this.hint.setVisible(near);
    this.hint.x = this.x;
    if (this.label) this.label.setPosition(this.x, this.y - 44);

    // Parts
    const f = this.facing;
    this.setFlipX(f < 0);
    const spin = (this.body.velocity.x * dt) / 1000 / 6;
    this.wheels[0].setPosition(this.x + f * 17, this.y - 6).rotation += spin;
    this.wheels[1].setPosition(this.x - f * 17, this.y - 6).rotation += spin;
    this.turret.setPosition(this.x - f * 6, this.y - 35);
    this.turret.setRotation(this.aimAngle).setFlipY(Math.cos(this.aimAngle) < -0.01);

    if (this.state === 'driven') p.setPosition(this.x, this.y - 8);
    if (this.hp <= 1 && this.state !== 'wrecked' && time > this.nextSmoke) {
      Fx.puff(s, this.x + Phaser.Math.Between(-10, 10), this.y - 30, 1.2, 0x555555);
      this.nextSmoke = time + 180;
    }
  }

  drive(time, dt) {
    const s = this.scene, c = s.ctrl, C = CFG.COMBI;
    if (c.down && c.jumpP) {
      this.state = 'parked';
      this.setVelocityX(0);
      s.player.exitVehicle();
      return;
    }
    const move = (c.left ? -1 : 0) + (c.right ? 1 : 0);
    if (move) this.facing = move;
    this.setVelocityX(move * C.SPEED);
    const onGround = this.body.blocked.down || this.body.touching.down;
    if (c.jumpP && onGround) {
      this.setVelocityY(-C.JUMP);
      Sfx.jump();
    }

    const target = c.up ? -Math.PI / 2 : this.facing > 0 ? 0 : Math.PI;
    if (Math.abs(Phaser.Math.Angle.Wrap(target - this.aimAngle)) > 2.5) this.aimAngle = target; // snap on turnaround
    else this.aimAngle = Phaser.Math.Angle.RotateTo(this.aimAngle, target, 0.012 * dt);

    const mx = this.turret.x + Math.cos(this.aimAngle) * 17;
    const my = this.turret.y + Math.sin(this.aimAngle) * 17;
    if (c.fire && time > this.lastMg + C.MG_DELAY) {
      this.lastMg = time;
      s.firePlayerBullet(mx, my, this.aimAngle + Phaser.Math.FloatBetween(-0.05, 0.05), C.MG_SPEED, 1, 'mgbullet');
      Fx.spark(s, mx, my);
      Sfx.mg();
    }
    if (c.bombP && this.cannon > 0) {
      this.cannon--;
      s.fireShell(mx, my, this.aimAngle);
      Fx.puff(s, mx, my, 1.4, 0xdddddd);
      Sfx.cannon();
    }
  }

  damage(n = 1) {
    const s = this.scene;
    if (this.state !== 'driven' || s.time.now < this.hurtUntil) return;
    this.hurtUntil = s.time.now + 400;
    this.hp -= n;
    Fx.flash(this);
    Sfx.hit();
    if (this.hp <= 0) this.wreck();
  }

  wreck() {
    const s = this.scene;
    this.state = 'wrecked';
    this.setVelocityX(0);
    s.player.exitVehicle();
    Fx.say(s, s.player, '¡Mi combi! ¡Todavía la estaba pagando!', 1800);
    s.tweens.add({ targets: this, alpha: 0.3, yoyo: true, repeat: 4, duration: 90 });
    s.time.delayedCall(900, () => {
      s.explodeAt(this.x, this.y - 14, 40, CFG.COMBI.WRECK_DAMAGE, true, 1.6);
      this.removeAll();
    });
  }

  removeAll() {
    const s = this.scene;
    (s.combiColliders || []).forEach((c) => c.destroy());
    this.wheels.forEach((w) => w.destroy());
    this.turret.destroy();
    this.hint.destroy();
    if (this.label) this.label.destroy();
    s.combi = null;
    this.destroy();
  }
}
