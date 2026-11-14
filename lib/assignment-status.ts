import type { Assignment } from "@/lib/assignments"

export type AssignmentStatus =
  | "submitted_on_time"
  | "submitted_late"
  | "not_submitted_open"
  | "not_submitted_overdue"

export const STATUS_LABEL: Record<AssignmentStatus, string> = {
  submitted_on_time: "Đã nộp",
  submitted_late: "Nộp trễ",
  not_submitted_open: "Chưa nộp",
  not_submitted_overdue: "Quá hạn",
}

export const ACTION_RANK: Record<AssignmentStatus, number> = {
  not_submitted_open: 0,
  not_submitted_overdue: 1,
  submitted_late: 2,
  submitted_on_time: 3,
}

export function getStatus(
  assignment: Assignment,
  now: Date
): AssignmentStatus {
  const due = new Date(assignment.dueAt).getTime()
  const nowMs = now.getTime()

  if (assignment.submittedAt) {
    const submitted = new Date(assignment.submittedAt).getTime()
    return submitted > due ? "submitted_late" : "submitted_on_time"
  }

  return nowMs > due ? "not_submitted_overdue" : "not_submitted_open"
}

export function canStillSubmit(status: AssignmentStatus): boolean {
  return status === "not_submitted_open" || status === "not_submitted_overdue"
}
