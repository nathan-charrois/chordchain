import { useEffect } from 'react'

const googleAnalyticsId = 'G-D90MFYS797'

type GoogleAnalyticsConfig = {
  send_page_view?: boolean
}

type GoogleAnalyticsEventParams = {
  page_location?: string
  page_path?: string
  page_title?: string
}

type GoogleAnalyticsCommand = | ['js', Date]
  | ['config', string, GoogleAnalyticsConfig?]
  | ['event', 'page_view', GoogleAnalyticsEventParams]

declare global {
  interface Window {
    dataLayer?: GoogleAnalyticsCommand[]
    gtag?: (...command: GoogleAnalyticsCommand) => void
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
    window.gtag('config', googleAnalyticsId, { send_page_view: false })
    window.gtag('event', 'page_view', {
      page_location: window.location.href,
      page_path: `${window.location.pathname}${window.location.search}`,
      page_title: document.title,
    })

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
