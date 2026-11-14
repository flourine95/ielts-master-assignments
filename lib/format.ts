import { BUSINESS_TIME_ZONE } from "@/lib/clock"

const partsFormatter = new Intl.DateTimeFormat("vi-VN", {
  timeZone: BUSINESS_TIME_ZONE,
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
})

export function formatShortDateTime(iso: string): string {
  const parts = partsFormatter.formatToParts(new Date(iso))
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? ""

  return `${get("day")}/${get("month")} ${get("hour")}:${get("minute")}`
}

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

function humanize(ms: number): string {
  const days = Math.floor(ms / DAY)
  const hours = Math.floor((ms % DAY) / HOUR)
  const minutes = Math.floor((ms % HOUR) / MINUTE)

  if (days > 0) return hours > 0 ? `${days} ngày ${hours} giờ` : `${days} ngày`
  if (hours > 0)
    return minutes > 0 ? `${hours} giờ ${minutes} phút` : `${hours} giờ`
  return `${Math.max(minutes, 1)} phút`
}

interface Distance {
  direction: "remaining" | "overdue"
  label: string
}

export function describeDistance(isoA: string, isoB: string): Distance {
  const diff = new Date(isoA).getTime() - new Date(isoB).getTime()

  if (diff < 0) return { direction: "overdue", label: humanize(-diff) }
  return { direction: "remaining", label: humanize(diff) }
}
