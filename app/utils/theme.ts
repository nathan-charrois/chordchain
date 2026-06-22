import type { CSSProperties } from 'react'
import {
  Card,
  createTheme,
  type CSSVariablesResolver,
  Paper,
} from '@mantine/core'

export const appFonts = {
  body: '"DM Sans", sans-serif',
  display: '"Fredoka", Georgia, serif',
  mono: '"SFMono-Regular", Consolas, monospace',
} as const

export const appColors = {
  ink: '#263331',
  inkMuted: '#746d62',
  canvas: '#f4ecdf',
  surface: '#fffaf2',
  surfaceRaised: '#fffdf8',
  border: '#ded1be',
  brand: '#174f4b',
  brandDark: '#103d3a',
  accent: '#d88b16',
  success: '#477447',
  inactive: '#a8aaa6',
} as const

export type BoardCellTone = 'default' | 'present' | 'correct' | 'active' | 'empty' | 'emptyCurrent'

type BoardTheme = {
  styles: {
    root: CSSProperties
    heading: CSSProperties
    progress: CSSProperties
    cell: CSSProperties
    cellNumber: CSSProperties
    chordName: CSSProperties
    chordNumeral: CSSProperties
    emptyMark: CSSProperties
    activeMark: CSSProperties
    correctIndicator: CSSProperties
  }
  tones: Record<BoardCellTone, CSSProperties>
}

const boardTheme: BoardTheme = {
  styles: {
    root: {
      backgroundColor: 'var(--app-color-surface)',
      backgroundImage: [
        'linear-gradient(rgb(255 253 248 / 92%), rgb(255 250 242 / 96%))',
        'radial-gradient(circle at 18% 0%, rgb(255 255 255 / 82%), transparent 30rem)',
      ].join(', '),
      borderColor: 'rgb(190 174 151 / 46%)',
      boxShadow: '0 2px 4px rgb(58 43 25 / 6%), 0 12px 28px rgb(58 43 25 / 9%)',
    },
    heading: {
      color: 'var(--app-color-ink)',
      fontSize: 'var(--mantine-font-size-sm)',
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
    },
    progress: {
      color: 'var(--app-color-ink-muted)',
      fontSize: 'var(--mantine-font-size-sm)',
      fontWeight: 600,
      letterSpacing: '0.04em',
    },
    cell: {
      position: 'relative',
      display: 'grid',
      minWidth: 0,
      placeItems: 'center',
      overflow: 'hidden',
      borderRadius: 'var(--mantine-radius-md)',
      transition: 'background-color 160ms ease, border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease',
    },
    cellNumber: {
      position: 'absolute',
      top: 'var(--mantine-spacing-sm)',
      left: 'var(--mantine-spacing-md)',
      color: 'inherit',
      fontSize: 'var(--mantine-font-size-sm)',
      lineHeight: 1,
      opacity: 0.84,
      zIndex: 1,
    },
    chordName: {
      color: 'inherit',
      fontFamily: 'var(--app-font-display)',
      fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
      fontWeight: 600,
      lineHeight: 1,
    },
    chordNumeral: {
      color: 'inherit',
      fontFamily: 'var(--app-font-display)',
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1,
    },
    emptyMark: {
      color: 'inherit',
      fontFamily: 'var(--app-font-display)',
      fontSize: '1.75rem',
      fontWeight: 400,
      lineHeight: 1,
    },
    activeMark: {
      color: 'var(--app-color-brand-8)',
      fontFamily: 'var(--app-font-display)',
      fontSize: '1.75rem',
      fontWeight: 400,
      lineHeight: 1,
    },
    correctIndicator: {
      position: 'absolute',
      top: 'var(--mantine-spacing-sm)',
      right: 'var(--mantine-spacing-md)',
      display: 'grid',
      placeItems: 'center',
      color: 'inherit',
      backgroundColor: 'rgb(255 255 255 / 7%)',
      border: '1px solid rgb(255 255 255 / 48%)',
      borderRadius: '50%',
      opacity: 0.84,
      zIndex: 1,
    },

  },
  tones: {
    default: {
      color: 'var(--mantine-color-parchment-0)',
      backgroundColor: '#35403f',
      backgroundImage: 'linear-gradient(145deg, rgb(255 255 255 / 5%), transparent 50%)',
      border: '1px solid #2b3534',
      boxShadow: '0 2px 3px rgb(45 35 24 / 16%), 0 7px 14px rgb(45 35 24 / 10%)',
    },
    present: {
      color: 'var(--mantine-color-parchment-0)',
      backgroundColor: 'var(--mantine-color-amber-6)',
      backgroundImage: 'linear-gradient(145deg, rgb(255 255 255 / 11%), transparent 48%)',
      border: '1px solid var(--mantine-color-amber-7)',
      boxShadow: '0 2px 3px rgb(87 54 10 / 16%), 0 7px 14px rgb(87 54 10 / 12%)',
    },
    correct: {
      color: 'var(--mantine-color-parchment-0)',
      backgroundColor: 'var(--mantine-color-forest-7)',
      backgroundImage: 'linear-gradient(145deg, rgb(255 255 255 / 10%), transparent 48%)',
      border: '1px solid var(--mantine-color-forest-8)',
      boxShadow: '0 2px 3px rgb(30 65 32 / 16%), 0 7px 14px rgb(30 65 32 / 12%)',
    },
    active: {
      color: 'var(--mantine-color-parchment-0)',
      backgroundColor: 'var(--mantine-color-brand-7)',
      border: '1px solid var(--mantine-color-brand-8)',
      boxShadow: '0 0 0 2px var(--app-color-brand)',
      transform: 'translateY(-2px)',
    },
    empty: {
      color: 'var(--mantine-color-parchment-5)',
      backgroundColor: 'rgb(255 253 248 / 38%)',
      border: '1px dashed var(--app-color-border)',
    },
    emptyCurrent: {
      color: 'var(--mantine-color-parchment-5)',
      backgroundColor: 'rgb(255 253 248 / 38%)',
      border: '1px solid var(--mantine-color-brand-8)',
      boxShadow: '0 0 0 2px var(--app-color-brand)',
      transform: 'translateY(-2px)',
    },
  },
}

