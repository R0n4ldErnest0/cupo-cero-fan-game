# Cupo Cero (fan game)

**▶ Play in your browser: https://r0n4ldernest0.github.io/cupo-cero-fan-game/** (PC or phone)

## Sobre el proyecto

**Cupo Cero** es un fan game run-and-gun al estilo Metal Slug que satiriza la extorsión, "el cobro de cupos", en
**Pima**, una ciudad que se parece mucho a Lima. Pancho, chofer de combi, se cansa de pagar después de que matan a su
compadre, y junto a Amaru (un mercenario contratado por el gremio), Don Tito (un policía retirado, de los honestos) e
Inés (dueña de una botica extorsionada) recorre 5 misiones: primero las bandas, luego la policía corrupta que las
protege y al final el alcalde detrás de todo. Humor de Metal Slug sobre un tema serio: la sátira apunta a los
extorsionadores, a los malos policías y a los políticos, nunca a las víctimas.

**In English:** a Metal Slug-style run-and-gun fan game satirizing the extortion racket ("cupos") that hits bus
drivers, shop owners and schools in Pima, a city that looks a lot like Lima, Peru. A combi driver and three allies fight
the gangs, the corrupt police who protect them and, finally, the mayor behind it all. Goofy arcade action on a serious
subject; the satire punches up, never at the victims. Plays in the browser, on PC or phone, for 1 or 2 players.

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
