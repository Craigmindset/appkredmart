"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Calendar, CreditCard, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header"

export default function BnplConfirmationPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const [orderDetails, setOrderDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails()
    }
  }, [orderId])

  const fetchOrderDetails = async () => {
    try {
      // API integration point: GET /api/bnpl/orders/{orderId}
      const response = await fetch(`/api/bnpl/orders/${orderId}`)
      const data = await response.json()
      setOrderDetails(data)
    } catch (error) {
      console.error("Error fetching order details:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#466cf4] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">BNPL Setup Complete!</h1>
            <p className="text-gray-600">Your Buy Now, Pay Later plan has been successfully created.</p>
          </div>

          {/* Order Details Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Order ID:</span>
                <p className="font-semibold">{orderId}</p>
              </div>
              <div>
                <span className="text-gray-600">Total Amount:</span>
                <p className="font-semibold">${orderDetails?.totalAmount?.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-gray-600">Monthly Payment:</span>
                <p className="font-semibold">${orderDetails?.monthlyPayment?.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-gray-600">Duration:</span>
                <p className="font-semibold">{orderDetails?.duration?.replace("months", " months")}</p>
              </div>
            </div>
          </div>

          {/* Payment Schedule */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Schedule</h2>
            <div className="space-y-3">
              {orderDetails?.paymentSchedule?.map((payment, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-[#466cf4]" />
                    <div>
                      <p className="font-medium">Payment {payment.installmentNumber}</p>
                      <p className="text-sm text-gray-600">Due: {new Date(payment.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="font-semibold">${payment.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="flex-1 bg-[#466cf4] hover:bg-[#3a5ce0]">
              <Download className="h-5 w-5 mr-2" />
              Download Payment Plan
            </Button>
            <Link href="/dashboard/user" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                <CreditCard className="h-5 w-5 mr-2" />
                Manage Payments
              </Button>
            </Link>
          </div>

          {/* Important Notice */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">Important Reminders:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Your first payment is due in 30 days</li>
              <li>• Set up automatic payments to avoid late fees</li>
              <li>• You can make early payments without penalties</li>
              <li>• Contact support if you need to modify your payment plan</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
