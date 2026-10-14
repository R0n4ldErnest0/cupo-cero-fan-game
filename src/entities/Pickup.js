// Item drops. kind = a crate letter (guns: CFG.WEAPONS[].letter, throwables: CFG.THROWABLES) or a food id
// (CFG.FOOD). Crates announce their name like the arcade ("HEAVY MACHINE GUN!").
// Drawn items (Piedras, food) have no letter: a little sign bobs above them instead.
class Pickup extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, kind) {
    super(scene, x, y, `pick_${kind}`);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.kind = kind;
    this.setOrigin(0.5, 1).setDepth(5);
    const thr = CFG.THROWABLES[kind];
    if ((thr && thr.icon) || CFG.FOOD[kind]) this.sign = scene.add.image(x, y, `sign_${kind}`).setOrigin(0.5, 1).setDepth(5);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (this.sign) this.sign.setPosition(Math.round(this.x), Math.round(this.y - this.height - 3 + Math.sin(time / 220) * 2));
  }

  destroy(fromScene) {
    if (this.sign) this.sign.destroy();
    super.destroy(fromScene);
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
      const T = CFG.THROW_TYPES[p.bombType];
      name = thr.id === 'bombs' ? `${T.name} +${T.refill}` : thr.name;
      voice = thr.voice;
      id = thr.id;
    } else {
      const f = CFG.FOOD[k];
      s.addScore(f.points, this.x, this.y - 16, p);
      p.eat(k);
      name = f.name;
    }
    s.message('', lang === 'en' ? `${name}!` : `¡${name}!`, 1200);
    if (voice) Voice.say(id, voice.charAt(0) + voice.slice(1).toLowerCase(), lang);
    Sfx.pickup();
    this.destroy();
  }
}
