# Announcer voice clips

The game shouts the item name when you grab a crate ("HEAVY MACHINE GUN!", "¡ANTICUCHERA!") and
"¡Misión cumplida!" at the end of a mission. Until real clips exist, `src/systems/Voice.js` uses the
browser's speech synthesis (robotic, placeholder).

To use real recordings, put audio files here (`.ogg` or `.mp3`; `.wav` works too) and list them in a
`voices.json` next to this file. Any line without a clip keeps using the placeholder voice.

```json
{
  "mg": "heavy_machine_gun.ogg",
  "rocket": "rocket_launcher.ogg",
  "flame": "anticuchera.ogg",
  "shotgun": "escopeta.ogg",
  "rooster": "gallo.ogg",
  "ball": "fulbito.ogg",
  "drone": "dron.ogg",
  "laser": "laser.ogg",
  "stones": "piedras.ogg",
  "bombs": "bombas.ogg",
  "molotov": "molotov.ogg",
  "super": "super_granada.ogg",
  "mission_complete": "mision_cumplida.ogg"
}
```

| id | Line |
|---|---|
| mg | "Heavy Machine Gun!" (English, like the arcade) |
| rocket | "Rocket Launcher!" (English, like the arcade) |
| flame | "¡Anticuchera!" |
| shotgun | "¡Escopeta!" |
| rooster | "¡Gallo de pelea!" |
| ball | "¡Fulbito!" |
| drone | "¡Dron!" |
| laser | "¡Láser!" |
| stones | "¡Piedras!" |
| bombs | "¡Bombas!" |
| molotov | "¡Molotov!" |
| super | "¡Súper granada!" |
| mission_complete | "¡Misión cumplida!" |

Recording tips: one short take per line (under ~1.5 s), deep and over the top, like an arcade
announcer. Trim the silence at the start so it plays the instant you grab the crate. Normalize
all clips to the same loudness. A little reverb/echo helps the arcade feel. Real voices must be
original recordings (never ripped from Metal Slug); AI-generated voices must be disclosed on the
itch.io page.

Note: the clips only load through the dev server (`python tools/serve.py`), not when `index.html`
is opened directly from disk; the placeholder voice is used there.
