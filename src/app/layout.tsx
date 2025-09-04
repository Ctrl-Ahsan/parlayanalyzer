import type { Metadata } from 'next'
import { Inter, Roboto_Condensed } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const robotoCondensed = Roboto_Condensed({ 
  subsets: ['latin'],
  variable: '--font-roboto-condensed',
})

export const metadata: Metadata = {
  title: 'Parlay Analyzer',
  description: 'Analyze and optimize your parlay bets',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${robotoCondensed.variable}`}>{children}</body>
    </html>
  )
}
