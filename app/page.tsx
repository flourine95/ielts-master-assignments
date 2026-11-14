import { cookies } from "next/headers"

import { AssignmentRow } from "@/components/assignment-row"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { canStillSubmit } from "@/lib/assignment-status"
import { SIMULATED_NOW } from "@/lib/clock"
import { initialsOf } from "@/lib/initials"
import {
  listAssignmentsForStudent,
  resolveSession,
  SESSION_COOKIE,
} from "@/lib/session"

export default async function Page() {
  const cookieStore = await cookies()
  const session = resolveSession(cookieStore.get(SESSION_COOKIE)?.value)

  if (!session) {
    return (
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-16">
        <Empty className="border">
          <EmptyHeader>
            <EmptyTitle>Bạn cần đăng nhập</EmptyTitle>
            <EmptyDescription>
              Danh sách bài tập chỉ hiển thị sau khi đăng nhập.
            </EmptyDescription>
          </EmptyHeader>
          <Button render={<a href="/login" />}>Đăng nhập</Button>
        </Empty>
      </main>
    )
  }

  const assignments = listAssignmentsForStudent(session.studentId, SIMULATED_NOW)
  const pending = assignments.filter((a) => canStillSubmit(a.status))

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <p className="text-sm font-semibold tracking-tight">IELTS Master</p>

          <div className="flex items-center gap-2.5">
            <div className="min-w-0 text-right leading-tight">
              <p className="truncate text-sm font-medium text-foreground">
                {session.displayName}
              </p>
              <p className="text-xs tabular-nums text-muted-foreground">
                {session.studentId}
              </p>
            </div>
            <Avatar size="lg">
              <AvatarFallback
                aria-hidden="true"
                className="text-foreground/85"
              >
                {initialsOf(session.displayName)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Bài tập của tôi
          </h1>
          <p className="text-sm text-muted-foreground">
            {pending.length > 0 ? (
              <>
                <span className="font-medium text-foreground">
                  {pending.length}
                </span>{" "}
                bài cần làm
              </>
            ) : (
              "Đã hoàn thành tất cả"
            )}
          </p>
        </div>

        <section aria-labelledby="danh-sach" className="mt-5">
          <h2 id="danh-sach" className="sr-only">
            Danh sách bài tập
          </h2>

          {assignments.length === 0 ? (
            <Empty className="border">
              <EmptyHeader>
                <EmptyTitle>Chưa có bài tập nào</EmptyTitle>
                <EmptyDescription>
                  Bài tập sẽ xuất hiện khi giáo viên giao cho lớp của bạn.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
              {assignments.map((assignment) => (
                <AssignmentRow
                  key={assignment.id}
                  assignment={assignment}
                  simulatedNowIso={SIMULATED_NOW.toISOString()}
                />
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}
