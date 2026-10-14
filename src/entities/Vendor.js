// Street vendor with a food cart (our Rumi Aikawa): tosses food to a player walking by. Vendors are victims of the
// cupos, on our side: bullets and explosions go past them.
// Mission data: vendors: [{ x, y?, food }] (food = a CFG.FOOD id).
const VENDOR_LINES = ['¡Invita la casa, causa!', '¡Pa\' que tengas fuerza!', '¡Gracias por defendernos!', '¡Cómete esto, chofer!'];

class Vendor extends Phaser.GameObjects.Container {
  constructor(scene, x, y, def) {
    super(scene, x, y);
    scene.add.existing(this);
    this.food = def.food;
    this.person = scene.add.image(10, -12, 'vendor_fwd_stand').setOrigin(0.5, 1).setFlipX(true);
    this.cart = scene.add.image(0, 0, `stall_${def.food}`).setOrigin(0.5, 1);
    this.add([this.person, this.cart]);
    this.setDepth(-1);
    this.bubbleOffset = 52;
    this.left = CFG.VENDOR.TOSS;
    this.nextToss = 0;
  }

  update(time) {
    const s = this.scene, V = CFG.VENDOR;
    if (this.left <= 0 || time < this.nextToss) return;
    const p = s.players.find((pl) => pl.state === 'play' && pl.alive && !pl.vehicle && Math.abs(pl.x - this.x) < V.RANGE && Math.abs(pl.y - this.y) < 30);
    if (!p) return;
    this.left--;
    this.nextToss = time + V.COOLDOWN;
    const k = s.spawnPickup(this.x, this.y - 30, this.food);
    k.setVelocity((p.x - this.x) * 1.5, -170);
    s.tweens.add({ targets: this.person, y: -14, yoyo: true, duration: 120 });
    if (this.left === V.TOSS - 1) Fx.say(s, this, Phaser.Utils.Array.GetRandom(VENDOR_LINES), 1600);
    Sfx.throw();
  }
}
