// Visual helpers: speech bubbles, explosions, puffs, sparks, floating score text.

const Fx = {
  say(scene, target, text, ms = 1800) {
    if (target.bubble && target.bubble.active) target.bubble.destroy();
    const t = scene.add
      .text(Math.round(target.x), Math.round(target.y - (target.bubbleOffset || 28)), text, {
        fontFamily: FONT, fontSize: '8px', fontStyle: 'bold', color: '#111111', backgroundColor: '#ffffff',
        padding: { x: 3, y: 2 }, align: 'center', wordWrap: { width: 130 }, resolution: 2,
      })
      .setOrigin(0.5, 1)
      .setDepth(50);
    t.follow = target;
    t.until = scene.time.now + ms;
    target.bubble = t;
    scene.bubbles.push(t);
    return t;
  },

  updateBubbles(scene, time) {
    scene.bubbles = scene.bubbles.filter((b) => {
      if (!b.active) return false;
      if (time > b.until) { b.destroy(); return false; }
      if (b.follow && b.follow.active) b.setPosition(Math.round(b.follow.x), Math.round(b.follow.y - (b.follow.bubbleOffset || 28)));
      // Keep bubbles fully on screen
      if (scene.viewLeft !== undefined) {
        const half = b.width / 2 + 2;
        b.x = Phaser.Math.Clamp(b.x, scene.viewLeft + half, scene.viewLeft + CFG.VIEW_W - half);
        b.y = Math.max(b.y, b.height + 2);
      }
      return true;
    });
  },

  boom(scene, x, y, scale = 1) {
    const s = scene.add.sprite(x, y, 'boom0').setScale(scale).setDepth(40);
    s.play('boom');
    s.once('animationcomplete', () => s.destroy());
  },

  puff(scene, x, y, scale = 1, tint) {
    const s = scene.add.sprite(x, y, 'puff0').setScale(scale).setDepth(39);
    if (tint) s.setTint(tint);
    s.play('puff');
    scene.tweens.add({ targets: s, y: y - 8, duration: 280 });
    s.once('animationcomplete', () => s.destroy());
  },

  splash(scene, x, y) {
    for (let i = 0; i < 3; i++) Fx.puff(scene, x + (i - 1) * 6, y - i * 2, 1, 0xf3d6a8);
  },

  spark(scene, x, y) {
    const s = scene.add.image(x, y, 'spark').setDepth(41);
    scene.tweens.add({ targets: s, alpha: 0, scale: 1.6, duration: 120, onComplete: () => s.destroy() });
  },

  // Small fading sparkle (rocket trail).
  trail(scene, x, y, tint) {
    const s = scene.add.image(x, y, 'spark').setScale(0.5).setTint(tint).setDepth(11);
    scene.tweens.add({ targets: s, alpha: 0, scale: 0.1, y: y + 3, duration: 260, onComplete: () => s.destroy() });
  },

  // New Year's firework burst: a ring of colored sparks around a small blast.
  firework(scene, x, y) {
    const colors = [0xff3fa4, 0xffe600, 0x3cff6a, 0x5ad1ff, 0xff7a00];
    const main = Phaser.Utils.Array.GetRandom(colors);
    Fx.boom(scene, x, y, 0.55);
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2, r = 16 + Math.random() * 8;
      const s = scene.add.image(x, y, 'spark').setTint(i % 3 ? main : 0xffffff).setDepth(41);
      scene.tweens.add({ targets: s, x: x + Math.cos(a) * r, y: y + Math.sin(a) * r + 4, alpha: 0, scale: 0.4, duration: 420, onComplete: () => s.destroy() });
    }
  },

  feathers(scene, x, y) {
    Fx.puff(scene, x, y, 1, 0xffffff);
    for (let i = 0; i < 9; i++) {
      const f = scene.add.image(x, y, 'feather').setDepth(41).setTint(i % 3 ? 0xffffff : 0xc0582a);
      const dx = Phaser.Math.Between(-22, 22);
      scene.tweens.add({ targets: f, x: x + dx, y: y + Phaser.Math.Between(-18, 6), duration: 250, ease: 'Quad.Out' });
      scene.tweens.add({ targets: f, y: `+=${Phaser.Math.Between(20, 34)}`, angle: Phaser.Math.Between(-180, 180), alpha: 0, delay: 250, duration: 700, onComplete: () => f.destroy() });
    }
  },

  floatText(scene, x, y, text, color = '#ffe066') {
    const t = scene.add
      .text(Math.round(x), Math.round(y), text, {
        fontFamily: FONT, fontSize: '8px', fontStyle: 'bold', color, stroke: '#000000', strokeThickness: 2, resolution: 2,
      })
      .setOrigin(0.5)
      .setDepth(45);
    scene.tweens.add({ targets: t, y: y - 18, alpha: 0, duration: 900, onComplete: () => t.destroy() });
  },

  // White hit-flash; restores sprite.baseTint afterwards if set.
  flash(sprite) {
    sprite.setTintFill(0xffffff);
    sprite.scene.time.delayedCall(60, () => {
      if (!sprite.active) return;
      sprite.clearTint();
      if (sprite.baseTint) sprite.setTint(sprite.baseTint);
    });
  },
};
