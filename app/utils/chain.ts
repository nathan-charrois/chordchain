import { playChord } from './music'
import type { Chord } from '~/components/Game/context/GameContext'

export const SEQUENCE_GAP_MS = 1200

type TimeoutHandle = ReturnType<typeof setTimeout>

type SequenceTimeouts = {
  chord: TimeoutHandle[]
  loopRestart: TimeoutHandle | null
  loopEnd: TimeoutHandle | null
  delayedInsert: TimeoutHandle | null
}

const sequenceTimeouts: SequenceTimeouts = {
  chord: [],
  loopRestart: null,
  loopEnd: null,
  delayedInsert: null,
}

let activeSession = 0

type PlaySequence = {
  chords: Chord[]
  arpeggiate: boolean
  loop?: boolean
  setIndex: (index: number | null) => void
}

export function playSequence({ chords, arpeggiate, setIndex, loop }: PlaySequence) {
  const session = startNewSession()
  const totalDuration = chords.length * SEQUENCE_GAP_MS

  function playSequenceAndLoop(currentSession: number) {
    if (!isSessionActive(currentSession)) {
      return
    }

    playSequenceOnce({
      chords,
      arpeggiate,
      setIndex,
      session: currentSession,
    })

    if (loop) {
      replaceTimeout('loopRestart', setTimeout(() => {
        if (!isSessionActive(currentSession)) {
          return
        }

        playSequenceAndLoop(currentSession)
      }, totalDuration))
    }

    replaceTimeout('loopEnd', setTimeout(() => {
      if (!isSessionActive(currentSession)) {
        return
      }

      setIndex(null)
    }, totalDuration + SEQUENCE_GAP_MS))
  }

  playSequenceAndLoop(session)
}

type PlaySequenceOnce = Pick<PlaySequence, 'chords' | 'arpeggiate' | 'setIndex'> & {
  session: number
}

export function playSequenceOnce({ chords, arpeggiate, setIndex, session }: PlaySequenceOnce) {
  clearChordTimeouts()

  for (let i = 0; i < chords.length; i++) {
    const timeout = setTimeout(
      () => {
        if (!isSessionActive(session)) {
          return
        }

        playChord(chords[i], arpeggiate)
        setIndex(i)
      },
      i * SEQUENCE_GAP_MS,
    )

    sequenceTimeouts.chord = [...sequenceTimeouts.chord, timeout]
  }

  sequencePlayed()
}

export function stopSequence() {
  invalidateSequenceLifecycle()
}

export function endSequence() {
  invalidateSequenceLifecycle()
}

export function sequencePlayed() {
  clearTimeoutByKey('loopEnd')
}

function startNewSession(): number {
  activeSession += 1
  clearAllTrackedTimeouts()

  return activeSession
}

function invalidateSequenceLifecycle() {
  activeSession += 1
  clearAllTrackedTimeouts()
}

function isSessionActive(session: number) {
  return session === activeSession
}

function clearChordTimeouts() {
  sequenceTimeouts.chord.forEach(clearTimeout)
  sequenceTimeouts.chord = []
}

function clearTimeoutByKey(key: Exclude<keyof SequenceTimeouts, 'chord'>) {
  if (!sequenceTimeouts[key]) {
    return
  }

  clearTimeout(sequenceTimeouts[key])
  sequenceTimeouts[key] = null
}

function clearAllTrackedTimeouts() {
  clearChordTimeouts()
  clearTimeoutByKey('loopRestart')
  clearTimeoutByKey('loopEnd')
  clearTimeoutByKey('delayedInsert')
}

function replaceTimeout(key: Exclude<keyof SequenceTimeouts, 'chord'>, timeout: TimeoutHandle) {
  clearTimeoutByKey(key)
  sequenceTimeouts[key] = timeout
}
