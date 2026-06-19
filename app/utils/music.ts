import zzfx from './zzfx'

export const MIDI_A4 = 69
export const A4_HZ = 440

export type ModeId
  = | 'ionian'
    | 'dorian'
    | 'phrygian'
    | 'lydian'
    | 'mixolydian'
    | 'aeolian'
    | 'locrian'

export type PuzzleDifficulty = 'easy' | 'medium' | 'hard'
export type ChordType = 'triad' | 'seventh' | 'sus2' | 'sus4'
export type ChordDegree = 1 | 2 | 3 | 4 | 5 | 6 | 7

export type ChordId = {
  degree: ChordDegree
  type: ChordType
}

export type DisplayChord = ChordId & {
  name: string
  notes: string[]
}

export type PaletteChordIds = {
  triad: ChordId[]
  seventh: ChordId[]
  extension: ChordId[]
}

export type DisplayPaletteSections = {
  triad: DisplayChord[]
  seventh: DisplayChord[]
  extension: DisplayChord[]
}

export const MODE_INTERVALS: Record<ModeId, readonly number[]> = {
  ionian: [0, 2, 4, 5, 7, 9, 11],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  aeolian: [0, 2, 3, 5, 7, 8, 10],
  locrian: [0, 1, 3, 5, 6, 8, 10],
}

export const CHORD_RECIPES: Record<ChordType, readonly number[]> = {
  triad: [0, 2, 4],
  seventh: [0, 2, 4, 6],
  sus2: [0, 1, 4],
  sus4: [0, 3, 4],
}

export const DIFFICULTY_CHORD_TYPES: Record<PuzzleDifficulty, readonly ChordType[]> = {
  easy: ['triad'],
  medium: ['triad', 'seventh'],
  hard: ['triad', 'seventh', 'sus2', 'sus4'],
}

export const MODE_IDS: ModeId[] = [
  'ionian',
  'dorian',
  'phrygian',
  'lydian',
  'mixolydian',
  'aeolian',
  'locrian',
]

export const DEFAULT_MODE_ID: ModeId = 'ionian'
export const DEFAULT_KEY = 'C'

const MODE_LABELS: Record<ModeId, string> = {
  ionian: 'Ionian',
  dorian: 'Dorian',
  phrygian: 'Phrygian',
  lydian: 'Lydian',
  mixolydian: 'Mixolydian',
  aeolian: 'Aeolian',
  locrian: 'Locrian',
}

const DIFFICULTY_LABELS: Record<PuzzleDifficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
}

const NOTE_LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const
const NATURAL_PITCH_CLASSES: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
}
const CHORD_DEGREES: ChordDegree[] = [1, 2, 3, 4, 5, 6, 7]
const CHORD_TYPES = new Set<ChordType>(['triad', 'seventh', 'sus2', 'sus4'])
const CHORD_DEGREE_SET = new Set<number>(CHORD_DEGREES)

type ParsedNote = {
  letter: string
  pitchClass: number
}

function toTitleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
}

function mod(value: number, divisor: number): number {
  return ((value % divisor) + divisor) % divisor
}

