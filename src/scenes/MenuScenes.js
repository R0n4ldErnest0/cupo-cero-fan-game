// Boot (builds textures), Title (1P/2P menu + stage select), Character Select, Mission End (tally),
// Ending and Game Over screens.

const MENU_TEXT = { fontFamily: FONT, fontStyle: 'bold', stroke: '#000000', align: 'center' };
const menuStyle = (extra) => Object.assign({}, MENU_TEXT, extra);

class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create() {
    Textures.build(this);
    this.scene.start('Title');
  }
}

class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  create() {
    this.add.image(480, 270, 'bg_sky').setScale(2);
    this.add.tileSprite(0, 100, 480, 150, 'bg_hills').setOrigin(0).setScale(2);
    this.add.tileSprite(0, 480 - 340, 480, 170, 'bg_city').setOrigin(0).setScale(2);
    this.add.tileSprite(0, 480, 480, 30, 'ground').setOrigin(0).setScale(2);

    this.add.image(250, 480, 'combi').setOrigin(0.5, 1).setScale(4);
    [-68, 68].forEach((dx) => this.add.image(250 + dx, 480 - 24, 'wheel').setScale(4));
    this.add.image(250 - 24, 480 - 140, 'cannon').setOrigin(0.2, 0.5).setScale(4);
    CFG.CHARACTERS.forEach((c, i) => this.add.image(470 + i * 70, 480, `${c.id}_fwd_stand`).setOrigin(0.5, 1).setScale(4));
    this.add.image(800, 480, 'abu_stand').setOrigin(0.5, 1).setScale(4).setFlipX(true);
    this.add.image(890, 480, 'thug_fwd_stand').setOrigin(0.5, 1).setScale(4).setFlipX(true);

    this.add.text(480, 66, 'CUPO CERO', menuStyle({ fontSize: '88px', color: '#ffe066', stroke: '#a81f25', strokeThickness: 12 })).setOrigin(0.5);
    this.add.text(480, 132, 'La rebelión de la combi', menuStyle({ fontSize: '24px', color: '#ffffff', strokeThickness: 6 })).setOrigin(0.5);

    this.choice = 0;
    this.items = ['1 JUGADOR', '2 JUGADORES'].map((t, i) =>
      this.add.text(480, 180 + i * 34, t, menuStyle({ fontSize: '26px', color: '#ffffff', strokeThickness: 6 })).setOrigin(0.5));
    this.notice = this.add.text(480, 252, '', menuStyle({ fontSize: '18px', color: '#ff6b6b', strokeThickness: 5 })).setOrigin(0.5);

    this.tStage = this.add.text(480, 284, '', menuStyle({ fontSize: '17px', color: '#9fd3f0', strokeThickness: 5 })).setOrigin(0.5);

    this.tCredits = this.add.text(16, 528, '', menuStyle({ fontSize: '16px', color: '#ffe066', strokeThickness: 4 })).setOrigin(0, 1);
    this.add.text(944, 528, '5: moneda   F2: free play   F3: misión (pruebas)', menuStyle({ fontSize: '13px', color: '#ffffff', strokeThickness: 3 })).setOrigin(1, 1);
    this.add.text(480, 506, 'Sátira. Todos los personajes y organizaciones son ficticios.', menuStyle({ fontSize: '13px', color: '#ffffff', strokeThickness: 3 })).setOrigin(0.5, 1);

    this.ctrl = new Controls(this, CFG.KEYS.solo, 0);
    this.twoCtrl = new Controls(this, { start: ['TWO'] });
    this.input.on('pointerdown', () => this.start(this.choice + 1));
    this.input.keyboard.addCapture('F3');
    this.input.keyboard.on('keydown-F3', () => {
      Sfx.init();
      Session.cycleStartMission();
      Sfx.jump();
    });
  }

  start(n) {
    Sfx.init();
    if (!Session.pay(n)) {
      this.notice.setColor('#ff6b6b').setText(`INSERTA ${n === 2 ? '2 MONEDAS' : 'MONEDA'} (TECLA 5)`);
      Sfx.hit();
      return;
    }
    Session.numPlayers = n;
    Sfx.horn();
    this.scene.start('CharSelect');
  }

  update(time) {
    const c = this.ctrl.read();
    if (c.upP || c.downP) this.choice = 1 - this.choice;
    if (this.twoCtrl.read().startP) this.start(2);
    else if (c.startP || c.fireP || c.jumpP) this.start(this.choice + 1);
    const blink = Math.floor(time / 450) % 2 === 0;
    this.items.forEach((t, i) => {
      t.setColor(i === this.choice ? '#ffe066' : '#bbbbbb');
      t.setText((i === this.choice && blink ? '► ' : '  ') + ['1 JUGADOR', '2 JUGADORES'][i] + '  ');
    });
    this.tCredits.setText(Session.creditText());
    const m = MISSIONS[Session.startMission];
    this.tStage.setText(Session.startMission ? `EMPEZAR EN ${m.title}: ${m.name}${m.draft ? ' (BORRADOR)' : ''}` : '');
  }
}

