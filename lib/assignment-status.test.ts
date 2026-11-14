import { describe, expect, it } from "vitest"

import {
  getStatus,
  STATUS_LABEL,
  type AssignmentStatus,
} from "@/lib/assignment-status"
import type { Assignment } from "@/lib/assignments"
import { SIMULATED_NOW } from "@/lib/clock"

const at = (iso: string): Assignment => ({
  id: "X",
  studentId: "S01",
  title: "Fixture",
  dueAt: iso,
  submittedAt: null,
})

const NOW = SIMULATED_NOW

describe("bốn trường hợp trạng thái bắt buộc", () => {
  it("A01 chưa nộp còn hạn ra Chưa nộp", () => {
    const status = getStatus(at("2026-11-13T23:59:00+07:00"), NOW)
    expect(status).toBe<AssignmentStatus>("not_submitted_open")
    expect(STATUS_LABEL[status]).toBe("Chưa nộp")
  })

  it("A02 chưa nộp hết hạn ra Quá hạn", () => {
    const status = getStatus(at("2026-11-09T23:59:00+07:00"), NOW)
    expect(status).toBe<AssignmentStatus>("not_submitted_overdue")
    expect(STATUS_LABEL[status]).toBe("Quá hạn")
  })

  it("A03 đã nộp trước hạn ra Đã nộp", () => {
    const status = getStatus(
      {
        ...at("2026-11-10T23:59:00+07:00"),
        submittedAt: "2026-11-10T20:00:00+07:00",
      },
      NOW
    )
    expect(status).toBe<AssignmentStatus>("submitted_on_time")
    expect(STATUS_LABEL[status]).toBe("Đã nộp")
  })

  it("A04 nộp sau hạn ra Nộp trễ", () => {
    const status = getStatus(
      {
        ...at("2026-11-08T23:59:00+07:00"),
        submittedAt: "2026-11-10T12:00:00+07:00",
      },
      NOW
    )
    expect(status).toBe<AssignmentStatus>("submitted_late")
    expect(STATUS_LABEL[status]).toBe("Nộp trễ")
  })
})

describe("biên thời gian", () => {
  it("nộp đúng một phút sau hạn là nộp trễ", () => {
    expect(
      getStatus(
        {
          ...at("2026-11-10T23:59:00+07:00"),
          submittedAt: "2026-11-11T00:00:00+07:00",
        },
        NOW
      )
    ).toBe<AssignmentStatus>("submitted_late")
  })

  it("nộp đúng bằng hạn vẫn tính là đúng hạn", () => {
    expect(
      getStatus(
        {
          ...at("2026-11-10T23:59:00+07:00"),
          submittedAt: "2026-11-10T23:59:00+07:00",
        },
        NOW
      )
    ).toBe<AssignmentStatus>("submitted_on_time")
  })

  it("nộp lệch một mili giây sau hạn đã là nộp trễ", () => {
    expect(
      getStatus(
        {
          ...at("2026-11-10T23:59:00+07:00"),
          submittedAt: "2026-11-10T23:59:00.001+07:00",
        },
        NOW
      )
    ).toBe<AssignmentStatus>("submitted_late")
  })

  it("now trùng hạn và chưa nộp thì vẫn còn hạn", () => {
    expect(getStatus(at("2026-11-11T09:00:00+07:00"), NOW)).toBe<AssignmentStatus>(
      "not_submitted_open"
    )
  })

  it("so sánh đúng khi mốc giờ khác offset", () => {
    expect(
      getStatus(at("2026-11-09T16:59:00+00:00"), NOW)
    ).toBe<AssignmentStatus>("not_submitted_overdue")
  })
})
