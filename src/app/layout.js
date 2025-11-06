import { Inter } from 'next/font/google'
import './globals.css'
import { ToastProvider } from './components/ToastProvider.jsx'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Stealth Mail - Temporary Email Generator',
  description: 'Generate temporary email addresses quickly and securely',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}