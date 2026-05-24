import zzfx from './zzfx'

export const MIDI_A4 = 69
export const A4_HZ = 440

export const PITCH_CLASSES = [
  'C', 'Db', 'D', 'Eb',
  'E', 'F', 'Gb', 'G',
  'Ab', 'A', 'Bb', 'B',
] as const

export const PITCH_CLASS_TO_NUM: Record<string, number> = Object.fromEntries(
  PITCH_CLASSES.map((n, i) => [n, i]),
)

export const SCALE_INTERVALS: Record<string, number[]> = {
  ionian: [0, 2, 4, 5, 7, 9, 11],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  aeolian: [0, 2, 3, 5, 7, 8, 10],
  locrian: [0, 1, 3, 5, 6, 8, 10],
}

export const CHORD_INTERVALS: Record<string, number[]> = {
  major: [0, 4, 7],
  minor: [0, 3, 7],
  dim: [0, 3, 6],
  aug: [0, 4, 8],
}

export type ModeId
  = | 'ionian'
    | 'dorian'
    | 'phrygian'
    | 'lydian'
    | 'mixolydian'
    | 'aeolian'
    | 'locrian'

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

const PITCH_CLASS_ALIASES: Record<string, string> = {
  'C#': 'Db',
  'D#': 'Eb',
  'F#': 'Gb',
  'G#': 'Ab',
  'A#': 'Bb',
}

function toTitleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
}

export function normalizeModeId(mode?: string): ModeId {
  if (!mode) {
    return DEFAULT_MODE_ID
  }

  const normalized = mode.trim().toLowerCase()

  if (normalized in SCALE_INTERVALS) {
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
  const alias = PITCH_CLASS_ALIASES[normalized] ?? normalized

  if (alias in PITCH_CLASS_TO_NUM) {
    return alias
  }

  console.warn(`[music] Unknown key '${key}', falling back to '${DEFAULT_KEY}'.`)
  return DEFAULT_KEY
}

export function formatModeLabel(mode: ModeId): string {
  return MODE_LABELS[mode]
}

export function formatKeyModeLabel(key: string, mode: ModeId): string {
  return `${key} ${formatModeLabel(mode)}`
}

function getTriadQuality(thirdOffset: number, fifthOffset: number): 'major' | 'minor' | 'dim' | 'aug' {
  if (thirdOffset === 4 && fifthOffset === 7) {
    return 'major'
  }

  if (thirdOffset === 3 && fifthOffset === 7) {
    return 'minor'
  }

  if (thirdOffset === 3 && fifthOffset === 6) {
    return 'dim'
  }

  if (thirdOffset === 4 && fifthOffset === 8) {
    return 'aug'
  }

  // Fallback keeps generation deterministic for malformed input.
  return 'major'
}

function getChordLabel(root: string, quality: 'major' | 'minor' | 'dim' | 'aug'): string {
  if (quality === 'minor') {
    return `${root}m`
  }

  if (quality === 'dim') {
    return `${root}dim`
  }

  if (quality === 'aug') {
    return `${root}aug`
  }

  return root
}

export function getScalePitchClasses(key: string, mode: ModeId): number[] {
  const root = normalizeKey(key)
  const modeId = normalizeModeId(mode)
  const rootPitchClass = PITCH_CLASS_TO_NUM[root]

  return SCALE_INTERVALS[modeId].map(interval => (rootPitchClass + interval) % 12)
}

export function getDiatonicTriads(key: string, mode: ModeId): string[] {
  const scalePitchClasses = getScalePitchClasses(key, mode)

  return scalePitchClasses.map((rootPitchClass, degree) => {
    const thirdPitchClass = scalePitchClasses[(degree + 2) % 7]
    const fifthPitchClass = scalePitchClasses[(degree + 4) % 7]
    const thirdOffset = (thirdPitchClass - rootPitchClass + 12) % 12
    const fifthOffset = (fifthPitchClass - rootPitchClass + 12) % 12
    const quality = getTriadQuality(thirdOffset, fifthOffset)
    const rootLabel = PITCH_CLASSES[rootPitchClass]

    return getChordLabel(rootLabel, quality)
  })
}

export function midiFromPitchClass(pitchClass: number, octave = 4): number {
  const n = ((pitchClass % 12) + 12) % 12
  const baseC = 12 * (octave + 1)
  return baseC + n
}

export function hzFromMidi(midi: number): number {
  return A4_HZ * Math.pow(2, (midi - MIDI_A4) / 12)
}

export function hzFromPitchClass(pc: number, octave = 4): number {
  const midi = midiFromPitchClass(pc, octave)
  return hzFromMidi(midi)
}

export function rootFromChord(chord: string): string {
  return chord.replace(/m|dim/g, '')
}

export function qualityFromChord(chord: string): string {
  if (chord.endsWith('dim')) return 'dim'
  if (chord.endsWith('m')) return 'minor'
  return 'major'
}

export function pitchClassesFromChord(chord: string): number[] {
  const root = rootFromChord(chord)
  const rootPitchClass = PITCH_CLASS_TO_NUM[root]

  const quality = qualityFromChord(chord)
  const intervals = CHORD_INTERVALS[quality]

  return intervals.map(i => (rootPitchClass + i) % 12)
}

export function playChord(chord: string, arpeggiate: boolean) {
  const pitchClasses = pitchClassesFromChord(chord)
  const interval = arpeggiate ? 200 : 0

  pitchClasses.map((pitchClass, index) => {
    setTimeout(
      () => playTone(pitchClass, 4),
      index * interval,
    )
  })
}

export function playTone(pitchClass: number, octave: number) {
  const frequency = hzFromPitchClass(pitchClass, octave)

  zzfx({
    volume: 4,
    randomness: 0,
    frequency,
    attack: 0.01,
    sustain: 0.30,
    release: 0.30,
  })
}
