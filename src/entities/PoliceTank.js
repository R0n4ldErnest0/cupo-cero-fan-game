// A police tanqueta, AI-driven (final mission). Two sides:
//   'ally'  the honest police's tank: rolls along a bit ahead of the players and shells the nearest enemy. It doesn't
//           die: worn down by enemy fire it pulls back to repair ("¡Me retiro a reparar!") and the Town sends it again.
//   'enemy' the serenazgo's tank: rolls in, stops at a distance and fires slow shells (jump them). Much weaker than a
//           Slug: a few grenades or a burst of bullets.
const TANK_LINES = {
  ally: ['¡Tanqueta de la policía honesta, a su servicio!', '¡Cubriendo al chofer!'],
  enemy: ['¡Orden del alcalde: nadie pasa!', '¡Despejen la plaza!'],
};

class PoliceTank extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, side = 'enemy', index = 0) {
    super(scene, x, y, side === 'ally' ? 'tank_ally_r' : 'tank_enemy_l');
    this.texKey = side === 'ally' ? 'tank_ally' : 'tank_enemy';
    scene.add.existing(this);
    scene.physics.add.existing(this);
    const T = CFG.TANK;
    this.side = side;
    this.ally = side === 'ally';
    this.index = index;
    this.setOrigin(0.5, 1).setDepth(5); // behind the people
    this.body.setSize(48, 22).setOffset(4, 8);
    this.hp = this.ally ? T.ALLY_HP : T.ENEMY_HP;
    this.alive = true;
    this.leaving = false;
    this.contactKills = false;
    this.score = T.SCORE;
    this.facing = this.ally ? 1 : -1;
    this.nextShot = scene.time.now + (this.ally ? 1200 : T.ENEMY_SHOT_MS * 0.6);
    this.bubbleOffset = 34;
    if (this.ally || Math.random() < CFG.ENEMY.TALK_CHANCE) {
      scene.time.delayedCall(400, () => this.active && Fx.say(scene, this, Phaser.Utils.Array.GetRandom(TANK_LINES[side]), 1600));
    }
  }

  update(time) {
    if (!this.alive) return;
    if (this.ally) this.updateAlly(time);
    else this.updateEnemy(time);
    this.setTexture(`${this.texKey}_${this.facing < 0 ? 'l' : 'r'}`);
  }

  updateAlly(time) {
    const s = this.scene, T = CFG.TANK;
    if (this.leaving) {
      this.facing = -1;
      this.setVelocityX(-T.SPEED * 1.5);
      if (Math.random() < 0.2) Fx.puff(s, this.x, this.y - 22, 0.8, 0x555555);
      if (this.x < s.viewLeft - 50) this.destroy();
      return;
    }
    // Keep a spot a bit ahead of the lead player (the tank covers you), but stay on screen.
    const lead = s.players.find((p) => p.state === 'play' && (p.alive || p.vehicle)) || s.players[0];
    const o = lead.vehicle || lead;
    const spot = Phaser.Math.Clamp(o.x + 46 + this.index * 40, s.viewLeft + 30, s.viewLeft + CFG.VIEW_W - 40);
    const dx = spot - this.x;
    let vx = Math.abs(dx) > 8 ? Math.sign(dx) * (Math.abs(dx) > 60 ? T.CATCHUP : T.SPEED) : 0; // hurries to catch up
    if (vx && !s.hasFloor(this.x + Math.sign(vx) * 28, this.y)) vx = 0;
    if (this.x < s.viewLeft - 40) { // left behind: roll back in from the left edge
      this.setPosition(s.viewLeft - 26, s.floorY({ x: s.viewLeft + 8 }) - 4);
      this.body.reset(this.x, this.y);
    }
    this.setVelocityX(vx);
    const e = s.nearestEnemy(this.x, this.y - 14, T.RANGE);
    this.facing = e ? (e.x < this.x ? -1 : 1) : 1;
    if (e && time > this.nextShot) {
      this.nextShot = time + T.ALLY_SHOT_MS;
      const mx = this.x + this.facing * 28, my = this.y - 22;
      const a = Phaser.Math.Angle.Between(mx, my, e.x, e.y - 10);
      s.fireShell(mx, my, a, null);
      Fx.puff(s, mx, my, 1.2, 0xdddddd);
      Sfx.cannon();
    }
  }

  updateEnemy(time) {
    const s = this.scene, T = CFG.TANK, t = s.target(this.x, this.y);
    this.facing = t.x < this.x ? -1 : 1;
    const far = Math.abs(t.x - this.x) > T.STOP_AT;
    this.setVelocityX(far && s.inView(this.x, this.y - 10, 30) ? this.facing * T.SPEED * 0.8 : 0);
    if (time > this.nextShot && s.inView(this.x, this.y - 10, -10)) {
      this.nextShot = time + T.ENEMY_SHOT_MS;
      // A flash on the barrel first, then a slow shell straight ahead (jump it).
      this.setTint(0xffa0a0);
      s.time.delayedCall(T.WARN_MS, () => {
        if (!this.alive) return;
        this.clearTint();
        s.enemyShoot(this.x + this.facing * 28, this.y - 13, this.facing < 0 ? Math.PI : 0, T.SHELL_SPEED, 'shell');
        Fx.puff(s, this.x + this.facing * 30, this.y - 13, 1, 0xdddddd);
        Sfx.cannon();
      });
    }
  }

  // Ally: hit by enemy fire (from the Town's overlap).
  hurt() {
    if (this.leaving) return;
    this.hp--;
    Fx.flash(this);
    if (this.hp <= 0) {
      this.leaving = true;
      Fx.say(this.scene, this, '¡Me retiro a reparar! ¡Ya vuelvo!', 1600);
    }
  }

  // Enemy: hit by the players.
  hit(dmg, explosive, owner) {
    if (!this.alive || this.ally) return;
    this.hp -= dmg;
    Fx.flash(this);
    if (this.hp <= 0) this.die(owner);
  }

  die(owner) {
    const s = this.scene;
    this.alive = false;
    this.setVelocityX(0);
    s.addScore(this.score, this.x, this.y - 30, owner);
    s.explodeAt(this.x, this.y - 12, 0, 0, true, 1.6);
    this.setTint(0x3a3a3a);
    s.time.delayedCall(500, () => this.active && s.explodeAt(this.x + 10, this.y - 18, 0, 0, true, 1));
    s.tweens.add({ targets: this, alpha: 0, delay: 900, duration: 400, onComplete: () => this.destroy() });
  }
}
