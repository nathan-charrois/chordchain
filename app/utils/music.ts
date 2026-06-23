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

export type ChordType = 'triad' | 'seventh' | 'suspended' | 'sixth'
export type ChordDegree = 1 | 2 | 3 | 4 | 5 | 6 | 7

export type ChordId = {
  degree: ChordDegree
  type: ChordType
}

export type DisplayChord = ChordId & {
  name: string
  notes: string[]
  numeral: string
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

export type ArpeggiateType
  = 'triad_ascend'
    | 'triad_descend'
    | 'triad_alberti'
    | 'triad_updown'
    | 'triad_downup'
    | 'seventh_ascend'
    | 'seventh_descend'
    | 'seventh_double'
    | 'seventh_pop_ostinato'
    | 'seventh_rythmic_feel'
    | 'full_sweep'
    | 'cascade_up'
    | 'skip_thirds_up'
    | 'spiral_down'
    | 'inside_out'
    | 'broken_chord'
    | 'math_rock_syncopation'
    | 'deep_house_pulse'

export const ARPEGGIATE_RECIPES: Record<ArpeggiateType, readonly number[]> = {
  triad_ascend: [1, 2, 3],
  triad_descend: [3, 2, 1],
  triad_alberti: [1, 2, 3, 2, 3],
  triad_updown: [1, 3, 2],
  triad_downup: [3, 1, 2],
  seventh_ascend: [1, 2, 3, 4],
  seventh_descend: [4, 3, 2, 1],
  seventh_double: [1, 1, 2, 3],
  seventh_pop_ostinato: [1, 1, 3, 2, 4, 1],
  seventh_rythmic_feel: [1, 2, 3, 2, 3, 4, 3, 4],
  full_sweep: [1, 3, 2, 4, 5],
  cascade_up: [1, 2, 1, 3, 1, 4, 1, 5],
  skip_thirds_up: [1, 3, 2, 4],
  spiral_down: [4, 5, 3, 4, 2, 1],
  inside_out: [3, 2, 1, 2, 3],
  broken_chord: [1, 4, 2, 4, 3],
  math_rock_syncopation: [1, 3, 2, 4],
  deep_house_pulse: [4, 3, 4, 3, 2],
}

export const CHORD_RECIPES: Record<ChordType, readonly number[]> = {
  triad: [0, 2, 4],
  seventh: [0, 2, 4, 6],
  suspended: [0, 1, 4],
  sixth: [0, 2, 4, 5],
}

export const DIFFICULTY_CHORD_TYPES: Record<PuzzleDifficulty, readonly ChordType[]> = {
  easy: ['triad'],
  medium: ['triad', 'seventh'],
  hard: ['triad', 'seventh', 'suspended', 'sixth'],
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
const CHORD_DEGREE_NUMERALS: Record<ChordDegree, string> = {
  1: 'I',
  2: 'II',
  3: 'III',
  4: 'IV',
  5: 'V',
  6: 'VI',
  7: 'VII',
}

const CHORD_TYPES = new Set<ChordType>(['triad', 'seventh', 'suspended', 'sixth'])
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
  const intervals = getChordIntervals(notes).join(',')

  if (type === 'suspended') {
    if (intervals === '0,2,7') {
      return `${root}sus2`
    }

    if (intervals === '0,1,7') {
      return `${root}susb2`
    }

    if (intervals === '0,2,6') {
      return `${root}sus2b5`
    }

    if (intervals === '0,1,6') {
      return `${root}susb2b5`
    }
  }

  if (type === 'sixth') {
    if (intervals === '0,4,7,9') {
      return `${root}6`
    }

    if (intervals === '0,3,7,9') {
      return `${root}m6`
    }

    if (intervals === '0,3,7,8') {
      return `${root}m(addb6)`
    }

    if (intervals === '0,3,6,8') {
      return `${root}dim(addb6)`
    }
  }

  if (type === 'triad') {
    if (intervals === '0,4,7') {
      return root
    }

    if (intervals === '0,3,7') {
      return `${root}m`
    }

    if (intervals === '0,3,6') {
      return `${root}dim`
    }
  }

  if (type === 'seventh') {
    if (intervals === '0,4,7,11') {
      return `${root}maj7`
    }

    if (intervals === '0,3,7,10') {
      return `${root}m7`
    }

    if (intervals === '0,4,7,10') {
      return `${root}7`
    }

    if (intervals === '0,3,6,10') {
      return `${root}m7b5`
    }
  }

  throw new Error(
    `[music] Unsupported ${type} quality for notes '${notes.join(', ')}' with intervals '${intervals}'.`,
  )
}

function getChordNumeral(notes: string[], chord: ChordId): string {
  const numeral = CHORD_DEGREE_NUMERALS[chord.degree]
  const intervals = getChordIntervals(notes).join(',')

  if (chord.type === 'suspended') {
    if (intervals === '0,2,7') {
      return `${numeral}sus2`
    }

    if (intervals === '0,1,7') {
      return `${numeral}susb2`
    }

    if (intervals === '0,2,6') {
      return `${numeral}sus2b5`
    }

    if (intervals === '0,1,6') {
      return `${numeral}susb2b5`
    }
  }

  if (chord.type === 'sixth') {
    if (intervals === '0,4,7,9') {
      return `${numeral}6`
    }

    if (intervals === '0,3,7,9') {
      return `${numeral}m6`
    }

    if (intervals === '0,3,7,8') {
      return `${numeral}m(addb6)`
    }

    if (intervals === '0,3,6,8') {
      return `${numeral}dim(addb6)`
    }
  }

  if (chord.type === 'triad') {
    if (intervals === '0,4,7') {
      return numeral
    }

    if (intervals === '0,3,7') {
      return numeral.toLowerCase()
    }

    if (intervals === '0,3,6') {
      return `${numeral.toLowerCase()}°`
    }
  }

  if (chord.type === 'seventh') {
    if (intervals === '0,4,7,11') {
      return `${numeral}maj7`
    }

    if (intervals === '0,3,7,10') {
      return `${numeral.toLowerCase()}7`
    }

    if (intervals === '0,4,7,10') {
      return `${numeral}7`
    }

    if (intervals === '0,3,6,10') {
      return `${numeral.toLowerCase()}ø7`
    }
  }

  throw new Error(
    `[music] Unsupported ${chord.type} numeral for notes '${notes.join(', ')}' with intervals '${intervals}'.`,
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
    numeral: getChordNumeral(notes, chord),
    name: getChordName(notes, chord.type),
    notes,
  }
}

export function buildChords(
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
      ...allowedTypes.includes('suspended')
        ? CHORD_DEGREES.map(degree => ({ degree, type: 'suspended' as ChordType }))
        : [],
      ...allowedTypes.includes('sixth')
        ? CHORD_DEGREES.map(degree => ({ degree, type: 'sixth' as ChordType }))
        : [],
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

export function hzFromNote(note: string, octave = 4): number {
  return hzFromPitchClass(getNotePitchClass(note), octave)
}

export type VoicedTone = {
  pitchClass: number
  octave: number
}

const DEFAULT_TONE_INTERVAL_MS = 10
const DEFAULT_ARPEGGIATED_TONE_INTERVAL_MS = 200
const DEFAULT_SEQUENCE_GAP_MS = 1200
const DEFAULT_TONE_VOLUME = 1.7
const MAIN_CHORD_OCTAVE = 4
const BASS_OCTAVE = MAIN_CHORD_OCTAVE - 1
const ARPEGGIO_VELOCITY_PATTERN = [1, 0.72, 0.9, 0.78]

function sortNotesByArpeggiateType(
  notes: string[],
  arpeggiateType: ArpeggiateType,
): string[] {
  const recipe = ARPEGGIATE_RECIPES[arpeggiateType]

  if (!recipe) {
    return notes
  }

  return recipe
    .filter((degree) => {
      const tone = notes[degree - 1]

      if (!tone) {
        console.warn(`[music] Arpeggiator recipe references tone ${degree}, but chord only has ${notes.length} tones.`)
        return false
      }

      return true
    })
    .map((degree) => {
      const tone = notes[degree - 1]

      return tone
    })
}

export function voicedTonesFromNotes(notes: string[], arpeggiate: boolean, arpeggiateType: ArpeggiateType): VoicedTone[] {
  if (!notes.length) {
    throw new Error('[music] Cannot voice a chord without notes.')
  }

  const rootPitchClass = getNotePitchClass(notes[0])

  const bassTone = {
    pitchClass: rootPitchClass,
    octave: BASS_OCTAVE,
  }

  const sortedNotes = arpeggiate ? sortNotesByArpeggiateType(notes, arpeggiateType) : notes

  const chordTones = sortedNotes.map((note) => {
    const interval = mod(getNotePitchClass(note) - rootPitchClass, 12)
    return toneFromRootInterval(rootPitchClass, MAIN_CHORD_OCTAVE, interval)
  })

  return [bassTone, ...chordTones]
}

export function playChord(notes: string[], arpeggiate: boolean, arpeggiateType: ArpeggiateType, sequenceGapMs = DEFAULT_SEQUENCE_GAP_MS) {
  const tones = voicedTonesFromNotes(notes, arpeggiate, arpeggiateType)
  const interval = getToneIntervalMs(sequenceGapMs, arpeggiate)
  const volume = getChordToneVolume(tones.length, arpeggiate)

  const toneTimeouts = tones.map((tone, index) => {
    return setTimeout(
      () => {
        const velocity = getToneVelocity(index, tones.length, arpeggiate)
        const toneVolume = volume * velocity + 5

        if (arpeggiate) {
          playArpeggiatedTone(tone.pitchClass, tone.octave, toneVolume, index)
          return
        }

        playLushChordTone(tone.pitchClass, tone.octave, toneVolume)
      },
      index * interval,
    )
  })

  return toneTimeouts
}

function toneFromRootInterval(rootPitchClass: number, octave: number, interval: number): VoicedTone {
  const midi = midiFromPitchClass(rootPitchClass, octave) + interval

  return {
    pitchClass: mod(midi, 12),
    octave: Math.floor(midi / 12) - 1,
  }
}

function getChordToneVolume(toneCount: number, arpeggiate: boolean): number {
  if (arpeggiate) {
    return DEFAULT_TONE_VOLUME
  }

  if (toneCount >= 5) {
    return DEFAULT_TONE_VOLUME - 0.45
  }

  return DEFAULT_TONE_VOLUME - 0.25
}

function getToneVelocity(index: number, toneCount: number, arpeggiate: boolean): number {
  if (arpeggiate) {
    if (index === 0) {
      return 0.82
    }

    return ARPEGGIO_VELOCITY_PATTERN[(index - 1) % ARPEGGIO_VELOCITY_PATTERN.length]
  }

  if (index === 0) {
    return 1
  }

  if (index === 1) {
    return 0.86
  }

  if (index === toneCount - 1) {
    return 0.82
  }

  return 0.72
}

function getToneIntervalMs(sequenceGapMs: number, arpeggiate: boolean) {
  if (arpeggiate) {
    return getArpeggioIntervalMs(sequenceGapMs)
  }

  return DEFAULT_TONE_INTERVAL_MS
}

function getArpeggioIntervalMs(sequenceGapMs: number) {
  return DEFAULT_ARPEGGIATED_TONE_INTERVAL_MS * (sequenceGapMs / DEFAULT_SEQUENCE_GAP_MS)
}

function getBassOctaveMultiplier(octave: number): number {
  return octave <= BASS_OCTAVE ? 1.25 : 1
}

function playLushChordTone(pitchClass: number, octave: number, volume: number) {
  const frequency = hzFromPitchClass(pitchClass, octave)
  const sustainMultiplier = getBassOctaveMultiplier(octave)
  const harmonicVolume = octave <= BASS_OCTAVE ? 0.14 : 0.24

  zzfx({
    volume: volume * 0.82,
    randomness: 0,
    frequency,
    attack: 0.025,
    decay: 0.08,
    sustain: 0.62 * sustainMultiplier,
    release: 0.48,
    shape: 0,
    sustainVolume: 0.88,
  })

  zzfx({
    volume: volume * harmonicVolume,
    randomness: 0,
    frequency,
    attack: 0.015,
    decay: 0.12,
    sustain: 0.48 * sustainMultiplier,
    release: 0.58,
    shape: 1,
    shapeCurve: 0.8,
    delay: 0.045,
    sustainVolume: 0.6,
  })
}

function playArpeggiatedTone(pitchClass: number, octave: number, volume: number, stepIndex: number) {
  const frequency = hzFromPitchClass(pitchClass, octave)
  const sustainMultiplier = getBassOctaveMultiplier(octave)
  const brightnessVolume = octave <= BASS_OCTAVE ? 0.08 : 0.16

  zzfx({
    volume: volume * 1.1,
    randomness: 0,
    frequency,
    attack: 0.004,
    decay: 0.055,
    sustain: 0.14 * sustainMultiplier,
    release: 0.16,
    shape: 1,
    shapeCurve: 0.7,
    delay: stepIndex % 2 === 0 ? 0.035 : 0.055,
    sustainVolume: 0.52,
  })

  zzfx({
    volume: volume * brightnessVolume,
    randomness: 0,
    frequency: frequency * 2,
    attack: 0.001,
    decay: 0.018,
    sustain: 0.015,
    release: 0.05,
    shape: 1,
    shapeCurve: 0.65,
    sustainVolume: 0.2,
  })
}

export function playTone(pitchClass: number, octave: number, volume = DEFAULT_TONE_VOLUME) {
  const frequency = hzFromPitchClass(pitchClass, octave)
  const sustainMultiplier = getBassOctaveMultiplier(octave)

  zzfx({
    volume: volume,
    randomness: 0,
    frequency,
    attack: 0.015,
    sustain: 0.50 * sustainMultiplier,
    release: 0.25,
  })
}
