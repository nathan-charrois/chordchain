import { hzFromNote } from './music'
import zzfx from './zzfx'

export type DrumInstrument
  = | 'kick'
    | 'snare'
    | 'closedHat'
    | 'openHat'
    | 'rim'
    | 'subBass'
    | 'wobbleBass'
    | 'bassGrowl'
    | 'crash'
    | 'dropImpact'
    | 'highTom'
    | 'lowTom'
    | 'rideBell'
    | 'china'
    | 'clubKick'
    | 'houseClap'
    | 'shaker'
    | 'tambourine'
    | 'houseBass'
    | 'houseBassPluck'
export type DrumLoopId
  = | 'loFiPocket'
    | 'dustyBreak'
    | 'halfTimeHeadNod'
    | 'boomBapBounce'
    | 'midnightDrive'
    | 'brokenTape'
    | 'dubSpace'
    | 'rimRunner'
    | 'neonWobble'
    | 'earthquakeDrop'
    | 'laserSkank'
    | 'fracturedSeven'
    | 'angularSprint'
    | 'polymeterPanic'
    | 'deepHousePulse'
    | 'velvetBasement'
    | 'sunriseTerrace'

export type DrumHit = {
  beat: number
  subdivision: number
  subdivisionsPerBeat?: 2 | 4
  instrument: DrumInstrument
}

type DrumVariationOperation
  = | { type: 'add', hit: DrumHit }
    | { type: 'remove', hit: DrumHit }
    | { type: 'replace', from: DrumHit, to: DrumHit }

type DrumVariation = DrumVariationOperation[]

export const DEFAULT_DRUM_LOOP_ID: DrumLoopId = 'loFiPocket'
export const DRUM_LOOP_BEATS = 4

export const DRUM_LOOP_OPTIONS: { value: DrumLoopId, label: string }[] = [
  { value: 'loFiPocket', label: 'Lo-fi Pocket' },
  { value: 'dustyBreak', label: 'Dusty Break' },
  { value: 'halfTimeHeadNod', label: 'Half-time Head Nod' },
  { value: 'boomBapBounce', label: 'Boom Bap Bounce' },
  { value: 'midnightDrive', label: 'Midnight Drive' },
  { value: 'brokenTape', label: 'Broken Tape' },
  { value: 'dubSpace', label: 'Dub Space' },
  { value: 'rimRunner', label: 'Rim Runner' },
  { value: 'neonWobble', label: 'Neon Wobble' },
  { value: 'earthquakeDrop', label: 'Earthquake Drop' },
  { value: 'laserSkank', label: 'Laser Skank' },
  { value: 'fracturedSeven', label: 'Fractured Seven' },
  { value: 'angularSprint', label: 'Angular Sprint' },
  { value: 'polymeterPanic', label: 'Polymeter Panic' },
  { value: 'deepHousePulse', label: 'Deep House Pulse' },
  { value: 'velvetBasement', label: 'Velvet Basement' },
  { value: 'sunriseTerrace', label: 'Sunrise Terrace' },
]

