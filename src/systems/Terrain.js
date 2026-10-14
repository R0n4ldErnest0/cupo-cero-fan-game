// Tile-based terrain built from a text map (one character = one 16x16 tile).
//
// Terrain characters are symbols; object markers are letters and @ (see MAP_LEGEND and mission.legend).
//   #  street / concrete (solid)        %  brick (solid)        *  dirt, cerro (solid)
//   =  concrete slab (one-way: stand on it, jump up through it, ↓+jump to drop down)
//   -  wooden plank (one-way)           :  back wall (decoration, no collision)
//   /  slope going up to the right      \  slope going down to the right (put solid tiles under slopes)
//   .  or space: empty
// A marker sits in the empty cell just above the floor it stands on.
//
// Maps are written as String.raw template literals; every row starts with '|' so indentation is free:
//   terrain: String.raw`
//     |        g         =====
//     |   ####/****\    =====
//     |#######*******########`,
const TILE = 16;

// Tileset order (the 'tiles' texture is painted in Textures.tiles in this order).
const TILE_IDS = ['street_top', 'street_lane', 'street', 'brick_top', 'brick', 'dirt_top', 'dirt', 'slab', 'plank', 'slope_up', 'slope_down', 'backwall'];
const TI = Object.fromEntries(TILE_IDS.map((id, i) => [id, i]));

const TERRAIN_CHARS = { '#': 'street', '%': 'brick', '*': 'dirt', '=': 'slab', '-': 'plank', '/': 'up', '\\': 'down', ':': 'back' };
const SOLID = { street: 1, brick: 1, dirt: 1 };
const ONE_WAY = { slab: 1, plank: 1 };
const SLOPE = { up: 1, down: 1 };

// Default object markers. Missions can add their own in `legend` (same format).
// Lowercase = enemies (spawn definitions { t, skin, variant, hp }; k = knife runner). Uppercase = item crates, using the letter
// the crate shows (CFG.WEAPONS / CFG.THROWABLES: H R A E G F D L guns, B M P S throwables).
// Food uses CFG.FOOD[].marker: O pan con chicharrón, U mote, N makis, Z chicha morada, Y lomo saltado,
// Q caldo de gallina, J chicha de jora, X pisco, K emoliente.
// Others: @ player start, W abuelita, V Combi Slug, > door to the next section, T tied-up honest cop (prisoner;
// gives a random item unless the mission's legend says { prisoner: true, drop }).
const MAP_LEGEND = {
  g: { t: 'grunt' },
  s: { t: 'grunt', skin: 'thug2' },
  t: { t: 'grunt', variant: 'thrower' },
  k: { t: 'grunt', variant: 'knife' },
  b: { t: 'biker' },
  W: { abuelita: true },
  T: { prisoner: true },
  V: { combi: true },
  '@': { start: true },
  '>': { door: true },
};
Object.values(CFG.WEAPONS).forEach((w) => { if (w.letter) MAP_LEGEND[w.letter] = { pickup: w.letter }; });
Object.keys(CFG.THROWABLES).forEach((letter) => (MAP_LEGEND[letter] = { pickup: letter }));
Object.entries(CFG.FOOD).forEach(([id, f]) => (MAP_LEGEND[f.marker] = { pickup: id }));

class Terrain {
  // A flat street at y = CFG.GROUND_Y, used by missions without a `terrain` map.
  static flatMap(width) {
    const cols = Math.ceil(width / TILE), groundRow = CFG.GROUND_Y / TILE;
    return Array.from({ length: groundRow + 2 }, (_, r) => (r < groundRow ? ' ' : '#').repeat(cols));
  }

  static parse(text) {
    return text.split('\n').filter((l) => l.includes('|')).map((l) => l.slice(l.indexOf('|') + 1).replace(/\s+$/, ''));
  }

