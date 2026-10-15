// Tied-up honest cop (our Metal Slug POW): he refused to collect cupos, so his corrupt colleagues handed him to the
// gang. A shot or a touch frees him; he salutes, walks to the nearest player, hands over his item and runs off.
// Mission data: prisoners: [{ x, y?, drop, clue }] or a 'T' map marker; Breakable props can hide one (drop: 'prisoner').
// A prisoner with a `clue` (an id of the mission's `clues`) tells it when freed: it goes into the expediente.
const PRISONER_LINES = [
  '¡Gracias, colega!', 'Me amarraron por no querer cobrar cupos.', '¡Viva la policía honesta... somos tres!',
  'Mi comisario me vendió por un cupo.', '¡Yo sí tomé tu denuncia!', 'Toma, te va a servir.',
];

class Prisoner extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, def = {}) {
    super(scene, x, y, 'poli_tied');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setOrigin(0.5, 1).setDepth(5);
    this.body.setSize(10, 14).setOffset(3, 10);
    this.drop = def.drop || 'random';
    this.clue = def.clue || null;
    this.state = 'tied';
    this.facing = 1;
    this.walkT = 0;
    this.bubbleOffset = 26;
  }

  free(by) {
    if (this.state !== 'tied') return;
    const s = this.scene;
    this.state = 'thanks';
    this.rescuer = by && by.index !== undefined ? by : null;
    if (this.rescuer) this.rescuer.rescued++;
    this.setTexture('poli_salute');
    this.body.setSize(8, 20).setOffset(4, 4);
    const clue = this.clue && s.mission.clues && s.mission.clues[this.clue];
    if (clue) {
      Session.addClue(this.clue);
      Fx.say(s, this, clue, 3800);
      s.message('', '¡PISTA PARA EL EXPEDIENTE!', 1800);
    } else Fx.say(s, this, Phaser.Utils.Array.GetRandom(PRISONER_LINES), 1600);
    Sfx.pickup();
    s.time.delayedCall(700, () => {
      if (this.active && this.state === 'thanks') {
        this.state = 'walking';
        this.giveAt = s.time.now + CFG.PRISONER.GIVE_AFTER;
      }
    });
  }

  // Touching a player while walking (or waiting too long) hands the item over.
  give() {
    if (this.state !== 'walking') return;
    const s = this.scene;
    let item = this.drop;
    if (item === 'random') item = Phaser.Utils.Array.GetRandom(CFG.RANDOM_DROPS);
    this.facing = s.target(this.x, this.y).x < this.x ? -1 : 1; // hand it toward the player
    this.setFlipX(this.facing < 0);
    if (item !== 'none') s.spawnPickup(this.x + this.facing * 8, this.y - 16, item).setVelocityY(-120);
    this.state = 'leaving';
    this.setTexture('poli_salute').setVelocityX(0);
    s.time.delayedCall(500, () => this.active && (this.state = 'running'));
  }

  update(time, dt) {
    const s = this.scene, P = CFG.PRISONER;
    if (this.state === 'walking') {
      const t = s.target(this.x, this.y);
      this.facing = t.x < this.x ? -1 : 1;
      const vx = Math.abs(t.x - this.x) > 10 ? this.facing * P.WALK : 0;
      this.setVelocityX(vx);
      this.walk(dt, vx);
      if (time > this.giveAt) this.give();
    } else if (this.state === 'running') {
      this.facing = -1;
      this.setVelocityX(-P.RUN);
      this.walk(dt, -P.RUN);
      if (this.x < s.viewLeft - 30) this.destroy();
    }
  }

  walk(dt, vx) {
    this.walkT += dt;
    this.setTexture(vx ? `poli_fwd_${RUN_CYCLE[Math.floor(this.walkT / 100) % 4]}` : 'poli_fwd_stand');
    this.setFlipX(this.facing < 0);
  }
}
