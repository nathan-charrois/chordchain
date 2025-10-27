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
    sustain: 0.25,
    release: 0.25,
  })
}
