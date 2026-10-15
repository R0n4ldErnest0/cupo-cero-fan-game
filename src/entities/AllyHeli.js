// The honest police's helicopter (final mission). Can't be shot down. Two modes:
//   'bomber' crosses the top of the screen now and then; a cop leans out and drops bombs on the enemies (and the boss)
//            below. Used at the obra paralizada.
//   'escort' in the air level: flies along with the players near the top and shoots the nearest enemy.
const ALLY_HELI_LINES = ['¡Bombas para el alcalde!', '¡Apoyo aéreo, causa!', '¡La policía honesta llegó por el aire!'];

class AllyHeli extends Phaser.GameObjects.Sprite {
  constructor(scene, mode) {
    const s = scene, escort = mode === 'escort';
    super(s, escort ? s.viewLeft - 40 : s.viewLeft - 50, s.viewTop + (escort ? 26 : 30), 'aircraft_heli');
    s.add.existing(this);
    this.mode = mode;
    this.setDepth(escort ? 6 : 15).setFlipX(true).setTint(0xd8f0d8);
    this.rotor = s.add.rectangle(this.x, this.y - 11, 36, 1, 0x2b2b33).setDepth(this.depth);
    this.bombsLeft = CFG.ALLY_HELI.BOMBS;
    this.nextDrop = 0;
    this.nextShot = s.time.now + 1500;
    this.born = s.time.now;
    this.bubbleOffset = 18;
    s.time.delayedCall(600, () => this.active && Fx.say(s, this, Phaser.Utils.Array.GetRandom(ALLY_HELI_LINES), 1500));
  }

  update(time, dt) {
    const s = this.scene, H = CFG.ALLY_HELI, sec = dt / 1000;
    const life = (time - this.born) / 1000;
    this.rotor.setPosition(this.x, this.y - 11).setScale(Math.abs(Math.sin(time / 30)) * 0.8 + 0.2, 1);
    if (this.mode === 'escort') {
      // Hold a spot near the top-left third, bobbing; shoot whatever is nearest.
      const hx = s.viewLeft + 110;
      this.x += Phaser.Math.Clamp(hx - this.x, -H.SPEED * sec, H.SPEED * sec);
      this.y = s.viewTop + 26 + Math.sin(life * 1.6) * 6;
      const e = s.nearestEnemy(this.x, this.y, H.RANGE);
      if (e && time > this.nextShot) {
        this.nextShot = time + H.SHOT_MS;
        s.firePlayerBullet(this.x + 16, this.y + 4, Phaser.Math.Angle.Between(this.x + 16, this.y + 4, e.x, e.y), 340, 1, 'pbullet', null);
        Sfx.shoot();
      }
      return;
    }
    // Bomber: cross from left to right; drop a bomb when over an enemy or the boss.
    this.x += H.SPEED * sec;
    this.y = s.viewTop + 30 + Math.sin(life * 2) * 4;
    if (this.bombsLeft > 0 && time > this.nextDrop) {
      const targets = s.enemies.getChildren().filter((e) => e.alive).concat(s.boss && s.boss.alive ? [s.boss] : []);
      if (targets.some((e) => Math.abs(e.x - this.x) < 20)) {
        this.bombsLeft--;
        this.nextDrop = time + H.DROP_GAP;
        s.throwGrenade(this.x, this.y + 10, H.SPEED * 0.3, 0, null);
        Sfx.throw();
      }
    }
    if (this.x > s.viewLeft + CFG.VIEW_W + 60) this.destroy();
  }

  destroy(fromScene) {
    if (this.rotor) this.rotor.destroy();
    super.destroy(fromScene);
  }
}
