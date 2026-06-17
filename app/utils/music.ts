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
  maj7: [0, 4, 7, 11],
  m7: [0, 3, 7, 10],
  dom7: [0, 4, 7, 10],
  m7b5: [0, 3, 6, 10],
}

export type PaletteSections = {
  diatonic: string[]
  secondaryDominant: string[]
  extensions: string[]
}

export type PaletteSectionId = keyof PaletteSections

export type ModeId
  = | 'ionian'
    | 'dorian'
    | 'phrygian'
    | 'lydian'
    | 'mixolydian'
    | 'aeolian'
    | 'locrian'

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
  if (quality === 'major') {
    return `${root}maj`
  }

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

function getSeventhQuality(
  thirdOffset: number,
  fifthOffset: number,
  seventhOffset: number,
): 'maj7' | 'm7' | 'dom7' | 'm7b5' {
  if (thirdOffset === 4 && fifthOffset === 7 && seventhOffset === 11) {
    return 'maj7'
  }

  if (thirdOffset === 3 && fifthOffset === 7 && seventhOffset === 10) {
    return 'm7'
  }

  if (thirdOffset === 4 && fifthOffset === 7 && seventhOffset === 10) {
    return 'dom7'
  }

  if (thirdOffset === 3 && fifthOffset === 6 && seventhOffset === 10) {
    return 'm7b5'
  }

  return 'dom7'
}

function getSeventhChordLabel(root: string, quality: 'maj7' | 'm7' | 'dom7' | 'm7b5'): string {
  if (quality === 'dom7') {
    return `${root}7`
  }

  return `${root}${quality}`
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

export function normalizeChordLabel(chord: string): string {
  const value = chord.trim()

  if (!value) {
    return value
  }

  if (value.endsWith('maj') || value.endsWith('m') || value.endsWith('dim') || value.endsWith('aug')) {
    return value
  }

  if (value.endsWith('maj7') || value.endsWith('m7') || value.endsWith('m7b5') || value.endsWith('7')) {
    return value
  }

  return `${value}maj`
}

export function getDiatonicTriadsByPolicy(key: string, mode: ModeId): string[] {
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

export function getSecondaryDominants(key: string, mode: ModeId): string[] {
  const scalePitchClasses = getScalePitchClasses(key, mode)

  return scalePitchClasses.map((targetPitchClass) => {
    const dominantRootPitchClass = (targetPitchClass + 7) % 12
    return `${PITCH_CLASSES[dominantRootPitchClass]}7`
  })
}

export function getDiatonicExtensions(key: string, mode: ModeId): string[] {
  const scalePitchClasses = getScalePitchClasses(key, mode)

  return scalePitchClasses.map((rootPitchClass, degree) => {
    const thirdPitchClass = scalePitchClasses[(degree + 2) % 7]
    const fifthPitchClass = scalePitchClasses[(degree + 4) % 7]
    const seventhPitchClass = scalePitchClasses[(degree + 6) % 7]
    const thirdOffset = (thirdPitchClass - rootPitchClass + 12) % 12
    const fifthOffset = (fifthPitchClass - rootPitchClass + 12) % 12
    const seventhOffset = (seventhPitchClass - rootPitchClass + 12) % 12
    const quality = getSeventhQuality(thirdOffset, fifthOffset, seventhOffset)
    const rootLabel = PITCH_CLASSES[rootPitchClass]

    return getSeventhChordLabel(rootLabel, quality)
  })
}

export function getPaletteSections(key: string, mode: ModeId): PaletteSections {
  return {
    diatonic: getDiatonicTriadsByPolicy(key, mode),
    secondaryDominant: getSecondaryDominants(key, mode),
    extensions: getDiatonicExtensions(key, mode),
  }
}

export function flattenPaletteSections(sections: PaletteSections): string[] {
  return [...sections.diatonic, ...sections.secondaryDominant, ...sections.extensions]
}

export function filterPaletteSections(sections: PaletteSections, enabledSectionIds: PaletteSectionId[]): PaletteSections {
  const enabledSectionIdSet = new Set(enabledSectionIds)

  return {
    diatonic: enabledSectionIdSet.has('diatonic') ? sections.diatonic : [],
    secondaryDominant: enabledSectionIdSet.has('secondaryDominant') ? sections.secondaryDominant : [],
    extensions: enabledSectionIdSet.has('extensions') ? sections.extensions : [],
  }
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
  const rootMatch = chord.match(/^([A-G](?:b)?)/)

  if (!rootMatch) {
    return chord
  }

  return rootMatch[1]
}

export function qualityFromChord(chord: string): string {
  if (chord.endsWith('maj7')) return 'maj7'
  if (chord.endsWith('m7b5')) return 'm7b5'
  if (chord.endsWith('m7')) return 'm7'
  if (chord.endsWith('7')) return 'dom7'
  if (chord.endsWith('dim')) return 'dim'
  if (chord.endsWith('aug')) return 'aug'
  if (chord.endsWith('m')) return 'minor'
  if (chord.endsWith('maj')) return 'major'
  return 'major'
}

export function pitchClassesFromChord(chord: string): number[] {
  const root = rootFromChord(chord)
  const rootPitchClass = PITCH_CLASS_TO_NUM[root]

  const quality = qualityFromChord(chord)
  const intervals = CHORD_INTERVALS[quality]

  return intervals.map(i => (rootPitchClass + i) % 12)
}

export type VoicedTone = {
  pitchClass: number
  octave: number
}

export function intervalsFromChord(chord: string): number[] {
  const quality = qualityFromChord(chord)
  const intervals = CHORD_INTERVALS[quality]

  if (!intervals) {
    return CHORD_INTERVALS.major
  }

  return [...intervals]
}

export function voicedTonesFromChord(chord: string): VoicedTone[] {
  const root = rootFromChord(chord)
  const rootPitchClass = PITCH_CLASS_TO_NUM[root]

  if (rootPitchClass === undefined) {
    console.warn(`[music] Could not resolve chord root '${root}' from '${chord}'.`)
    return []
  }

  const intervals = intervalsFromChord(chord)
  const bassTone = {
    pitchClass: rootPitchClass,
    octave: BASS_OCTAVE,
  }
  const chordTones = intervals.map(interval => toneFromRootInterval(rootPitchClass, MAIN_CHORD_OCTAVE, interval))

  return [bassTone, ...chordTones]
}

const DEFAULT_ARPEGGIO_INTERVAL_MS = 200
const DEFAULT_SEQUENCE_GAP_MS = 1200
const DEFAULT_TONE_VOLUME = 4
const MAIN_CHORD_OCTAVE = 4
const BASS_OCTAVE = MAIN_CHORD_OCTAVE - 1

export function playChord(chord: string, arpeggiate: boolean, sequenceGapMs = DEFAULT_SEQUENCE_GAP_MS) {
  const tones = voicedTonesFromChord(chord)
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
    pitchClass: ((midi % 12) + 12) % 12,
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