const DRUM_LOOPS: Record<DrumLoopId, DrumHit[]> = {
  loFiPocket: [
    { beat: 0, subdivision: 0, instrument: 'kick' },
    { beat: 0, subdivision: 0, instrument: 'closedHat' },
    { beat: 0, subdivision: 1, instrument: 'closedHat' },
    { beat: 1, subdivision: 0, instrument: 'snare' },
    { beat: 1, subdivision: 0, instrument: 'closedHat' },
    { beat: 1, subdivision: 1, instrument: 'kick' },
    { beat: 1, subdivision: 1, instrument: 'closedHat' },
    { beat: 2, subdivision: 0, instrument: 'kick' },
    { beat: 2, subdivision: 0, instrument: 'closedHat' },
    { beat: 2, subdivision: 1, instrument: 'closedHat' },
    { beat: 3, subdivision: 0, instrument: 'snare' },
    { beat: 3, subdivision: 0, instrument: 'closedHat' },
    { beat: 3, subdivision: 1, instrument: 'openHat' },
  ],
  dustyBreak: [
    { beat: 0, subdivision: 0, instrument: 'kick' },
    { beat: 0, subdivision: 0, instrument: 'closedHat' },
    { beat: 0, subdivision: 1, instrument: 'rim' },
    { beat: 1, subdivision: 0, instrument: 'snare' },
    { beat: 1, subdivision: 0, instrument: 'closedHat' },
    { beat: 1, subdivision: 1, instrument: 'closedHat' },
    { beat: 2, subdivision: 0, instrument: 'kick' },
    { beat: 2, subdivision: 0, instrument: 'closedHat' },
    { beat: 2, subdivision: 1, instrument: 'kick' },
    { beat: 2, subdivision: 1, instrument: 'openHat' },
    { beat: 3, subdivision: 0, instrument: 'snare' },
    { beat: 3, subdivision: 0, instrument: 'closedHat' },
    { beat: 3, subdivision: 1, instrument: 'rim' },
  ],
  halfTimeHeadNod: [
    { beat: 0, subdivision: 0, instrument: 'kick' },
    { beat: 0, subdivision: 0, instrument: 'closedHat' },
    { beat: 0, subdivision: 1, instrument: 'closedHat' },
    { beat: 1, subdivision: 0, instrument: 'rim' },
    { beat: 1, subdivision: 0, instrument: 'closedHat' },
    { beat: 1, subdivision: 1, instrument: 'kick' },
    { beat: 1, subdivision: 1, instrument: 'closedHat' },
    { beat: 2, subdivision: 0, instrument: 'snare' },
    { beat: 2, subdivision: 0, instrument: 'closedHat' },
    { beat: 2, subdivision: 1, instrument: 'openHat' },
    { beat: 3, subdivision: 0, instrument: 'closedHat' },
    { beat: 3, subdivision: 1, instrument: 'kick' },
    { beat: 3, subdivision: 1, instrument: 'closedHat' },
  ],
  boomBapBounce: [
    { beat: 0, subdivision: 0, instrument: 'kick' },
    { beat: 0, subdivision: 0, instrument: 'closedHat' },
    { beat: 0, subdivision: 1, instrument: 'rim' },
    { beat: 1, subdivision: 0, instrument: 'snare' },
    { beat: 1, subdivision: 0, instrument: 'closedHat' },
    { beat: 1, subdivision: 1, instrument: 'kick' },
    { beat: 1, subdivision: 1, instrument: 'closedHat' },
    { beat: 2, subdivision: 0, instrument: 'kick' },
    { beat: 2, subdivision: 0, instrument: 'closedHat' },
    { beat: 2, subdivision: 1, instrument: 'closedHat' },
    { beat: 3, subdivision: 0, instrument: 'snare' },
    { beat: 3, subdivision: 0, instrument: 'closedHat' },
    { beat: 3, subdivision: 1, instrument: 'openHat' },
  ],
  midnightDrive: [
    { beat: 0, subdivision: 0, instrument: 'kick' },
    { beat: 0, subdivision: 1, instrument: 'closedHat' },
    { beat: 1, subdivision: 0, instrument: 'kick' },
    { beat: 1, subdivision: 0, instrument: 'snare' },
    { beat: 1, subdivision: 1, instrument: 'closedHat' },
    { beat: 2, subdivision: 0, instrument: 'kick' },
    { beat: 2, subdivision: 1, instrument: 'closedHat' },
    { beat: 3, subdivision: 0, instrument: 'kick' },
    { beat: 3, subdivision: 0, instrument: 'snare' },
    { beat: 3, subdivision: 1, instrument: 'openHat' },
  ],
  brokenTape: [
    { beat: 0, subdivision: 0, instrument: 'kick' },
    { beat: 0, subdivision: 1, instrument: 'kick' },
    { beat: 0, subdivision: 1, instrument: 'closedHat' },
    { beat: 1, subdivision: 0, instrument: 'snare' },
    { beat: 1, subdivision: 1, instrument: 'rim' },
    { beat: 2, subdivision: 0, instrument: 'closedHat' },
    { beat: 2, subdivision: 1, instrument: 'kick' },
    { beat: 2, subdivision: 1, instrument: 'openHat' },
    { beat: 3, subdivision: 0, instrument: 'snare' },
    { beat: 3, subdivision: 1, instrument: 'closedHat' },
  ],
  dubSpace: [
    { beat: 0, subdivision: 0, instrument: 'kick' },
    { beat: 0, subdivision: 1, instrument: 'closedHat' },
    { beat: 1, subdivision: 1, instrument: 'rim' },
    { beat: 2, subdivision: 0, instrument: 'snare' },
    { beat: 2, subdivision: 1, instrument: 'openHat' },
    { beat: 3, subdivision: 1, instrument: 'kick' },
  ],
  rimRunner: [
    { beat: 0, subdivision: 0, instrument: 'kick' },
    { beat: 0, subdivision: 0, instrument: 'closedHat' },
    { beat: 0, subdivision: 1, instrument: 'rim' },
    { beat: 1, subdivision: 0, instrument: 'snare' },
    { beat: 1, subdivision: 1, instrument: 'rim' },
    { beat: 2, subdivision: 0, instrument: 'kick' },
    { beat: 2, subdivision: 0, instrument: 'closedHat' },
    { beat: 2, subdivision: 1, instrument: 'rim' },
    { beat: 3, subdivision: 0, instrument: 'snare' },
    { beat: 3, subdivision: 1, instrument: 'openHat' },
  ],
  neonWobble: [
    { beat: 0, subdivision: 0, instrument: 'kick' },
    { beat: 0, subdivision: 0, instrument: 'crash' },
    { beat: 0, subdivision: 0, instrument: 'subBass' },
    { beat: 0, subdivision: 1, instrument: 'wobbleBass' },
    { beat: 0, subdivision: 1, instrument: 'closedHat' },
    { beat: 1, subdivision: 0, instrument: 'wobbleBass' },
    { beat: 1, subdivision: 1, instrument: 'bassGrowl' },
    { beat: 1, subdivision: 1, instrument: 'closedHat' },
    { beat: 2, subdivision: 0, instrument: 'kick' },
    { beat: 2, subdivision: 0, instrument: 'snare' },
    { beat: 2, subdivision: 0, instrument: 'subBass' },
    { beat: 2, subdivision: 1, instrument: 'wobbleBass' },
    { beat: 2, subdivision: 1, instrument: 'closedHat' },
    { beat: 3, subdivision: 0, instrument: 'bassGrowl' },
    { beat: 3, subdivision: 1, instrument: 'wobbleBass' },
    { beat: 3, subdivision: 1, instrument: 'openHat' },
  ],
  earthquakeDrop: [
    { beat: 0, subdivision: 0, instrument: 'dropImpact' },
    { beat: 0, subdivision: 0, instrument: 'crash' },
    { beat: 0, subdivision: 0, instrument: 'subBass' },
    { beat: 0, subdivision: 1, instrument: 'bassGrowl' },
    { beat: 1, subdivision: 0, instrument: 'kick' },
    { beat: 1, subdivision: 0, instrument: 'wobbleBass' },
    { beat: 1, subdivision: 1, instrument: 'closedHat' },
    { beat: 2, subdivision: 0, instrument: 'snare' },
    { beat: 2, subdivision: 0, instrument: 'subBass' },
    { beat: 2, subdivision: 1, instrument: 'bassGrowl' },
    { beat: 2, subdivision: 1, instrument: 'closedHat' },
    { beat: 3, subdivision: 0, instrument: 'kick' },
    { beat: 3, subdivision: 0, instrument: 'wobbleBass' },
    { beat: 3, subdivision: 1, instrument: 'bassGrowl' },
    { beat: 3, subdivision: 1, instrument: 'openHat' },
  ],
  laserSkank: [
    { beat: 0, subdivision: 0, instrument: 'kick' },
    { beat: 0, subdivision: 0, instrument: 'subBass' },
    { beat: 0, subdivision: 1, instrument: 'bassGrowl' },
    { beat: 0, subdivision: 1, instrument: 'closedHat' },
    { beat: 1, subdivision: 0, instrument: 'wobbleBass' },
    { beat: 1, subdivision: 1, instrument: 'kick' },
    { beat: 1, subdivision: 1, instrument: 'closedHat' },
    { beat: 2, subdivision: 0, instrument: 'snare' },
    { beat: 2, subdivision: 0, instrument: 'crash' },
    { beat: 2, subdivision: 0, instrument: 'subBass' },
    { beat: 2, subdivision: 1, instrument: 'wobbleBass' },
    { beat: 2, subdivision: 1, instrument: 'closedHat' },
    { beat: 3, subdivision: 0, instrument: 'bassGrowl' },
    { beat: 3, subdivision: 1, instrument: 'kick' },
    { beat: 3, subdivision: 1, instrument: 'openHat' },
  ],
  fracturedSeven: [
    sixteenthHit(0, 0, 'kick'),
    sixteenthHit(0, 0, 'china'),
    sixteenthHit(0, 1, 'closedHat'),
    sixteenthHit(0, 2, 'snare'),
    sixteenthHit(0, 3, 'highTom'),
    sixteenthHit(1, 0, 'kick'),
    sixteenthHit(1, 1, 'rideBell'),
    sixteenthHit(1, 2, 'lowTom'),
    sixteenthHit(1, 3, 'kick'),
    sixteenthHit(2, 0, 'snare'),
    sixteenthHit(2, 0, 'china'),
    sixteenthHit(2, 1, 'highTom'),
    sixteenthHit(2, 2, 'kick'),
    sixteenthHit(2, 3, 'rideBell'),
    sixteenthHit(3, 0, 'lowTom'),
    sixteenthHit(3, 1, 'kick'),
    sixteenthHit(3, 2, 'snare'),
    sixteenthHit(3, 3, 'china'),
  ],
  angularSprint: [
    sixteenthHit(0, 0, 'kick'),
    sixteenthHit(0, 0, 'rideBell'),
    sixteenthHit(0, 1, 'highTom'),
    sixteenthHit(0, 2, 'closedHat'),
    sixteenthHit(0, 3, 'snare'),
    sixteenthHit(1, 0, 'lowTom'),
    sixteenthHit(1, 1, 'kick'),
    sixteenthHit(1, 2, 'rideBell'),
    sixteenthHit(1, 3, 'highTom'),
    sixteenthHit(2, 0, 'snare'),
    sixteenthHit(2, 0, 'china'),
    sixteenthHit(2, 1, 'kick'),
    sixteenthHit(2, 2, 'lowTom'),
    sixteenthHit(2, 3, 'closedHat'),
    sixteenthHit(3, 0, 'kick'),
    sixteenthHit(3, 1, 'rideBell'),
    sixteenthHit(3, 2, 'snare'),
    sixteenthHit(3, 3, 'highTom'),
  ],
  polymeterPanic: [
    sixteenthHit(0, 0, 'kick'),
    sixteenthHit(0, 0, 'china'),
    sixteenthHit(0, 2, 'rideBell'),
    sixteenthHit(0, 3, 'highTom'),
    sixteenthHit(1, 0, 'snare'),
    sixteenthHit(1, 1, 'kick'),
    sixteenthHit(1, 3, 'lowTom'),
    sixteenthHit(2, 0, 'rideBell'),
    sixteenthHit(2, 1, 'snare'),
    sixteenthHit(2, 2, 'highTom'),
    sixteenthHit(2, 3, 'kick'),
    sixteenthHit(3, 0, 'china'),
    sixteenthHit(3, 1, 'lowTom'),
    sixteenthHit(3, 2, 'kick'),
    sixteenthHit(3, 3, 'snare'),
  ],
  deepHousePulse: [
    sixteenthHit(0, 0, 'clubKick'),
    sixteenthHit(0, 1, 'shaker'),
    sixteenthHit(0, 2, 'openHat'),
    sixteenthHit(0, 2, 'houseBass'),
    sixteenthHit(0, 3, 'shaker'),
    sixteenthHit(1, 0, 'clubKick'),
    sixteenthHit(1, 0, 'houseClap'),
    sixteenthHit(1, 1, 'shaker'),
    sixteenthHit(1, 2, 'openHat'),
    sixteenthHit(1, 3, 'houseBassPluck'),
    sixteenthHit(2, 0, 'clubKick'),
    sixteenthHit(2, 1, 'houseBassPluck'),
    sixteenthHit(2, 1, 'shaker'),
    sixteenthHit(2, 2, 'openHat'),
    sixteenthHit(2, 2, 'houseBass'),
    sixteenthHit(2, 3, 'shaker'),
    sixteenthHit(3, 0, 'clubKick'),
    sixteenthHit(3, 0, 'houseClap'),
    sixteenthHit(3, 1, 'shaker'),
    sixteenthHit(3, 2, 'openHat'),
    sixteenthHit(3, 2, 'tambourine'),
    sixteenthHit(3, 3, 'houseBassPluck'),
  ],
  velvetBasement: [
    sixteenthHit(0, 0, 'clubKick'),
    sixteenthHit(0, 1, 'closedHat'),
    sixteenthHit(0, 2, 'houseBass'),
    sixteenthHit(0, 3, 'shaker'),
    sixteenthHit(1, 0, 'clubKick'),
    sixteenthHit(1, 0, 'houseClap'),
    sixteenthHit(1, 1, 'houseBassPluck'),
    sixteenthHit(1, 2, 'openHat'),
    sixteenthHit(1, 3, 'shaker'),
    sixteenthHit(2, 0, 'clubKick'),
    sixteenthHit(2, 1, 'closedHat'),
    sixteenthHit(2, 2, 'houseBass'),
    sixteenthHit(2, 3, 'houseBassPluck'),
    sixteenthHit(2, 3, 'shaker'),
    sixteenthHit(3, 0, 'clubKick'),
    sixteenthHit(3, 0, 'houseClap'),
    sixteenthHit(3, 1, 'closedHat'),
    sixteenthHit(3, 2, 'openHat'),
    sixteenthHit(3, 3, 'houseBassPluck'),
    sixteenthHit(3, 3, 'tambourine'),
  ],
  sunriseTerrace: [
    sixteenthHit(0, 0, 'clubKick'),
    sixteenthHit(0, 0, 'tambourine'),
    sixteenthHit(0, 1, 'shaker'),
    sixteenthHit(0, 2, 'openHat'),
    sixteenthHit(0, 2, 'houseBass'),
    sixteenthHit(0, 3, 'shaker'),
    sixteenthHit(1, 0, 'clubKick'),
    sixteenthHit(1, 0, 'houseClap'),
    sixteenthHit(1, 1, 'houseBassPluck'),
    sixteenthHit(1, 1, 'shaker'),
    sixteenthHit(1, 2, 'openHat'),
    sixteenthHit(1, 3, 'shaker'),
    sixteenthHit(2, 0, 'clubKick'),
    sixteenthHit(2, 1, 'shaker'),
    sixteenthHit(2, 2, 'openHat'),
    sixteenthHit(2, 2, 'houseBass'),
    sixteenthHit(2, 3, 'houseBassPluck'),
    sixteenthHit(2, 3, 'shaker'),
    sixteenthHit(3, 0, 'clubKick'),
    sixteenthHit(3, 0, 'houseClap'),
    sixteenthHit(3, 1, 'houseBassPluck'),
    sixteenthHit(3, 1, 'shaker'),
    sixteenthHit(3, 2, 'openHat'),
    sixteenthHit(3, 2, 'tambourine'),
    sixteenthHit(3, 3, 'shaker'),
  ],
}

