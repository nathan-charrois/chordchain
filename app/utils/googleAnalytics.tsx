import { useEffect } from 'react'

const googleAnalyticsId = 'G-D90MFYS797'

type GoogleAnalyticsCommand = | ['js', Date] | ['config', string]
type GoogleAnalyticsTag = (...command: GoogleAnalyticsCommand) => void

declare global {
  interface Window {
    dataLayer?: GoogleAnalyticsCommand[]
    gtag?: GoogleAnalyticsTag
  }
}

export function GoogleAnalytics() {
  useEffect(() => {
    const dataLayer = window.dataLayer ?? []

    window.dataLayer = dataLayer
    window.gtag = (...command) => {
      dataLayer.push(command)
    }

    window.gtag('js', new Date())
    window.gtag('config', googleAnalyticsId)

    if (document.getElementById('google-analytics')) {
      return
    }

    const script = document.createElement('script')

    script.id = 'google-analytics'
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`

    document.head.appendChild(script)

    return () => {
      script.remove()
    }
  }, [])

  return null
}