  constructor(scene, mission) {
    this.scene = scene;
    const rows = mission.terrain ? Terrain.parse(mission.terrain) : Terrain.flatMap(mission.width);
    const legend = Object.assign({}, MAP_LEGEND, mission.legend || {});
    this.rows = rows.length;
    const baseCols = Math.max(...rows.map((r) => r.length), Math.ceil((mission.width || 0) / TILE));
    this.width = baseCols * TILE;
    this.height = this.rows * TILE;
    // Repeat the last column a bit past the end, so enemies entering from off-screen right have a floor.
    const PAD = 6;
    this.cols = baseCols + PAD;
    rows.forEach((row, r) => {
      const padded = row.padEnd(baseCols, ' ');
      const last = TERRAIN_CHARS[padded[baseCols - 1]] ? padded[baseCols - 1] : ' ';
      rows[r] = padded + last.repeat(PAD);
    });

    // kinds[r][c]: 'street' | 'slab' | 'up' | ... | null. Letters become objects.
    this.kinds = [];
    this.objects = [];
    rows.forEach((row, r) => {
      const line = [];
      for (let c = 0; c < this.cols; c++) {
        const ch = row[c] || ' ';
        if (TERRAIN_CHARS[ch]) line.push(TERRAIN_CHARS[ch]);
        else {
          line.push(null);
          if (/[A-Za-z@>]/.test(ch)) {
            if (legend[ch]) this.objects.push(Object.assign({ x: c * TILE + TILE / 2, y: (r + 1) * TILE, ch }, legend[ch]));
            else console.warn(`Terrain: unknown marker '${ch}' at row ${r}, column ${c}`);
          }
        }
      }
      this.kinds.push(line);
    });
    // Markers inside a gallery keep the back wall behind them.
    this.kinds.forEach((line) => line.forEach((k, c) => {
      if (k === null && line[c - 1] === 'back' && line[c + 1] === 'back') line[c] = 'back';
    }));

    this.buildLayer();
  }

  kind(c, r) {
    if (r < 0 || r >= this.rows || c < 0 || c >= this.cols) return null;
    return this.kinds[r][c];
  }

  kindAt(x, y) {
    return this.kind(Math.floor(x / TILE), Math.floor(y / TILE));
  }

  tileIndex(c, r) {
    const k = this.kind(c, r);
    if (!k) return -1;
    if (SOLID[k]) {
      const top = !SOLID[this.kind(c, r - 1)];
      if (k === 'street') {
        if (top) return TI.street_top;
        return this.kind(c, r - 1) === 'street' && !SOLID[this.kind(c, r - 2)] && c % 4 < 2 ? TI.street_lane : TI.street;
      }
      return TI[top ? `${k}_top` : k];
    }
    return { slab: TI.slab, plank: TI.plank, up: TI.slope_up, down: TI.slope_down }[k] ?? -1;
  }

  // Back wall goes on its own layer, so it also shows behind the floors of a gallery.
  backIndex(c, r) {
    const k = this.kind(c, r);
    if (k === 'back') return TI.backwall;
    if (ONE_WAY[k] && (this.kind(c, r - 1) === 'back' || this.kind(c, r + 1) === 'back')) return TI.backwall;
    return -1;
  }

  buildLayer() {
    const grid = (fn) => Array.from({ length: this.rows }, (_, r) => Array.from({ length: this.cols }, (_, c) => fn.call(this, c, r)));
    const map = (this.map = this.scene.make.tilemap({ data: grid(this.tileIndex), tileWidth: TILE, tileHeight: TILE }));
    const tileset = map.addTilesetImage('tiles');
    const back = map.createBlankLayer('back', tileset).setDepth(-6);
    back.putTilesAt(grid(this.backIndex), 0, 0);
    const layer = (this.layer = map.createLayer(0, tileset, 0, 0).setDepth(-5));
    layer.forEachTile((tile) => {
      const k = this.kind(tile.x, tile.y);
      if (SOLID[k]) {
        // Faces that touch a slope must not block: you walk off the slope onto them.
        const left = this.kind(tile.x - 1, tile.y) !== 'up';
        const right = this.kind(tile.x + 1, tile.y) !== 'down';
        tile.setCollision(left, right, true, true, false);
      } else if (ONE_WAY[k]) {
        tile.setCollision(false, false, true, false, false);
        tile.oneWay = true;
      }
    });
    layer.calculateFacesWithin(0, 0, this.cols, this.rows);
  }