const DRUM_LOOP_VARIATIONS: Record<DrumLoopId, DrumVariation[]> = {
  loFiPocket: [
    [
      addHit(2, 1, 'rim'),
    ],
    [
      removeHit(1, 1, 'kick'),
      addHit(3, 1, 'kick'),
    ],
    [
      replaceHit(3, 1, 'openHat', 'rim'),
      addHit(0, 1, 'kick'),
    ],
  ],
  dustyBreak: [
    [],
    [],
    [],
    [
      removeHit(2, 1, 'kick'),
      addHit(1, 1, 'rim'),
      addHit(3, 1, 'kick'),
    ],
    [
      removeHit(0, 1, 'rim'),
      addHit(0, 1, 'kick'),
      replaceHit(3, 1, 'rim', 'openHat'),
    ],
    // [
    //   replaceHit(3, 1, 'rim', 'kick'),
    //   replaceHit(2, 1, 'openHat', 'closedHat'),
    // ],
    // [
    //   removeHit(2, 1, 'kick'),
    //   addHit(1, 1, 'rim'),
    //   addHit(3, 1, 'kick'),
    // ],
    // [
    //   removeHit(0, 1, 'rim'),
    //   addHit(0, 1, 'kick'),
    //   replaceHit(3, 1, 'rim', 'openHat'),
    // ],
  ],
  halfTimeHeadNod: [
    [
      addHit(0, 1, 'rim'),
      addHit(3, 0, 'kick'),
    ],
    [
      removeHit(1, 1, 'kick'),
      addHit(2, 1, 'kick'),
    ],
    [
      replaceHit(2, 1, 'openHat', 'closedHat'),
      addHit(3, 1, 'snare'),
    ],
  ],
  boomBapBounce: [
    [
      addHit(2, 1, 'kick'),
    ],
    [
      removeHit(0, 1, 'rim'),
      addHit(0, 1, 'kick'),
      addHit(3, 1, 'rim'),
    ],
    [
      removeHit(1, 1, 'kick'),
      addHit(3, 1, 'kick'),
      replaceHit(3, 1, 'openHat', 'closedHat'),
    ],
  ],
  midnightDrive: [
    [
      addHit(0, 1, 'rim'),
      addHit(2, 1, 'rim'),
    ],
    [
      removeHit(1, 0, 'kick'),
      addHit(1, 1, 'kick'),
      replaceHit(3, 1, 'openHat', 'closedHat'),
    ],
    [
      addHit(0, 1, 'kick'),
      addHit(3, 1, 'rim'),
    ],
  ],
  brokenTape: [
    [
      replaceHit(0, 1, 'kick', 'rim'),
      addHit(3, 1, 'kick'),
    ],
    [
      removeHit(1, 1, 'rim'),
      addHit(1, 1, 'closedHat'),
      addHit(2, 0, 'rim'),
    ],
    [
      replaceHit(2, 1, 'openHat', 'closedHat'),
      addHit(1, 1, 'kick'),
      addHit(3, 1, 'rim'),
    ],
  ],
  dubSpace: [
    [
      addHit(1, 0, 'rim'),
      addHit(3, 0, 'closedHat'),
    ],
    [
      addHit(1, 1, 'kick'),
      replaceHit(2, 1, 'openHat', 'closedHat'),
    ],
    [
      removeHit(3, 1, 'kick'),
      addHit(3, 1, 'rim'),
      addHit(1, 1, 'openHat'),
    ],
  ],
  rimRunner: [
    [
      addHit(1, 1, 'kick'),
      replaceHit(3, 1, 'openHat', 'rim'),
    ],
    [
      removeHit(1, 1, 'rim'),
      addHit(1, 1, 'closedHat'),
      addHit(3, 1, 'kick'),
    ],
    [
      removeHit(0, 1, 'rim'),
      addHit(0, 1, 'openHat'),
      addHit(3, 0, 'rim'),
    ],
  ],
  neonWobble: [
    [
      addHit(1, 0, 'kick'),
      replaceHit(3, 1, 'openHat', 'closedHat'),
    ],
    [
      removeHit(1, 0, 'wobbleBass'),
      addHit(1, 0, 'bassGrowl'),
      addHit(3, 0, 'kick'),
    ],
    [
      addHit(0, 0, 'dropImpact'),
      addHit(2, 1, 'bassGrowl'),
      replaceHit(3, 1, 'wobbleBass', 'bassGrowl'),
    ],
  ],
  earthquakeDrop: [
    [
      removeHit(0, 0, 'crash'),
      addHit(1, 1, 'wobbleBass'),
      addHit(3, 1, 'kick'),
    ],
    [
      replaceHit(0, 1, 'bassGrowl', 'wobbleBass'),
      addHit(2, 1, 'kick'),
      addHit(3, 0, 'bassGrowl'),
    ],
    [
      addHit(2, 0, 'dropImpact'),
      addHit(2, 0, 'crash'),
      replaceHit(3, 1, 'openHat', 'bassGrowl'),
    ],
  ],
  laserSkank: [
    [
      addHit(1, 0, 'kick'),
      addHit(3, 0, 'closedHat'),
    ],
    [
      replaceHit(0, 1, 'bassGrowl', 'wobbleBass'),
      replaceHit(2, 1, 'wobbleBass', 'bassGrowl'),
      addHit(3, 1, 'closedHat'),
    ],
    [
      addHit(0, 0, 'dropImpact'),
      addHit(0, 0, 'crash'),
      addHit(3, 1, 'bassGrowl'),
    ],
  ],
  fracturedSeven: [
    [],
    [
      addSixteenthHit(1, 0, 'china'),
      replaceSixteenthHit(3, 2, 'snare', 'highTom'),
      addSixteenthHit(3, 3, 'snare'),
    ],
    [
      removeSixteenthHit(0, 2, 'snare'),
      addSixteenthHit(0, 2, 'lowTom'),
      addSixteenthHit(2, 1, 'kick'),
    ],
    [
      addSixteenthHit(0, 3, 'kick'),
      addSixteenthHit(1, 2, 'snare'),
      replaceSixteenthHit(3, 3, 'china', 'rideBell'),
    ],
  ],
  angularSprint: [
    [],
    [
      addSixteenthHit(0, 2, 'kick'),
      addSixteenthHit(1, 0, 'china'),
      replaceSixteenthHit(3, 3, 'highTom', 'lowTom'),
    ],
    [
      removeSixteenthHit(1, 1, 'kick'),
      addSixteenthHit(1, 1, 'snare'),
      addSixteenthHit(2, 3, 'kick'),
    ],
    [
      addSixteenthHit(0, 1, 'rideBell'),
      addSixteenthHit(2, 2, 'snare'),
      addSixteenthHit(3, 3, 'china'),
    ],
  ],
  polymeterPanic: [
    [],
    [],
    [
      addSixteenthHit(0, 1, 'kick'),
      addSixteenthHit(1, 2, 'rideBell'),
      replaceSixteenthHit(3, 1, 'lowTom', 'highTom'),
    ],
    [
      removeSixteenthHit(2, 1, 'snare'),
      addSixteenthHit(2, 1, 'kick'),
      addSixteenthHit(3, 0, 'snare'),
    ],
    [
      addSixteenthHit(0, 3, 'snare'),
      addSixteenthHit(1, 3, 'china'),
      addSixteenthHit(3, 3, 'rideBell'),
    ],
  ],
  deepHousePulse: [
    [],
    [
      addSixteenthHit(1, 2, 'tambourine'),
      addSixteenthHit(2, 3, 'houseBassPluck'),
    ],
    [
      removeSixteenthHit(0, 2, 'houseBass'),
      addSixteenthHit(0, 3, 'houseBassPluck'),
      addSixteenthHit(3, 1, 'houseBass'),
    ],
    [
      addSixteenthHit(0, 0, 'houseClap'),
      addSixteenthHit(2, 0, 'houseClap'),
      addSixteenthHit(3, 3, 'tambourine'),
    ],
  ],
  velvetBasement: [
    [],
    [
      addSixteenthHit(0, 3, 'houseBassPluck'),
      addSixteenthHit(2, 1, 'tambourine'),
    ],
    [
      replaceSixteenthHit(1, 1, 'houseBassPluck', 'houseBass'),
      addSixteenthHit(3, 1, 'houseBassPluck'),
    ],
    [
      removeSixteenthHit(2, 2, 'houseBass'),
      addSixteenthHit(2, 1, 'houseBassPluck'),
      addSixteenthHit(3, 2, 'tambourine'),
    ],
  ],
  sunriseTerrace: [
    [],
    [
      addSixteenthHit(1, 3, 'houseBassPluck'),
      addSixteenthHit(2, 0, 'tambourine'),
    ],
    [
      removeSixteenthHit(3, 1, 'houseBassPluck'),
      addSixteenthHit(3, 2, 'houseBass'),
      addSixteenthHit(0, 3, 'houseBassPluck'),
    ],
    [
      addSixteenthHit(0, 2, 'houseClap'),
      addSixteenthHit(2, 2, 'houseClap'),
      addSixteenthHit(3, 3, 'houseBassPluck'),
    ],
  ],
}

