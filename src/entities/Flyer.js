// Flying enemies of the air level (Mission 5). Variants:
//   'polheli' small police helicopter: comes in from the right, hovers on a wave, fires aimed shots.
//   'drone'   serenazgo drone: small, flies straight at you and blows up on contact.
//   'tv'      TV news helicopter: can't be shot down ("¡ESTAMOS EN VIVO!"); it just films you and leaves.
//   'plane'   missile plane: lines up with you, a red line blinks across the screen at that height (the warning),
//             then a slow missile flies straight along it: move up or down. `shots` missiles, then it leaves.
//   'para'    serenazgo on a parachute: drops from the top, drifts back slowly and shoots now and then.
const FLYER_LINES = {
  polheli: ['¡Aterrice, es una orden!', '¡No tiene permiso de vuelo!'],
  tv: ['¡EN VIVO! ¡El chofer vuela!', '¡Exclusiva!'],
  plane: ['¡Fijando blanco!', '¡Misil con presupuesto municipal!'],
  para: ['¡Serenazgo aerotransportado!', '¡Alto ahí... desde arriba!'],
};

class Flyer extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, variant) {
    super(scene, x, y, variant === 'para' ? 'sere_fwd_stand' : `flyer_${variant}`);
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
    this.shots = 1;
    if (variant === 'plane') this.phase = 'in';
    if (variant === 'para') {
      this.canopy = scene.add.image(x, y - 20, 'parachute').setDepth(7);
      this.bubbleOffset = 34;
    }
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
    } else if (this.variant === 'plane') {
      this.updatePlane(time, F, t);
    } else if (this.variant === 'para') {
      this.setVelocity(-F.drift, F.fall);
      this.canopy.setPosition(this.x, this.y - 20).setRotation(Math.sin(life * 2) * 0.12);
      if (time > this.nextShot && this.y > s.viewTop + 30) {
        this.nextShot = time + Phaser.Math.Between(F.shot[0], F.shot[1]);
        s.enemyShoot(this.x, this.y - 4, Phaser.Math.Angle.Between(this.x, this.y - 4, t.x, t.y), CFG.ENEMY.BULLET_SPEED);
        Sfx.enemyShot();
      }
      if (this.y > s.viewTop + CFG.VIEW_H + 30) return this.destroy();
    } else if (this.variant === 'drone') {
      const a = Phaser.Math.Angle.Between(this.x, this.y, t.x, t.y);
      s.physics.velocityFromRotation(a, F.speed, this.body.velocity);
    } else {
      this.setVelocity(-F.speed, 0);
      this.y = this.baseY + Math.sin(life * 1.5) * 6;
    }
    if (!this.active) return;
    if (this.variant === 'para') this.setFlipX(t.x < this.x);
    else this.setFlipX(this.body.velocity.x > 0);
    if (this.x < s.viewLeft - 60) this.destroy();
  }

  // Missile plane: fly in, line up with the target, blink the warning line, fire straight left; repeat, then leave.
  updatePlane(time, F, t) {
    const s = this.scene;
    if (this.phase === 'in') {
      this.setVelocity(-F.speed, 0);
      if (this.x > s.viewLeft + CFG.VIEW_W - 40) return;
      this.setVelocity(0, 0);
      this.phase = 'aim';
      this.phaseAt = time;
      this.fromY = this.y;
      this.aimY = t.y;
    }
    if (this.phase === 'aim') {
      const k = Math.min(1, (time - this.phaseAt) / F.aimMs);
      this.y = Phaser.Math.Linear(this.fromY, this.aimY, Phaser.Math.Easing.Sine.InOut(k));
      if (k < 1) return;
      this.phase = 'warn';
      this.phaseAt = time;
      this.warnLine = s.add.rectangle(s.viewLeft, this.y + 6, CFG.VIEW_W, 2, 0xff3030, 0.7).setOrigin(0, 0.5).setDepth(6);
      Sfx.rev();
    }
    if (this.phase === 'warn') {
      const blink = Math.floor((time - this.phaseAt) / 110) % 2 === 0;
      this.warnLine.setVisible(blink);
      if (blink) this.setTint(0xff9090);
      else this.clearTint();
      if (time - this.phaseAt < F.warn) return;
      this.warnLine.destroy();
      this.warnLine = null;
      this.clearTint();
      s.enemyShoot(this.x - 20, this.y + 6, Math.PI, F.missile, 'emissile');
      Sfx.rocket();
      this.shots--;
      this.phase = this.shots > 0 ? 'reload' : 'leave';
      this.phaseAt = time;
    }
    if (this.phase === 'reload' && time - this.phaseAt > F.gap) {
      this.phase = 'aim';
      this.phaseAt = time;
      this.fromY = this.y;
      this.aimY = s.target(this.x, this.y).y;
    }
    if (this.phase === 'leave') {
      this.setVelocity(F.speed * 0.8, -50); // pulls up and goes back the way it came
      if (this.y < s.viewTop - 30) this.destroy();
    }
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

  destroy(fromScene) {
    if (this.canopy) this.canopy.destroy();
    if (this.warnLine) this.warnLine.destroy();
    super.destroy(fromScene);
  }
}