function parseNote(note: string): ParsedNote | null {
  const match = /^([A-G])([#b]{0,2})$/.exec(note)

  if (!match) {
    return null
  }

  const [, letter, accidentals] = match
  const accidentalOffset = [...accidentals].reduce((total, accidental) => {
    return total + (accidental === '#' ? 1 : -1)
  }, 0)

  return {
    letter,
    pitchClass: mod(NATURAL_PITCH_CLASSES[letter] + accidentalOffset, 12),
  }
}

function formatNote(letter: string, pitchClass: number): string {
  const naturalPitchClass = NATURAL_PITCH_CLASSES[letter]
  let accidentalOffset = mod(pitchClass - naturalPitchClass, 12)

  if (accidentalOffset > 6) {
    accidentalOffset -= 12
  }

  if (accidentalOffset > 0) {
    return `${letter}${'#'.repeat(accidentalOffset)}`
  }

  if (accidentalOffset < 0) {
    return `${letter}${'b'.repeat(Math.abs(accidentalOffset))}`
  }

  return letter
}

function getNotePitchClass(note: string): number {
  const parsed = parseNote(note)

  if (!parsed) {
    throw new Error(`[music] Invalid note '${note}'.`)
  }

  return parsed.pitchClass
}

function getChordIntervals(notes: string[]): number[] {
  const rootPitchClass = getNotePitchClass(notes[0])

  return notes.map(note => mod(getNotePitchClass(note) - rootPitchClass, 12))
}

function getChordName(notes: string[], type: ChordType): string {
  const root = notes[0]

  if (type === 'sus2') {
    return `${root}sus2`
  }

  if (type === 'sus4') {
    return `${root}sus4`
  }

  const intervals = getChordIntervals(notes)

  if (type === 'triad') {
    if (intervals.join(',') === '0,4,7') {
      return root
    }

    if (intervals.join(',') === '0,3,7') {
      return `${root}m`
    }

    if (intervals.join(',') === '0,3,6') {
      return `${root}dim`
    }
  }

  if (type === 'seventh') {
    if (intervals.join(',') === '0,4,7,11') {
      return `${root}maj7`
    }

    if (intervals.join(',') === '0,3,7,10') {
      return `${root}m7`
    }

    if (intervals.join(',') === '0,4,7,10') {
      return `${root}7`
    }

    if (intervals.join(',') === '0,3,6,10') {
      return `${root}m7b5`
    }
  }

  throw new Error(
    `[music] Unsupported ${type} quality for notes '${notes.join(', ')}' with intervals '${intervals.join(', ')}'.`,
  )
}

function validateScale(scale: string[]): void {
  if (scale.length !== 7) {
    throw new Error(`[music] A scale must contain exactly seven notes; received ${scale.length}.`)
  }

  const parsedNotes = scale.map((note) => {
    const parsed = parseNote(note)

    if (!parsed) {
      throw new Error(`[music] Invalid scale note '${note}'.`)
    }

    return parsed
  })

  if (new Set(parsedNotes.map(note => note.letter)).size !== 7) {
    throw new Error(`[music] Scale notes must use seven distinct diatonic letters: '${scale.join(', ')}'.`)
  }
}

export function normalizeModeId(mode?: string): ModeId {
  if (!mode) {
    return DEFAULT_MODE_ID
  }

  const normalized = mode.trim().toLowerCase()

  if (normalized in MODE_INTERVALS) {
    return normalized as ModeId
  }

  console.warn(`[music] Unknown mode '${mode}', falling back to '${DEFAULT_MODE_ID}'.`)
  return DEFAULT_MODE_ID
}

export function normalizeKey(key?: string): string {
  if (!key) {
    return DEFAULT_KEY
  }

  const normalized = toTitleCase(key.trim())

  if (parseNote(normalized)) {
    return normalized
  }

  console.warn(`[music] Unknown key '${key}', falling back to '${DEFAULT_KEY}'.`)
  return DEFAULT_KEY
}

export function formatModeLabel(mode: ModeId): string {
  return MODE_LABELS[mode]
}

export function formatPuzzleDifficulty(difficulty: PuzzleDifficulty): string {
  return DIFFICULTY_LABELS[difficulty]
}

export function formatKeyModeLabel(key: string, mode: ModeId): string {
  return `${key} ${formatModeLabel(mode)}`
}

export function isChordId(value: unknown): value is ChordId {
  if (!value || typeof value !== 'object') {
    return false
  }

  const chord = value as Partial<ChordId>

  return CHORD_DEGREE_SET.has(chord.degree as number)
    && CHORD_TYPES.has(chord.type as ChordType)
}

export function areChordIdsEqual(left: ChordId, right: ChordId): boolean {
  return left.degree === right.degree && left.type === right.type
}

export function chordIdKey(chord: ChordId): string {
  return `${chord.degree}:${chord.type}`
}

export function isChordAllowedForDifficulty(chord: ChordId, difficulty: PuzzleDifficulty): boolean {
  return isChordId(chord) && DIFFICULTY_CHORD_TYPES[difficulty].includes(chord.type)
}

export function buildScale(key: string, mode: ModeId): string[] {
  const normalizedKey = normalizeKey(key)
  const normalizedMode = normalizeModeId(mode)
  const tonic = parseNote(normalizedKey)

  if (!tonic) {
    throw new Error(`[music] Could not parse normalized key '${normalizedKey}'.`)
  }

  const tonicLetterIndex = NOTE_LETTERS.indexOf(tonic.letter as typeof NOTE_LETTERS[number])

  return MODE_INTERVALS[normalizedMode].map((interval, degreeIndex) => {
    const letter = NOTE_LETTERS[(tonicLetterIndex + degreeIndex) % NOTE_LETTERS.length]
    const pitchClass = mod(tonic.pitchClass + interval, 12)

    return formatNote(letter, pitchClass)
  })
}

export function buildChord(scale: string[], chord: ChordId): DisplayChord {
  validateScale(scale)

  if (!isChordId(chord)) {
    throw new Error(`[music] Invalid chord identity '${JSON.stringify(chord)}'.`)
  }

  const rootIndex = chord.degree - 1
  const notes = CHORD_RECIPES[chord.type].map(offset => scale[(rootIndex + offset) % scale.length])

  return {
    ...chord,
    name: getChordName(notes, chord.type),
    notes,
  }
}

export function buildDisplayProgression(
  key: string,
  mode: ModeId,
  progression: ChordId[],
): DisplayChord[] {
  const scale = buildScale(key, mode)

  return progression.map(chord => buildChord(scale, chord))
}

export function buildPaletteChordIds(difficulty: PuzzleDifficulty): PaletteChordIds {
  const allowedTypes = DIFFICULTY_CHORD_TYPES[difficulty]

  return {
    triad: allowedTypes.includes('triad')
      ? CHORD_DEGREES.map(degree => ({ degree, type: 'triad' }))
      : [],
    seventh: allowedTypes.includes('seventh')
      ? CHORD_DEGREES.map(degree => ({ degree, type: 'seventh' }))
      : [],
    extension: [
      ...(allowedTypes.includes('sus2')
        ? CHORD_DEGREES.map(degree => ({ degree, type: 'sus2' as const }))
        : []),
      ...(allowedTypes.includes('sus4')
        ? CHORD_DEGREES.map(degree => ({ degree, type: 'sus4' as const }))
        : []),
    ],
  }
}

export function midiFromPitchClass(pitchClass: number, octave = 4): number {
  const normalizedPitchClass = mod(pitchClass, 12)
  const baseC = 12 * (octave + 1)

  return baseC + normalizedPitchClass
}

export function hzFromMidi(midi: number): number {
  return A4_HZ * Math.pow(2, (midi - MIDI_A4) / 12)
}

export function hzFromPitchClass(pitchClass: number, octave = 4): number {
  return hzFromMidi(midiFromPitchClass(pitchClass, octave))
}

export type VoicedTone = {
  pitchClass: number
  octave: number
}

const DEFAULT_ARPEGGIO_INTERVAL_MS = 200
const DEFAULT_SEQUENCE_GAP_MS = 1200
const DEFAULT_TONE_VOLUME = 4
const MAIN_CHORD_OCTAVE = 4
const BASS_OCTAVE = MAIN_CHORD_OCTAVE - 1

export function voicedTonesFromNotes(notes: string[]): VoicedTone[] {
  if (!notes.length) {
    throw new Error('[music] Cannot voice a chord without notes.')
  }

  const rootPitchClass = getNotePitchClass(notes[0])
  const bassTone = {
    pitchClass: rootPitchClass,
    octave: BASS_OCTAVE,
  }
  const chordTones = notes.map((note) => {
    const interval = mod(getNotePitchClass(note) - rootPitchClass, 12)

    return toneFromRootInterval(rootPitchClass, MAIN_CHORD_OCTAVE, interval)
  })

  return [bassTone, ...chordTones]
}

export function playChord(notes: string[], arpeggiate: boolean, sequenceGapMs = DEFAULT_SEQUENCE_GAP_MS) {
  const tones = voicedTonesFromNotes(notes)
  const interval = arpeggiate ? getArpeggioIntervalMs(sequenceGapMs) : 0
  const volume = getChordToneVolume(tones.length)

  tones.forEach((tone, index) => {
    setTimeout(
      () => playTone(tone.pitchClass, tone.octave, volume),
      index * interval,
    )
  })
}

function toneFromRootInterval(rootPitchClass: number, octave: number, interval: number): VoicedTone {
  const midi = midiFromPitchClass(rootPitchClass, octave) + interval

  return {
    pitchClass: mod(midi, 12),
    octave: Math.floor(midi / 12) - 1,
  }
}

function getChordToneVolume(toneCount: number): number {
  if (toneCount >= 5) {
    return 3.1
  }

  if (toneCount === 4) {
    return 3.4
  }

  return DEFAULT_TONE_VOLUME
}

function getArpeggioIntervalMs(sequenceGapMs: number) {
  return DEFAULT_ARPEGGIO_INTERVAL_MS * (sequenceGapMs / DEFAULT_SEQUENCE_GAP_MS)
}

export function playTone(pitchClass: number, octave: number, volume = DEFAULT_TONE_VOLUME) {
  const frequency = hzFromPitchClass(pitchClass, octave)

  zzfx({
    volume,
    randomness: 0,
    frequency,
    attack: 0.02,
    sustain: 0.40,
    release: 0.40,
  })
}
