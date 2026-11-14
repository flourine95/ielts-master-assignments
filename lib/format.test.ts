import { describe, expect, it } from "vitest"

import {
  describeDistance,
  formatShortDateTime,
} from "@/lib/format"
import { initialsOf } from "@/lib/initials"

describe("định dạng ngày giờ GMT+7", () => {
  it("ra ngày/tháng rồi mới tới giờ", () => {
    expect(formatShortDateTime("2026-11-13T23:59:00+07:00")).toBe("13/11 23:59")
    expect(formatShortDateTime("2026-11-08T23:59:00+07:00")).toBe("08/11 23:59")
    expect(formatShortDateTime("2026-11-10T20:00:00+07:00")).toBe("10/11 20:00")
  })

  it("không phụ thuộc timezone của máy chạy", () => {
    expect(formatShortDateTime("2026-11-13T16:59:00+00:00")).toBe("13/11 23:59")
  })

  it("dùng định dạng 24 giờ, không phải AM/PM", () => {
    // Nếu ai đổi hourCycle sang h12, 23:59 thành "11:59 CH" và test này đỏ.
    expect(formatShortDateTime("2026-11-13T23:59:00+07:00")).toBe("13/11 23:59")
    expect(formatShortDateTime("2026-11-13T23:59:00+07:00")).not.toMatch(/CH|PM|SA/i)

    // 09:00 giữ số 0 đứng đầu, không thành "9:00".
    expect(formatShortDateTime("2026-11-09T09:00:00+07:00")).toBe("09/11 09:00")
  })

  it("phân biệt còn hạn và quá hạn", () => {
    const now = "2026-11-11T09:00:00+07:00"
    expect(describeDistance("2026-11-13T23:59:00+07:00", now)).toEqual({
      direction: "remaining",
      label: "2 ngày 14 giờ",
    })
    expect(describeDistance("2026-11-09T23:59:00+07:00", now)).toEqual({
      direction: "overdue",
      label: "1 ngày 9 giờ",
    })
  })
})

describe("chữ cái đầu cho avatar", () => {
  it("lấy chữ đầu của từ đầu và từ cuối", () => {
    expect(initialsOf("Phi Long")).toBe("PL")
  })

  it("tên nhiều đốt vẫn chỉ ra hai ký tự", () => {
    expect(initialsOf("Nguyễn Thị Phi Long")).toBe("NL")
  })

  it("tên một từ lấy hai ký tự đầu", () => {
    expect(initialsOf("Long")).toBe("LO")
  })

  it("không vỡ khi tên rỗng", () => {
    expect(initialsOf("")).toBe("?")
    expect(initialsOf("   ")).toBe("?")
  })

  it("chuẩn hoá về chữ hoa", () => {
    expect(initialsOf("phi long")).toBe("PL")
  })
})
