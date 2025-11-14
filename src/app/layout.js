import { Geist } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import SessionWrapper from "@/components/SessionWrapper"
import './globals.css'

const geist = Geist({ subsets: ["latin"] });

export const metadata = {
  title: 'PolyFlip - Learn Languages with Flashcards',
  description: 'A playful language learning flashcard app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geist.className} font-sans antialiased`}>
        <SessionWrapper>
          {children}
        </SessionWrapper>
        <Analytics />
      </body>
    </html>
  )
}
