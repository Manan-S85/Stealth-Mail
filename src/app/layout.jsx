import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Stealth Mail - Temporary Email Generator',
  description: 'Generate temporary, disposable email addresses instantly. No registration required. Perfect for protecting your privacy and avoiding spam.',
  keywords: 'temporary email, disposable email, privacy, spam protection, temp mail',
  authors: [{ name: 'Stealth Mail Team' }],
  openGraph: {
    title: 'Stealth Mail - Temporary Email Generator',
    description: 'Generate temporary, disposable email addresses instantly. No registration required.',
    url: 'https://stealthmail.com',
    siteName: 'Stealth Mail',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stealth Mail - Temporary Email Generator',
    description: 'Generate temporary, disposable email addresses instantly. No registration required.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}