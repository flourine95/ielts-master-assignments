import { canStillSubmit } from "@/lib/assignment-status"
import { describeDistance, formatShortDateTime } from "@/lib/format"
import type { AssignmentView } from "@/lib/session"
import { cn } from "@/lib/utils"
import { StatusBadge } from "@/components/status-badge"

export function AssignmentRow({
  assignment,
  simulatedNowIso,
}: {
  assignment: AssignmentView
  simulatedNowIso: string
}) {
  const { id, title, dueAt, submittedAt, status } = assignment
  const pending = canStillSubmit(status)
  const overdue = status === "not_submitted_overdue"

  const countdown = pending ? describeDistance(dueAt, simulatedNowIso) : null

  return (
    <li className="grid gap-3 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-6 sm:px-5">
      <div className="min-w-0">
        <h3 className="text-base leading-snug font-medium text-foreground">
          {title}
        </h3>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-muted-foreground">
          <time dateTime={dueAt} className="tabular-nums">
            Hạn {formatShortDateTime(dueAt)}
          </time>
          {submittedAt && (
            <time
              dateTime={submittedAt}
              className="tabular-nums before:mr-2 before:text-border before:content-['·']"
            >
              Nộp {formatShortDateTime(submittedAt)}
            </time>
          )}
          <span className="text-xs text-muted-foreground/80 before:mr-2 before:text-border before:content-['·']">
            {id}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 sm:flex-col sm:items-end sm:gap-1">
        <StatusBadge status={status} />

        {countdown && (
          <span
            className={cn(
              "text-xs tabular-nums",
              overdue ? "text-status-overdue" : "text-muted-foreground"
            )}
          >
            {countdown.direction === "overdue"
              ? `Trễ ${countdown.label}`
              : `Còn ${countdown.label}`}
          </span>
        )}
      </div>
    </li>
  )
}
