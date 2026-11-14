import { describe, expect, it } from "vitest"

import { SIMULATED_NOW } from "@/lib/clock"
import { listAssignmentsForStudent, resolveSession } from "@/lib/session"

describe("lọc dữ liệu theo học viên", () => {
  const s01 = listAssignmentsForStudent("S01", SIMULATED_NOW)

  it("S01 nhận đúng 4 bài", () => {
    expect(s01.map((a) => a.id).sort()).toEqual(["A01", "A02", "A03", "A04"])
  })

  it("sắp theo khả năng hành động: còn hạn, quá hạn, đã xong", () => {
    expect(s01.map((a) => a.id)).toEqual(["A01", "A02", "A04", "A03"])
    expect(s01[0].status).toBe("not_submitted_open")
    expect(s01.at(-1)?.status).toBe("submitted_on_time")
  })

  it("trong cùng nhóm, hạn nộp gần hơn đứng trước", () => {
    const done = s01.filter(
      (a) => a.status === "submitted_late" || a.status === "submitted_on_time"
    )
    expect(done.map((a) => a.id)).toEqual(["A04", "A03"])
    expect(new Date(done[0].dueAt).getTime()).toBeLessThan(
      new Date(done[1].dueAt).getTime()
    )
  })

  it("B01 của S02 không xuất hiện trong dữ liệu S01", () => {
    expect(s01.some((a) => a.id === "B01")).toBe(false)
    expect(JSON.stringify(s01)).not.toContain("B01")
  })

  it("hai học viên không dùng chung bài nào", () => {
    const s02 = listAssignmentsForStudent("S02", SIMULATED_NOW)
    expect(s02.map((a) => a.id)).toEqual(["B01"])

    const s01Ids = new Set(s01.map((a) => a.id))
    expect(s02.some((a) => s01Ids.has(a.id))).toBe(false)
  })

  it("S01 ra đúng 4 trạng thái theo bảng kết quả của đề", () => {
    const byId = Object.fromEntries(s01.map((a) => [a.id, a.status]))
    expect(byId).toEqual({
      A01: "not_submitted_open",
      A02: "not_submitted_overdue",
      A03: "submitted_on_time",
      A04: "submitted_late",
    })
  })

  it("học viên không tồn tại nhận mảng rỗng", () => {
    expect(listAssignmentsForStudent("S99", SIMULATED_NOW)).toEqual([])
    expect(listAssignmentsForStudent("", SIMULATED_NOW)).toEqual([])
  })

  it("kết quả không phụ thuộc timezone của máy chạy", () => {
    const fixed = new Date("2026-11-11T02:00:00.000Z")
    expect(listAssignmentsForStudent("S01", fixed)).toEqual(s01)
  })
})

describe("session giả lập ở server", () => {
  it("token hợp lệ trả đúng học viên", () => {
    expect(resolveSession("sess-01-demo")?.studentId).toBe("S01")
    expect(resolveSession("sess-02-demo")?.studentId).toBe("S02")
  })

  it("token lạ hoặc thiếu thì không có session", () => {
    expect(resolveSession(undefined)).toBeNull()
    expect(resolveSession("sess-gia-mao")).toBeNull()
  })
})
