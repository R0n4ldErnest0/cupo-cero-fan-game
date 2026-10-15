// Final boss: the mayor ("El Jefe" of the ledger), in a mech built from an obra paralizada: a concrete-mixer body on
// scaffolding legs, a crane with a wrecking ball, giant ribbon-cutting scissors and a podium where he gives his
// speech (Boss framework). To be tuned by trial and error. Attacks:
//   promesas   "PROMESA" speech bubbles that drift after you and burst
//   concrete   globs of fresh concrete: where they land, a puddle slows you down for a while
//   wrecking   the crane swings the ball across the floor (jump it)           [crane part]
//   scissors   he lunges with the ribbon-cutting scissors ("¡Inauguramos!")   [scissors part]
//   dialogo    "MESA DE DIÁLOGO": a table in front of him; while he talks he can't be hurt
class BossAlcalde extends Boss {
  constructor(scene, x, y) {
    const A = CFG.ALCALDE;
    super(scene, x, y, 'alcalde_mech', {
      name: 'EL ALCALDE',
      hp: A.HP,
      score: 20000,
      intro: 'Vecinos: esta obra la inauguro yo. Y la cierro yo. ¡Seguridad!',
      introMs: 2600,
      deathMs: 3200,
      phases: [
        { below: 1, attacks: ['promesas', 'concrete', 'wrecking'], pause: [900, 1300] },
        { below: 0.6, attacks: ['promesas', 'concrete', 'wrecking', 'scissors', 'dialogo'], pause: [800, 1100], line: '¡Instalemos una mesa de diálogo!' },
        { below: 0.3, attacks: ['promesas', 'concrete', 'wrecking', 'scissors', 'dialogo'], pause: [500, 800], speed: 1.3, line: '¡Esta obra no se para! ¡Bueno, sí se para, pero no así!' },
      ],
    });
    this.body.setSize(64, 84).setOffset(14, 12);
    this.floor = y;
    this.crane = this.addPart('crane', { dx: 40, dy: -70, hp: A.PART_HP, attacks: ['wrecking'], bonus: 12, line: '¡Mi grúa! ¡Era alquilada!' });
    this.scissorsPart = this.addPart('ribbon_scissors', { dx: -46, dy: -46, hp: A.PART_HP, attacks: ['scissors'], bonus: 12, line: '¡Ahora con qué inauguro!' });
    this.leftX = scene.arenaX + 60;
    this.rightX = scene.arenaX + CFG.VIEW_W - 60;
    this.talking = false;
    this.puddles = [];
  }

  enter() {
    this.x -= 1;
    if (this.x > this.rightX) return false;
    this.x = this.rightX;
    return true;
  }

  idle(time) {
    this.updatePuddles(time);
  }

  // Speech bubbles that drift toward the player and burst after a while (or on contact).
  attack_promesas(time) {
    const s = this.scene;
    Fx.say(s, this, Phaser.Utils.Array.GetRandom(['¡Prometo seguridad!', '¡Prometo pistas nuevas!', '¡Prometo... prometer!']), 1300);
    return this.repeat(time, this.phaseIndex > 1 ? 4 : 3, 450, () => {
      const b = s.eBombs.create(this.x + this.facing * 20, this.y - 90, 'promesa').setDepth(13);
      b.isEnemyBomb = true;
      b.body.setAllowGravity(false);
      b.step = (t) => {
        const tg = s.target(b.x, b.y);
        const a = Phaser.Math.Angle.Between(b.x, b.y, tg.x, tg.y - 12);
        s.physics.velocityFromRotation(a, CFG.ALCALDE.PROMISE_SPEED, b.body.velocity);
        if (t > b.until) s.explodeEnemyBomb(b);
      };
      b.until = s.time.now + CFG.ALCALDE.PROMISE_MS;
      Sfx.throw();
    });
  }

  // Globs of fresh concrete from the mixer: puddles that slow you down.
  attack_concrete(time) {
    const s = this.scene;
    Fx.say(s, this, '¡Concreto fresquito, para la obra!', 1200);
    return this.repeat(time, 3, 330, (i) => {
      const t = s.target(this.x, this.y);
      const b = s.enemyLob(this.x, this.y - 60, t.x + (i - 1) * 50, this.floor - 4, 'concrete', 0.9);
      b.onLand = (x) => this.addPuddle(x);
      Sfx.splash();
    }, 200, 400);
  }

