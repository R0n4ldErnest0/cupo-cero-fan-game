// Boss framework. A boss subclass gives its data and its attacks; the base does the rest:
//   entrance -> intro line -> [pause -> attack] ... with phases by health, breakable parts and the death sequence.
// No health bar (like the arcade): the boss smokes more and more as it gets damaged.
//
// def = {
//   name, hp, score,
//   intro: 'line', introMs,
//   phases: [{ below: 1, attacks: ['a', 'b'], pause: [min, max], speed, line }, { below: 0.5, ... }]
//            (a phase starts when hp / maxHp drops to `below`; `line` is said when it starts),
//   deathMs: how long the explosions last before the section is cleared,
// }
// Subclass methods:
//   enter(time, dt)        move in; return true when in place
//   attack_<name>(time)    start an attack; return a runner { step(time, dt) -> true when finished }
//   idle(time, dt)         between attacks (hover, sway...)
//   sync(time, dt)         keep extra images (rider, wheels, rotor) in place
//   onPhase(index)         a new phase started (tint, shake...)
//   onDeath()              death extras (an escape...)
// Parts: this.addPart(texture, def) creates a BossPart with its own hp; while it stands its `attacks` can be used,
// destroying it removes them and deals `bonus` damage to the boss.
class Boss extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, def) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setOrigin(0.5, 1).setDepth(9);
    this.body.setAllowGravity(false).setImmovable(true);
    this.def = def;
    this.maxHp = def.hp;
    this.hp = def.hp;
    this.alive = true;
    this.state = 'enter';
    this.until = 0;
    this.phaseIndex = 0;
    this.lastAttack = null;
    this.runner = null;
    this.parts = [];
    this.facing = -1;
    this.bubbleOffset = 48;
    this.nextSmoke = 0;
  }

  get phase() {
    return this.def.phases[this.phaseIndex];
  }

  // Speed multiplier of the current phase (attacks use it for cadence and movement).
  get sp() {
    return this.phase.speed || 1;
  }

  addPart(texture, def) {
    const p = new BossPart(this, texture, def);
    this.parts.push(p);
    return p;
  }

  update(time, dt) {
    if (!this.alive) return this.sync(time, dt);
    const s = this.scene, D = this.def;
    if (this.state === 'enter') {
      if (this.enter(time, dt)) {
        this.state = 'intro';
        this.until = time + (D.introMs || 2000);
        if (D.intro) Fx.say(s, this, D.intro, D.introMs || 2000);
      }
    } else if (this.state === 'intro') {
      if (time > this.until) this.rest(time, 300);
    } else if (this.state === 'idle') {
      this.idle(time, dt);
      if (time > this.until) this.nextAttack(time);
    } else if (this.state === 'attack') {
      if (this.runner.step(time, dt)) this.rest(time);
    }
    this.smoke(time);
    this.sync(time, dt);
  }

  rest(time, ms) {
    const [a, b] = this.phase.pause || [800, 1200];
    this.state = 'idle';
    this.runner = null;
    this.until = time + (ms !== undefined ? ms : Phaser.Math.Between(a, b));
  }

  // An attack of the current phase whose part (if any) still stands, not the same one twice in a row.
  nextAttack(time) {
    const usable = this.phase.attacks.filter((a) => this.canUse(a));
    const opts = usable.filter((a) => a !== this.lastAttack);
    const a = Phaser.Utils.Array.GetRandom(opts.length ? opts : usable);
    if (!a) return this.rest(time);
    this.lastAttack = a;
    this.state = 'attack';
    this.runner = this[`attack_${a}`](time);
  }

  canUse(attack) {
    return !this.parts.some((p) => !p.alive && p.def.attacks && p.def.attacks.includes(attack));
  }

  // Damage feedback instead of a health bar: smoke from 60% down, thicker and darker below 30%.
  smoke(time) {
    const k = this.hp / this.maxHp;
    if (k > 0.6 || time < this.nextSmoke) return;
    this.nextSmoke = time + (k > 0.3 ? 260 : 110);
    const b = this.getBounds();
    Fx.puff(this.scene, Phaser.Math.Between(b.left + 6, b.right - 6), b.top + Phaser.Math.Between(4, b.height / 2), k > 0.3 ? 0.9 : 1.3, k > 0.3 ? 0x8a8a8a : 0x444444);
  }

  hit(dmg, owner) {
    if (!this.alive || this.state === 'enter') return;
    if (owner) this.lastHitter = owner;
    this.hp = Math.max(0, this.hp - dmg);
    Fx.flash(this);
    this.flashExtras();
    const next = this.def.phases[this.phaseIndex + 1];
    if (next && this.hp / this.maxHp <= next.below) {
      this.phaseIndex++;
      if (next.line) Fx.say(this.scene, this, next.line, 1500);
      this.scene.cameras.main.shake(200, 0.006);
      this.onPhase(this.phaseIndex);
    }
    if (this.hp <= 0) this.die();
  }

  die() {
    const s = this.scene, D = this.def, ms = D.deathMs || 2300;
    this.alive = false;
    this.state = 'dying';
    this.setVelocity(0, 0);
    s.addScore(D.score || 5000, this.x, this.y - 50, this.lastHitter);
    this.parts.forEach((p) => p.alive && p.destroyPart(false));
    const n = Math.floor(ms / 190);
    for (let i = 0; i < n; i++) {
      s.time.delayedCall(i * 170, () => {
        const b = this.getBounds();
        s.explodeAt(Phaser.Math.Between(b.left, b.right), Phaser.Math.Between(b.top, b.bottom), 0, 0, true, Phaser.Math.FloatBetween(0.6, 1.2));
      });
    }
    this.onDeath();
    s.time.delayedCall(ms, () => {
      s.explodeAt(this.x, this.y - this.height / 2, 0, 0, true, 2.2);
      this.setVisible(false);
      this.body.enable = false;
      this.removeExtras();
      s.sectionCleared(); // a mid-boss leads to the next section, the last boss ends the mission
    });
  }

  // ---------- hooks (override) ----------
  enter() { return true; }
  idle() {}
  sync() {}
  onPhase() {}
  onDeath() {}
  flashExtras() {}
  removeExtras() {}

  // ---------- helpers for attacks ----------

  // A runner that calls fn(i) `count` times, every `gap` ms (after `delay`), then waits `after` ms.
  repeat(time, count, gap, fn, delay = 200, after = 0) {
    let i = 0, next = time + delay;
    return {
      step: (t) => {
        if (i < count && t >= next) {
          fn(i++);
          next = t + gap / this.sp;
        }
        return i >= count && t >= next + after;
      },
    };
  }
}

