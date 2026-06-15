export function formatLocalDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const DISPLAY_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

const DISPLAY_TIME_FORMATTER = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
})

export function formatDisplayDate(localDate: string): string {
  const [year, month, day] = localDate.split('-').map(Number)

  if (!year || !month || !day) {
    return localDate
  }

  return DISPLAY_DATE_FORMATTER.format(new Date(year, month - 1, day))
}

export function formatDisplayDateTime(dateTime: string): string {
  const date = new Date(dateTime)

  if (Number.isNaN(date.getTime())) {
    return dateTime
  }

  const formattedDate = DISPLAY_DATE_FORMATTER.format(date)
  const formattedTime = DISPLAY_TIME_FORMATTER.format(date).toLowerCase()

  return `${formattedDate} at ${formattedTime}`
}

export function formatCountdown(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function getSecondsToNextMidnight(now: Date): number {
  const nextMidnight = new Date(now)

  nextMidnight.setHours(24, 0, 0, 0)

  return Math.max(0, Math.floor((nextMidnight.getTime() - now.getTime()) / 1000))
}
