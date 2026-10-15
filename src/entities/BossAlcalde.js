// Final boss: the mayor ("El Jefe" of the ledger) in a municipal bulldozer, out to flatten the march (Boss framework).
// Police keep coming to defend him (every CFG.ALCALDE.GUARD_MS, up to MAX_GUARDS on screen). Attacks:
//   promesas   "PROMESA" speech bubbles from the megaphone that drift after you and burst   [megaphone part]
//   rubble     the blade scoops up rubble and flings it at you (three chunks; they burst where they land)
//   ram        revs up, flashing and smoking (the warning), then charges with the blade down toward you and stops
//              CFG.ALCALDE.RAM_GAP px short of the screen edge (that pocket is the safe spot); then backs up to the middle
//   dialogo    "MESA DE DIÁLOGO": a table in front of him; while he talks he can't be hurt
class BossAlcalde extends Boss {
  constructor(scene, x, y) {
    const A = CFG.ALCALDE;
    super(scene, x, y, 'alcalde_dozer', {
      name: 'EL ALCALDE',
      hp: A.HP,
      score: 20000,
      intro: 'Vecinos: esta plaza la remodelo yo. Empezando por ustedes. ¡Seguridad!',
      introMs: 2600,
      deathMs: 3200,
      phases: [
        { below: 1, attacks: ['promesas', 'rubble', 'ram'], pause: [1000, 1400] },
        { below: 0.6, attacks: ['promesas', 'rubble', 'ram', 'dialogo'], pause: [850, 1200], line: '¡Instalemos una mesa de diálogo!' },
        { below: 0.3, attacks: ['rubble', 'ram', 'promesas', 'ram', 'dialogo'], pause: [650, 950], speed: 1.2, line: '¡Esta obra no se para! ¡Bueno, sí se para, pero no así!' },
      ],
    });
    this.body.setSize(92, 56).setOffset(6, 18);
    this.floor = y;
    this.megaphone = this.addPart('megafono', { dx: 22, dy: -76, hp: A.PART_HP, attacks: ['promesas'], bonus: 12, line: '¡Mi megáfono! ¡Ahora quién me escucha!' });
    const half = 52;
    this.leftX = scene.arenaX + A.RAM_GAP + half;
    this.rightX = scene.arenaX + CFG.VIEW_W - A.RAM_GAP - half;
    this.midX = scene.arenaX + CFG.VIEW_W / 2;
    this.talking = false;
    this.nextGuard = 0;
  }

  enter() {
    this.x -= 1;
    this.rumble();
    if (this.x > this.rightX) return false;
    this.x = this.rightX;
    return true;
  }

  rumble() {
    this.y = this.floor - (Math.floor(this.scene.time.now / 90) % 2);
  }

  // Police come to defend him now and then (from both edges), while he's fighting.
  callGuards(time) {
    const s = this.scene, A = CFG.ALCALDE;
    if (!this.alive || this.state === 'enter' || this.state === 'intro' || time < this.nextGuard) return;
    this.nextGuard = time + A.GUARD_MS;
    const guards = s.enemies.getChildren().filter((e) => e.alive).length;
    if (guards >= A.MAX_GUARDS) return;
    if (Math.random() < 0.5) Fx.say(s, this, Phaser.Utils.Array.GetRandom(['¡Seguridad!', '¡Defiendan la obra!', '¡Serenazgo, a mí!']), 1000);
    const n = Math.min(2, A.MAX_GUARDS - guards);
    for (let i = 0; i < n; i++) {
      const left = (i + Math.floor(time / A.GUARD_MS)) % 2 === 0;
      const def = Phaser.Utils.Array.GetRandom([{ t: 'cop' }, { t: 'cop' }, { t: 'sere' }, { t: 'riot' }]);
      s.spawnEnemy(def, left ? s.viewLeft - 14 : s.viewLeft + CFG.VIEW_W + 14);
    }
  }

  idle() {
    this.rumble();
  }