// A breakable piece of a boss (gun pod, missile pod...). It follows the boss at (dx, dy) from the boss origin,
// mirrored with its facing. Hit like an enemy; at 0 hp it blows up and its attacks are gone.
class BossPart extends Phaser.Physics.Arcade.Sprite {
  constructor(boss, texture, def) {
    super(boss.scene, boss.x, boss.y, texture);
    boss.scene.add.existing(this);
    boss.scene.physics.add.existing(this);
    this.body.setAllowGravity(false).setImmovable(true);
    this.setDepth(boss.depth + 1);
    this.boss = boss;
    this.def = def;
    this.hp = def.hp;
    this.alive = true;
  }

  follow() {
    const b = this.boss;
    this.setPosition(b.x + this.def.dx * -b.facing, b.y + this.def.dy).setFlipX(b.facing > 0).setAngle(b.angle);
  }

  hit(dmg, explosive, owner) {
    if (!this.alive || this.boss.state === 'enter') return;
    this.hp -= dmg;
    Fx.flash(this);
    if (this.hp <= 0) this.destroyPart(true, owner);
  }

  destroyPart(bonus, owner) {
    const s = this.scene, b = this.boss;
    this.alive = false;
    s.explodeAt(this.x, this.y, 0, 0, true, 1.1);
    if (bonus && this.def.line) Fx.say(s, b, this.def.line, 1300);
    if (bonus && this.def.bonus) b.hit(this.def.bonus, owner);
    if (bonus) s.addScore(500, this.x, this.y - 10, owner);
    this.setVisible(false);
    this.body.enable = false;
  }
}
