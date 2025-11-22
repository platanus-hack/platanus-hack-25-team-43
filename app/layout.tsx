import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Student Success Path - Career Guidance for LATAM Students",
  description: "Personalized career pathways and action plans for ambitious international students in Latin America",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.className} ${geistMono.className}`}>{children}</body>
    </html>
  )
}
