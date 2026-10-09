// Boot (builds textures), Title and Game Over screens.

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

  create(data = {}) {
    this.add.image(480, 270, 'bg_sky').setScale(2);
    this.add.tileSprite(0, 100, 480, 150, 'bg_hills').setOrigin(0).setScale(2);
    this.add.tileSprite(0, 480 - 340, 480, 170, 'bg_city').setOrigin(0).setScale(2);
    this.add.tileSprite(0, 480, 480, 30, 'ground').setOrigin(0).setScale(2);

    this.add.image(300, 480, 'combi').setOrigin(0.5, 1).setScale(4);
    [-68, 68].forEach((dx) => this.add.image(300 + dx, 480 - 24, 'wheel').setScale(4));
    this.add.image(300 - 24, 480 - 124, 'cannon').setOrigin(0.2, 0.5).setScale(4);
    this.add.image(560, 480, 'chato_fwd_stand').setOrigin(0.5, 1).setScale(4);
    this.add.image(650, 480, 'abu_stand').setOrigin(0.5, 1).setScale(4).setFlipX(true);
    this.add.image(820, 480, 'thug_fwd_stand').setOrigin(0.5, 1).setScale(4).setFlipX(true);

    const base = { fontFamily: FONT, fontStyle: 'bold', stroke: '#000000', align: 'center' };
    this.add.text(480, 70, 'CUPO CERO', Object.assign({}, base, { fontSize: '88px', color: '#ffe066', stroke: '#a81f25', strokeThickness: 12 })).setOrigin(0.5);
    this.add.text(480, 138, 'La rebelión de la combi', Object.assign({}, base, { fontSize: '24px', color: '#ffffff', strokeThickness: 6 })).setOrigin(0.5);

    const start = this.add.text(480, 200, 'PRESIONA ENTER', Object.assign({}, base, { fontSize: '28px', color: '#ffffff', strokeThickness: 6 })).setOrigin(0.5);
    this.tweens.add({ targets: start, alpha: 0.2, yoyo: true, repeat: -1, duration: 500 });

    if (data.completed) {
      this.add.text(480, 242, `¡MISIÓN 1 CUMPLIDA!  PUNTOS: ${data.score}\nMisión 2 (el mercado): próximamente`,
        Object.assign({}, base, { fontSize: '18px', color: '#9fd36a', strokeThickness: 5 })).setOrigin(0.5);
    }

    this.add.text(480, 526, 'Sátira. Todos los personajes y organizaciones son ficticios.',
      Object.assign({}, base, { fontSize: '13px', color: '#ffffff', strokeThickness: 3 })).setOrigin(0.5, 1);

    const go = () => {
      Sfx.init();
      Sfx.horn();
      this.scene.start('Level1');
    };
    this.input.keyboard.once('keydown-ENTER', go);
    this.input.keyboard.once('keydown-SPACE', go);
    this.input.once('pointerdown', go);
  }
}

class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  create(data = {}) {
    this.cameras.main.setBackgroundColor('#120808');
    const base = { fontFamily: FONT, fontStyle: 'bold', stroke: '#000000', align: 'center' };
    this.add.text(480, 180, 'GAME OVER', Object.assign({}, base, { fontSize: '80px', color: '#d8343a', strokeThickness: 10 })).setOrigin(0.5);
    this.add.text(480, 260, 'El cupo ganó esta vez...\npero mañana hay paro.', Object.assign({}, base, { fontSize: '22px', color: '#ffffff', strokeThickness: 5 })).setOrigin(0.5);
    this.add.text(480, 330, `PUNTOS: ${data.score || 0}`, Object.assign({}, base, { fontSize: '22px', color: '#ffe066', strokeThickness: 5 })).setOrigin(0.5);
    this.add.text(480, 400, 'ENTER: reintentar     ESC: título', Object.assign({}, base, { fontSize: '18px', color: '#cccccc', strokeThickness: 4 })).setOrigin(0.5);
    this.input.keyboard.once('keydown-ENTER', () => this.scene.start('Level1'));
    this.input.keyboard.once('keydown-ESC', () => this.scene.start('Title'));
  }
}
