// The Combi Slug — our "Metal Slug" tank — and the base of every drivable vehicle (see MototaxiSlug).
// Board with ↓, exit with ↓+jump. Fire = roof machine gun, grenade = cannon. Like the SV-001, the gun turns toward
// the held direction (all 8, including down-diagonals) and keeps its angle when released. Route stickers = HP.
// A vehicle is described by a spec (sizes, speeds, parts); subclasses change the spec and override bomb()/aim().
const COMBI_SPEC = {
  kind: 'combi', name: 'COMBI SLUG', tex: 'combi', body: [58, 26, 3, 8],
  wheels: [{ dx: 17, dy: -6 }, { dx: -17, dy: -6 }], wheelScale: 1, wheelSpin: 6,
  turret: { tex: 'cannon', dx: -6, dy: -35, len: 17 }, labelY: 44, hintY: 56,
  wreckLine: '¡Mi combi! ¡Todavía la estaba pagando!',
};

class CombiSlug extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spec = COMBI_SPEC) {
    super(scene, x, y, spec.tex);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.spec = spec;
    this.cfg = spec.kind === 'combi' ? CFG.COMBI : CFG.MOTOTAXI;
    this.setOrigin(0.5, 1).setDepth(9);
    this.body.setSize(spec.body[0], spec.body[1]).setOffset(spec.body[2], spec.body[3]);
    this.wheels = spec.wheels.map(() => scene.add.image(x, y, 'wheel').setDepth(10).setScale(spec.wheelScale));
    this.turret = scene.add.image(x, y, spec.turret.tex).setOrigin(0.2, 0.5).setDepth(10);
    this.label = scene.add
      .text(x, y - spec.labelY, spec.name, {
        fontFamily: FONT, fontSize: '8px', fontStyle: 'bold', color: '#111111', backgroundColor: '#f2c94c', padding: { x: 3, y: 1 }, resolution: 2,
      })
      .setOrigin(0.5, 1)
      .setDepth(30);
    this.hint = scene.add
      .text(x, y - spec.hintY, '↓ ¡SÚBETE!', {
        fontFamily: FONT, fontSize: '8px', fontStyle: 'bold', color: '#ffe066', stroke: '#000000', strokeThickness: 3, resolution: 2,
      })
      .setOrigin(0.5, 1)
      .setDepth(30)
      .setVisible(false);
    scene.tweens.add({ targets: this.hint, y: '-=4', yoyo: true, repeat: -1, duration: 300 });

