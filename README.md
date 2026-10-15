# Cupo Cero (fan game)

**▶ Play in your browser: https://r0n4ldernest0.github.io/cupo-cero-fan-game/** (PC or phone)

*Un fan game run-and-gun al estilo Metal Slug que satiriza la extorsión ("el cobro de cupos") en Lima.*

Pancho, a combi driver whose compadre was killed for not paying the "cupo", teams up with a mercenary hired by the
drivers' union, a retired honest cop and a drugstore owner. Over 5 missions they fight the gangs, then the corrupt police
who protect them, and finally the mayor behind it all. The tone is goofy Metal Slug action on top of a serious subject,
and the satire punches up: the targets are extortionists, corrupt police and politicians, never their victims.

> **Unofficial fan game.** Not affiliated with, endorsed by or connected to SNK. "Metal Slug" is a trademark of SNK
> Corporation. This is a non-commercial project. All characters, gangs, officers, politicians and organizations are
> fictional; any resemblance to real people is coincidental. All art and sound are original, generated in code.

## Controls

| | Keyboard (1 player) | Phone / tablet |
|---|---|---|
| Move / aim up / crouch | ← → ↑ ↓ | joystick (left side of the screen) |
| Jump | Z | SALTO |
| Shoot | X | DISPARO |
| Grenade | C | GRANADA |
| Start / insert coin | Enter / 5 | START / MONEDA |
| Pause / mute | P / M | II |

↓ next to the Combi Slug gets in; ↓ + jump gets out. Two players on one keyboard: 1P WASD + F G H, 2P arrows + , . /
Gamepads work too (A jump, X shoot, B grenade, Start). On a phone, play in landscape.

## Running it locally

No build step: it's plain HTML + JavaScript with [Phaser 3](https://phaser.io) (MIT license) bundled in `lib/`.

```
python tools/serve.py 8000   # then open http://localhost:8000
```

Testing shortcuts (free play, mission select, skipping sections) are on when running locally, or with `?dev` added to
the URL. See `CLAUDE.md` for the code layout and `ROADMAP.md` for the plan.

## Status

All 5 missions are playable as a greybox: placeholder art, synthesized sound and a provisional ending.
