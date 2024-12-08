import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

type LoanType = 'personal' | 'business' | 'emergency'

const LoanCalculator: React.FC = () => {
  const [loanType, setLoanType] = useState<LoanType>('personal')
  const [amount, setAmount] = useState<number>(5000)
  const [period, setPeriod] = useState<number>(6)
  const [result, setResult] = useState<{ monthlyPayment: number; totalPayment: number; totalInterest: number } | null>(null)

  const calculateLoan = () => {
    let interestRate: number
    switch (loanType) {
      case 'personal':
        interestRate = 0.2 // 20%
        break
      case 'business':
        interestRate = 0.18 // 18%
        break
      case 'emergency':
        interestRate = 0.25 // 25%
        break
      default:
        interestRate = 0.2
    }

    if (period > 6) {
      interestRate += 0.2 // Additional 20% for periods over 6 months
    }

    const monthlyInterestRate = interestRate / 12
    const monthlyPayment = (amount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -period))
    const totalPayment = monthlyPayment * period
    const totalInterest = totalPayment - amount

    setResult({
      monthlyPayment,
      totalPayment,
      totalInterest
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loan Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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
            <Label htmlFor="amount">Loan Amount (KSh)</Label>
            <Input
              id="amount"
              type="number"
              min={5000}
              max={100000}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="period">Repayment Period (months)</Label>
            <Input
              id="period"
              type="number"
              min={1}
              max={12}
              value={period}
              onChange={(e) => setPeriod(Number(e.target.value))}
            />
          </div>
          <Button onClick={calculateLoan}>Calculate</Button>
        </div>
        {result && (
          <div className="mt-4 space-y-2">
            <p>Monthly Payment: KSh {result.monthlyPayment.toFixed(2)}</p>
            <p>Total Payment: KSh {result.totalPayment.toFixed(2)}</p>
            <p>Total Interest: KSh {result.totalInterest.toFixed(2)}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default LoanCalculator