class CharSelectScene extends Phaser.Scene {
  constructor() {
    super('CharSelect');
  }

  create() {
    this.cameras.main.setBackgroundColor('#1a1420');
    this.add.tileSprite(0, 540 - 340, 480, 170, 'bg_city').setOrigin(0).setScale(2).setAlpha(0.25);
    this.add.text(480, 50, 'ELIGE TU PERSONAJE', menuStyle({ fontSize: '40px', color: '#ffe066', strokeThickness: 8 })).setOrigin(0.5);

    this.n = Session.numPlayers;
    this.cards = CFG.CHARACTERS.map((c, i) => {
      const x = 210 + i * 180;
      const frame = this.add.rectangle(x, 290, 160, 270, 0x000000, 0.55).setStrokeStyle(4, 0x444444);
      this.add.image(x, 300, `${c.id}_fwd_stand`).setOrigin(0.5, 1).setScale(5);
      this.add.text(x, 322, c.name, menuStyle({ fontSize: '17px', color: '#ffffff', strokeThickness: 4 })).setOrigin(0.5, 0);
      this.add.text(x, 350, c.role, menuStyle({ fontSize: '13px', color: '#cccccc', strokeThickness: 3, wordWrap: { width: 140 } })).setOrigin(0.5, 0);
      return { x, frame };
    });

    const K = CFG.KEYS;
    this.ctrls = this.n === 1 ? [new Controls(this, K.solo, 0)] : [new Controls(this, K.p1, 0), new Controls(this, K.p2, 1)];
    this.sel = this.ctrls.map((_, i) => ({ idx: i, done: false }));
    this.tags = this.sel.map((_, i) =>
      this.add.text(0, 0, '', menuStyle({ fontSize: '20px', color: i ? '#5ad1ff' : '#ffe066', strokeThickness: 5 })).setOrigin(0.5));

    const help = this.n === 1
      ? '← → elegir   ·   Z / X / ENTER confirmar'
      : '1P: A/D elegir, F confirmar   ·   2P: ← → elegir, «,» confirmar   ·   o mandos';
    this.add.text(480, 470, help, menuStyle({ fontSize: '15px', color: '#ffffff', strokeThickness: 4 })).setOrigin(0.5);
    this.add.text(480, 500, 'Todos juegan igual por ahora (como Metal Slug 1–3). Granada cancela.', menuStyle({ fontSize: '12px', color: '#999999', strokeThickness: 3 })).setOrigin(0.5);
    this.starting = false;
  }

  takenBy(i, idx) {
    return this.sel.some((s, j) => j !== i && s.done && s.idx === idx);
  }

  update(time) {
    if (this.starting) return;
    this.ctrls.forEach((ctl, i) => {
      const c = ctl.read(), s = this.sel[i];
      if (!s.done) {
        if (c.leftP) { s.idx = (s.idx + 3) % 4; Sfx.jump(); }
        if (c.rightP) { s.idx = (s.idx + 1) % 4; Sfx.jump(); }
        if (c.fireP || c.jumpP || c.startP) {
          if (this.takenBy(i, s.idx)) Sfx.hit();
          else { s.done = true; Sfx.pickup(); }
        }
      } else if (c.bombP) s.done = false;
    });

    const blink = Math.floor(time / 300) % 2 === 0;
    this.cards.forEach((card, idx) => {
      const on = this.sel.map((s, i) => (s.idx === idx ? i : -1)).filter((i) => i >= 0);
      const color = on.length === 2 ? 0xffffff : on[0] === 1 ? 0x5ad1ff : 0xffe066;
      card.frame.setStrokeStyle(on.length ? 6 : 3, on.length ? color : 0x444444);
    });
    this.sel.forEach((s, i) => {
      const card = this.cards[s.idx];
      this.tags[i].setPosition(card.x + (this.n === 2 ? (i ? 40 : -40) : 0), 130)
        .setText(s.done ? `${i + 1}P ✓` : `${i + 1}P`).setAlpha(s.done || blink ? 1 : 0.4);
    });

    if (this.sel.every((s) => s.done)) {
      this.starting = true;
      Session.chars = this.sel.map((s) => CFG.CHARACTERS[s.idx].id);
      Session.newRun();
      Sfx.horn();
      const start = { mission: Session.startMission, section: Session.startSection };
      // A new game from the very start shows the story intro first.
      const intro = start.mission === 0 && start.section === 0;
      this.time.delayedCall(700, () => this.scene.start(intro ? 'Intro' : 'Level', start));
    }
  }
}

// Between missions: score tally and what comes next. Lives, scores and characters carry over.
class MissionEndScene extends Phaser.Scene {
  constructor() {
    super('MissionEnd');
  }

