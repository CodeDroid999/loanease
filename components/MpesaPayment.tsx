import React, { useState } from 'react'
import Button from "../components/ui/button"
import Input from "../components/ui/input"
import Label from "../components/ui/label"
import { useToast } from "../components/ui/useToast"

interface MpesaPaymentProps {
  amount: number
  onPaymentComplete: () => void
}

const MpesaPayment: React.FC<MpesaPaymentProps> = ({ amount, onPaymentComplete }) => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()  // Use showToast to trigger toasts

  const handlePayment = async () => {
    setLoading(true)
    // Simulate M-Pesa API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      showToast({
        title: "Payment Initiated",
        description: "Please check your phone for the M-Pesa prompt.",
      })
      onPaymentComplete()
    } catch (error) {
      showToast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive", // Now variant is accepted
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Label htmlFor="phoneNumber">M-Pesa Phone Number</Label>
      <input
        id="phoneNumber"
        type="tel"
        placeholder="e.g., 0712345678"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <Button onClick={handlePayment} disabled={loading || !phoneNumber}>
        {loading ? 'Processing...' : `Pay KSh ${amount.toFixed(2)}`}
      </Button>
    </div>
  )
}

export default MpesaPayment
