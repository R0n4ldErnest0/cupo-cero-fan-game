// Synthesized songs, played by Music when there's no recorded file for a track (assets/music/music.json).
// A song is a tempo, a style (drums + bass + chord pattern, see Music.STYLES) and parts of bars:
//   chords: one chord per bar ('Am', 'G', 'C#m'...; sharps only)
//   lead:   one string per bar, 16 sixteenth-note steps: a note ('A4', 'G#5'), '-' holds it, '.' is a rest
// `order` lists the parts; the song loops over it (or plays once with `once: true`).
const SONGS = {
  // Title screen: heroic chicha.
  title: {
    bpm: 112, style: 'cumbia', lead: 'square',
    parts: {
      A: {
        chords: 'Am F G E',
        lead: [
          'E5 - - E5 D5 - C5 - D5 - E5 - A4 - - -',
          'F5 - - E5 D5 - C5 - A4 - C5 - F4 - - -',
          'G5 - - F5 E5 - D5 - B4 - D5 - G4 - - -',
          'G#4 - B4 - D5 - E5 - G#5 - - - E5 - - -',
        ],
      },
      B: {
        chords: 'Dm Am F E',
        lead: [
          'A5 - G5 F5 E5 - D5 - F5 - E5 - D5 - - -',
          'C5 - B4 A4 E5 - - - C5 - B4 - A4 - - -',
          'A4 - C5 - F5 - A5 - G5 - F5 - E5 - - -',
          'D5 - C5 - B4 - G#4 - B4 - - - . . . .',
        ],
      },
    },
    order: 'A B',
  },

  // Mission 1, Ate: the paradero chicha (the old placeholder loop is part A).
  m1: {
    bpm: 104, style: 'cumbia', lead: 'square',
    parts: {
      A: {
        chords: 'Am G F E',
        lead: [
          'A4 . C5 . E5 . D5 C5 B4 . A4 . C5 . . .',
          'B4 . D5 . G5 . F5 E5 D5 . B4 . G4 . . .',
          'A4 . C5 . F5 . E5 D5 C5 . A4 . F4 . A4 .',
          'G#4 . B4 . E5 . D5 . C5 . B4 . G#4 . . .',
        ],
      },
      B: {
        chords: 'Dm Am E Am',
        lead: [
          'D5 - F5 - A5 - G5 F5 E5 - D5 - F5 - - -',
          'E5 - C5 - A4 - B4 C5 E5 - - - . . . .',
          'B4 - G#4 - E4 - G#4 B4 D5 - C5 - B4 - - -',
          'A4 - - - E5 - D5 C5 B4 - A4 - . . . .',
        ],
      },
    },
    order: 'A A B A',
  },

  // Mission 2, Kamarra: a faster, festive market cumbia.
  m2: {
    bpm: 118, style: 'cumbia', lead: 'square',
    parts: {
      A: {
        chords: 'Dm C A# A',
        lead: [
          'D5 . F5 D5 A4 . D5 . F5 . E5 D5 E5 . . .',
          'E5 . G5 E5 C5 . E5 . G5 . F5 E5 D5 . . .',
          'D5 . F5 D5 A#4 . D5 . F5 . G5 F5 D5 . . .',
          'C#5 . E5 C#5 A4 . C#5 . E5 . D5 C#5 A4 . . .',
        ],
      },
      B: {
        chords: 'Gm Dm A Dm',
        lead: [
          'G5 - A#5 - A5 G5 F5 - D5 - F5 - G5 - - -',
          'F5 - E5 D5 A4 - D5 - F5 - A5 - - - . .',
          'E5 - C#5 - A4 - C#5 E5 G5 - F5 - E5 - - -',
          'D5 - - - A4 - - - D5 . . . . . . .',
        ],
      },
    },
    order: 'A A B A',
  },

  // Mission 3, the cerros and the Lentopolitano: huayno rock.
  m3: {
    bpm: 132, style: 'huayno', lead: 'square',
    parts: {
      A: {
        chords: 'Em G D Em',
        lead: [
          'E5 E5 G5 . E5 E5 D5 . B4 B4 D5 . E5 . . .',
          'G5 G5 A5 . G5 G5 E5 . D5 D5 E5 . G5 . . .',
          'A5 . G5 . E5 . D5 . B4 . D5 . E5 . D5 .',
          'B4 . D5 . E5 - - - E4 . . . . . . .',
        ],
      },
      B: {
        chords: 'C D B Em',
        lead: [
          'G5 - E5 - C5 - E5 G5 A5 - G5 - E5 - - -',
          'F#5 - D5 - A4 - D5 F#5 A5 - F#5 - D5 - - -',
          'D#5 - F#5 - B5 - A5 - F#5 - D#5 - B4 - - -',
          'E5 - - - G5 - F#5 - E5 - - - . . . .',
        ],
      },
    },
    order: 'A A B',
  },

  // Mission 4, the comisaría at night: slow and sneaky.
  m4: {
    bpm: 96, style: 'noir', lead: 'square',
    parts: {
      A: {
        chords: 'Cm G# Fm G',
        lead: [
          'C5 - - D#5 - - G5 - F5 - D#5 - D5 - - -',
          'C5 - - D#5 - - G#5 - G5 - F5 - D#5 - - -',
          'F5 - - G#5 - - C6 - A#5 - G#5 - G5 - - -',
          'G5 - F5 - D#5 - D5 - B4 - - - G4 - - -',
        ],
      },
      B: {
        chords: 'Cm Cm Fm G',
        lead: [
          'G5 . G5 . G#5 - G5 - D#5 . D#5 . C5 - - -',
          'D#5 . D#5 . F5 - D#5 - C5 . C5 . G#4 - - -',
          'C5 . F5 . G#5 - G5 - F5 . G#5 . C6 - - -',
          'B5 - - - G5 - - - D5 - - - B4 - - -',
        ],
      },
    },
    order: 'A A B',
  },

  // Mission 5, the final mission: a march with the honest police.
  m5: {
    bpm: 132, style: 'march', lead: 'square',
    parts: {
      A: {
        chords: 'Am F C G',
        lead: [
          'A4 - - A4 C5 - E5 - A5 - - - G5 - E5 -',
          'F5 - - E5 D5 - C5 - A4 - - - C5 - F5 -',
          'E5 - - D5 C5 - D5 - E5 - - - G5 - - -',
          'G5 - F5 - E5 - D5 - B4 - D5 - G5 - - -',
        ],
      },
      B: {
        chords: 'F G Am Am',
        lead: [
          'A5 - - - G5 - F5 - C6 - - - A5 - - -',
          'B5 - - - A5 - G5 - D6 - - - B5 - - -',
          'C6 - B5 A5 E5 - A5 - C6 - B5 A5 E5 - - -',
          'A5 - - - - - - - . . . . . . . .',
        ],
      },
    },
    order: 'A A B',
  },

  // Every boss fight.
  boss: {
    bpm: 140, style: 'boss', lead: 'sawtooth',
    parts: {
      A: {
        chords: 'Em Em C D',
        lead: [
          'E5 . E5 . G5 . E5 . A#5 . A5 . G5 . E5 .',
          'E5 . E5 . G5 . E5 . D5 . C5 . B4 - - -',
          'C5 . E5 . G5 . C6 . B5 . G5 . E5 . C5 .',
          'D5 . F#5 . A5 . D6 . C6 . A5 . F#5 . D5 .',
        ],
      },
      B: {
        chords: 'Em F Em B',
        lead: [
          'B5 - - - A#5 - - - A5 - G5 - F#5 - E5 -',
          'F5 - - - E5 - - - D5 - C5 - A4 - - -',
          'E5 . G5 . B5 . G5 . E5 . G5 . B5 . E6 .',
          'D#6 - - - B5 - - - F#5 - - - D#5 - - -',
        ],
      },
    },
    order: 'A A B',
  },

  // MISSION COMPLETE!
  win: {
    bpm: 180, style: 'jingle', lead: 'square', once: true,
    parts: {
      A: {
        chords: 'C F G C',
        lead: [
          'C5 . E5 . G5 . C6 - - - G5 . C6 - - -',
          'A5 . C6 . F5 . A5 - - - C6 . F6 - - -',
          'D6 . B5 . G5 . B5 . D6 . F6 . G6 - - -',
          'E6 - - - - - - - C6 - - - - - - -',
        ],
      },
    },
    order: 'A',
  },

  // Game over.
  gameover: {
    bpm: 80, style: 'none', lead: 'triangle', once: true,
    parts: {
      A: {
        chords: 'Am Dm E Am',
        lead: [
          'E5 - - - D5 - C5 - B4 - - - A4 - - -',
          'F5 - - - E5 - D5 - C5 - - - A4 - - -',
          'G#4 - - - B4 - - - D5 - - - C5 - B4 -',
          'A4 - - - - - - - - - - - . . . .',
        ],
      },
    },
    order: 'A',
  },
};