  addPuddle(x) {
    const s = this.scene;
    const img = s.add.image(x, this.floor, 'concrete_puddle').setOrigin(0.5, 1).setDepth(4);
    this.puddles.push({ x, img, until: s.time.now + CFG.ALCALDE.PUDDLE_MS });
  }

  updatePuddles(time) {
    const s = this.scene;
    this.puddles = this.puddles.filter((p) => {
      if (time > p.until) { p.img.destroy(); return false; }
      s.players.forEach((pl) => {
        if (pl.state === 'play' && !pl.vehicle && Math.abs(pl.x - p.x) < 18 && pl.y >= this.floor - 2) pl.slowUntil = time + 150;
      });
      return true;
    });
  }

  // The crane swings the wrecking ball across the floor and back (jump over it).
  attack_wrecking(time) {
    const s = this.scene;
    if (!this.crane.alive) return this.repeat(time, 0, 0, () => {});
    Fx.say(s, this, '¡Demolición! ¡Digo... remodelación!', 1200);
    const ball = s.add.image(this.crane.x, this.crane.y, 'wrecking_ball').setDepth(14);
    const chain = s.add.graphics().setDepth(13);
    const far = this.facing < 0 ? this.leftX - 30 : this.rightX + 30;
    let done = false;
    s.tweens.chain({
      targets: ball,
      tweens: [
        { x: this.x + this.facing * 20, y: this.floor - 12, duration: 500 / this.sp, ease: 'Quad.In' },
        { x: far, duration: 900 / this.sp, ease: 'Sine.InOut' },
        { x: this.crane.x, y: this.crane.y, duration: 700, ease: 'Quad.Out' },
      ],
      onUpdate: () => {
        chain.clear().lineStyle(2, 0x3a3d45, 1).lineBetween(this.crane.x, this.crane.y, ball.x, ball.y);
        s.players.forEach((p) => {
          const o = p.vehicle || p;
          if (Phaser.Math.Distance.Between(ball.x, ball.y, o.x, o.y - 10) < 16) {
            if (p.vehicle) p.vehicle.damage(1);
            else if (p.canBeHit()) p.die();
          }
        });
      },
      onComplete: () => { ball.destroy(); chain.destroy(); done = true; },
    });
    Sfx.rev();
    return { step: () => done };
  }

  // Lunges forward snapping the ribbon-cutting scissors.
  attack_scissors(time) {
    const s = this.scene, start = this.x;
    Fx.say(s, this, '¡Inauguramos!', 900);
    this.charging = true;
    let done = false;
    s.tweens.add({
      targets: this, x: Phaser.Math.Clamp(start + this.facing * 120, this.leftX, this.rightX), duration: 450 / this.sp, ease: 'Quad.In', yoyo: true, hold: 200,
      onYoyo: () => { Sfx.whack(); s.cameras.main.shake(120, 0.004); },
      onComplete: () => { this.charging = false; done = true; },
    });
    return { step: () => done };
  }

  // "Mesa de diálogo": a table in front; invulnerable while he talks.
  attack_dialogo(time) {
    const s = this.scene, A = CFG.ALCALDE;
    this.talking = true;
    const table = s.add.image(this.x + this.facing * 40, this.floor, 'mesa_dialogo').setOrigin(0.5, 1).setDepth(12);
    Fx.say(s, this, 'Instalaremos una mesa de diálogo... para dialogar sobre el diálogo.', A.DIALOGO_MS);
    let done = false;
    s.time.delayedCall(A.DIALOGO_MS, () => {
      this.talking = false;
      s.tweens.add({ targets: table, alpha: 0, y: table.y + 10, duration: 300, onComplete: () => table.destroy() });
      done = true;
    });
    return { step: () => done };
  }

  hit(dmg, owner) {
    if (this.talking) {
      if (Math.random() < 0.3) Sfx.ting();
      return;
    }
    super.hit(dmg, owner);
  }

  sync(time) {
    if (this.alive && this.state !== 'enter' && !this.charging) this.facing = this.scene.target(this.x, this.y).x < this.x ? -1 : 1;
    this.setFlipX(this.facing > 0);
    this.parts.forEach((p) => p.follow());
    if (this.state === 'attack' || this.state === 'intro') this.updatePuddles(time);
  }

  removeExtras() {
    this.parts.forEach((p) => p.destroy());
    this.puddles.forEach((p) => p.img.destroy());
  }

  onDeath() {
    const s = this.scene;
    this.talking = false;
    s.time.delayedCall(600, () => Fx.say(s, this, '¡No me pueden vacar! ¡Tengo inmunidad! ¡Tengo... una mesa de diálogo!', 2600));
  }
}
