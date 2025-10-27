import { playChord } from './music'
import type { Chord } from '~/components/Game/context/GameContext'

export const testSequence: Chord[] = ['C', 'Fm', 'Am', 'G']

export const SEQUENCE_GAP_MS = 600

let loopTimeout: ReturnType<typeof setTimeout> | null = null

export function playSequence(chords: Chord[], arpeggiate: boolean, loop: boolean) {
  const totalDuration = chords.length * SEQUENCE_GAP_MS

  function playSequenceAndLoop() {
    playSequenceOnce(chords, arpeggiate)
    if (loop) {
      loopTimeout = setTimeout(playSequenceAndLoop, totalDuration)
    }
  }

  stopSequence()
  playSequenceAndLoop()
}

export function playSequenceOnce(chords: Chord[], arpeggiate: boolean) {
  for (let i = 0; i < chords.length; i++) {
    setTimeout(
      () => playChord(chords[i], arpeggiate),
      i * SEQUENCE_GAP_MS,
    )
  }
}

export function stopSequence() {
  if (loopTimeout) {
    clearTimeout(loopTimeout)
    loopTimeout = null
  }
}
