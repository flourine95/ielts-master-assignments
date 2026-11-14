import type { Metadata } from "next"
import { Be_Vietnam_Pro } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Bài tập của tôi | IELTS Master",
    template: "%s | IELTS Master",
  },
  description:
    "Danh sách bài tập của học viên IELTS Master, kèm hạn nộp và trạng thái từng bài.",
  applicationName: "IELTS Master",
  robots: { index: false, follow: false },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={cn("antialiased", "font-sans", beVietnamPro.variable)}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
