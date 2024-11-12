import { useMemo } from 'react'

const useFormatResponse = () => {
  const truncate = (text, maxLength = 30) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
  }

  const formatDate = (isoString, showYear = false) => {
    const date = new Date(isoString)
    const day = date.getDate()
    const month = date.toLocaleString('default', { month: 'short' })
    const year = date.getFullYear()

    if (showYear || year !== new Date().getFullYear()) {
      return `${day} ${month} ${year}`
    } else {
      return `${day} ${month}`
    }
  }

  // think about it
  // when longer than 1 year use formatDate?
  const timeAgo = dateStr => {
    const now = new Date()
    const date = new Date(dateStr)
    const diffInSeconds = Math.floor((now - date) / 1000)

    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'week', seconds: 604800 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 }
    ]

    for (let i = 0; i < intervals.length; i++) {
      const interval = intervals[i]
      const count = Math.floor(diffInSeconds / interval.seconds)
      if (count >= 1) {
        return count === 1
          ? `1 ${interval.label} ago`
          : `${count} ${interval.label}s ago`
      }
    }
    return 'just now'
  }

  return useMemo(
    () => ({
      truncate,
      formatDate,
      timeAgo
    }),
    []
  )
}

export default useFormatResponse
