import { playChord } from './music'
import type { Chord } from '~/components/Game/context/GameContext'

export const testSequence: Chord[] = ['C', 'Fm', 'Am', 'G']

export const SEQUENCE_GAP_MS = 600

export function playSequenceOnce(chords: Chord[], arpeggiate: boolean) {
  for (let i = 0; i < chords.length; i++) {
    setTimeout(
      () => playChord(chords[i], arpeggiate),
      i * SEQUENCE_GAP_MS,
    )
  }
}

export function playSequence(chords: Chord[], arpeggiate: boolean) {
  const totalDuration = chords.length * SEQUENCE_GAP_MS

  function playLoop() {
    playSequenceOnce(chords, arpeggiate)
    setTimeout(playLoop, totalDuration)
  }

  playLoop()
}

export function playChain({
  chords,
  loop,
  arpeggiate,
}: {
  chords: Chord[]
  loop: boolean
  arpeggiate: boolean
}) {
  if (loop) {
    playSequence(chords, arpeggiate)
  }
  else {
    playSequenceOnce(chords, arpeggiate)
  }
}
