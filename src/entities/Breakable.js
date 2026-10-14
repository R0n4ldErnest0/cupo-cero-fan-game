// Gang property you can shoot apart (boxes of "cupo", loot bags, trash bins, barrels, parked motorbikes), like
// Metal Slug's crates and barrels: it may drop food or an item, hide a cupero, or blow up.
// Mission data: props: [{ x, y?, type, drop }] (types in CFG.PROPS; drop: item kind | 'random' | 'enemy' |
// 'prisoner' (a tied-up honest cop is inside) | 'none').
class Breakable extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, def) {
    super(scene, x, y, `prop_${def.type}`);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setOrigin(0.5, 1).setDepth(4);
    this.body.setAllowGravity(false).setImmovable(true);
    this.type = def.type;
    this.drop = def.drop || 'random';
    this.cfg = CFG.PROPS[def.type];
    this.hp = this.cfg.hp;
    this.alive = true;
  }

  // Same signature as enemies, so every weapon can hit it.
  hit(dmg, explosive, owner) {
    if (!this.alive) return;
    this.hp -= dmg;
    Fx.flash(this);
    if (this.hp <= 0) this.smash(owner);
  }

  smash(owner) {
    const s = this.scene, x = this.x, y = this.y, h = this.height;
    this.alive = false;
    s.addScore(this.cfg.score, x, y - h - 4, owner);
    for (let i = 0; i < 6; i++) {
      const d = s.add.image(x, y - h / 2, `debris${i % 3}`).setDepth(8);
      s.tweens.add({ targets: d, x: x + Phaser.Math.Between(-26, 26), y: y - h - Phaser.Math.Between(0, 20), angle: 360, duration: 220, ease: 'Quad.Out' });
      s.tweens.add({ targets: d, y: y, alpha: 0, delay: 220, duration: 380, onComplete: () => d.destroy() });
    }
    if (this.cfg.explodes) s.explodeAt(x, y - h / 2, 34, 4, true, 1.1, owner);
    else {
      Fx.puff(s, x, y - h / 2, 1.2, 0xc8b89a);
      Sfx.crunch();
    }
    let drop = this.drop;
    if (drop === 'random') drop = Phaser.Utils.Array.GetRandom(CFG.RANDOM_DROPS);
    if (drop === 'enemy') {
      const e = s.spawnEnemy({ t: 'grunt', variant: Math.random() < 0.5 ? 'knife' : 'gunner' }, x);
      e.setVelocityY(-160);
      Fx.say(s, e, '¡Sorpresa, causa!', 1200);
    } else if (drop === 'prisoner') {
      s.addPrisoner(x, y, { drop: 'random' });
    } else if (drop !== 'none') {
      const k = s.spawnPickup(x, y - h, drop);
      k.setVelocityY(-150);
    }
    this.destroy();
  }
}