  create(data = {}) {
    this.index = data.mission || 0;
    const done = MISSIONS[this.index], next = MISSIONS[this.index + 1];
    this.cameras.main.setBackgroundColor('#101820');
    this.add.tileSprite(0, 540 - 340, 480, 170, 'bg_city').setOrigin(0).setScale(2).setAlpha(0.25);
    this.add.text(480, 90, `${done.title} COMPLETE`, menuStyle({ fontSize: '52px', color: '#ffe066', strokeThickness: 9 })).setOrigin(0.5);
    this.add.text(480, 140, done.name, menuStyle({ fontSize: '22px', color: '#ffffff', strokeThickness: 5 })).setOrigin(0.5);
    const scores = (data.scores || []).map((p) => `${p.index + 1}P ${p.name}   ${String(p.score).padStart(7, '0')}\n` +
      `POLICÍAS HONESTOS RESCATADOS x${p.rescued || 0}  +${p.bonus || 0}`).join('\n');
    this.add.text(480, 236, scores, menuStyle({ fontSize: '22px', color: '#ffffff', strokeThickness: 5, lineSpacing: 6 })).setOrigin(0.5);
    if (next) {
      this.add.text(480, 330, 'SIGUIENTE', menuStyle({ fontSize: '18px', color: '#9fd3f0', strokeThickness: 4 })).setOrigin(0.5);
      this.add.text(480, 364, `${next.title}: ${next.subtitle}${next.draft ? ' (BORRADOR)' : ''}`,
        menuStyle({ fontSize: '24px', color: '#ffe066', strokeThickness: 5 })).setOrigin(0.5);
    }
    this.prompt = this.add.text(480, 450, 'DISPARO / ENTER: CONTINUAR', menuStyle({ fontSize: '18px', color: '#cccccc', strokeThickness: 4 })).setOrigin(0.5);
    this.ctrls = [new Controls(this, CFG.KEYS.solo, 0), new Controls(this, CFG.KEYS.p2, 1)];
    this.leaving = false;
    this.time.delayedCall(8000, () => this.next());
  }

  next() {
    if (this.leaving) return;
    this.leaving = true;
    Sfx.horn();
    if (MISSIONS[this.index + 1]) this.scene.start('Level', { mission: this.index + 1 });
    else this.scene.start('Ending', { scores: (Session.run.players || []).map((p, i) => ({ index: i, char: p.char, score: p.score })) });
  }

  update(time) {
    this.prompt.setAlpha(Math.floor(time / 400) % 2 ? 0.4 : 1);
    if (this.ctrls.some((ctl) => { const c = ctl.read(); return c.startP || c.fireP || c.jumpP; })) this.next();
  }
}

// Placeholder ending until Mission 5 and the final cutscene exist.
class EndingScene extends Phaser.Scene {
  constructor() {
    super('Ending');
  }

  create(data = {}) {
    this.cameras.main.setBackgroundColor('#0c0c14');
    this.add.text(480, 140, 'CONTINUARÁ...', menuStyle({ fontSize: '64px', color: '#ffe066', strokeThickness: 9 })).setOrigin(0.5);
    this.add.text(480, 220, `Jugaste todas las misiones disponibles (${MISSIONS.length} de 5).\nLa ruta, la comisaría y la municipalidad te esperan.`,
      menuStyle({ fontSize: '20px', color: '#ffffff', strokeThickness: 5 })).setOrigin(0.5);
    const scores = (data.scores || []).filter((p) => p.score > 0)
      .map((p) => `${p.index + 1}P ${CFG.CHARACTERS.find((c) => c.id === p.char).name}   ${p.score}`).join('\n');
    this.add.text(480, 330, scores, menuStyle({ fontSize: '22px', color: '#ffe066', strokeThickness: 5 })).setOrigin(0.5);
    this.add.text(480, 440, 'ENTER: volver al título', menuStyle({ fontSize: '18px', color: '#cccccc', strokeThickness: 4 })).setOrigin(0.5);
    this.ctrl = new Controls(this, CFG.KEYS.solo, 0);
    Session.run = null;
  }

  update() {
    const c = this.ctrl.read();
    if (c.startP || c.fireP || c.jumpP) this.scene.start('Title');
  }
}

class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  create(data = {}) {
    this.cameras.main.setBackgroundColor('#120808');
    this.add.text(480, 170, 'GAME OVER', menuStyle({ fontSize: '80px', color: '#d8343a', strokeThickness: 10 })).setOrigin(0.5);
    this.add.text(480, 250, 'El cupo ganó esta vez...\npero mañana hay paro.', menuStyle({ fontSize: '22px', color: '#ffffff', strokeThickness: 5 })).setOrigin(0.5);
    const scores = (data.scores || []).map((p) => `${p.index + 1}P ${p.name}: ${p.score}`).join('\n');
    this.add.text(480, 330, scores, menuStyle({ fontSize: '20px', color: '#ffe066', strokeThickness: 5 })).setOrigin(0.5);
    this.add.text(480, 420, 'ENTER: volver al título', menuStyle({ fontSize: '18px', color: '#cccccc', strokeThickness: 4 })).setOrigin(0.5);
    this.ctrl = new Controls(this, CFG.KEYS.solo, 0);
  }

  update() {
    const c = this.ctrl.read();
    if (c.startP || c.fireP || c.jumpP) this.scene.start('Title');
  }
}
