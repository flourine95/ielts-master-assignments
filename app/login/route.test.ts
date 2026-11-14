import { beforeEach, describe, expect, it, vi } from "vitest"

const setCookie = vi.fn()
const redirectMock = vi.fn((url: string) => {
  throw new Error(`REDIRECT:${url}`)
})

vi.mock("next/headers", () => ({
  cookies: async () => ({ set: setCookie }),
}))

vi.mock("next/navigation", () => ({
  redirect: (url: string) => redirectMock(url),
}))

const { GET } = await import("@/app/login/route")

function call(query: string) {
  return GET(new Request(`http://localhost/login${query}`))
}

/** Gọi route và bắt redirect, vì `redirect()` ném để dừng luồng. */
async function callCaught(query: string) {
  try {
    const res = await call(query)
    return { status: res.status, redirect: null }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (message.startsWith("REDIRECT:")) {
      return { status: 307, redirect: message.slice("REDIRECT:".length) }
    }
    throw error
  }
}

beforeEach(() => {
  setCookie.mockClear()
  redirectMock.mockClear()
})

describe("tạo phiên giả lập", () => {
  it("không có tham số thì cấp phiên S01", async () => {
    const result = await callCaught("")

    expect(result.redirect).toBe("/")
    expect(setCookie).toHaveBeenCalledWith(
      "im_session",
      "sess-01-demo",
      expect.objectContaining({ httpOnly: true, path: "/" })
    )
  })

  it("as=s02 thì cấp phiên S02", async () => {
    await callCaught("?as=s02")

    expect(setCookie).toHaveBeenCalledWith(
      "im_session",
      "sess-02-demo",
      expect.anything()
    )
  })

  it("giá trị lạ trả 400 và không đặt cookie", async () => {
    const result = await callCaught("?as=xyz")

    expect(result.status).toBe(400)
    expect(setCookie).not.toHaveBeenCalled()
  })

  it("giá trị gần đúng cũng bị từ chối, không âm thầm rơi về S01", async () => {
    for (const bad of ["s02x", "S02", "s03", " "]) {
      const result = await callCaught(`?as=${encodeURIComponent(bad)}`)
      expect(result.status).toBe(400)
    }
    expect(setCookie).not.toHaveBeenCalled()
  })

  it("cookie đặt httpOnly và sameSite lax", async () => {
    await callCaught("")

    expect(setCookie).toHaveBeenCalledWith(
      "im_session",
      expect.any(String),
      expect.objectContaining({ httpOnly: true, sameSite: "lax" })
    )
  })
})
