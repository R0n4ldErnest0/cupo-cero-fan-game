// On-screen controls for phones and tablets (player 1 only). An HTML overlay on top of the canvas (#touch in
// index.html): a floating joystick on the left half (move, aim up, crouch / board), JUMP / FIRE / GRENADE buttons on
// the right, and START, PAUSE and COIN at the top. Controls.read() merges this state into P1's input.
// It shows on touch screens and hides again as soon as a key is pressed on a physical keyboard.
const TouchPad = {
  enabled: false,
  held: {}, // action -> currently held
  downAt: {}, // action -> performance.now() of the last press (so taps shorter than a frame still count)

  init() {
    const root = document.getElementById('touch');
    if (!root) return;
    const touchy = navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches;
    const show = (on) => {
      this.enabled = on;
      document.body.classList.toggle('touch', on);
    };
    show(touchy);
    window.addEventListener('touchstart', () => show(true), { passive: true });
    window.addEventListener('keydown', () => show(false));

    // Buttons: hold while the finger is down.
    root.querySelectorAll('[data-action]').forEach((el) => {
      const a = el.dataset.action;
      const up = (e) => {
        if (e && e.pointerId !== undefined && el.hasPointerCapture && el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
        this.set(a, false);
        el.classList.remove('on');
      };
      el.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        this.capture(el, e.pointerId);
        this.firstTouch();
        this.set(a, true);
        el.classList.add('on');
      });
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', up);
    });
    // One-shot buttons (coin, pause).
    root.querySelectorAll('[data-tap]').forEach((el) => {
      el.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        this.firstTouch();
        this.tap(el.dataset.tap);
      });
    });
    this.joystick(root.querySelector('.stick-zone'), root.querySelector('.stick'), root.querySelector('.knob'));
  },

  // Keep getting this finger's events even if it slides off the button.
  capture(el, id) {
    try { el.setPointerCapture(id); } catch (e) { /* the pointer is already gone */ }
  },

  set(a, on) {
    if (on && !this.held[a]) this.downAt[a] = performance.now();
    this.held[a] = on;
  },

  // Floating joystick: it appears where the thumb lands; 8 directions, like the arcade lever.
  joystick(zone, base, knob) {
    if (!zone) return;
    const R = 46, DEAD = 14;
    let id = null, ox = 0, oy = 0;
    const dirs = (dx, dy) => {
      const d = Math.hypot(dx, dy);
      const out = { left: false, right: false, up: false, down: false };
      if (d >= DEAD) {
        const sector = (Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) + 8) % 8; // 0 = right, 2 = down, 4 = left, 6 = up
        out.right = sector === 7 || sector === 0 || sector === 1;
        out.down = sector >= 1 && sector <= 3;
        out.left = sector >= 3 && sector <= 5;
        out.up = sector >= 5 && sector <= 7;
      }
      Object.entries(out).forEach(([a, on]) => this.set(a, on));
    };
    const place = (x, y) => {
      const k = Math.min(1, R / (Math.hypot(x - ox, y - oy) || 1));
      knob.style.transform = `translate(${(x - ox) * k}px, ${(y - oy) * k}px)`;
    };
    zone.addEventListener('pointerdown', (e) => {
      if (id !== null) return;
      e.preventDefault();
      this.firstTouch();
      id = e.pointerId;
      this.capture(zone, id);
      ox = e.clientX;
      oy = e.clientY;
      base.style.left = `${ox}px`;
      base.style.top = `${oy}px`;
      base.classList.add('on');
      place(ox, oy);
    });
    zone.addEventListener('pointermove', (e) => {
      if (e.pointerId !== id) return;
      dirs(e.clientX - ox, e.clientY - oy);
      place(e.clientX, e.clientY);
    });
    const end = (e) => {
      if (e.pointerId !== id) return;
      id = null;
      dirs(0, 0);
      base.classList.remove('on');
    };
    zone.addEventListener('pointerup', end);
    zone.addEventListener('pointercancel', end);
  },

  tap(what) {
    if (what === 'coin') {
      Session.addCredit();
      Sfx.coin();
    } else if (what === 'pause') {
      const hud = game.scene.getScene('HUD');
      if (hud && game.scene.isActive('HUD')) hud.togglePause();
    }
  },

  // The first touch unlocks sound and asks for fullscreen in landscape (browsers that allow it).
  firstTouch() {
    Sfx.init();
    if (this.started) return;
    this.started = true;
    const el = document.documentElement;
    if (el.requestFullscreen && !document.fullscreenElement) {
      el.requestFullscreen({ navigationUI: 'hide' })
        .then(() => screen.orientation && screen.orientation.lock && screen.orientation.lock('landscape'))
        .catch(() => {});
    }
  },
};
