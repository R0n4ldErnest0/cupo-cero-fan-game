// The story intro: text scrolling up from the bottom of the screen, after character select on a new game from
// Mission 1. Fire / jump / start skips it. Then the first mission starts.
const INTRO_TEXT = [
  'PIMA. HOY.',
  '',
  'En los paraderos, en los mercados, en los colegios,',
  'nadie trabaja sin pagar.',
  'Le dicen "el cupo".',
  'El que no paga... ya sabe.',
  '',
  'Ayer mataron a Lucho,',
  'chofer de la ruta 13-B.',
  'No quiso pagar.',
  '',
  'Su compadre Pancho, chofer de combi,',
  'dijo basta:',
  '"Hoy no se paga. Hoy se cobra."',
  '',
  'El gremio de transportistas contrató a Amaru,',
  'un mercenario que no le debe nada a nadie.',
  '',
  'Don Tito, policía retirado (de los honestos),',
  'conoce a los de uniforme mejor que nadie.',
  '',
  'Y doña Inés, la de la botica de la esquina,',
  'extorsionada tres veces este mes,',
  'también se apuntó.',
  '',
  'La policía no ve nada.',
  'La municipalidad no oye nada.',
  '',
  'Ellos sí.',
].join('\n');

class IntroScene extends Phaser.Scene {
  constructor() {
    super('Intro');
  }

  create(data) {
    this.next = data;
    this.cameras.main.setBackgroundColor('#08080c');
    this.add.tileSprite(0, 540 - 340, 480, 170, 'bg_city').setOrigin(0).setScale(2).setAlpha(0.18);
    this.crawl = this.add.text(480, 560, INTRO_TEXT, menuStyle({ fontSize: '24px', color: '#ffe066', strokeThickness: 5, lineSpacing: 10 }))
      .setOrigin(0.5, 0);
    this.title = this.add.text(480, 270, 'CUPO CERO', menuStyle({ fontSize: '88px', color: '#ffe066', stroke: '#a81f25', strokeThickness: 12 }))
      .setOrigin(0.5).setAlpha(0);
    this.add.text(944, 528, 'DISPARO / ENTER: SALTAR', menuStyle({ fontSize: '13px', color: '#888888', strokeThickness: 3 })).setOrigin(1, 1);
    const dist = 560 + this.crawl.height + 40;
    this.tweens.add({
      targets: this.crawl, y: 560 - dist, duration: dist * CFG.INTRO.MS_PER_PX,
      onComplete: () => {
        this.tweens.add({ targets: this.title, alpha: 1, duration: 600 });
        this.time.delayedCall(2200, () => this.done());
      },
    });
    this.ctrls = [new Controls(this, CFG.KEYS.solo, 0), new Controls(this, CFG.KEYS.p2, 1)];
    this.leaving = false;
  }

  done() {
    if (this.leaving) return;
    this.leaving = true;
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Level', this.next));
  }

  update() {
    if (this.ctrls.some((ctl) => { const c = ctl.read(); return c.startP || c.fireP || c.jumpP; })) this.done();
  }
}
