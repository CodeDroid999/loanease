import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { AuthProvider } from '../contexts/AuthContext'
import Layout from '../components/Layout'
import { Toaster } from 'react-hot-toast'

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

