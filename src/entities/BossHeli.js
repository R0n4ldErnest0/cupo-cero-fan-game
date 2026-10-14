// Mission 3 boss: the police helicopter that came to pick up El Cobrador at the station (Boss framework).
// It hovers over the platform and drifts from side to side. Attacks: a sweeping burst from the nose gun, tear-gas
// canisters, dropping cops on a rope and (angry phase) a missile barrage from the pod. The nose gun and the missile
// pod are breakable parts: destroy them and those attacks are gone. When it goes down, El Cobrador escapes again.
class BossHeli extends Boss {
  constructor(scene, x, y) {
    const H = CFG.HELI;
    super(scene, x + 40, y - 160, 'heli', {
      name: 'HELICÓPTERO POLICIAL',
      hp: H.HP,
      score: 8000,
      intro: '¡Te dije que tenía contactos, chofer!',
      introMs: 2200,
      deathMs: 2600,
      phases: [
        { below: 1, attacks: ['spray', 'gas', 'drop'], pause: [900, 1400] },
        { below: 0.5, attacks: ['spray', 'gas', 'drop', 'missiles'], pause: [600, 1000], speed: 1.3, line: '¡Central, refuerzos! ¡Fuego a discreción!' },
      ],
    });
    this.contactKills = false;
    this.body.setSize(84, 30).setOffset(8, 4);
    this.floor = y;
    this.hoverY = y - H.HOVER;
    this.goalX = scene.arenaX + CFG.VIEW_W - 90;
    this.rotor = scene.add.image(x, y, 'heli_rotor').setDepth(10);
    // El Cobrador leans out of the side door.
    this.rider = scene.add.image(x, y, 'cobrador_fwd_stand').setOrigin(0.5, 1).setDepth(10).setCrop(0, 0, 16, 17);
    this.gun = this.addPart('heli_gun', { dx: -36, dy: -6, hp: H.PART_HP, attacks: ['spray'], bonus: 8, line: '¡Se me trabó la ametralladora!' });
    this.pod = this.addPart('heli_pod', { dx: 8, dy: -3, hp: H.PART_HP, attacks: ['missiles'], bonus: 8, line: '¡Los misiles no! ¡Eran prestados!' });
    this.sideIndex = 0;
    Sfx.rotor();
  }

  enter(time, dt) {
    const k = dt / 1000;
    this.x += (this.goalX - this.x) * Math.min(1, k * 2);
    this.y += (this.hoverY - this.y) * Math.min(1, k * 2);
    return Math.abs(this.x - this.goalX) < 2 && Math.abs(this.y - this.hoverY) < 2;
  }

  // Hover, bob and drift to the other side of the arena between attacks; the nose points at the player.
  idle(time, dt) {
    const k = dt / 1000;
    this.x += Phaser.Math.Clamp(this.goalX - this.x, -CFG.HELI.DRIFT * this.sp * k, CFG.HELI.DRIFT * this.sp * k);
    this.y = this.hoverY + Math.sin(time / 300) * 4;
  }

  rest(time, ms) {
    super.rest(time, ms);
    const A = this.scene.arenaX;
    this.sideIndex = 1 - this.sideIndex;
    this.goalX = this.sideIndex ? A + 100 : A + CFG.VIEW_W - 90;
  }

  // Nose gun: a burst that sweeps across the player.
  attack_spray(time) {
    const s = this.scene;
    return this.repeat(time, 10, 90, (i) => {
      if (!this.gun.alive) return;
      const t = s.target(this.x, this.y);
      const a = Phaser.Math.Angle.Between(this.gun.x, this.gun.y, t.x, t.y - 10) + (i - 4.5) * 0.08 * -this.facing;
      s.enemyShoot(this.gun.x, this.gun.y, a, CFG.HELI.BULLET_SPEED);
      Sfx.enemyShot();
    });
  }

  attack_gas(time) {
    const s = this.scene;
    Fx.say(s, this, '¡Gas lacrimógeno!', 1000);
    return this.repeat(time, 3, 300, (i) => {
      const t = s.target(this.x, this.y);
      s.enemyLob(this.x, this.y - 4, t.x + (i - 1) * 40, this.floor - 4, 'teargas', 0.9);
      Sfx.throw();
    });
  }

