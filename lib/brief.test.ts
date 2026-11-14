import { describe, expect, it } from "vitest"

import { ASSIGNMENTS } from "@/lib/assignments"

/*
 * Chỉ kiểm những gì dữ liệu seed phải khớp với bảng trong đề mà không file
 * test nào khác kiểm: mốc thời gian nguyên văn, kiểu gạch nối trong tên bài,
 * và offset +07:00. Kết quả trạng thái và việc lọc đã có ở session.test.ts,
 * mốc giả lập đã có ở clock.test.ts.
 */
describe("dữ liệu seed khớp nguyên văn bảng trong đề", () => {
  it("hạn nộp và thời điểm nộp khớp từng ký tự", () => {
    const times = Object.fromEntries(
      ASSIGNMENTS.map((a) => [a.id, [a.dueAt, a.submittedAt]])
    )

    expect(times).toEqual({
      A01: ["2026-11-13T23:59:00+07:00", null],
      A02: ["2026-11-09T23:59:00+07:00", null],
      A03: ["2026-11-10T23:59:00+07:00", "2026-11-10T20:00:00+07:00"],
      A04: ["2026-11-08T23:59:00+07:00", "2026-11-10T12:00:00+07:00"],
      B01: ["2026-11-13T23:59:00+07:00", null],
    })
  })

  it("tên bài dùng en dash U+2013, không dùng hyphen thường", () => {
    const titles = ASSIGNMENTS.map((a) => a.title)

    expect(titles).toEqual([
      "Foundation U1 – Reading",
      "Foundation U2 – Listening",
      "Foundation U3 – Writing",
      "Foundation U4 – Speaking",
      "Foundation U1 – Reading",
    ])

    for (const title of titles) {
      expect(title).toContain("\u2013")
      expect(title).not.toContain("-")
    }
  })

  it("mọi mốc thời gian đều mang offset +07:00 như đề yêu cầu", () => {
    for (const assignment of ASSIGNMENTS) {
      expect(assignment.dueAt).toMatch(/\+07:00$/)
      if (assignment.submittedAt) {
        expect(assignment.submittedAt).toMatch(/\+07:00$/)
      }
    }
  })
})
