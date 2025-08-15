"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2, CheckCircle, Plus, CreditCard, X, ArrowLeft, Shield, Smartphone } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface FormData {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  bvn: string
}

export default function CreateWallet() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [otp, setOtp] = useState("")
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    bvn: "",
  })

  const router = useRouter()
  const { toast } = useToast()

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    const { firstName, lastName, email, phoneNumber, bvn } = formData

    if (!firstName || !lastName || !email || !phoneNumber || !bvn) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return false
    }

    if (phoneNumber.length !== 11) {
      toast({
        title: "Invalid Phone Number",
        description: "Phone number must be 11 digits.",
        variant: "destructive",
      })
      return false
    }

    if (bvn.length !== 11) {
      toast({
        title: "Invalid BVN",
        description: "BVN must be 11 digits.",
        variant: "destructive",
      })
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleSendOTP = async () => {
    if (!validateForm()) return

    setIsLoading(true)

    // Simulate OTP sending
    setTimeout(() => {
      setIsLoading(false)
      setStep(2)
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${formData.phoneNumber}`,
      })
    }, 1500)
  }

  const handleCreateWallet = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit verification code.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate wallet creation
    setTimeout(() => {
      setIsLoading(false)
      setShowSuccessModal(true)
      toast({
        title: "Wallet Created Successfully!",
        description: "Your KredMart wallet is now ready to use.",
      })
    }, 2000)
  }

  const handleResendOTP = () => {
    toast({
      title: "OTP Resent",
      description: `New verification code sent to ${formData.phoneNumber}`,
    })
  }

  const walletDetails = {
    accountName: `${formData.firstName} ${formData.lastName}`,
    accountNumber: "2034567890",
    bankName: "KredMart Bank",
  }

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create Your Wallet
            </CardTitle>
            <CardDescription className="text-gray-600">
              Enter your details to create a secure KredMart wallet
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="border-gray-200 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="border-gray-200 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="border-gray-200 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                placeholder="08012345678"
                value={formData.phoneNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 11)
                  handleInputChange("phoneNumber", value)
                }}
                className="border-gray-200 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500">11-digit phone number</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bvn">BVN (Bank Verification Number)</Label>
              <Input
                id="bvn"
                placeholder="12345678901"
                value={formData.bvn}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 11)
                  handleInputChange("bvn", value)
                }}
                className="border-gray-200 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500">11-digit BVN number</p>
            </div>

            <Button
              onClick={handleSendOTP}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 mt-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                "Send OTP"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
            <Smartphone className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Verify Your Phone
          </CardTitle>
          <CardDescription className="text-gray-600">
            Enter the 6-digit code sent to {formData.phoneNumber}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="otp">Verification Code</Label>
            <Input
              id="otp"
              placeholder="123456"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                setOtp(value)
              }}
              className="border-gray-200 focus:border-green-500 text-center text-lg tracking-widest"
              maxLength={6}
            />
          </div>

          <div className="flex justify-center">
            <Button variant="ghost" onClick={handleResendOTP} className="text-blue-600 hover:text-blue-700">
              Resend OTP
            </Button>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={handleCreateWallet}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-medium"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Wallet"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm border-0">
          <DialogHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold text-green-600">Wallet Created Successfully!</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-3">Your Wallet Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Name:</span>
                  <span className="font-medium text-gray-900">{walletDetails.accountName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Number:</span>
                  <span className="font-medium text-gray-900">{walletDetails.accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bank Name:</span>
                  <span className="font-medium text-gray-900">{walletDetails.bankName}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => router.push("/dashboard/wallet")}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Go to Wallet
              </Button>
              <Button
                onClick={() => router.push("/dashboard/loan-request")}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Request Loan
              </Button>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={() => setShowSuccessModal(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
