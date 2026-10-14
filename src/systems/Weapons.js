// Gun behaviors, melee and player projectiles. Tuning lives in CFG.WEAPONS / CFG.MOLOTOV / CFG.MELEE.
//
// Projectiles that fly straight are in scene.pBullets (stopped by walls, hit on overlap). Projectiles that
// touch the ground (grenades, stones, rockets, roosters, balls) are in scene.pBombs and are handled by kind in
// PROJECTILES below: ground(scene, b) runs on landing (default: burst), burst(scene, b) is the impact.
// Anything with a step(time, dt) method is updated every frame by LevelScene.

// Crate letter -> weapon id ('H' -> 'mg').
const WEAPON_BY_LETTER = {};
Object.entries(CFG.WEAPONS).forEach(([id, w]) => { if (w.letter) WEAPON_BY_LETTER[w.letter] = id; });

const FIREWORK_COLORS = [0xff3fa4, 0xffe600, 0x3cff6a, 0x5ad1ff, 0xff7a00];

const Weapons = {
  // Gun position and angle for the player's current aim.
  muzzle(p) {
    if (p.aim === 'up') return { x: p.x + p.facing * 4, y: p.y - 26, angle: -Math.PI / 2 };
    if (p.aim === 'down') return { x: p.x, y: p.y - 2, angle: Math.PI / 2 };
    return { x: p.x + p.facing * 9, y: p.y - (p.crouching ? 6 : 13), angle: p.facing > 0 ? 0 : Math.PI };
  },

  fire(p, id, time) {
    const w = CFG.WEAPONS[id], m = this.muzzle(p);
    this.FIRE[id].call(this, p.scene, p, w, m, time);
  },

  FIRE: {
    pistol(s, p, w, m) {
      s.firePlayerBullet(m.x, m.y, m.angle, w.speed, w.damage, w.tex, p);
      Fx.spark(s, m.x, m.y);
      Sfx.shoot();
    },

    mg(s, p, w, m) {
      const a = m.angle + Phaser.Math.FloatBetween(-w.spread, w.spread);
      s.firePlayerBullet(m.x, m.y, a, w.speed, w.damage, w.tex, p);
      Fx.spark(s, m.x, m.y);
      Sfx.mg();
    },

    // New Year's firework rocket: flies straight for a moment, then homes in on the nearest enemy.
    rocket(s, p, w, m, time) {
      const r = s.pBombs.create(m.x, m.y, 'rocket').setDepth(12).setRotation(m.angle);
      r.kind = 'rocket';
      r.owner = p;
      r.body.setAllowGravity(false);
      r.body.setSize(6, 6);
      s.physics.velocityFromRotation(m.angle, w.speed, r.body.velocity);
      r.homeAt = time + 140;
      r.nextTrail = 0;
      r.step = (t, dt) => {
        Weapons.home(r, w, t, dt);
        if (t > r.nextTrail) {
          r.nextTrail = t + 35;
          Fx.trail(s, r.x - Math.cos(r.rotation) * 4, r.y - Math.sin(r.rotation) * 4, Phaser.Utils.Array.GetRandom(FIREWORK_COLORS));
        }
      };
      Sfx.rocket();
    },

    // Street-grill flamethrower: a short-range fireball that goes through enemies and leaves them charred.
    flame(s, p, w, m, time) {
      const b = s.firePlayerBullet(m.x, m.y, m.angle, w.speed, w.damage, 'flame', p);
      b.pierce = true;
      b.how = 'fire';
      b.body.setSize(10, 10);
      const born = time;
      b.step = (t) => {
        const k = (t - born) / w.life;
        if (k >= 1) return b.destroy();
        b.setScale(1 + k * 1.6).setAlpha(1 - k * 0.6); // the body grows with the scale
      };
      Sfx.flame();
    },

    // Wide short blast: everything in a cone in front takes a hit.
    shotgun(s, p, w, m) {
      const blast = s.add.image(m.x, m.y, 'blast').setOrigin(0, 0.5).setRotation(m.angle).setDepth(12);
      s.tweens.add({ targets: blast, alpha: 0, scaleX: 1.3, duration: w.life, onComplete: () => blast.destroy() });
      const range = w.speed * (w.life / 1000) + 40;
      const hit = new Set();
      this.targets(s).forEach((t) => {
        const r = t.getBounds();
        for (const da of [-0.4, -0.2, 0, 0.2, 0.4]) {
          for (let d = 6; d <= range && !hit.has(t); d += 8) {
            const x = m.x + Math.cos(m.angle + da) * d, y = m.y + Math.sin(m.angle + da) * d;
            if (s.terrain.isSolid(x, y)) break;
            if (r.contains(x, y)) hit.add(t);
          }
        }
      });
      hit.forEach((t) => s.hitTarget(t, w.damage, true, p));
      s.cameras.main.shake(70, 0.003);
      Sfx.shotgun();
    },

    // Fighting rooster: runs along the floor, leaps at the first enemy ahead and bursts in feathers.
    rooster(s, p, w, m, time) {
      const r = s.pBombs.create(p.x + p.facing * 8, p.y - 8, 'rooster0').setDepth(11).setFlipX(p.facing < 0);
      r.kind = 'rooster';
      r.owner = p;
      r.facing = p.facing;
      r.body.setSize(10, 10).setOffset(3, 4);
      r.setVelocity(p.facing * w.speed, p.aim === 'down' ? 60 : -80);
      const born = time;
      r.step = (t) => {
        const b = r.body;
        const grounded = b.blocked.down || r.onSlope;
        if (t - born > w.life || b.blocked.left || b.blocked.right) return Weapons.roosterFlyAway(s, r);
        r.setTexture(grounded && Math.floor(t / 70) % 2 ? 'rooster1' : 'rooster0');
        if (!grounded || r.leaping) return;
        r.setVelocityX(r.facing * w.speed);
        const e = Weapons.targets(s).find((o) => {
          const dx = (o.x - r.x) * r.facing;
          return dx > 0 && dx < 46 && Math.abs(o.y - r.y) < 30;
        });
        if (e) {
          r.leaping = true;
          r.setVelocity(r.facing * w.speed * 1.2, -170);
          Sfx.rooster();
        }
      };
      Sfx.rooster();
    },

    // Fulbito ball: hops along the floor and over small obstacles.
    ball(s, p, w, m, time) {
      const b = s.pBombs.create(m.x, m.y, 'ball').setDepth(12);
      b.kind = 'ball';
      b.owner = p;
      b.hop = w.hop;
      const vy = p.aim === 'up' ? -320 : p.aim === 'down' ? 120 : -120;
      b.setVelocity(p.aim === 'fwd' ? p.facing * w.speed : p.facing * 40, vy).setAngularVelocity(p.facing * 600);
      b.vx = b.body.velocity.x;
      const born = time;
      b.step = (t) => {
        if (t - born > w.life || b.body.blocked.left || b.body.blocked.right) return s.detonate(b);
        b.body.velocity.x = b.vx;
      };
      Sfx.kick();
    },

    // Delivery drone: small and fast, chases enemies.
    drone(s, p, w, m, time) {
      const d = s.firePlayerBullet(m.x, m.y, m.angle, w.speed, w.damage, 'drone', p);
      d.setRotation(0).setFlipX(Math.cos(m.angle) < -0.1);
      d.homeAt = time + 60;
      d.step = (t, dt) => {
        Weapons.home(d, w, t, dt);
        d.setRotation(0).setFlipX(d.body.velocity.x < 0);
        d.y += Math.sin(t / 40) * 0.4;
      };
      Sfx.drone();
    },

    // Laser pointer: a beam that cuts through every enemy in the line, up to a wall.
    laser(s, p, w, m, time) {
      const line = this.beamLine(p, w);
      this.targets(s).forEach((t) => {
        if (Phaser.Geom.Intersects.LineToRectangle(line, t.getBounds())) s.hitTarget(t, w.damage, false, p, 'laser');
      });
      p.beamUntil = time + w.delay + 30;
      Sfx.laser();
    },
  },

  // Everything a weapon can hurt right now: live enemies and the boss.
  targets(s) {
    const list = s.enemies.getChildren().filter((e) => e.alive);
    if (s.boss && s.boss.alive && s.boss.state !== 'enter') list.push(s.boss);
    return list;
  },

  // Steer toward the nearest enemy and speed up (rockets, drones).
  home(b, w, time, dt) {
    if (!b.active) return;
    const v = b.body.velocity;
    let a = Math.atan2(v.y, v.x);
    const t = time > b.homeAt && b.scene.nearestEnemy(b.x, b.y, 400);
    if (t) a = Phaser.Math.Angle.RotateTo(a, Math.atan2(t.y - b.y, t.x - b.x), (w.turn * dt) / 1000);
    const speed = Math.min(w.maxSpeed, Math.hypot(v.x, v.y) + (300 * dt) / 1000);
    b.scene.physics.velocityFromRotation(a, speed, v);
    b.setRotation(a);
  },

  // ---------- laser beam ----------

  beamLine(p, w = CFG.WEAPONS.laser) {
    const s = p.scene, m = this.muzzle(p);
    const dx = Math.cos(m.angle), dy = Math.sin(m.angle);
    let len = 0;
    while (len < w.range && !s.terrain.isSolid(m.x + dx * len, m.y + dy * len) && s.inView(m.x + dx * len, m.y + dy * len, 4)) len += 4;
    return new Phaser.Geom.Line(m.x, m.y, m.x + dx * len, m.y + dy * len);
  },

  // Redrawn every frame from the current muzzle while the trigger keeps the beam alive.
  updateBeam(p, time) {
    if (!(p.beamUntil > time) || !p.alive || p.vehicle) return this.clearBeam(p);
    const g = p.beam || (p.beam = p.scene.add.graphics().setDepth(12));
    const L = this.beamLine(p);
    const flick = Math.floor(time / 40) % 2;
    g.clear();
    g.lineStyle(5, 0x3cff6a, flick ? 0.35 : 0.25).lineBetween(L.x1, L.y1, L.x2, L.y2);
    g.lineStyle(2, 0x9dff9d, 0.9).lineBetween(L.x1, L.y1, L.x2, L.y2);
    g.lineStyle(1, 0xffffff, 1).lineBetween(L.x1, L.y1, L.x2, L.y2);
    g.fillStyle(0xeaffea, 1).fillCircle(L.x2, L.y2, flick ? 3 : 2);
  },

  clearBeam(p) {
    if (p.beam) p.beam.clear();
  },

  // ---------- melee ----------

  melee(p, foe) {
    const s = p.scene, C = CFG.MELEE;
    s.hitTarget(foe, C.DAMAGE, false, p, 'melee');
    const f = p.facing;
    const tool = s.add.image(p.x + f * 4, p.y - 14, p.info.melee).setOrigin(0, 0.5).setDepth(11).setFlipX(f < 0);
    if (f < 0) tool.setOrigin(1, 0.5);
    tool.setRotation(-1.4 * f);
    s.tweens.add({ targets: tool, rotation: 0.7 * f, duration: 110, onComplete: () => tool.destroy() });
    Fx.spark(s, p.x + f * 16, p.y - 12);
    Sfx.whack();
  },

  // ---------- projectile kinds (pBombs) ----------

  PROJECTILES: {
    grenade: {
      ground: (s, b) => { if (++b.bounces >= 2) s.detonate(b); },
      burst: (s, b) => s.explodeAt(b.x, b.y, CFG.GRENADE.radius, CFG.GRENADE.damage, true, 1, b.owner),
    },
    super: {
      ground: (s, b) => { if (++b.bounces >= 2) s.detonate(b); },
      burst: (s, b) => {
        const S = CFG.SUPER_GRENADE;
        s.explodeAt(b.x, b.y, S.radius, S.damage, true, 2.6, b.owner);
        for (let i = 0; i < 8; i++) {
          const a = (i / 8) * Math.PI * 2;
          s.time.delayedCall(60 + i * 40, () => Fx.boom(s, b.x + Math.cos(a) * 50, b.y - 20 + Math.sin(a) * 30, 1.2));
        }
        s.cameras.main.flash(250, 255, 255, 230);
        s.cameras.main.shake(400, 0.012);
      },
    },
    molotov: {
      burst: (s, b) => {
        const M = CFG.MOLOTOV;
        Fx.boom(s, b.x, b.y, 0.6);
        Sfx.flame();
        s.damageEnemiesInRadius(b.x, b.y, M.radius, M.damage, false, b.owner, 'fire');
        Weapons.addFire(s, b.x, b.y, b.owner);
      },
    },
    shell: { burst: (s, b) => s.explodeAt(b.x, b.y, CFG.COMBI.CANNON_RADIUS, CFG.COMBI.CANNON_DAMAGE, true, 1.1, b.owner) },
    cup: {
      burst: (s, b) => {
        Fx.splash(s, b.x, b.y);
        Sfx.splash();
        s.damageEnemiesInRadius(b.x, b.y, CFG.ABUELITA.SPLASH, CFG.ABUELITA.DAMAGE, false, b.owner);
      },
    },
    rocket: {
      burst: (s, b) => {
        const w = CFG.WEAPONS.rocket;
        Fx.firework(s, b.x, b.y);
        Sfx.firework();
        s.damageEnemiesInRadius(b.x, b.y, w.radius, w.damage, true, b.owner);
      },
    },
    rooster: {
      ground: () => {}, // it runs; the overlap with an enemy is what makes it burst
      slope: () => {},
      burst: (s, b) => {
        const w = CFG.WEAPONS.rooster;
        Fx.feathers(s, b.x, b.y - 6);
        Sfx.feathers();
        s.damageEnemiesInRadius(b.x, b.y - 6, w.radius, w.damage, false, b.owner);
        Weapons.roosterFlyAway(s, b);
      },
    },
    ball: {
      ground: (s, b) => { b.body.velocity.y = -b.hop; },
      slope: (s, b) => { b.y -= 3; b.body.velocity.y = -b.hop; },
      burst: (s, b) => {
        Fx.puff(s, b.x, b.y, 0.7);
        s.damageEnemiesInRadius(b.x, b.y, 6, CFG.WEAPONS.ball.damage, false, b.owner);
      },
    },
    stone: {
      burst: (s, b) => {
        Fx.spark(s, b.x, b.y);
        s.damageEnemiesInRadius(b.x, b.y, 4, CFG.STONE.damage, false, b.owner);
      },
    },
  },

  // The rooster is never hurt: after its attack (or when it gets bored) it flaps away crowing.
  roosterFlyAway(s, r) {
    if (!r.active) return;
    const { x, y } = r, f = r.facing;
    r.destroy();
    const bird = s.add.image(x, y, 'rooster0').setOrigin(0.5, 1).setFlipX(f < 0).setDepth(11);
    bird.bubbleOffset = 14;
    if (Math.random() < 0.6) Fx.say(s, bird, '¡KIKIRIKÍ!', 900);
    s.tweens.add({ targets: bird, x: x + f * 60, y: y - 90, alpha: 0, duration: 900, onComplete: () => bird.destroy() });
    s.tweens.add({ targets: bird, angle: -20 * f, yoyo: true, repeat: 4, duration: 90 });
  },

  // ---------- molotov fire on the ground ----------

  addFire(s, x, y, owner) {
    const M = CFG.MOLOTOV, flames = [];
    for (let dx = -M.fireWidth / 2; dx <= M.fireWidth / 2; dx += 9) {
      // It may burst on an enemy's body: the fire drops to the floor below (not across a pit or a lower floor).
      const fy = s.terrain.surfaceBelow(x + dx, y - 10);
      if (fy === null || fy - y > 48) continue;
      flames.push(s.add.sprite(x + dx, fy, 'fire0').setOrigin(0.5, 1).setDepth(7));
    }
    s.fires.push({ x, y, owner, flames, until: s.time.now + M.fireMs, next: 0 });
  },

  updateFires(s, time) {
    const M = CFG.MOLOTOV;
    s.fires = s.fires.filter((f) => {
      if (time > f.until) {
        f.flames.forEach((fl) => s.tweens.add({ targets: fl, alpha: 0, scaleY: 0.3, duration: 200, onComplete: () => fl.destroy() }));
        return false;
      }
      f.flames.forEach((fl, i) => fl.setTexture((Math.floor(time / 90) + i) % 2 ? 'fire1' : 'fire0'));
      if (time > f.next) {
        f.next = time + M.fireTick;
        // Each enemy standing in the patch takes one hit per tick, however many flames touch it.
        this.targets(s).forEach((t) => {
          const r = t.getBounds();
          if (f.flames.some((fl) => r.contains(fl.x, fl.y - 4) || r.contains(fl.x, fl.y - 10))) s.hitTarget(t, M.fireDamage, false, f.owner, 'fire');
        });
      }
      return true;
    });
  },
};
