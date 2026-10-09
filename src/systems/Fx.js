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
