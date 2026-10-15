// Story pages between the mission-complete banner and the tally (mission `story` data). Fire / jump / start
// shows the next page; after the last one it goes on to `next` (the tally) with `data`.
//
// Page types:
//   { type: 'ledger', title, entries: [{ text, amount, mark }], footer }
//      a page of "EL LIBRO DE CUPOS": entries appear one by one; `mark` circles one in red. '█' blocks render as a
//      censored name (black bar).
//   { type: 'talk', who, text }   a line of dialogue in a box at the bottom (over the last page shown).
//   { type: 'file', title, items: [{ text, found }] }   the expediente: clues from the honest cops, "???" if missed.
class StoryScene extends Phaser.Scene {
  constructor() {
    super('Story');
  }

  create(data) {
    this.pages = data.pages || [];
    this.next = data.next || 'MissionEnd';
    this.nextData = data.data || {};
    this.index = -1;
    this.cameras.main.setBackgroundColor('#101014');
    this.ctrls = [new Controls(this, CFG.KEYS.solo, 0), new Controls(this, CFG.KEYS.p2, 1)];
    this.layer = this.add.container(0, 0);
    this.talkBox = this.add.container(0, 0).setDepth(10);
    this.prompt = this.add.text(944, 528, 'DISPARO / ENTER: SIGUIENTE', menuStyle({ fontSize: '14px', color: '#cccccc', strokeThickness: 3 }))
      .setOrigin(1, 1).setDepth(11);
    this.readyAt = 0;
    this.advance();
  }

  advance() {
    this.index++;
    if (this.index >= this.pages.length) return this.scene.start(this.next, this.nextData);
    const page = this.pages[this.index];
    this.readyAt = this.time.now + 600;
    if (page.type === 'ledger') this.showLedger(page);
    else if (page.type === 'file') this.showFile(page);
    else this.showTalk(page);
  }

  showLedger(page) {
    this.layer.removeAll(true);
    this.talkBox.removeAll(true);
    const g = this.add.graphics();
    const x0 = 130, y0 = 40, w = 700, h = 400;
    g.fillStyle(0x5a2e1e).fillRect(x0 - 14, y0 - 14, w + 28, h + 28); // leather cover
    g.fillStyle(0xf2e8cf).fillRect(x0, y0, w, h); // paper
    g.lineStyle(1, 0xc8d8e8, 1);
    for (let y = y0 + 70; y < y0 + h - 10; y += 34) g.lineBetween(x0 + 16, y + 24, x0 + w - 16, y + 24);
    g.lineStyle(2, 0xd89090, 1).lineBetween(x0 + 60, y0, x0 + 60, y0 + h);
    this.layer.add(g);
    const ink = { fontFamily: FONT, fontSize: '18px', color: '#1b2a5a', fontStyle: 'bold' };
    this.layer.add(this.add.text(x0 + w / 2, y0 + 30, page.title, Object.assign({}, ink, { fontSize: '28px', color: '#7a1f1f' })).setOrigin(0.5));
    (page.entries || []).forEach((e, i) => {
      const y = y0 + 80 + i * 34;
      this.time.delayedCall(400 + i * 450, () => {
        if (!this.layer.active) return;
        const parts = this.censor(e.text, x0 + 72, y, ink);
        parts.forEach((o) => this.layer.add(o));
        const amt = this.add.text(x0 + w - 24, y, e.amount, ink).setOrigin(1, 0);
        this.layer.add(amt);
        Sfx.throw();
        if (e.mark) {
          const c = this.add.graphics();
          c.lineStyle(3, 0xd8343a, 1).strokeEllipse(x0 + w / 2 + 10, y + 12, w - 60, 38);
          this.layer.add(c);
          Sfx.hit();
        }
      });
    });
    if (page.footer) {
      const n = (page.entries || []).length;
      this.time.delayedCall(500 + n * 450, () => {
        if (this.layer.active) this.layer.add(this.add.text(x0 + w - 24, y0 + h - 40, page.footer, Object.assign({}, ink, { fontSize: '16px', fontStyle: 'italic' })).setOrigin(1, 0));
      });
      this.readyAt = this.time.now + 600 + n * 450;
    }
  }