  // Come down, lower two cops on a rope, go back up. Skipped if there are already enough enemies around.
  attack_drop(time) {
    const s = this.scene, H = CFG.HELI, downY = this.floor - H.DROP_HOVER;
    let phase = 'down', at = 0, dropped = 0;
    return {
      step: (t) => {
        if (phase === 'down') {
          this.y += (downY - this.y) * 0.08;
          if (Math.abs(this.y - downY) > 2) return false;
          phase = 'drop';
          at = t;
        }
        if (phase === 'drop') {
          const alive = s.enemies.getChildren().filter((e) => e.alive).length;
          if (dropped < 2 && t >= at && alive < H.MAX_ENEMIES) {
            this.dropCop(dropped++ ? 'riot' : 'cop');
            at = t + 500;
          } else if (dropped >= 2 || alive >= H.MAX_ENEMIES) {
            phase = 'up';
          }
          return false;
        }
        this.y += (this.hoverY - this.y) * 0.08;
        return Math.abs(this.y - this.hoverY) < 2;
      },
    };
  }

  dropCop(t) {
    const s = this.scene, x = this.x + this.facing * -10;
    const e = s.spawnEnemy({ t }, x);
    e.y = this.y + 4;
    const rope = s.add.graphics().setDepth(7);
    const until = s.time.now + 600;
    const ev = s.time.addEvent({
      delay: 16, loop: true, callback: () => {
        rope.clear();
        if (s.time.now > until || !e.active) { rope.destroy(); ev.remove(); return; }
        rope.lineStyle(1, 0xc8a165, 1).lineBetween(x, this.y, e.x, e.y - 20);
      },
    });
    Fx.say(s, e, t === 'riot' ? '¡Llegó el refuerzo!' : '¡Alto ahí!', 900);
  }

  // Angry phase: missiles from the pod, aimed where the player is.
  attack_missiles(time) {
    const s = this.scene;
    Fx.say(s, this, '¡Misiles! ¡Total, los paga el Estado!', 1300);
    return this.repeat(time, 4, 260, (i) => {
      if (!this.pod.alive) return;
      const t = s.target(this.x, this.y);
      const a = Phaser.Math.Angle.Between(this.pod.x, this.pod.y, t.x, t.y - 8) + (i - 1.5) * 0.12;
      const m = s.eBombs.create(this.pod.x, this.pod.y, 'emissile').setDepth(12).setRotation(a);
      m.isEnemyBomb = true;
      m.body.setAllowGravity(false);
      s.physics.velocityFromRotation(a, CFG.HELI.MISSILE_SPEED, m.body.velocity);
      Sfx.rocket();
    }, 300, 300);
  }

  sync(time, dt) {
    const f = this.facing;
    if (this.alive && this.state !== 'enter') {
      const t = this.scene.target(this.x, this.y);
      this.facing = t.x < this.x ? -1 : 1;
    }
    this.setFlipX(f > 0);
    this.rotor.setPosition(this.x, this.y - this.height + 1).setScale(Math.abs(Math.sin(time / 30)) * 0.9 + 0.1, 1).setAngle(this.angle);
    if (this.rider.active && !this.riderFree) this.rider.setPosition(this.x + f * 3, this.y - 12).setFlipX(f > 0).setAngle(this.angle);
    this.parts.forEach((p) => p.follow());
  }

  flashExtras() {
    Fx.flash(this.rider);
  }

  removeExtras() {
    this.rotor.destroy();
    this.parts.forEach((p) => p.destroy());
  }

  // Spins down onto the platform; El Cobrador jumps out and runs off to the comisaría.
  onDeath() {
    const s = this.scene;
    Sfx.rotorStop();
    s.tweens.add({ targets: this, angle: this.facing * 25, y: this.floor - 4, duration: 1800, ease: 'Quad.In' });
    s.time.delayedCall(1900, () => this.escape());
  }

  escape() {
    const s = this.scene, r = this.rider;
    this.riderFree = true;
    r.setCrop().setFlipX(false).setDepth(11);
    r.bubbleOffset = 28;
    r.y = this.floor;
    Fx.say(s, r, '¡Me voy a la comisaría! ¡Ahí sí no me agarras!', 3200);
    let i = 0;
    const run = s.time.addEvent({ delay: 90, loop: true, callback: () => r.active && r.setTexture(`cobrador_fwd_${RUN_CYCLE[i++ % 4]}`) });
    s.tweens.add({ targets: r, x: s.viewLeft + CFG.VIEW_W + 40, duration: 1800, onComplete: () => { run.remove(); r.destroy(); } });
  }
}
