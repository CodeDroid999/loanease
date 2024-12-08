import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { db } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'
import { useAuth } from '@/contexts/AuthContext'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import LoanCalculator from '@/components/LoanCalculator'

type LoanType = 'personal' | 'business' | 'emergency'

export default function ApplyPage() {
  const [loanType, setLoanType] = useState<LoanType>('personal')
  const [amount, setAmount] = useState(5000)
  const [purpose, setPurpose] = useState('')
  const [repaymentPeriod, setRepaymentPeriod] = useState(6)
  const [collateral, setCollateral] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  const calculateInterest = (amount: number, period: number, type: LoanType) => {
    let rate: number
    switch (type) {
      case 'personal':
        rate = 0.2
        break
      case 'business':
        rate = 0.18
        break
      case 'emergency':
        rate = 0.25
        break
      default:
        rate = 0.2
    }
    if (period > 6) rate += 0.2
    return amount * rate
  }

  const calculateMonthlyPayment = (amount: number, period: number, type: LoanType) => {
    const totalAmount = amount + calculateInterest(amount, period, type)
    return totalAmount / period
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      const interestAmount = calculateInterest(amount, repaymentPeriod, loanType)
      const totalAmount = amount + interestAmount
      const monthlyPayment = calculateMonthlyPayment(amount, repaymentPeriod, loanType)

      await addDoc(collection(db, 'applications'), {
        email: user.email,
        loanType,
        amount,
        purpose,
        repaymentPeriod,
        collateral,
        interestAmount,
        totalAmount,
        monthlyPayment,
        status: 'pending',
        createdAt: new Date()
      })
      toast({
        title: "Application submitted",
        description: "We'll review your application and get back to you soon.",
      })
      router.push('/dashboard')
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem submitting your application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto py-10">
      <Head>
        <title>Apply for a Loan - LoanEase</title>
        <meta name="description" content="Apply for a quick and easy loan with LoanEase" />
      </Head>
      <h1 className="text-3xl font-bold mb-6">Loan Application</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="loanType">Loan Type</Label>
            <Select onValueChange={(value: LoanType) => setLoanType(value)}>
              <SelectTrigger id="loanType">
                <SelectValue placeholder="Select loan type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Personal Loan</SelectItem>
                <SelectItem value="business">Business Loan</SelectItem>
                <SelectItem value="emergency">Emergency Loan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="amount">Loan Amount (KSh {amount.toLocaleString()})</Label>
            <Slider
              id="amount"
              min={5000}
              max={100000}
              step={1000}
              value={[amount]}
              onValueChange={(value) => setAmount(value[0])}
            />
          </div>
          <div>
            <Label htmlFor="purpose">Loan Purpose</Label>
            <Input id="purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="repaymentPeriod">Preferred Repayment Period (months)</Label>
            <Select onValueChange={(value) => setRepaymentPeriod(parseInt(value))}>
              <SelectTrigger id="repaymentPeriod">
                <SelectValue placeholder="Select repayment period" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 9, 12].map((month) => (
                  <SelectItem key={month} value={month.toString()}>{month} {month === 1 ? 'month' : 'months'}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="collateral">Collateral (item of equal value to loan amount)</Label>
            <Input id="collateral" value={collateral} onChange={(e) => setCollateral(e.target.value)} required />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Loan Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Loan Amount: KSh {amount.toLocaleString()}</p>
              <p>Interest Rate: {repaymentPeriod <= 6 ? '20%' : '40%'}</p>
              <p>Interest Amount: KSh {calculateInterest(amount, repaymentPeriod, loanType).toLocaleString()}</p>
              <p>Total Repayment: KSh {(amount + calculateInterest(amount, repaymentPeriod, loanType)).toLocaleString()}</p>
              <p>Monthly Payment: KSh {calculateMonthlyPayment(amount, repaymentPeriod, loanType).toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
            </CardContent>
          </Card>
          <Button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Application'}
          </Button>
        </form>
        <LoanCalculator />
      </div>
    </div>
  )
}

