import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { SESSION_COOKIE } from "@/lib/session"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const as = url.searchParams.get("as")

  let token: string
  if (as === null || as === "") {
    token = "sess-01-demo"
  } else if (as === "s02") {
    token = "sess-02-demo"
  } else {
    return new Response(`Tài khoản không tồn tại: ${as}`, {
      status: 400,
      headers: { "content-type": "text/plain; charset=utf-8" },
    })
  }

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  })

  redirect("/")
}