declare module '@mantine/core' {
  export interface MantineThemeOther {
    board: BoardTheme
  }
}

const theme = createTheme({
  primaryColor: 'brand',
  primaryShade: 7,
  fontFamily: appFonts.body,
  fontFamilyMonospace: appFonts.mono,
  headings: {
    fontFamily: appFonts.display,
    fontWeight: '600',
  },
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  radius: {
    xs: '0.25rem',
    sm: '0.375rem',
    md: '0.625rem',
    lg: '0.875rem',
    xl: '1.25rem',
  },
  defaultRadius: 'md',
  shadows: {
    xs: '0 1px 2px rgb(58 43 25 / 7%)',
    sm: '0 3px 8px rgb(58 43 25 / 9%)',
    md: '0 8px 20px rgb(58 43 25 / 11%)',
    lg: '0 14px 32px rgb(58 43 25 / 14%)',
    xl: '0 22px 48px rgb(58 43 25 / 16%)',
  },
  colors: {
    brand: [
      '#edf8f6',
      '#dee7e5',
      '#c7dfdc',
      '#a4c9c5',
      '#78b9b3',
      '#4fa9a0',
      '#399b92',
      '#174f4b',
      '#154743',
      '#103d3a',
    ],
    amber: [
      '#fff8e8',
      '#ffedca',
      '#fbd99c',
      '#f5c36a',
      '#efaf40',
      '#e9a122',
      '#d88b16',
      '#b96f0c',
      '#965607',
      '#784204',
    ],
    forest: [
      '#f0f7ef',
      '#dcebd9',
      '#bad5b5',
      '#96bd8e',
      '#77a96d',
      '#609956',
      '#518a49',
      '#477447',
      '#375c37',
      '#2b492b',
    ],
    parchment: [
      '#fffdf8',
      '#fffaf2',
      '#fbf4e9',
      '#f4ecdf',
      '#e9dece',
      '#ded1be',
      '#cdbda7',
      '#b7a48b',
      '#98846c',
      '#74634f',
    ],
  },
  other: {
    board: boardTheme,
  },
  components: {
    Card: Card.extend({
      defaultProps: {
        radius: 'lg',
        shadow: 'md',
      },
      styles: {
        root: {
          backgroundColor: 'var(--app-color-surface)',
          border: '1px solid rgb(190 174 151 / 43%)',
        },
      },
    }),
    Paper: Paper.extend({
      defaultProps: {
        radius: 'md',
        shadow: 'sm',
      },
      styles: {
        root: {
          borderColor: 'var(--app-color-border)',
        },
      },
    }),
  },
})

export const appCssVariablesResolver: CSSVariablesResolver = theme => ({
  variables: {
    '--app-font-body': theme.fontFamily,
    '--app-font-display': theme.headings.fontFamily,
    '--app-color-brand': theme.colors.brand[7],
    '--app-color-brand-dark': theme.colors.brand[9],
    '--app-color-accent': theme.colors.amber[6],
    '--app-color-success': theme.colors.forest[7],
    '--app-color-canvas': theme.colors.parchment[3],
    '--app-color-surface': theme.colors.parchment[1],
    '--app-color-surface-raised': theme.colors.parchment[0],
    '--app-color-border': theme.colors.parchment[5],
    '--app-color-ink': appColors.ink,
    '--app-color-ink-muted': appColors.inkMuted,
    '--app-shadow-surface': theme.shadows.sm,
    '--app-shadow-raised': theme.shadows.md,
  },
  light: {},
  dark: {},
})

export default theme
