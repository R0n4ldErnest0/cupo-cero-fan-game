// The town and the honest police help all through the final mission (section `town`). `town: true` is
// { cops: true, supplies: true }; otherwise any of:
//   cops      the honest cops you freed come back to fight with you (2 + one per CFG.TOWN.FREED_PER_ALLY freed, max
//             CFG.TOWN.MAX_ALLIES). One who gets hurt pulls back, and another runs in from the left a few seconds later.
//   tanks: n  the honest police's tanquetas roll with you (PoliceTank 'ally'); one that pulls back to repair comes back.
//   heli      the honest police's helicopter crosses now and then dropping bombs on the enemies (AllyHeli 'bomber').
//   escort    in the air level: the helicopter flies with you and shoots (AllyHeli 'escort').
//   supplies  neighbors throw crates of ammo and food from their balconies, more often the more clues the expediente
//             has (the more proof went out, the more people help).
//   intro     show the "¡EL PUEBLO TE APOYA!" banner.
class Town {
  constructor(scene, def) {
    this.scene = scene;
    this.def = def === true ? { cops: true, supplies: true } : def;
    const T = CFG.TOWN, run = Session.run || {};
    const freed = run.freed || 0, clues = (run.clues || []).length;
    this.allyCount = this.def.cops ? Math.min(T.MAX_ALLIES, 2 + Math.floor(freed / T.FREED_PER_ALLY)) : 0;
    this.tankCount = this.def.tanks || 0;
    this.supplyMs = Math.max(T.SUPPLY_MIN_MS, T.SUPPLY_MS - clues * T.SUPPLY_PER_CLUE);
    this.nextSupply = scene.time.now + 3000;
    this.nextCop = 0;
    this.nextTank = 0;
    this.nextHeli = scene.time.now + T.HELI_FIRST_MS;
    this.allies = scene.physics.add.group();
    this.helis = [];
    const start = scene.players.find((p) => p.state === 'play') || scene.players[0];
    for (let i = 0; i < this.allyCount; i++) this.allies.add(new Ally(scene, start.x - 40 - i * 22, start.y - 30, i));
    for (let i = 0; i < this.tankCount; i++) this.allies.add(new PoliceTank(scene, start.x + 50 + i * 40, start.y - 10, 'ally', i));
    if (this.def.escort) this.helis.push(new AllyHeli(scene, 'escort'));
    if (this.def.intro) {
      scene.time.delayedCall(800, () => scene.message('¡EL PUEBLO TE APOYA!', `${this.allyCount} policías honestos · ${clues} pistas`, 2200));
    }
  }

  // Called once the scene's colliders exist.
  setupCollisions(solids) {
    const s = this.scene, P = s.physics.add;
    P.collider(this.allies, solids);
    P.overlap(this.allies, s.eBullets, (a, b) => {
      if (a.leaving || !b.active) return;
      b.destroy();
      a.hurt();
    });
  }

  update(time, dt) {
    const s = this.scene, T = CFG.TOWN;
    const list = this.allies.getChildren().slice();
    list.forEach((a) => a.active && a.update(time, dt));
    this.helis = this.helis.filter((h) => h.active);
    this.helis.forEach((h) => h.update(time, dt));
    if (s.finished) return;
    // Reinforcements: keep the squad full, one at a time from the left edge. The first tick a member is missing only
    // starts the timer; the replacement comes in on the next one.
    const standing = (cls) => list.filter((a) => a.active && !a.leaving && a instanceof cls);
    const cops = standing(Ally), tanks = standing(PoliceTank);
    if (cops.length < this.allyCount && time > this.nextCop) {
      this.nextCop = time + T.REINFORCE_MS;
      if (this.copDown) this.allies.add(new Ally(s, s.viewLeft - 16, this.groundY(s.viewLeft + 10), this.freeIndex(cops)));
      this.copDown = true;
    } else if (cops.length >= this.allyCount) this.copDown = false;
    if (tanks.length < this.tankCount && time > this.nextTank) {
      this.nextTank = time + T.TANK_BACK_MS;
      if (this.tankDown) this.allies.add(new PoliceTank(s, s.viewLeft - 30, this.groundY(s.viewLeft + 10), 'ally', this.freeIndex(tanks)));
      this.tankDown = true;
    } else if (tanks.length >= this.tankCount) this.tankDown = false;
    if (this.def.heli && time > this.nextHeli) {
      this.nextHeli = time + T.HELI_MS;
      this.helis.push(new AllyHeli(s, 'bomber'));
    }
    if (this.def.supplies && time > this.nextSupply) {
      this.nextSupply = time + this.supplyMs;
      const x = Phaser.Math.Between(s.viewLeft + 40, s.viewLeft + CFG.VIEW_W - 40);
      const k = s.spawnPickup(x, s.viewTop + 10, Phaser.Utils.Array.GetRandom(T.SUPPLIES));
      k.setVelocity(Phaser.Math.Between(-30, 30), -60);
    }
  }

  freeIndex(members) {
    const used = new Set(members.map((a) => a.index));
    let i = 0;
    while (used.has(i)) i++;
    return i;
  }

  groundY(x) {
    return this.scene.floorY({ x }) - 4;
  }
}