  // Height of a slope tile's surface at world x (null if that tile is not a slope).
  slopeY(c, r, x) {
    const k = this.kind(c, r);
    if (!SLOPE[k]) return null;
    const dx = Phaser.Math.Clamp(x - c * TILE, 0, TILE);
    return r * TILE + (k === 'up' ? TILE - dx : dx);
  }

  // Bullets stop here: solid tiles, and the filled part of slopes. One-way floors let shots through.
  isSolid(x, y) {
    const c = Math.floor(x / TILE), r = Math.floor(y / TILE), k = this.kind(c, r);
    if (SOLID[k]) return true;
    if (SLOPE[k]) return y >= this.slopeY(c, r, x);
    return false;
  }

  inSlope(x, y) {
    const c = Math.floor(x / TILE), r = Math.floor(y / TILE);
    return !!SLOPE[this.kind(c, r)] && y >= this.slopeY(c, r, x);
  }

  isOneWayAt(x, y) {
    return !!ONE_WAY[this.kindAt(x, y)];
  }

  // Is there something to stand on just ahead (used by enemies so they don't walk off ledges)?
  hasFloor(x, footY) {
    const k1 = this.kindAt(x, footY + 2), k2 = this.kindAt(x, footY + TILE);
    return !!(k1 && k1 !== 'back') || !!SLOPE[k2];
  }

  // First floor surface at or below y in column x (null over a pit).
  surfaceBelow(x, y) {
    const c = Math.floor(x / TILE);
    for (let r = Math.max(0, Math.floor(y / TILE)); r < this.rows; r++) {
      const k = this.kind(c, r);
      if (SLOPE[k] && this.slopeY(c, r, x) >= y - 2) return this.slopeY(c, r, x);
      if ((SOLID[k] || ONE_WAY[k]) && r * TILE >= y - 2) return r * TILE;
    }
    return null;
  }

  // Street level: the top of the lowest solid block in column x (ignores upper floors). Null over a pit.
  groundY(x) {
    const c = Math.floor(x / TILE);
    let r = this.rows - 1;
    if (!SOLID[this.kind(c, r)]) return null;
    while (r > 0 && SOLID[this.kind(c, r - 1)]) r--;
    const above = this.kind(c, r - 1);
    return SLOPE[above] ? this.slopeY(c, r - 1, x) : r * TILE;
  }

  // Arcade physics has no slopes, so walkers are snapped onto slope surfaces after each physics step.
  // Runs between the physics step and postUpdate: moving body.position also moves the sprite.
  snap(o) {
    const b = o.body;
    // Walkers that were standing last frame stick to a slope going down instead of hopping off its top.
    const was = o.onSlope || o.wasGrounded;
    o.onSlope = false;
    o.wasGrounded = !!(b && (b.blocked.down || b.touching.down));
    if (!b || !b.enable || b.velocity.y < 0) return;
    const x = b.position.x + b.halfWidth, foot = b.position.y + b.height;
    const c = Math.floor(x / TILE), r0 = Math.floor(foot / TILE);
    let best = null, kind = null;
    for (let r = r0 - 1; r <= r0 + 1; r++) {
      const s = this.slopeY(c, r, x);
      if (s === null) continue;
      const d = foot - s; // > 0: sunk into the slope; < 0: floating above it
      if (d >= -(was ? 6 : 1) && d <= 10 && (best === null || Math.abs(d) < Math.abs(foot - best))) {
        best = s;
        kind = this.kind(c, r);
      }
    }
    o.slopeKind = kind;
    if (best === null) return;
    b.position.y += best - foot;
    b.updateCenter();
    if (b.velocity.y > 0) b.velocity.y = 0;
    b.blocked.down = true;
    o.onSlope = true;
  }
}