  showFile(page) {
    this.layer.removeAll(true);
    this.talkBox.removeAll(true);
    const g = this.add.graphics();
    const x0 = 110, y0 = 50, w = 740, h = 390;
    g.fillStyle(0xc8a165).fillRect(x0, y0 - 18, 180, 26); // folder tab
    g.fillStyle(0xd9b878).fillRect(x0, y0, w, h);
    g.fillStyle(0xf4efe0).fillRect(x0 + 20, y0 + 56, w - 40, h - 76); // the sheet
    this.layer.add(g);
    const style = { fontFamily: FONT, fontSize: '17px', color: '#1b1b22', fontStyle: 'bold', wordWrap: { width: w - 110 } };
    this.layer.add(this.add.text(x0 + 24, y0 + 14, page.title, Object.assign({}, style, { fontSize: '24px', color: '#5b3a20' })));
    const found = page.items.filter((it) => it.found).length;
    this.layer.add(this.add.text(x0 + w - 24, y0 + 18, `PISTAS ${found}/${page.items.length}`, Object.assign({}, style, { color: '#7a1f1f' })).setOrigin(1, 0));
    page.items.forEach((it, i) => {
      const y = y0 + 76 + i * 98;
      this.time.delayedCall(300 + i * 400, () => {
        if (!this.layer.active) return;
        this.layer.add(this.add.text(x0 + 40, y, `${i + 1}.`, style));
        this.layer.add(this.add.text(x0 + 76, y, it.found ? it.text : '???  (Libera a todos los policías honestos)', Object.assign({}, style, { color: it.found ? '#1b2a5a' : '#9a9a9a' })));
        if (it.found) Sfx.throw();
      });
    });
    this.readyAt = this.time.now + 300 + page.items.length * 400;
    if (found === page.items.length) {
      this.time.delayedCall(400 + page.items.length * 400, () => {
        if (!this.layer.active) return;
        const st = this.add.text(x0 + w - 60, y0 + h - 60, 'COMPLETO', Object.assign({}, style, { fontSize: '30px', color: '#c0282e' })).setOrigin(0.5).setAngle(-12);
        this.layer.add(st);
        Sfx.hit();
      });
    }
  }

  // Text where '█' runs become black bars (a censored name).
  censor(text, x, y, style) {
    const out = [];
    let cx = x;
    for (const chunk of text.split(/(█+)/)) {
      if (!chunk) continue;
      if (chunk[0] === '█') {
        const bar = this.add.rectangle(cx, y + 2, chunk.length * 11, 18, 0x111111).setOrigin(0, 0);
        out.push(bar);
        cx += chunk.length * 11 + 4;
      } else {
        const t = this.add.text(cx, y, chunk, style);
        out.push(t);
        cx += t.width;
      }
    }
    return out;
  }

  showTalk(page) {
    this.talkBox.removeAll(true);
    const bg = this.add.rectangle(480, 470, 900, 96, 0x000000, 0.85).setStrokeStyle(2, 0xffe066);
    const who = this.add.text(50, 430, page.who, menuStyle({ fontSize: '18px', color: '#ffe066', strokeThickness: 4 }));
    const text = this.add.text(50, 456, page.text, menuStyle({ fontSize: '20px', color: '#ffffff', strokeThickness: 4, align: 'left', wordWrap: { width: 860 } }));
    this.talkBox.add([bg, who, text]);
  }

  update(time) {
    this.prompt.setAlpha(time < this.readyAt ? 0 : Math.floor(time / 400) % 2 ? 0.4 : 1);
    const pressed = this.ctrls.some((ctl) => { const c = ctl.read(); return c.startP || c.fireP || c.jumpP; });
    if (pressed && time >= this.readyAt) this.advance();
  }
}
