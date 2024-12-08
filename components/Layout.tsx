import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button } from "@/components/ui/button"
import { useAuth } from '@/contexts/AuthContext'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Bell } from 'lucide-react'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/">
                  <span className="text-2xl font-bold text-blue-600">LoanEase</span>
                </Link>
              </div>
              <div className="ml-6 flex space-x-8">
                <Link href="/about">
                  <span className="text-gray-500 hover:text-gray-700">About</span>
                </Link>
                <Link href="/contact">
                  <span className="text-gray-500 hover:text-gray-700">Contact</span>
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              {user ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="ghost">Dashboard</Button>
                  </Link>
                  <Link href="/account-settings">
                    <Button variant="ghost">Account Settings</Button>
                  </Link>
                  <Link href="/notifications">
                    <Button variant="ghost">
                      <Bell className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Button onClick={handleSignOut} variant="ghost">Sign Out</Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link href="/apply">
                    <Button className="ml-4">Apply Now</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between">
            <p>&copy; 2023 LoanEase. All rights reserved.</p>
            <div className="space-x-4">
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/terms-of-service">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout

