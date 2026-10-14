// HUD overlay at native 960x540: P1 top-left, P2 top-right, boss bar bottom, credits bottom-left.
class HUDScene extends Phaser.Scene {
  constructor() {
    super('HUD');
  }

  create() {
    this.level = this.scene.get('Level');
    const big = { fontFamily: FONT, fontSize: '20px', fontStyle: 'bold', color: '#ffe066', stroke: '#000000', strokeThickness: 5 };
    const small = Object.assign({}, big, { fontSize: '15px', color: '#ffffff', strokeThickness: 4 });

    this.slots = [0, 1].map((i) => {
      const x = i ? 944 : 16, ox = i ? 1 : 0;
      const mk = (y, st) => this.add.text(x, y, '', st).setOrigin(ox, 0);
      return {
        name: mk(8, big),
        l1: mk(34, small),
        l2: mk(54, small),
        l3: mk(74, Object.assign({}, small, { color: '#9fd3f0' })),
      };
    });

    this.bossBar = this.add.graphics();
    this.tBoss = this.add.text(480, 474, '', Object.assign({}, small, { fontSize: '14px' })).setOrigin(0.5, 1);
    this.tCredits = this.add.text(16, 528, '', Object.assign({}, small, { fontSize: '14px', color: '#ffe066' })).setOrigin(0, 1);
    this.add.text(944, 528, 'P pausa · M sonido · 5 moneda · F2 free play', Object.assign({}, small, { fontSize: '12px', strokeThickness: 3 }))
      .setOrigin(1, 1).setAlpha(0.7);

    this.msg = this.add.text(480, 300, '', Object.assign({}, big, { fontSize: '48px', strokeThickness: 8, align: 'center' })).setOrigin(0.5);
    this.sub = this.add.text(480, 354, '', Object.assign({}, small, { fontSize: '22px', align: 'center', strokeThickness: 5 })).setOrigin(0.5);
    this.pauseText = this.add.text(480, 410, 'PAUSA', Object.assign({}, big, { fontSize: '36px' })).setOrigin(0.5).setVisible(false);

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
    const lvl = 'Level';
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

  update(time) {
    const lv = this.level;
    // During a restart (new section) the old players are already destroyed for a frame.
    if (!lv || !lv.players || lv.players.some((p) => !p.scene)) return;
    lv.players.forEach((p, i) => this.drawSlot(this.slots[i], p, i, time));
    this.tCredits.setText(Session.creditText());

    const g = this.bossBar;
    g.clear();
    const hp = this.registry.get('bossHp'), max = this.registry.get('bossMax');
    if (hp > 0) {
      const w = 360, x = 480 - w / 2, y = 480;
      g.fillStyle(0x000000, 0.8).fillRect(x - 3, y - 3, w + 6, 18);
      g.fillStyle(0xc0282e).fillRect(x, y, (w * hp) / max, 12);
      this.tBoss.setText(this.registry.get('bossName'));
    } else this.tBoss.setText('');
  }

  drawSlot(s, p, i, time) {
    const blink = Math.floor(time / 400) % 2 === 0;
    const color = i ? '#5ad1ff' : '#ffe066';
    const startKey = i ? '2' : Session.numPlayers === 1 ? 'ENTER' : '1';
    const set = (a, b, c, d) => { s.name.setText(a); s.l1.setText(b); s.l2.setText(c); s.l3.setText(d); };

    if (p.state === 'play') {
      s.name.setColor(color);
      const v = p.vehicle;
      set(
        `${i + 1}P ${p.info.name}`,
        `VIDAS x${p.lives}   ${String(p.score).padStart(7, '0')}`,
        `${CFG.WEAPONS[p.weapon].name} ${p.ammo === Infinity ? '∞' : p.ammo}   ${CFG.THROW_TYPES[p.bombType].name} ${p.bombs}${p.superBombs ? ` +${p.superBombs} SÚPER` : ''}`,
        v ? `COMBI ${'■'.repeat(Math.max(0, v.hp))}  CAÑÓN ${v.cannon}` : [p.fat && 'GORDITO', p.drunk && 'MAREADO'].filter(Boolean).join('  '),
      );
    } else if (p.state === 'continue') {
      s.name.setColor('#ff6b6b');
      const c = CFG.CHARACTERS.find((ch) => ch.id === p.pendingChar);
      const sec = Math.max(0, Math.ceil(p.countdown / 1000));
      const pay = Session.canPay(1);
      set(
        p.joining ? `${i + 1}P ¿ENTRAS? ${sec}` : `${i + 1}P ¿CONTINUAR? ${sec}`,
        `< ${c.name} >`,
        pay ? (blink ? `PRESIONA ${startKey}` : '') : 'SIN CRÉDITOS',
        pay ? '' : blink ? 'INSERTA MONEDA (5)' : '',
      );
    } else if (p.state === 'inactive') {
      s.name.setColor('#888888');
      set(`${i + 1}P`, blink ? (Session.canPay(1) ? `PRESIONA ${startKey} PARA ENTRAR` : 'INSERTA MONEDA (5)') : '', '', '');
    } else {
      s.name.setColor('#888888');
      set(`${i + 1}P GAME OVER`, String(p.score).padStart(7, '0'), '', '');
    }
  }
}
