import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface MpesaPaymentProps {
  amount: number
  onPaymentComplete: () => void
}

const MpesaPayment: React.FC<MpesaPaymentProps> = ({ amount, onPaymentComplete }) => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handlePayment = async () => {
    setLoading(true)
    // Here you would integrate with the M-Pesa API
    // This is a mock implementation
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast({
        title: "Payment Initiated",
        description: "Please check your phone for the M-Pesa prompt.",
      })
      onPaymentComplete()
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Label htmlFor="phoneNumber">M-Pesa Phone Number</Label>
      <Input
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

