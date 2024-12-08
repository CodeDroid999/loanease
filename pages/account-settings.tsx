import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "react-hot-toast"
import { useAuth } from '@/contexts/AuthContext'
import { updatePassword, updateEmail, User } from 'firebase/auth'
import { Loader2 } from 'lucide-react'

export default function AccountSettingsPage() {
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      await updateEmail(user, newEmail)
      toast({
        title: "Email updated",
        description: "Your email has been successfully updated.",
      })
      setNewEmail('')
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while updating your email.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      await updatePassword(user, newPassword)
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      })
      setNewPassword('')
      setConfirmPassword('')
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while updating your password.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    router.push('/login')
    return null
  }

  return (
    <div className="container mx-auto py-10">
      <Head>
        <title>Account Settings - LoanEase</title>
        <meta name="description" content="Manage your LoanEase account settings" />
      </Head>
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
      <div className="space-y-8">
        <form onSubmit={handleUpdateEmail} className="space-y-4">
          <h2 className="text-xl font-semibold">Update Email</h2>
          <div>
            <Label htmlFor="newEmail">New Email</Label>
            <Input
              id="newEmail"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Email'
            )}
          </Button>
        </form>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <h2 className="text-xl font-semibold">Update Password</h2>
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
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
                Updating...
              </>
            ) : (
              'Update Password'
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}

