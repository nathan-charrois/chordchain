import type { DrumLoopId } from './drums'
import { DRUM_LOOP_BEATS, getDrumLoop, playDrum } from './drums'
import { type ArpeggiateType, playChord } from './music'

export const SEQUENCE_GAP_MS = 1400
export const DEFAULT_TEMPO_BPM = 100

type TimeoutHandle = ReturnType<typeof setTimeout>

type SequenceTimeouts = {
  chord: TimeoutHandle[]
  tone: TimeoutHandle[]
  subdivision: TimeoutHandle[]
  loopRestart: TimeoutHandle | null
  loopEnd: TimeoutHandle | null
  delayedInsert: TimeoutHandle | null
}

const sequenceTimeouts: SequenceTimeouts = {
  chord: [],
  tone: [],
  subdivision: [],
  loopRestart: null,
  loopEnd: null,
  delayedInsert: null,
}

let activeSession = 0

type PlaySequence = {
  chords: string[][]
  arpeggiate: boolean
  arpeggiateType: ArpeggiateType
  drums: boolean
  drumLoopId: DrumLoopId
  shouldLoop: () => boolean
  tempoBpm: number
  setIndex: (index: number | null) => void
  onComplete?: () => void
}

export function playSequence({ chords, arpeggiate, arpeggiateType, drums, drumLoopId, setIndex, shouldLoop, tempoBpm, onComplete }: PlaySequence) {
  const session = startNewSession()
  const sequenceGapMs = getSequenceGapMs(tempoBpm)
  const totalDuration = chords.length * sequenceGapMs

  function playSequenceAndLoop(currentSession: number, loopIteration: number) {
    if (!isSessionActive(currentSession)) {
      return
    }

    playSequenceOnce({
      chords,
      arpeggiate,
      arpeggiateType,
      drums,
      drumLoopId,
      loopIteration,
      setIndex,
      sequenceGapMs,
      session: currentSession,
    })

    replaceTimeout('loopRestart', setTimeout(() => {
      if (!isSessionActive(currentSession)) {
        return
      }

      if (shouldLoop()) {
        playSequenceAndLoop(currentSession, loopIteration + 1)
        return
      }

      replaceTimeout('loopEnd', setTimeout(() => {
        if (!isSessionActive(currentSession)) {
          return
        }

        setIndex(null)
        onComplete?.()
      }, sequenceGapMs))
    }, totalDuration))
  }

  playSequenceAndLoop(session, 0)
}

type PlaySequenceOnce = Pick<PlaySequence, 'chords' | 'arpeggiate' | 'arpeggiateType' | 'drums' | 'drumLoopId' | 'setIndex'> & {
  loopIteration: number
  sequenceGapMs: number
  session: number
}

export function playSequenceOnce({ chords, arpeggiate, arpeggiateType, drums, drumLoopId, loopIteration, setIndex, sequenceGapMs, session }: PlaySequenceOnce) {
  clearChordTimeouts()
  clearSubdivisionTimeouts()

  for (let i = 0; i < chords.length; i++) {
    const timeout = setTimeout(
      () => {
        if (!isSessionActive(session)) {
          return
        }

        const toneTimeouts = playChord(chords[i], arpeggiate, arpeggiateType, sequenceGapMs)
        sequenceTimeouts.tone = [...sequenceTimeouts.tone, ...toneTimeouts]
        setIndex(i)
      },
      i * sequenceGapMs,
    )

    sequenceTimeouts.chord = [...sequenceTimeouts.chord, timeout]
  }

  if (drums) {
    scheduleDrumLoop(drumLoopId, loopIteration, chords, sequenceGapMs, session)
  }

  sequencePlayed()
}

function scheduleDrumLoop(drumLoopId: DrumLoopId, loopIteration: number, chords: string[][], sequenceGapMs: number, session: number) {
  const drumLoop = getDrumLoop(drumLoopId, loopIteration)

  for (let chordIndex = 0; chordIndex < chords.length; chordIndex++) {
    const loopBeat = chordIndex % DRUM_LOOP_BEATS
    const drumHits = drumLoop.filter(hit => hit.beat === loopBeat)
    const rootNote = chords[chordIndex][0]

    for (const hit of drumHits) {
      const subdivisionsPerBeat = hit.subdivisionsPerBeat ?? 2
      const subdivisionGapMs = sequenceGapMs / subdivisionsPerBeat
      const timeout = setTimeout(() => {
        if (!isSessionActive(session)) {
          return
        }

        playDrum(hit.instrument, rootNote)
      }, chordIndex * sequenceGapMs + hit.subdivision * subdivisionGapMs)

      sequenceTimeouts.subdivision = [...sequenceTimeouts.subdivision, timeout]
    }
  }
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

function clearSubdivisionTimeouts() {
  sequenceTimeouts.subdivision.forEach(clearTimeout)
  sequenceTimeouts.subdivision = []
}

function clearToneTimeouts() {
  sequenceTimeouts.tone.forEach(clearTimeout)
  sequenceTimeouts.tone = []
}

function clearTimeoutByKey(key: Exclude<keyof SequenceTimeouts, 'chord' | 'subdivision' | 'tone'>) {
  if (!sequenceTimeouts[key]) {
    return
  }

  clearTimeout(sequenceTimeouts[key])
  sequenceTimeouts[key] = null
}

function clearAllTrackedTimeouts() {
  clearChordTimeouts()
  clearSubdivisionTimeouts()
  clearToneTimeouts()
  clearTimeoutByKey('loopRestart')
  clearTimeoutByKey('loopEnd')
  clearTimeoutByKey('delayedInsert')
}

function replaceTimeout(key: Exclude<keyof SequenceTimeouts, 'chord' | 'subdivision' | 'tone'>, timeout: TimeoutHandle) {
  clearTimeoutByKey(key)
  sequenceTimeouts[key] = timeout
}

function getSequenceGapMs(tempoBpm: number) {
  return SEQUENCE_GAP_MS * (DEFAULT_TEMPO_BPM / tempoBpm)
}
