// The town helps (Mission 5 plaza, section `town: true`). How much depends on what you did during the game:
//   allies: the honest cops you freed come back to fight with you (1 + one per CFG.TOWN.FREED_PER_ALLY freed, max 4);
//   supplies: neighbors throw crates of ammo and food from their balconies, more often the more clues the expediente
//   has (the more proof went out on TV, the more people help).
const TOWN_SHOUTS = ['¡Para el chofer!', '¡Toma, hijito!', '¡Fuerza, causa!', '¡El pueblo no se vende!'];

class Town {
  constructor(scene) {
    this.scene = scene;
    const T = CFG.TOWN, run = Session.run || {};
    const freed = run.freed || 0, clues = (run.clues || []).length;
    this.allyCount = Math.min(T.MAX_ALLIES, 1 + Math.floor(freed / T.FREED_PER_ALLY));
    this.supplyMs = Math.max(T.SUPPLY_MIN_MS, T.SUPPLY_MS - clues * T.SUPPLY_PER_CLUE);
    this.nextSupply = scene.time.now + 3000;
    this.allies = scene.physics.add.group();
    const start = scene.players.find((p) => p.state === 'play') || scene.players[0];
    for (let i = 0; i < this.allyCount; i++) this.allies.add(new Ally(scene, start.x - 40 - i * 22, start.y - 30, i));
    scene.time.delayedCall(800, () => scene.message('¡EL PUEBLO TE APOYA!', `${this.allyCount} policías honestos · ${clues} pistas en TV`, 2600));
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
    this.allies.getChildren().slice().forEach((a) => a.active && a.update(time, dt));
    if (time > this.nextSupply && !s.finished) {
      this.nextSupply = time + this.supplyMs;
      const x = Phaser.Math.Between(s.viewLeft + 40, s.viewLeft + CFG.VIEW_W - 40);
      const k = s.spawnPickup(x, s.viewTop + 10, Phaser.Utils.Array.GetRandom(T.SUPPLIES));
      k.setVelocity(Phaser.Math.Between(-30, 30), -60);
      Fx.floatText(s, x, s.viewTop + 40, Phaser.Utils.Array.GetRandom(TOWN_SHOUTS), '#ffe066');
    }
  }
}
