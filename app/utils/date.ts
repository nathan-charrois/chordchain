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
