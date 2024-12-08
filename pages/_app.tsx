import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"
import '@/styles/globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import Layout from '@/components/Layout'

const inter = Inter({ subsets: ['latin'] })

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <main className={inter.className}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <Toaster />
      </main>
    </AuthProvider>
  )
}

