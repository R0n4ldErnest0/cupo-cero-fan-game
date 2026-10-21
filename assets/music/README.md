# Music

Every track is synthesized by `src/systems/Music.js` from the song data in `src/systems/Songs.js`.
To replace one with a real recording, put the file here (`.mp3` or `.ogg`; it should loop cleanly) and list it in
`music.json` next to this file. Tracks not listed keep the synthesized version.

```json
{
  "title": "title.mp3",
  "m1": "m1_ate.mp3",
  "boss": { "file": "boss.ogg", "vol": 0.8 },
  "win": { "file": "mission_complete.ogg", "once": true }
}
```

`vol` scales the track (1 = default), `once: true` plays it once instead of looping.

| id | where | mood |
|---|---|---|
| `title` | title screen, character select, ending | heroic chicha |
| `m1` | Mission 1, Ate (paradero, combi) | chicha / cumbia peruana, surf-guitar lead |
| `m2` | Mission 2, Kamarra (market) | faster, festive cumbia |
| `m3` | Mission 3, cerros + Lentopolitano | huayno rock (charango, fast) |
| `m4` | Mission 4, the comisaría at night | slow, sneaky, minor key |
| `m5` | Mission 5, air level + plaza + Municipalidad | march / rock, heroic |
| `boss` | every boss fight | driving, tense |
| `win` | MISSION COMPLETE! (plays once, ~5 s) | short fanfare |
| `gameover` | game over (plays once) | short, sad |

A section can use another track with `music: 'id'` in its data, and a different boss track with `bossMusic: 'id'`.

Only use music you made or have the rights to (no ripped Metal Slug tracks: those can go in `assets/_private/` for
private testing only). Instrumental tracks work best, so they don't cover the announcer and the speech bubbles.

## Prompts for an AI music generator

Instrumental, loopable, 1–2 minutes:

- **title**: "Instrumental chicha peruana, heroic arcade title theme, surf-reverb electric guitar lead, güiro, timbales, cumbia bass, 112 bpm, A minor"
- **m1**: "Instrumental 80s chicha peruana, Los Shapis style, twangy electric guitar with echo, güiro, cumbia rhythm, 104 bpm, energetic run-and-gun video game level"
- **m2**: "Instrumental fast cumbia peruana, festive market vibe, bright guitar lead, timbales fills, 118 bpm, D minor, arcade video game"
- **m3**: "Instrumental huayno rock, fast charango and distorted guitar, Andean drums, 132 bpm, E minor, action video game"
- **m4**: "Instrumental slow tense chicha noir, night stealth, minor key, sparse guitar with echo, 96 bpm, video game"
- **m5**: "Instrumental heroic military march meets cumbia, snare rolls, brass and electric guitar, 132 bpm, final level of an arcade game"
- **boss**: "Instrumental intense boss battle, driving rock with cumbia percussion, fast 140 bpm, E minor, arcade"
