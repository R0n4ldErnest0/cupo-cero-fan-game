// A playable character (P1 or P2). One-hit death like Metal Slug.
// state: 'play' (in the level), 'continue' (countdown / choosing character), 'out' (game over), 'inactive' (not joined).
class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, index, char, x, y) {
    super(scene, x, y, `${char}_fwd_stand`);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setOrigin(0.5, 1).setDepth(10);
    this.body.setSize(8, 20).setOffset(4, 4);
    this.index = index;
    this.char = char;
    this.state = 'play';
    this.lives = CFG.CREDITS.LIVES_PER_CREDIT;
    this.score = 0;
    this.ctrl = Controls.none();
    this.countdown = 0;
    this.joining = false;
    this.pendingChar = char;
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

  get info() {
    return CFG.CHARACTERS.find((c) => c.id === this.char);
  }

  setCharacter(id) {
    this.char = id;
    this.setTexture(`${id}_fwd_stand`);
  }

  targetable() {
    return this.state === 'play' && (this.alive || !!this.vehicle);
  }

  canBeHit() {
    return this.state === 'play' && this.alive && !this.vehicle && !this.scene.finished && this.scene.time.now > this.invulnUntil;
  }

  setWeapon(name) {
    this.weapon = name;
    this.ammo = CFG.WEAPONS[name].ammo;
  }

  update(time, dt) {
    if (this.state !== 'play' || this.vehicle) return;
    const onGround = this.body.blocked.down || this.body.touching.down;
    if (!this.alive) {
      if (onGround) this.setVelocityX(0);
      return;
    }
    const s = this.scene, c = this.ctrl, P = CFG.PLAYER;

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
      // ↓ + jump on a one-way floor drops through it instead of jumping.
      if (c.down && s.terrain.isOneWayAt(this.x, this.y + 2)) this.dropUntil = time + 250;
      else {
        this.setVelocityY(-P.JUMP);
        Sfx.jump();
      }
    }

    // Holding ↓ in the air shoots straight down, like Metal Slug.
    this.aim = !onGround && c.down ? 'down' : c.up && !this.crouching ? 'up' : 'fwd';
    const w = CFG.WEAPONS[this.weapon];
    if (c.fire && time > this.lastShot + w.delay) this.shoot(time, w);
    if (c.bombP && this.bombs > 0) this.throwGrenade();

    let legs = 'stand';
    if (!onGround) legs = 'jump';
    else if (move) {
      this.runTime += dt;
      legs = RUN_CYCLE[Math.floor(this.runTime / 90) % 4];
    }
    const ch = this.char;
    let key = `${ch}_${this.aim}_${legs}`;
    if (this.crouching) key = `${ch}_crouch`;
    else if (this.aim === 'down') key = `${ch}_fwd_jump`;
    this.setTexture(key);
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
    } else if (this.aim === 'down') {
      x = this.x;
      y = this.y - 2;
      angle = Math.PI / 2;
    } else {
      x = this.x + this.facing * 9;
      y = this.y - (this.crouching ? 6 : 13);
      angle = this.facing > 0 ? 0 : Math.PI;
    }
    if (w.spread) angle += Phaser.Math.FloatBetween(-w.spread, w.spread);
    this.scene.firePlayerBullet(x, y, angle, w.speed, w.damage, w.tex, this);
    Fx.spark(this.scene, x, y);
    if (this.weapon === 'mg') {
      Sfx.mg();
      if (--this.ammo <= 0) this.setWeapon('pistol');
    } else Sfx.shoot();
  }

  throwGrenade() {
    this.bombs--;
    const G = CFG.GRENADE;
    this.scene.throwGrenade(this.x + this.facing * 4, this.y - 18, this.facing * G.vx + this.body.velocity.x * 0.5, G.vy, this);
    Sfx.throw();
  }

  die() {
    if (!this.canBeHit()) return;
    this.alive = false;
    Sfx.playerDie();
    this.body.setSize(8, 20).setOffset(4, 4);
    this.crouching = false;
    this.setVelocity(-this.facing * 60, -220);
    this.setTexture(`${this.char}_fwd_jump`).setTint(0xff6666).setAlpha(1);
    this.scene.tweens.add({ targets: this, angle: -this.facing * 90, duration: 400 });
    Fx.say(this.scene, this, '¡Ahhh!', 800);
    this.scene.time.delayedCall(1500, () => this.scene.onPlayerDeath(this));
  }

  // Fell into a pit: no death animation, just gone.
  fallDeath() {
    if (this.state !== 'play' || !this.alive) return;
    this.alive = false;
    Sfx.playerDie();
    this.setVisible(false);
    this.body.enable = false;
    this.setVelocity(0, 0);
    this.scene.time.delayedCall(900, () => this.scene.onPlayerDeath(this));
  }

  respawn(x, y) {
    this.state = 'play';
    this.alive = true;
    this.setVisible(true);
    this.body.enable = true;
    this.setPosition(x, y);
    this.setVelocity(0, 0);
    this.angle = 0;
    this.clearTint();
    this.setWeapon('pistol');
    this.bombs = CFG.PLAYER.START_BOMBS;
    this.invulnUntil = this.scene.time.now + CFG.PLAYER.INVULN_MS;
  }

  // Remove from play (continue countdown, game over, not joined yet).
  deactivate() {
    this.alive = false;
    this.setVisible(false);
    this.body.enable = false;
    this.setVelocity(0, 0);
    this.angle = 0;
  }

  enterVehicle(v) {
    this.vehicle = v;
    this.setVisible(false);
    this.body.enable = false;
    v.board(this);
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
