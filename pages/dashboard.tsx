import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from '@/contexts/AuthContext'
import MpesaPayment from '@/components/MpesaPayment'

interface Application {
  id: string
  amount: number
  purpose: string
  repaymentPeriod: number
  interestAmount: number
  totalAmount: number
  monthlyPayment: number
  status: 'pending' | 'approved' | 'rejected'
  createdAt: Date
  paidAmount?: number
}

export default function DashboardPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [creditScore, setCreditScore] = useState<number | null>(null)
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const q = query(collection(db, 'applications'), where('email', '==', user.email))
        const querySnapshot = await getDocs(q)
        const apps: Application[] = []
        querySnapshot.forEach((doc) => {
          apps.push({ id: doc.id, ...doc.data() } as Application)
        })
        setApplications(apps)

        // Simulated credit score
        setCreditScore(Math.floor(Math.random() * (850 - 300 + 1) + 300))
      }
    }

    fetchData()
  }, [user])

  const handlePayment = async (applicationId: string, amount: number) => {
    if (!user) return

    try {
      const applicationRef = doc(db, 'applications', applicationId)
      const application = applications.find(app => app.id === applicationId)
      if (!application) return

      const newPaidAmount = (application.paidAmount || 0) + amount
      await updateDoc(applicationRef, { paidAmount: newPaidAmount })

      // Update local state
      setApplications(apps => apps.map(app => 
        app.id === applicationId ? { ...app, paidAmount: newPaidAmount } : app
      ))

      // Refresh data
      fetchData()
    } catch (error) {
      console.error("Error updating payment:", error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto py-10">
      <Head>
        <title>Dashboard - LoanEase</title>
        <meta name="description" content="View your loan applications and credit score" />
      </Head>
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.email}</h1>
      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Credit Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{creditScore !== null ? creditScore : 'Loading...'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{applications.length}</p>
          </CardContent>
        </Card>
      </div>
      <h2 className="text-2xl font-bold mb-4">Your Loan Applications</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Amount</TableHead>
            <TableHead>Purpose</TableHead>
            <TableHead>Repayment Period</TableHead>
            <TableHead>Interest</TableHead>
            <TableHead>Total Repayment</TableHead>
            <TableHead>Monthly Payment</TableHead>
            <TableHead>Paid Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((app) => (
            <TableRow key={app.id}>
              <TableCell>KSh {app.amount.toLocaleString()}</TableCell>
              <TableCell>{app.purpose}</TableCell>
              <TableCell>{app.repaymentPeriod} months</TableCell>
              <TableCell>KSh {app.interestAmount.toLocaleString()}</TableCell>
              <TableCell>KSh {app.totalAmount.toLocaleString()}</TableCell>
              <TableCell>KSh {app.monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
              <TableCell>KSh {(app.paidAmount || 0).toLocaleString()}</TableCell>
              <TableCell>
                <Badge variant={app.status === 'approved' ? 'success' : app.status === 'rejected' ? 'destructive' : 'default'}>
                  {app.status}
                </Badge>
              </TableCell>
              <TableCell>
                {app.status === 'approved' && (app.paidAmount || 0) < app.totalAmount && (
                  <MpesaPayment 
                    amount={app.monthlyPayment} 
                    onPaymentComplete={() => handlePayment(app.id, app.monthlyPayment)}
                  />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

