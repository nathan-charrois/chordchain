import { playChord } from './music'
import type { Chord } from '~/components/Game/context/GameContext'

export const SEQUENCE_GAP_MS = 600

let loopTimeout: ReturnType<typeof setTimeout> | null = null
let loopEnd: ReturnType<typeof setTimeout> | null = null
let chordTimeouts: ReturnType<typeof setTimeout>[] | null = null

type PlaySequence = {
  chords: Chord[]
  arpeggiate: boolean
  loop?: boolean
  setIndex: (index: number | null) => void
}

export function playSequence({ chords, arpeggiate, setIndex, loop }: PlaySequence) {
  const totalDuration = chords.length * SEQUENCE_GAP_MS

  function playSequenceAndLoop() {
    playSequenceOnce({
      chords,
      arpeggiate,
      setIndex,
    })

    if (loop) {
      loopTimeout = setTimeout(() => playSequenceAndLoop(), totalDuration)
    }

    loopEnd = setTimeout(() => setIndex(null), totalDuration + SEQUENCE_GAP_MS)
  }

  stopSequence()
  playSequenceAndLoop()
}

export function playSequenceOnce({ chords, arpeggiate, setIndex }: PlaySequence) {
  for (let i = 0; i < chords.length; i++) {
    const timeout = setTimeout(
      () => {
        playChord(chords[i], arpeggiate)
        setIndex(i)
      },
      i * SEQUENCE_GAP_MS,
    )

    chordTimeouts = [...(chordTimeouts ?? []), timeout]
  }

  sequencePlayed()
}

export function stopSequence() {
  if (chordTimeouts) {
    chordTimeouts.map(chordTimeout => clearTimeout(chordTimeout))
    chordTimeouts = null
  }

  if (loopTimeout) {
    clearTimeout(loopTimeout)
    loopTimeout = null
    loopEnd = null
  }
}

export function sequencePlayed() {
  if (loopEnd) {
    clearTimeout(loopEnd)
    loopEnd = null
  }
}