export function getDrumLoop(drumLoopId: DrumLoopId, loopIteration = 0): DrumHit[] {
  const drumLoop = DRUM_LOOPS[drumLoopId]
  const variation = DRUM_LOOP_VARIATIONS[drumLoopId][loopIteration]

  if (!variation?.length) {
    return [...drumLoop]
  }

  return applyDrumVariation(drumLoop, variation)
}

export function playDrum(instrument: DrumInstrument, rootNote?: string) {
  switch (instrument) {
    case 'kick':
      playKick()
      break
    case 'snare':
      playSnare()
      break
    case 'closedHat':
      playClosedHat()
      break
    case 'openHat':
      playOpenHat()
      break
    case 'rim':
      playRim()
      break
    case 'subBass':
      playSubBass(rootNote)
      break
    case 'wobbleBass':
      playWobbleBass(rootNote)
      break
    case 'bassGrowl':
      playBassGrowl(rootNote)
      break
    case 'crash':
      playCrash()
      break
    case 'dropImpact':
      playDropImpact(rootNote)
      break
    case 'highTom':
      playHighTom()
      break
    case 'lowTom':
      playLowTom()
      break
    case 'rideBell':
      playRideBell()
      break
    case 'china':
      playChina()
      break
    case 'clubKick':
      playClubKick()
      break
    case 'houseClap':
      playHouseClap()
      break
    case 'shaker':
      playShaker()
      break
    case 'tambourine':
      playTambourine()
      break
    case 'houseBass':
      playHouseBass(rootNote)
      break
    case 'houseBassPluck':
      playHouseBassPluck(rootNote)
      break
  }
}

