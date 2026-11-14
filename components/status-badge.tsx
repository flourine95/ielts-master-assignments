import { CircleCheck, CircleDashed, ClockAlert, TriangleAlert } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { STATUS_LABEL, type AssignmentStatus } from "@/lib/assignment-status"

type StatusStyle = {
  variant: "statusDone" | "statusLate" | "statusPending" | "statusOverdue"
  icon: typeof CircleCheck
}

const STATUS: Record<AssignmentStatus, StatusStyle> = {
  submitted_on_time: { variant: "statusDone", icon: CircleCheck },
  submitted_late: { variant: "statusLate", icon: ClockAlert },
  not_submitted_open: { variant: "statusPending", icon: CircleDashed },
  not_submitted_overdue: { variant: "statusOverdue", icon: TriangleAlert },
}

export function StatusBadge({ status }: { status: AssignmentStatus }) {
  if (status === "submitted_late") {
    const done = STATUS.submitted_on_time
    const late = STATUS.submitted_late

    return (
      <span className="flex flex-wrap items-center gap-1.5">
        <Badge variant={done.variant}>
          <done.icon aria-hidden="true" />
          {STATUS_LABEL.submitted_on_time}
        </Badge>
        <Badge variant={late.variant}>
          <late.icon aria-hidden="true" />
          {STATUS_LABEL.submitted_late}
        </Badge>
      </span>
    )
  }

  const { variant, icon: Icon } = STATUS[status]

  return (
    <Badge variant={variant}>
      <Icon aria-hidden="true" />
      {STATUS_LABEL[status]}
    </Badge>
  )
}
