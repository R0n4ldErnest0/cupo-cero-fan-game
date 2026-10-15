// Mission 4 boss: the corrupt Comisario "Archivo", in a mech built from a filing cabinet on office-chair wheels
// (Boss framework). Attacks: volleys of "ARCHIVADO" stamps (top drawer), complaint folders thrown in arcs (middle
// drawer), and a charge across the floor ("¡Circulen!"). Angry under 50%: he calls for backup and stamps rain from
// the ceiling. The two drawers are breakable parts.
class BossComisario extends Boss {
  constructor(scene, x, y) {
    const C = CFG.COMISARIO;
    super(scene, x, y, 'comisario_mech', {
      name: 'EL COMISARIO',
      hp: C.HP,
      score: 12000,
      intro: 'Su denuncia es muy importante para nosotros... ¡ARCHIVADA!',
      introMs: 2400,
      deathMs: 2600,
      phases: [
        { below: 1, attacks: ['stamps', 'folders', 'charge'], pause: [850, 1200] },
        { below: 0.5, attacks: ['stamps', 'folders', 'charge', 'backup', 'rain'], pause: [600, 900], speed: 1.25, line: '¡Esto es un operativo! ¡Todos contra el chofer!' },
      ],
    });
    this.body.setSize(50, 70).setOffset(10, 12);
    this.floor = y;
    this.stampDrawer = this.addPart('drawer', { dx: -24, dy: -60, hp: C.DRAWER_HP, attacks: ['stamps', 'rain'], bonus: 10, line: '¡Mi sello oficial!' });
    this.folderDrawer = this.addPart('drawer', { dx: -24, dy: -38, hp: C.DRAWER_HP, attacks: ['folders'], bonus: 10, line: '¡Las denuncias se salieron del archivo!' });
    this.leftX = scene.arenaX + 50;
    this.rightX = scene.arenaX + CFG.VIEW_W - 50;
  }

  get angry() {
    return this.phaseIndex > 0;
  }

  enter() {
    this.x -= 1.4;
    if (this.x > this.rightX) return false;
    this.x = this.rightX;
    return true;
  }

  idle() {}

  // "ARCHIVADO" stamps fired from the top drawer, three at a time, aimed at the player.
  attack_stamps(time) {
    const s = this.scene;
    if (Math.random() < 0.6) Fx.say(s, this, '¡ARCHIVADO!', 900);
    return this.repeat(time, this.angry ? 4 : 3, 420, () => {
      if (!this.stampDrawer.alive) return;
      const d = this.stampDrawer, t = s.target(d.x, d.y);
      const base = Phaser.Math.Angle.Between(d.x, d.y, t.x, t.y - 12);
      [-0.15, 0, 0.15].forEach((o) => s.enemyShoot(d.x, d.y, base + o, CFG.COMISARIO.STAMP_SPEED, 'stamp'));
      Sfx.hit();
    });
  }

  // Complaint folders thrown in arcs: they burst into papers where they land.
  attack_folders(time) {
    const s = this.scene;
    Fx.say(s, this, '¡Llévese su denuncia!', 1000);
    return this.repeat(time, 4, 260, (i) => {
      if (!this.folderDrawer.alive) return;
      const t = s.target(this.x, this.y);
      s.enemyLob(this.folderDrawer.x, this.folderDrawer.y, t.x + (i - 1.5) * 36, this.floor - 4, 'folder', 0.85);
      Sfx.throw();
    });
  }

  // Rolls across the floor on his office-chair wheels (deadly to touch: jump over or get out of the way).
  attack_charge(time) {
    const s = this.scene, revUntil = time + 600;
    Fx.say(s, this, '¡Circulen, circulen!', 900);
    this.hitCombi = false;
    return {
      step: (t) => {
        if (t < revUntil) {
          this.angle = Math.sin(t / 40) * 3;
          return false;
        }
        this.angle = 0;
        this.charging = true;
        this.x += this.facing * CFG.COMISARIO.CHARGE_SPEED * this.sp * (s.game.loop.delta / 1000);
        const done = (this.facing < 0 && this.x <= this.leftX) || (this.facing > 0 && this.x >= this.rightX);
        if (!done) return false;
        this.x = Phaser.Math.Clamp(this.x, this.leftX, this.rightX);
        this.facing *= -1;
        this.charging = false;
        return true;
      },
    };
  }

  // Angry: calls cops in from both sides (only while there are few enemies around).
  attack_backup(time) {
    const s = this.scene;
    Fx.say(s, this, '¡Refuerzos! ¡Rápido!', 1100);
    Sfx.horn();
    const alive = s.enemies.getChildren().filter((e) => e.alive).length;
    if (alive < 3) {
      s.spawnEnemy({ t: 'cop' }, s.viewLeft - 20);
      s.spawnEnemy({ t: Math.random() < 0.5 ? 'riot' : 'cop' }, s.viewLeft + CFG.VIEW_W + 20);
    }
    return this.repeat(time, 0, 0, () => {}, 900);
  }

  // Angry: stamps rain from the ceiling.
  attack_rain(time) {
    const s = this.scene;
    Fx.say(s, this, '¡ARCHIVADO! ¡ARCHIVADO! ¡ARCHIVADO!', 1300);
    return this.repeat(time, 10, 130, () => {
      const x = Phaser.Math.Between(s.viewLeft + 20, s.viewLeft + CFG.VIEW_W - 20);
      s.enemyShoot(x, s.viewTop + 30, Math.PI / 2 + Phaser.Math.FloatBetween(-0.15, 0.15), CFG.COMISARIO.RAIN_SPEED, 'stamp');
    }, 200, 500);
  }

  sync() {
    if (this.alive && this.state !== 'enter' && !this.charging) this.facing = this.scene.target(this.x, this.y).x < this.x ? -1 : 1;
    this.setFlipX(this.facing > 0);
    this.parts.forEach((p) => p.follow());
  }

  removeExtras() {
    this.parts.forEach((p) => p.destroy());
  }

  onDeath() {
    const s = this.scene;
    this.charging = false;
    s.time.delayedCall(500, () => Fx.say(s, this, '¡Esto es una persecución política! ¡Llamen a mi abogado!', 2400));
    // Complaints fly out of the burst cabinet.
    for (let i = 0; i < 10; i++) {
      s.time.delayedCall(200 + i * 120, () => {
        const f = s.add.image(this.x, this.y - 40, 'folder').setDepth(30);
        s.tweens.add({ targets: f, x: f.x + Phaser.Math.Between(-90, 90), y: f.y - Phaser.Math.Between(20, 80), angle: 360, alpha: 0, duration: 1200, onComplete: () => f.destroy() });
      });
    }
  }
}
