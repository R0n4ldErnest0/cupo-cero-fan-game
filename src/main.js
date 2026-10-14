// Entry point.
Session.load();

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: CFG.WIDTH,
  height: CFG.HEIGHT,
  backgroundColor: '#000000',
  pixelArt: true,
  roundPixels: true,
  input: { gamepad: true },
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: CFG.GRAVITY }, debug: CFG.DEBUG },
  },
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [BootScene, TitleScene, CharSelectScene, LevelScene, HUDScene, MissionEndScene, EndingScene, GameOverScene],
});

// Arcade-style global keys, active in every scene: 5 = insert coin, F2 = toggle FREE PLAY,
// F4 = finish the current mission, F6 = drop the next item crate in front of 1P (testing).
window.addEventListener('keydown', (e) => {
  if (e.repeat) return;
  if (e.code === 'Digit5' || e.code === 'Numpad5') {
    Session.addCredit();
    Sfx.init();
    Sfx.coin();
  } else if (e.code === 'F2') {
    e.preventDefault();
    Session.toggleFreePlay();
    Sfx.init();
    Sfx.coin();
  } else if (e.code === 'F4') {
    e.preventDefault();
    const lv = game.scene.getScene('Level');
    if (game.scene.isActive('Level') && !lv.finished && !lv.frozen) lv.missionComplete();
  } else if (e.code === 'F6') {
    e.preventDefault();
    const lv = game.scene.getScene('Level');
    const p = lv && lv.players && lv.players.find((pl) => pl.state === 'play' && pl.alive);
    if (!game.scene.isActive('Level') || !p) return;
    const letters = Object.values(CFG.WEAPONS).map((w) => w.letter).filter(Boolean).concat(Object.keys(CFG.THROWABLES));
    lv.testCrate = ((lv.testCrate ?? -1) + 1) % letters.length;
    lv.spawnPickup(p.x + p.facing * 30, p.y - 30, letters[lv.testCrate]);
  }
});