function playKick() {
  zzfx({
    volume: 20,
    randomness: 0,
    frequency: 90,
    attack: 0.005,
    sustain: 0.05,
    release: 0.2,
    shape: 0,
    slide: -0.2,
  })
}

function playSnare() {
  zzfx({
    volume: 12,
    randomness: 0,
    frequency: 160,
    attack: 0.005,
    sustain: 0.03,
    release: 0.14,
    shape: 1,
    noise: 4,
    bitCrush: 0.03,
  })
}

function playClosedHat() {
  zzfx({
    volume: 3,
    randomness: 0.08,
    frequency: 5200,
    attack: 0.001,
    sustain: 0.008,
    release: 0.025,
    shape: 4,
    noise: 1.5,
    bitCrush: 0.04,
  })
}

function playOpenHat() {
  zzfx({
    volume: 2.5,
    randomness: 0.08,
    frequency: 4600,
    attack: 0.001,
    sustain: 0.04,
    release: 0.12,
    shape: 4,
    noise: 1.8,
    bitCrush: 0.03,
  })
}

function playRim() {
  zzfx({
    volume: 5,
    randomness: 0.02,
    frequency: 760,
    attack: 0.001,
    sustain: 0.008,
    release: 0.045,
    shape: 1,
    shapeCurve: 2,
    pitchJump: 120,
    pitchJumpTime: 0.008,
  })
}

