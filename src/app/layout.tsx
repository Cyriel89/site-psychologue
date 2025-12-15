import './globals.css'
import { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from './components/ScrollToTop'
import { cookies } from "next/headers";
import { COOKIE_NAME, parseSessionFromToken } from "@/lib/session";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "Psychologue - Nom",
  description: "Site professionnel d'une psychologue",
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const session = await parseSessionFromToken(token);
  const userRole = session?.role as string | undefined;
  return (
    <html lang="fr">
      <body className={`${inter.className} antialiased bg-white text-gray-800`}>
        <Header userRole={userRole} />
        <main>{children}</main>
        <ScrollToTop />
        <Footer />
      </body>
    </html>
  )
}
