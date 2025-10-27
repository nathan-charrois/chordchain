import { zzfx } from 'zzfx'

export type Params = {
  volume?: number
  randomness?: number
  frequency?: number
  attack?: number
  sustain?: number
  release?: number
  shape?: number
  shapeCurve?: number
  slide?: number
  deltaSlide?: number
  pitchJump?: number
  pitchJumpTime?: number
  repeatTime?: number
  noise?: number
  modulation?: number
  bitCrush?: number
  delay?: number
  sustainVolume?: number
  decay?: number
  tremolo?: number
}

export default function (params: Params) {
  const {
    volume,
    randomness,
    frequency,
    attack,
    sustain,
    release,
    shape,
    shapeCurve,
    slide,
    deltaSlide,
    pitchJump,
    pitchJumpTime,
    repeatTime,
    noise,
    modulation,
    bitCrush,
    delay,
    sustainVolume,
    decay,
    tremolo,
  } = params

  zzfx(
    volume,
    randomness,
    frequency,
    attack,
    sustain,
    release,
    shape,
    shapeCurve,
    slide,
    deltaSlide,
    pitchJump,
    pitchJumpTime,
    repeatTime,
    noise,
    modulation,
    bitCrush,
    delay,
    sustainVolume,
    decay,
    tremolo,
  )
}
