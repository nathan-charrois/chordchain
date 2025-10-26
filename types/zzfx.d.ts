// types/zzfx.d.ts
// Expanded TypeScript declarations for ZzFX.
// Compatible with packages that export a named `zzfx` and an object `ZZFX.play(...)`.
// Keeps permissive overloads so custom/forked builds still type-check.

declare module 'zzfx' {
  /** Typical wave shapes used by ZzFX. Actual mapping can vary by build; we leave it numeric. */
  export type ZzfxWaveShape = number

  /**
   * The canonical ZzFX 20-parameter tuple.
   * Each entry is optional; unspecified params use the library defaults.
   *
   * [0]  volume           (0..1, default 0.5)
   * [1]  randomness       (0..1)
   * [2]  frequency        (Hz, e.g., 440)
   * [3]  attack           (seconds)
   * [4]  sustain          (seconds)
   * [5]  release          (seconds)
   * [6]  shape            (wave shape id; see ZzfxWaveShape)
   * [7]  shapeCurve       (timbre curve / waveshaper amount)
   * [8]  slide            (frequency slide)
   * [9]  deltaSlide       (slide acceleration)
   * [10] pitchJump        (semitones or ratio; build-dependent)
   * [11] pitchJumpTime    (seconds)
   * [12] repeatTime       (seconds between repeats)
   * [13] noise            (noise mix amount)
   * [14] modulation       (FM/AM amount; build-dependent)
   * [15] bitCrush         (bit-depth or rate reduction)
   * [16] delay            (echo/delay mix/time; build-dependent)
   * [17] sustainVolume    (sustain level 0..1)
   * [18] decay            (extra decay time)
   * [19] tremolo          (tremolo amount/rate; build-dependent)
   *
   * NOTE: Parameter semantics vary slightly across forks; this typing documents the common meanings.
   */
  export type ZzfxParams = [
    volume?: number,
    randomness?: number,
    frequency?: number,
    attack?: number,
    sustain?: number,
    release?: number,
    shape?: ZzfxWaveShape,
    shapeCurve?: number,
    slide?: number,
    deltaSlide?: number,
    pitchJump?: number,
    pitchJumpTime?: number,
    repeatTime?: number,
    noise?: number,
    modulation?: number,
    bitCrush?: number,
    delay?: number,
    sustainVolume?: number,
    decay?: number,
    tremolo?: number,
  ]

  /** Return type varies by build; commonly an AudioBufferSourceNode, but allow void for fire-and-forget. */
  /** Return type varies by build; commonly an AudioBufferSourceNode, but allow void for fire-and-forget. */
  export type ZzfxReturn = AudioBufferSourceNode | void

  /**
   * Play a ZzFX sound using positional parameters.
   * Overloads accept the canonical 20-tuple or any numeric variadic list for fork compatibility.
   */
  export function zzfx(
    ...parameters: ZzfxParams
  ): ZzfxReturn
  export function zzfx(
    ...parameters: number[]
  ): ZzfxReturn

  /**
   * Low-level API holder used by `zzfx(...)`.
   * Many builds expose `ZZFX.play(...)` with the same signature as `zzfx`.
   * We model only what’s common to avoid breaking on variants.
   */
  export const ZZFX: {
    play: (...parameters: ZzfxParams) => ZzfxReturn
  }

  /** Allow default import for setups that expect it. */
  export default zzfx
}

/**
 * Cover subpath imports such as 'zzfx/ZzFX' or 'zzfx/dist/ZzFX.js'.
 * We mirror the same signatures to keep things ergonomic regardless of entry path.
 */
declare module 'zzfx/*' {
  export type ZzfxWaveShape = number
  export type ZzfxParams = import('zzfx').ZzfxParams
  export type ZzfxReturn = import('zzfx').ZzfxReturn

  export function zzfx(...parameters: ZzfxParams): ZzfxReturn
  export function zzfx(...parameters: number[]): ZzfxReturn

  export const ZZFX: {
    play: (...parameters: ZzfxParams) => ZzfxReturn
  }

  export default zzfx
}
