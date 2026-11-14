import {
  ACTION_RANK,
  getStatus,
  type AssignmentStatus,
} from "@/lib/assignment-status"
import { ASSIGNMENTS, type Assignment } from "@/lib/assignments"

export const SESSION_COOKIE = "im_session"

export interface Session {
  studentId: string
  displayName: string
}

const SESSIONS: Record<string, Session> = {
  "sess-01-demo": { studentId: "S01", displayName: "Phi Long" },
  "sess-02-demo": { studentId: "S02", displayName: "Học viên S02" },
}

export function resolveSession(token: string | undefined): Session | null {
  if (!token) return null
  return SESSIONS[token] ?? null
}

export interface AssignmentView {
  id: string
  title: string
  dueAt: string
  submittedAt: string | null
  status: AssignmentStatus
}

export function listAssignmentsForStudent(
  studentId: string,
  now: Date
): AssignmentView[] {
  return ASSIGNMENTS.filter(
    (assignment: Assignment) => assignment.studentId === studentId
  )
    .map((assignment) => ({
      id: assignment.id,
      title: assignment.title,
      dueAt: assignment.dueAt,
      submittedAt: assignment.submittedAt,
      status: getStatus(assignment, now),
    }))
    .sort((a, b) => {
      const byAction = ACTION_RANK[a.status] - ACTION_RANK[b.status]
      if (byAction !== 0) return byAction
      return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()
    })
}
