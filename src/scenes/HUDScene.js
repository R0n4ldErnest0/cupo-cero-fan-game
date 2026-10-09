// HUD overlay at native 960x540. Reads values from the registry; listens for 'hud-message'.
class HUDScene extends Phaser.Scene {
  constructor() {
    super('HUD');
  }

  create() {
    const big = { fontFamily: FONT, fontSize: '20px', fontStyle: 'bold', color: '#ffe066', stroke: '#000000', strokeThickness: 5 };
    const small = Object.assign({}, big, { fontSize: '16px', color: '#ffffff', strokeThickness: 4 });

    this.add.text(16, 10, 'DON CHATO', big);
    this.tLives = this.add.text(16, 36, '', small);
    this.tScore = this.add.text(16, 58, '', small);
    this.tArms = this.add.text(230, 10, '', big);
    this.tBombs = this.add.text(230, 36, '', small);
    this.tCombi = this.add.text(230, 58, '', Object.assign({}, small, { color: '#9fd3f0' }));

    this.bossBar = this.add.graphics();
    this.tBoss = this.add.text(940, 10, '', Object.assign({}, small, { fontSize: '14px' })).setOrigin(1, 0);

    this.msg = this.add.text(480, 200, '', Object.assign({}, big, { fontSize: '48px', strokeThickness: 8, align: 'center' })).setOrigin(0.5);
    this.sub = this.add.text(480, 256, '', Object.assign({}, small, { fontSize: '22px', align: 'center', strokeThickness: 5 })).setOrigin(0.5);
    this.pauseText = this.add.text(480, 320, 'PAUSA', Object.assign({}, big, { fontSize: '36px' })).setOrigin(0.5).setVisible(false);
    this.add.text(944, 524, 'P: pausa   M: sonido', Object.assign({}, small, { fontSize: '12px', strokeThickness: 3 })).setOrigin(1, 1).setAlpha(0.7);

    const onMsg = (t, s, ms) => this.showMessage(t, s, ms);
    this.game.events.on('hud-message', onMsg);
    this.events.once('shutdown', () => this.game.events.off('hud-message', onMsg));
    this.input.keyboard.on('keydown-P', () => this.togglePause());
    this.input.keyboard.on('keydown-M', () => Sfx.toggleMute());
  }

  showMessage(title, sub, ms) {
    this.tweens.killTweensOf([this.msg, this.sub]);
    this.msg.setText(title).setAlpha(1).setScale(1.5);
    this.sub.setText(sub).setAlpha(1);
    this.tweens.add({ targets: this.msg, scale: 1, duration: 250, ease: 'Back.Out' });
    if (this.msgTimer) this.msgTimer.remove();
    this.msgTimer = this.time.delayedCall(ms, () => this.tweens.add({ targets: [this.msg, this.sub], alpha: 0, duration: 300 }));
  }

  togglePause() {
    const lvl = 'Level1';
    if (this.scene.isPaused(lvl)) {
      this.scene.resume(lvl);
      this.pauseText.setVisible(false);
      if (Sfx.ctx) Sfx.ctx.resume();
    } else if (this.scene.isActive(lvl)) {
      this.scene.pause(lvl);
      this.pauseText.setVisible(true);
      if (Sfx.ctx) Sfx.ctx.suspend();
    }
  }

  update() {
    const r = this.registry;
    this.tLives.setText(`VIDAS x${Math.max(0, r.get('lives'))}`);
    this.tScore.setText(`PUNTOS ${String(r.get('score')).padStart(7, '0')}`);
    this.tArms.setText(`ARMAS ${r.get('arms')}`);
    this.tBombs.setText(`GRANADAS ${r.get('bombs')}`);
    this.tCombi.setText(r.get('inCombi') ? `COMBI ${'■'.repeat(Math.max(0, r.get('combiHp')))}  CAÑÓN ${r.get('cannon')}` : '');

    const g = this.bossBar;
    g.clear();
    const hp = r.get('bossHp'), max = r.get('bossMax');
    if (hp > 0) {
      const w = 320, x = 940 - w, y = 34;
      g.fillStyle(0x000000, 0.8).fillRect(x - 3, y - 3, w + 6, 18);
      g.fillStyle(0xc0282e).fillRect(x, y, (w * hp) / max, 12);
      this.tBoss.setText(r.get('bossName'));
    } else this.tBoss.setText('');
  }
}
