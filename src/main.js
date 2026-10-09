// Entry point.
const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: CFG.WIDTH,
  height: CFG.HEIGHT,
  backgroundColor: '#000000',
  pixelArt: true,
  roundPixels: true,
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: CFG.GRAVITY }, debug: CFG.DEBUG },
  },
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [BootScene, TitleScene, Level1Scene, HUDScene, GameOverScene],
});
