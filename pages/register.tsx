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

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [isPhoneAuth, setIsPhoneAuth] = useState(false)
  const [confirmationResult, setConfirmationResult] = useState<any>(null)
  const router = useRouter()
  const { toast } = useToast()
  const { signUpWithEmail, signInWithPhone, confirmPhoneSignIn } = useAuth()

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!email || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    try {
      await signUpWithEmail(email, password)
      toast({
        title: "Registration successful",
        description: "Your account has been created.",
      })
      router.push('/dashboard')
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "There was a problem creating your account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePhoneSignUp = async (e: React.FormEvent) => {
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
        title: "Registration successful",
        description: "Your account has been created.",
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
        <title>Register - LoanEase</title>
        <meta name="description" content="Create a new LoanEase account" />
      </Head>
      <h1 className="text-2xl font-bold mb-5">Register</h1>
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
          <form onSubmit={handlePhoneSignUp} className="space-y-4">
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
        <form onSubmit={handleEmailSignUp} className="space-y-4">
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
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              'Register'
            )}
          </Button>
        </form>
      )}
      <p className="mt-4">
        Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Login here</Link>
      </p>
      <div id="recaptcha-container"></div>
    </div>
  )
}