function playSubBass(rootNote = 'C') {
  zzfx({
    volume: 10,
    randomness: 0,
    frequency: hzFromNote(rootNote, 1),
    attack: 0.005,
    sustain: 0.35,
    release: 0.18,
    shape: 0,
    slide: -0.02,
    sustainVolume: 0.8,
  })
}

function playWobbleBass(rootNote = 'C') {
  zzfx({
    volume: 8,
    randomness: 0,
    frequency: hzFromNote(rootNote, 2),
    attack: 0.01,
    sustain: 0.26,
    release: 0.1,
    shape: 2,
    shapeCurve: 1.5,
    slide: -0.04,
    repeatTime: 0.1,
    sustainVolume: 0.75,
    bitCrush: 0.04,
    tremolo: 0.65,
  })
}

function playBassGrowl(rootNote = 'C') {
  zzfx({
    volume: 7,
    randomness: 0.01,
    frequency: hzFromNote(rootNote, 2),
    attack: 0.015,
    sustain: 0.22,
    release: 0.14,
    shape: 2,
    shapeCurve: 2,
    slide: -0.08,
    noise: 0.12,
    modulation: 18,
    bitCrush: 0.08,
    repeatTime: 0.08,
    sustainVolume: 0.7,
    tremolo: 0.35,
  })
}

