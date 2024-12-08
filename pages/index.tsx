import Head from 'next/head'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>LoanEase - Quick and Easy Loans</title>
        <meta name="description" content="Apply for loans online with our easy-to-use platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-blue-600">LoanEase</span>
              </div>
            </div>
            <div className="flex items-center">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/apply">
                <Button className="ml-4">Apply Now</Button>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Quick and Easy Loans</h1>
            <p className="text-xl text-gray-600 mb-8">Get the financial boost you need with our simple online application process.</p>
            <Link href="/apply">
              <Button size="lg">Start Your Application</Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p>&copy; 2023 LoanEase. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

