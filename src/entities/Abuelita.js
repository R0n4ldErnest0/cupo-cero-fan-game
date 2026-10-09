// Emoliente Abuelita — our "Hyakutaro". Tied up for not paying; once freed she follows the
// player for a while throwing boiling emoliente at the nearest enemy, then leaves a gift.
class Abuelita extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'abu_tied');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setOrigin(0.5, 1).setDepth(8);
    this.body.setSize(10, 18).setOffset(3, 2);
    this.state = 'tied';
    this.facing = 1;
    this.nextThrow = 0;
    this.throwPoseUntil = 0;
    this.walkT = 0;
    this.nextCry = 0;
    this.bubbleOffset = 24;
    this.sign = scene.add
      .text(x, y - 22, 'NO PAGÓ', {
        fontFamily: FONT, fontSize: '7px', fontStyle: 'bold', color: '#ffffff', backgroundColor: '#c0282e', padding: { x: 2, y: 1 }, resolution: 2,
      })
      .setOrigin(0.5, 1)
      .setDepth(7);
  }

  free() {
    if (this.state !== 'tied') return;
    const s = this.scene;
    this.state = 'free';
    this.until = s.time.now + CFG.ABUELITA.DURATION;
    this.sign.destroy();
    this.setTexture('abu_stand');
    Sfx.pickup();
    s.addScore(300, this.x, this.y - 30);
    s.message('', '¡LA ABUELITA DEL EMOLIENTE SE UNE!', 1800);
    Fx.say(s, this, "¡Gracias, hijito! ¡Emoliente calientito pa' esos malditos!", 2400);
  }

  update(time, dt) {
    const s = this.scene, A = CFG.ABUELITA;
    if (this.state === 'tied') {
      const onScreen = this.x < s.viewLeft + CFG.VIEW_W && this.x > s.viewLeft;
      if (onScreen && time > this.nextCry) {
        Fx.say(s, this, '¡Auxilio! ¡Me amarraron por no pagar!', 1600);
        this.nextCry = time + 4500;
      }
      return;
    }

    if (this.state === 'leaving') {
      this.setVelocityX(-110);
      this.walkAnim(dt, true);
      if (this.x < s.viewLeft - 30) this.destroy();
      return;
    }

    const t = s.target();
    const desired = t.x - (t.facing || 1) * 28;
    const dx = desired - this.x;
    let vx = 0;
    if (Math.abs(dx) > 6) {
      vx = Math.sign(dx) * Math.min(130, Math.abs(dx) * 3);
      this.facing = Math.sign(dx);
    }
    this.setVelocityX(vx);

    if (time > this.nextThrow) {
      const e = s.nearestEnemy(this.x, this.y - 10, A.RANGE);
      if (e) {
        this.facing = e.x < this.x ? -1 : 1;
        this.throwCup(e);
        this.nextThrow = time + A.THROW_DELAY;
        this.throwPoseUntil = time + 250;
      }
    }

    if (time < this.throwPoseUntil) this.setTexture('abu_throw');
    else this.walkAnim(dt, vx !== 0);
    this.setFlipX(this.facing < 0);

    if (time > this.until) this.leave();
  }

  walkAnim(dt, moving) {
    if (!moving) return this.setTexture('abu_stand');
    this.walkT += dt;
    this.setTexture(Math.floor(this.walkT / 120) % 2 ? 'abu_walk' : 'abu_stand');
  }

  throwCup(e) {
    const T = 0.6, g = CFG.GRAVITY;
    const fx = this.x + this.facing * 4, fy = this.y - 18;
    const vx = (e.x - fx) / T;
    const vy = (e.y - fy - 0.5 * g * T * T) / T;
    this.scene.throwCup(fx, fy, vx, vy);
    Sfx.throw();
  }

  leave() {
    const s = this.scene;
    this.state = 'leaving';
    this.facing = -1;
    this.setFlipX(true);
    s.spawnPickup(this.x, this.y - 20, s.player.weapon === 'mg' ? 'B' : 'H');
    Fx.say(s, this, '¡Cuídate, hijito! Me voy a mi puesto.', 2000);
  }
}