function playCrash() {
  zzfx({
    volume: 5,
    randomness: 0.12,
    frequency: 3200,
    attack: 0.001,
    sustain: 0.08,
    release: 0.55,
    shape: 4,
    noise: 2,
    bitCrush: 0.025,
    delay: 0.05,
  })
}

function playDropImpact(rootNote = 'C') {
  playKick()

  zzfx({
    volume: 12,
    randomness: 0,
    frequency: hzFromNote(rootNote, 1),
    attack: 0.001,
    sustain: 0.18,
    release: 0.5,
    shape: 0,
    slide: -0.35,
    noise: 0.1,
  })
}

function playHighTom() {
  zzfx({
    volume: 7,
    randomness: 0.01,
    frequency: 190,
    attack: 0.001,
    sustain: 0.035,
    release: 0.13,
    shape: 0,
    slide: -0.18,
    sustainVolume: 0.55,
  })

  zzfx({
    volume: 1.5,
    randomness: 0.04,
    frequency: 900,
    attack: 0.001,
    sustain: 0.005,
    release: 0.025,
    shape: 4,
    noise: 0.4,
  })
}

function playLowTom() {
  zzfx({
    volume: 9,
    randomness: 0.01,
    frequency: 105,
    attack: 0.001,
    sustain: 0.05,
    release: 0.19,
    shape: 0,
    slide: -0.12,
    sustainVolume: 0.6,
  })

  zzfx({
    volume: 1.5,
    randomness: 0.04,
    frequency: 600,
    attack: 0.001,
    sustain: 0.006,
    release: 0.03,
    shape: 4,
    noise: 0.35,
  })
}

function playRideBell() {
  zzfx({
    volume: 2.4,
    randomness: 0.01,
    frequency: 1800,
    attack: 0.001,
    sustain: 0.015,
    release: 0.2,
    shape: 1,
    shapeCurve: 1.5,
    sustainVolume: 0.45,
  })

  zzfx({
    volume: 1.2,
    randomness: 0.015,
    frequency: 2700,
    attack: 0.001,
    sustain: 0.008,
    release: 0.12,
    shape: 0,
    sustainVolume: 0.35,
  })
}

function playChina() {
  zzfx({
    volume: 2.5,
    randomness: 0.08,
    frequency: 1100,
    attack: 0.001,
    sustain: 0.035,
    release: 0.28,
    shape: 2,
    shapeCurve: 0.7,
    slide: -0.03,
    noise: 0.45,
    sustainVolume: 0.4,
  })

  zzfx({
    volume: 1.5,
    randomness: 0.1,
    frequency: 3400,
    attack: 0.001,
    sustain: 0.025,
    release: 0.34,
    shape: 4,
    noise: 0.7,
    sustainVolume: 0.3,
  })
}

function playClubKick() {
  zzfx({
    volume: 14,
    randomness: 0,
    frequency: 62,
    attack: 0.001,
    sustain: 0.055,
    release: 0.24,
    shape: 0,
    slide: -0.22,
    sustainVolume: 0.55,
  })

  zzfx({
    volume: 1.4,
    randomness: 0.015,
    frequency: 1250,
    attack: 0.001,
    sustain: 0.004,
    release: 0.022,
    shape: 4,
    noise: 0.18,
  })
}

function playHouseClap() {
  zzfx({
    volume: 4,
    randomness: 0.06,
    frequency: 950,
    attack: 0.001,
    sustain: 0.025,
    release: 0.12,
    shape: 4,
    noise: 1.1,
    repeatTime: 0.018,
    sustainVolume: 0.45,
  })

  zzfx({
    volume: 2,
    randomness: 0.04,
    frequency: 230,
    attack: 0.001,
    sustain: 0.018,
    release: 0.09,
    shape: 1,
    noise: 0.8,
    sustainVolume: 0.35,
  })
}