    this.state = 'parked';
    this.hp = this.cfg.HP;
    this.cannon = CFG.COMBI.CANNON_AMMO;
    this.facing = 1;
    this.aimAngle = 0;
    this.lastMg = 0;
    this.hurtUntil = 0;
    this.nextSmoke = 0;
    this.bubbleOffset = spec.labelY;
    this.driver = null;
  }

  // What the HUD shows while driving.
  hudText() {
    return `COMBI ${'■'.repeat(Math.max(0, this.hp))}  CAÑÓN ${this.cannon}`;
  }

  // What carries over to the next section (see LevelScene.savePlayers / carryCombi).
  saveState() {
    return { kind: this.spec.kind, hp: this.hp, cannon: this.cannon };
  }

  loadState(st) {
    this.hp = st.hp;
    this.cannon = st.cannon;
  }

  canBoard(p) {
    return this.state === 'parked' && p.targetable() && !p.vehicle && Math.abs(p.x - this.x) < 40 && Math.abs(p.y - this.y) < 36;
  }

  board(driver) {
    this.state = 'driven';
    this.driver = driver;
    if (this.label) { this.label.destroy(); this.label = null; }
    Sfx.horn();
    this.scene.message(`¡${this.spec.name}!`, '', 1200);
  }

  update(time, dt) {
    const s = this.scene, spec = this.spec;
    if (this.state === 'driven') this.drive(time, dt);
    else if (this.state === 'parked') this.setVelocityX(0);

    const near = this.state === 'parked' && s.players.some((p) => p.targetable() && !p.vehicle && Math.abs(p.x - this.x) < 110);
    this.hint.setVisible(near);
    this.hint.x = this.x;
    if (this.label) this.label.setPosition(this.x, this.y - spec.labelY);

    // Tilt with the slope (45° tiles) and keep the parts attached to the tilted body.
    const want = this.onSlope ? (this.slopeKind === 'up' ? -Math.PI / 4 : Math.PI / 4) : 0;
    this.rotation += (want - this.rotation) * Math.min(1, dt / 90);
    const cos = Math.cos(this.rotation), sin = Math.sin(this.rotation);
    const at = (dx, dy) => [this.x + dx * cos - dy * sin, this.y + dx * sin + dy * cos];

    const f = this.facing;
    this.setFlipX(f < 0);
    const spin = (this.body.velocity.x * dt) / 1000 / spec.wheelSpin;
    spec.wheels.forEach((w, i) => this.wheels[i].setPosition(...at(f * w.dx, w.dy)).rotation += spin);
    this.turret.setPosition(...at(f * spec.turret.dx, spec.turret.dy));
    this.turret.setRotation(this.aimAngle).setFlipY(Math.cos(this.aimAngle) < -0.01);

    if (this.state === 'driven') this.driver.setPosition(this.x, this.y - 8);
    if (this.hp <= 1 && this.state !== 'wrecked' && time > this.nextSmoke) {
      Fx.puff(s, this.x + Phaser.Math.Between(-10, 10), this.y - spec.labelY * 0.7, 1.2, 0x555555);
      this.nextSmoke = time + 180;
    }
  }

  // The gun turns toward the held direction and keeps its angle.
  aim(c, move, dt) {
    const ax = move, ay = (c.up ? -1 : 0) + (c.down ? 1 : 0);
    if (ax || ay) this.aimAngle = Phaser.Math.Angle.RotateTo(this.aimAngle, Math.atan2(ay, ax), CFG.COMBI.TURRET_SPEED * dt);
  }

  // Grenade button: the combi's cannon.
  bomb(c, time, mx, my) {
    if (!c.bombP || this.cannon <= 0) return;
    const s = this.scene;
    this.cannon--;
    s.fireShell(mx, my, this.aimAngle, this.driver);
    Fx.puff(s, mx, my, 1.4, 0xdddddd);
    Sfx.cannon();
  }

  drive(time, dt) {
    const s = this.scene, c = this.driver.ctrl, C = this.cfg;
    if (c.down && c.jumpP) {
      this.state = 'parked';
      this.setVelocityX(0);
      this.driver.exitVehicle();
      this.driver = null;
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
    this.aim(c, move, dt);

    const mx = this.turret.x + Math.cos(this.aimAngle) * this.spec.turret.len;
    const my = this.turret.y + Math.sin(this.aimAngle) * this.spec.turret.len;
    if (c.fire && time > this.lastMg + C.MG_DELAY) {
      this.lastMg = time;
      s.firePlayerBullet(mx, my, this.aimAngle + Phaser.Math.FloatBetween(-0.05, 0.05), C.MG_SPEED, 1, 'mgbullet', this.driver);
      Fx.spark(s, mx, my);
      Sfx.mg();
    }
    this.bomb(c, time, mx, my);
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
    const d = this.driver;
    d.exitVehicle();
    this.driver = null;
    Fx.say(s, d, this.spec.wreckLine, 1800);
    s.tweens.add({ targets: this, alpha: 0.3, yoyo: true, repeat: 4, duration: 90 });
    s.time.delayedCall(900, () => {
      s.explodeAt(this.x, this.y - 14, 40, CFG.COMBI.WRECK_DAMAGE, true, 1.6, d);
      this.removeAll();
    });
  }

  // Drove into a pit: the vehicle is lost and so is the driver (LevelScene.checkPits handles the death).
  fellIntoPit() {
    const d = this.driver;
    this.driver = null;
    if (d) {
      d.vehicle = null;
      d.setPosition(this.x, this.y);
    }
    this.removeAll();
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
