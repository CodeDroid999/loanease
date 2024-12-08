import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "react-hot-toast"
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'
import { RecaptchaVerifier } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [isPhoneAuth, setIsPhoneAuth] = useState(false)
  const [confirmationResult, setConfirmationResult] = useState<any>(null)
  const router = useRouter()
  const { toast } = useToast()
  const { signInWithEmail, signInWithPhone, confirmPhoneSignIn } = useAuth()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    try {
      await signInWithEmail(email, password)
      toast({
        title: "Login successful",
        description: "Welcome back!",
      })
      router.push('/dashboard')
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred during login.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!phoneNumber) {
      toast({
        title: "Error",
        description: "Please enter your phone number.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    try {
      const appVerifier = new RecaptchaVerifier('recaptcha-container', {
        size: 'invisible',
      }, auth)
      const confirmation = await signInWithPhone(phoneNumber, appVerifier)
      setConfirmationResult(confirmation)
      toast({
        title: "Verification code sent",
        description: "Please enter the verification code sent to your phone.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "There was a problem sending the verification code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!verificationCode) {
      toast({
        title: "Error",
        description: "Please enter the verification code.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    try {
      await confirmPhoneSignIn(verificationCode, confirmationResult)
      toast({
        title: "Login successful",
        description: "Welcome back!",
      })
      router.push('/dashboard')
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "There was a problem verifying your code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <Head>
        <title>Login - LoanEase</title>
        <meta name="description" content="Login to your LoanEase account" />
      </Head>
      <h1 className="text-2xl font-bold mb-5">Login</h1>
      <div className="mb-4">
        <Button onClick={() => setIsPhoneAuth(!isPhoneAuth)}>
          {isPhoneAuth ? 'Switch to Email' : 'Switch to Phone'}
        </Button>
      </div>
      {isPhoneAuth ? (
        confirmationResult ? (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <Label htmlFor="verificationCode">Verification Code</Label>
              <Input
                id="verificationCode"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Code'
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handlePhoneLogin} className="space-y-4">
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending code...
                </>
              ) : (
                'Send Verification Code'
              )}
            </Button>
          </form>
        )
      ) : (
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </form>
      )}
      <p className="mt-4">
        Don't have an account? <Link href="/register" className="text-blue-600 hover:underline">Register here</Link>
      </p>
      <p className="mt-2">
        <Link href="/forgot-password" className="text-blue-600 hover:underline">Forgot password?</Link>
      </p>
      <div id="recaptcha-container"></div>
    </div>
  )
}