function playShaker() {
  zzfx({
    volume: 1.1,
    randomness: 0.1,
    frequency: 6500,
    attack: 0.001,
    sustain: 0.007,
    release: 0.035,
    shape: 4,
    noise: 1.25,
    sustainVolume: 0.25,
  })
}

function playTambourine() {
  zzfx({
    volume: 1.8,
    randomness: 0.08,
    frequency: 4800,
    attack: 0.001,
    sustain: 0.015,
    release: 0.08,
    shape: 4,
    noise: 0.85,
    repeatTime: 0.024,
    sustainVolume: 0.3,
    tremolo: 0.25,
  })

  zzfx({
    volume: 0.8,
    randomness: 0.03,
    frequency: 2200,
    attack: 0.001,
    sustain: 0.008,
    release: 0.055,
    shape: 1,
    shapeCurve: 1.4,
    sustainVolume: 0.25,
  })
}

function playHouseBass(rootNote = 'C') {
  zzfx({
    volume: 6,
    randomness: 0,
    frequency: hzFromNote(rootNote, 2),
    attack: 0.006,
    sustain: 0.12,
    release: 0.12,
    shape: 0,
    slide: -0.015,
    sustainVolume: 0.65,
    decay: 0.035,
  })

  zzfx({
    volume: 1.8,
    randomness: 0,
    frequency: hzFromNote(rootNote, 3),
    attack: 0.004,
    sustain: 0.055,
    release: 0.08,
    shape: 1,
    shapeCurve: 1.3,
    sustainVolume: 0.3,
  })
}

function playHouseBassPluck(rootNote = 'C') {
  zzfx({
    volume: 5,
    randomness: 0,
    frequency: hzFromNote(rootNote, 2),
    attack: 0.002,
    sustain: 0.025,
    release: 0.09,
    shape: 1,
    shapeCurve: 1.5,
    slide: -0.025,
    sustainVolume: 0.25,
    decay: 0.055,
  })

  zzfx({
    volume: 1.1,
    randomness: 0,
    frequency: hzFromNote(rootNote, 3),
    attack: 0.001,
    sustain: 0.01,
    release: 0.045,
    shape: 0,
    sustainVolume: 0.2,
  })
}

function sixteenthHit(beat: number, subdivision: number, instrument: DrumInstrument): DrumHit {
  return {
    beat,
    subdivision,
    subdivisionsPerBeat: 4,
    instrument,
  }
}

function addHit(
  beat: number,
  subdivision: number,
  instrument: DrumInstrument,
  subdivisionsPerBeat: 2 | 4 = 2,
): DrumVariationOperation {
  return {
    type: 'add',
    hit: { beat, subdivision, subdivisionsPerBeat, instrument },
  }
}

function removeHit(
  beat: number,
  subdivision: number,
  instrument: DrumInstrument,
  subdivisionsPerBeat: 2 | 4 = 2,
): DrumVariationOperation {
  return {
    type: 'remove',
    hit: { beat, subdivision, subdivisionsPerBeat, instrument },
  }
}

function replaceHit(
  beat: number,
  subdivision: number,
  from: DrumInstrument,
  to: DrumInstrument,
  subdivisionsPerBeat: 2 | 4 = 2,
): DrumVariationOperation {
  return {
    type: 'replace',
    from: { beat, subdivision, subdivisionsPerBeat, instrument: from },
    to: { beat, subdivision, subdivisionsPerBeat, instrument: to },
  }
}

function addSixteenthHit(beat: number, subdivision: number, instrument: DrumInstrument): DrumVariationOperation {
  return addHit(beat, subdivision, instrument, 4)
}

function removeSixteenthHit(beat: number, subdivision: number, instrument: DrumInstrument): DrumVariationOperation {
  return removeHit(beat, subdivision, instrument, 4)
}

function replaceSixteenthHit(
  beat: number,
  subdivision: number,
  from: DrumInstrument,
  to: DrumInstrument,
): DrumVariationOperation {
  return replaceHit(beat, subdivision, from, to, 4)
}

function applyDrumVariation(drumLoop: DrumHit[], variation: DrumVariation): DrumHit[] {
  return variation.reduce((hits, operation) => {
    if (operation.type === 'add') {
      return addUniqueDrumHit(hits, operation.hit)
    }

    if (operation.type === 'remove') {
      return removeDrumHit(hits, operation.hit)
    }

    return addUniqueDrumHit(
      removeDrumHit(hits, operation.from),
      operation.to,
    )
  }, [...drumLoop])
}

function addUniqueDrumHit(drumLoop: DrumHit[], hit: DrumHit): DrumHit[] {
  if (drumLoop.some(loopHit => areDrumHitsEqual(loopHit, hit))) {
    return drumLoop
  }

  return [...drumLoop, hit]
}

function removeDrumHit(drumLoop: DrumHit[], hit: DrumHit): DrumHit[] {
  return drumLoop.filter(loopHit => !areDrumHitsEqual(loopHit, hit))
}

function areDrumHitsEqual(first: DrumHit, second: DrumHit): boolean {
  return first.beat === second.beat
    && first.subdivision === second.subdivision
    && (first.subdivisionsPerBeat ?? 2) === (second.subdivisionsPerBeat ?? 2)
    && first.instrument === second.instrument
}
