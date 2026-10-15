// An honest cop you freed earlier, back to help in the plaza (Mission 5). Follows the players and shoots the nearest
// enemy. Never dies: after CFG.TOWN.ALLY_HITS hits he pulls back ("¡Me retiro, causa!") and leaves the screen.
const ALLY_LINES = ['¡Me salvaste en el cerro, ahora me toca!', '¡La policía honesta está contigo!', '¡Por todos los que no pudieron denunciar!'];

class Ally extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, index) {
    super(scene, x, y, 'poli_fwd_stand');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setOrigin(0.5, 1).setDepth(8);
    this.body.setSize(8, 20).setOffset(4, 4);
    this.index = index;
    this.hits = 0;
    this.leaving = false;
    this.facing = 1;
    this.walkT = 0;
    this.nextShot = scene.time.now + 800 + index * 300;
    this.bubbleOffset = 28;
    scene.time.delayedCall(300 + index * 500, () => this.active && Fx.say(scene, this, ALLY_LINES[index % ALLY_LINES.length], 1800));
  }

  update(time, dt) {
    const s = this.scene, T = CFG.TOWN;
    let vx = 0;
    if (this.leaving) {
      vx = -T.ALLY_SPEED * 1.6;
      this.facing = -1;
      if (this.x < s.viewLeft - 30) return this.destroy();
    } else {
      // Keep a spot near the players (spread out by index), shoot the nearest enemy in view.
      const lead = s.players.find((p) => p.state === 'play' && p.alive) || s.players[0];
      const spot = lead.x - 30 - this.index * 22;
      if (Math.abs(spot - this.x) > 10) vx = Math.sign(spot - this.x) * T.ALLY_SPEED * (Math.abs(spot - this.x) > 70 ? 1.8 : 1);
      // Left behind (stuck at a ledge, or the players ran ahead): come back in at the left edge of the screen.
      if (this.x < s.viewLeft - 24) {
        this.setPosition(s.viewLeft - 8, s.floorY({ x: s.viewLeft + 8 }) - 4);
        this.body.reset(this.x, this.y);
      }
      const e = s.nearestEnemy(this.x, this.y - 14, T.ALLY_RANGE);
      if (e) this.facing = e.x < this.x ? -1 : 1;
      else if (vx) this.facing = Math.sign(vx);
      if (e && time > this.nextShot) {
        this.nextShot = time + T.ALLY_SHOT_MS;
        const a = Phaser.Math.Angle.Between(this.x, this.y - 13, e.x, e.y);
        s.firePlayerBullet(this.x + this.facing * 8, this.y - 13, a, 340, 1, 'pbullet', null);
        Sfx.shoot();
      }
      if (vx && this.body.blocked.down && !s.hasFloor(this.x + Math.sign(vx) * 6, this.y)) vx = 0;
    }
    this.setVelocityX(vx);
    if (vx) {
      this.walkT += dt;
      this.setTexture(`poli_fwd_${RUN_CYCLE[Math.floor(this.walkT / 100) % 4]}`);
    } else this.setTexture('poli_fwd_stand');
    this.setFlipX(this.facing < 0);
  }

  hurt() {
    if (this.leaving) return;
    this.hits++;
    Fx.flash(this);
    if (this.hits >= CFG.TOWN.ALLY_HITS) {
      this.leaving = true;
      Fx.say(this.scene, this, '¡Me retiro, causa! ¡Sigue tú!', 1400);
    }
  }
}
