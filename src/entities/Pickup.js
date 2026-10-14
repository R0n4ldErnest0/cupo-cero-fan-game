// Item drops. kind = a crate letter (guns: CFG.WEAPONS[].letter, throwables: CFG.THROWABLES) or 'food'
// (pan con chicharrón, score). Crates announce their name like the arcade ("HEAVY MACHINE GUN!").
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
    const s = this.scene, k = this.kind;
    const gun = WEAPON_BY_LETTER[k], thr = CFG.THROWABLES[k];
    let name, voice, lang = 'es', id;
    if (gun) {
      const w = CFG.WEAPONS[gun];
      p.giveWeapon(gun);
      name = w.name;
      voice = w.voice || w.name;
      lang = w.lang || 'es';
      id = gun;
    } else if (thr) {
      p.giveThrowable(thr.id);
      name = thr.id === 'bombs' && p.bombType === 'molotov' ? 'MOLOTOV +10' : thr.id === 'bombs' ? 'GRANADAS +10' : thr.name;
      voice = thr.voice;
      id = thr.id;
    } else {
      s.addScore(1000, this.x, this.y - 16, p);
      name = 'PAN CON CHICHARRÓN';
    }
    s.message('', lang === 'en' ? `${name}!` : `¡${name}!`, 1200);
    if (voice) Voice.say(id, voice.charAt(0) + voice.slice(1).toLowerCase(), lang);
    Sfx.pickup();
    this.destroy();
  }
}