  // Speech bubbles that drift toward the player and burst after a while (or on contact).
  attack_promesas(time) {
    const s = this.scene;
    Fx.say(s, this, Phaser.Utils.Array.GetRandom(['¡Prometo seguridad!', '¡Prometo pistas nuevas!', '¡Prometo... prometer!']), 1300);
    return this.repeat(time, this.phaseIndex > 1 ? 4 : 3, 450, () => {
      if (!this.megaphone.alive) return;
      const b = s.eBombs.create(this.megaphone.x, this.megaphone.y, 'promesa').setDepth(13);
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

  // The blade scoops rubble and flings three chunks at the player (spread out; they burst where they land).
  attack_rubble(time) {
    const s = this.scene, A = CFG.ALCALDE;
    Fx.say(s, this, Phaser.Utils.Array.GetRandom(['¡Desmonte gratis!', '¡Esto es obra pública!']), 1100);
    this.setAngle(this.facing * -3);
    return this.repeat(time, 3, 300, (i) => {
      const t = s.target(this.x, this.y);
      s.enemyLob(this.x + this.facing * 48, this.y - 36, t.x + (i - 1) * 40, this.floor - 4, 'debris', A.RUBBLE_T);
      Sfx.throw();
      if (i === 2) this.setAngle(0);
    }, 450, 300);
  }

  // Rev up (shake, flash, smoke), charge with the blade toward the player, stop short of the edge, back up.
  attack_ram(time) {
    const s = this.scene, A = CFG.ALCALDE;
    const dir = this.facing, baseX = this.x, revUntil = time + A.RAM_REV;
    const stop = dir < 0 ? this.leftX : this.rightX;
    let phase = 'rev', last = time;
    Fx.say(s, this, '¡A demoler!', 1000);
    Sfx.rev();
    this.charging = true;
    return {
      step: (t) => {
        const dt = Math.min(50, t - last) / 1000;
        last = t;
        if (phase === 'rev') {
          this.x = baseX + Math.sin(t * 0.1) * 1.5;
          this.setTint(Math.floor(t / 110) % 2 ? 0xffffff : 0xffb0b0);
          if (Math.random() < 0.35) Fx.puff(s, this.x - dir * 6, this.y - 66, 1, 0x555555);
          if (t < revUntil) return false;
          this.x = baseX;
          this.clearTint();
          phase = 'ram';
          Sfx.rev();
        }
        if (phase === 'ram') {
          this.x += dir * A.RAM_SPEED * this.sp * dt;
          this.rumble();
          if (Math.random() < 0.3) Fx.puff(s, this.x - dir * 50, this.floor - 4, 0.8, 0xb0a090);
          if ((dir < 0 && this.x > stop) || (dir > 0 && this.x < stop)) return false;
          this.x = stop;
          s.cameras.main.shake(200, 0.008);
          Sfx.explode(true);
          phase = 'back';
          this.charging = false;
        }
        // Back up to the middle of the arena (slowly, facing the same way).
        this.x += Math.sign(this.midX - this.x) * A.RAM_SPEED * 0.4 * dt;
        this.rumble();
        return Math.abs(this.midX - this.x) < 3;
      },
    };
  }

  // "Mesa de diálogo": a table in front; invulnerable while he talks.
  attack_dialogo(time) {
    const s = this.scene, A = CFG.ALCALDE;
    this.talking = true;
    const table = s.add.image(this.x + this.facing * 64, this.floor, 'mesa_dialogo').setOrigin(0.5, 1).setDepth(12);
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
    if (this.alive && this.state !== 'enter' && !this.charging && !this.talking) this.facing = this.scene.target(this.x, this.y).x < this.x ? -1 : 1;
    this.setFlipX(this.facing > 0);
    this.parts.forEach((p) => p.follow());
    this.callGuards(time);
  }

  removeExtras() {
    this.parts.forEach((p) => p.destroy());
  }

  onDeath() {
    const s = this.scene;
    this.talking = false;
    this.charging = false;
    this.clearTint();
    s.time.delayedCall(600, () => Fx.say(s, this, '¡No me pueden vacar! ¡Tengo inmunidad! ¡Tengo... una mesa de diálogo!', 2600));
  }
}
