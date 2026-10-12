// Item drops: H = machine gun, B = +10 grenades, food = pan con chicharrón (score).
class Pickup extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, kind) {
    super(scene, x, y, `pick_${kind}`);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.kind = kind;
    this.setOrigin(0.5, 1).setDepth(5);
  }

  collect(p) {
    if (!this.active || !p) return;
    const s = this.scene;
    if (this.kind === 'H') {
      p.setWeapon('mg');
      s.message('', '¡METRALLETA!', 1200);
    } else if (this.kind === 'B') {
      p.bombs += 10;
      s.message('', '¡GRANADAS +10!', 1200);
    } else {
      s.addScore(1000, this.x, this.y - 16, p);
      s.message('', '¡PAN CON CHICHARRÓN!', 1200);
    }
    Sfx.pickup();
    this.destroy();
  }
}
