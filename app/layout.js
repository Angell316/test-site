'use client'

import './globals.css'
import { Inter, Poppins } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'
import { AnimeListProvider } from '@/contexts/AnimeListContext'

const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({ 
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={`${inter.variable} ${poppins.variable}`}>
      <body className={inter.className}>
        <AuthProvider>
          <AnimeListProvider>
            {children}
          </AnimeListProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

