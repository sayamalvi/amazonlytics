import './globals.css'
import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import Navbar from '@/components/Navbar'
import WelcomeHeading from '@/components/WelcomeHeading'
import { headers } from 'next/headers'

const headerList = headers()
const pathname = headerList.get('x-pathname')

const inter = Inter({ subsets: ['latin'] })
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'], weight: ['400', '500', '600', '700'],
})
export const metadata: Metadata = {
  title: 'Amazonlytics',
  description: 'Track Amazon Product Prices',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className='max-w-10xl mx-auto'>
          {pathname === '/' ? <Navbar /> : <WelcomeHeading />}
          {children}
        </main>
      </body>
    </html>
  )
}
