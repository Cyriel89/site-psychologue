// src/app/layout.tsx
import './globals.css'
import { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from './components/ScrollToTop'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "Psychologue - Nom",
  description: "Site professionnel d'une psychologue",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-white text-gray-800`}>
        <Header />
        <main>{children}</main>
        <ScrollToTop />
        <Footer />
      </body>
    </html>
  )
}
