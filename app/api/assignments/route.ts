import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { SIMULATED_NOW } from "@/lib/clock"
import {
  listAssignmentsForStudent,
  resolveSession,
  SESSION_COOKIE,
} from "@/lib/session"

export async function GET() {
  const cookieStore = await cookies()
  const session = resolveSession(cookieStore.get(SESSION_COOKIE)?.value)

  if (!session) {
    return NextResponse.json(
      { error: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn." },
      { status: 401 }
    )
  }

  const assignments = listAssignmentsForStudent(
    session.studentId,
    SIMULATED_NOW
  )

  return NextResponse.json({
    student: {
      id: session.studentId,
      displayName: session.displayName,
    },
    simulatedNow: SIMULATED_NOW.toISOString(),
    assignments,
  })
}
