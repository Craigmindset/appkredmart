"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, XCircle, Clock, Wallet, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header"

export default function LoanApprovalPage() {
  const searchParams = useSearchParams()
  const applicationId = searchParams.get("applicationId")
  const [applicationDetails, setApplicationDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (applicationId) {
      fetchApplicationDetails()
    }
  }, [applicationId])

  const fetchApplicationDetails = async () => {
    try {
      // API integration point: GET /api/loans/applications/{applicationId}
      const response = await fetch(`/api/loans/applications/${applicationId}`)
      const data = await response.json()
      setApplicationDetails(data)
    } catch (error) {
      console.error("Error fetching application details:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptLoan = async () => {
    try {
      // API integration point: POST /api/loans/applications/{applicationId}/accept
      const response = await fetch(`/api/loans/applications/${applicationId}/accept`, {
        method: "POST",
      })

      if (response.ok) {
        // Redirect to success page or dashboard
        window.location.href = "/dashboard/user?tab=wallet"
      }
    } catch (error) {
      console.error("Error accepting loan:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#466cf4] mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing loan application...</p>
        </div>
      </div>
    )
  }

  const getStatusIcon = () => {
    switch (applicationDetails?.status) {
      case "approved":
        return <CheckCircle className="h-16 w-16 text-green-500" />
      case "rejected":
        return <XCircle className="h-16 w-16 text-red-500" />
      default:
        return <Clock className="h-16 w-16 text-yellow-500" />
    }
  }

  const getStatusMessage = () => {
    switch (applicationDetails?.status) {
      case "approved":
        return {
          title: "Loan Approved!",
          message: "Congratulations! Your loan application has been approved.",
          color: "text-green-600",
        }
      case "rejected":
        return {
          title: "Loan Application Declined",
          message: "Unfortunately, your loan application was not approved at this time.",
          color: "text-red-600",
        }
      default:
        return {
          title: "Application Under Review",
          message: "Your loan application is being processed. We'll notify you once it's complete.",
          color: "text-yellow-600",
        }
    }
  }

  const statusInfo = getStatusMessage()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Status Header */}
          <div className="text-center mb-8">
            {getStatusIcon()}
            <h1 className={`text-3xl font-bold mb-2 ${statusInfo.color}`}>{statusInfo.title}</h1>
            <p className="text-gray-600">{statusInfo.message}</p>
          </div>

          {/* Application Details Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Application ID:</span>
                <p className="font-semibold">{applicationId}</p>
              </div>
              <div>
                <span className="text-gray-600">Loan Amount:</span>
                <p className="font-semibold">${applicationDetails?.loanAmount?.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-gray-600">Provider:</span>
                <p className="font-semibold">{applicationDetails?.provider}</p>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <p className={`font-semibold capitalize ${statusInfo.color}`}>{applicationDetails?.status}</p>
              </div>
            </div>
          </div>

          {/* Approved Loan Details */}
          {applicationDetails?.status === "approved" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-green-800 mb-4">Loan Terms</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-green-700">Interest Rate:</span>
                  <p className="font-semibold">{applicationDetails?.providerResponse?.interestRate}% per month</p>
                </div>
                <div>
                  <span className="text-green-700">Repayment Term:</span>
                  <p className="font-semibold">{applicationDetails?.providerResponse?.repaymentTerms}</p>
                </div>
                <div>
                  <span className="text-green-700">Provider Loan ID:</span>
                  <p className="font-semibold">{applicationDetails?.providerResponse?.providerLoanId}</p>
                </div>
                <div>
                  <span className="text-green-700">Approved Amount:</span>
                  <p className="font-semibold">${applicationDetails?.providerResponse?.approvedAmount?.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Rejected Loan Details */}
          {applicationDetails?.status === "rejected" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Reason for Decline</h3>
              <p className="text-red-700">
                {applicationDetails?.reason || "Credit assessment did not meet requirements"}
              </p>

              <div className="mt-4">
                <h4 className="font-semibold text-red-800 mb-2">What you can do:</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Try a different loan provider</li>
                  <li>• Apply for a smaller loan amount</li>
                  <li>• Improve your credit score and reapply later</li>
                  <li>• Use alternative payment methods</li>
                </ul>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {applicationDetails?.status === "approved" && (
              <>
                <Button onClick={handleAcceptLoan} className="flex-1 bg-green-600 hover:bg-green-700">
                  <Wallet className="h-5 w-5 mr-2" />
                  Accept Loan & Complete Purchase
                </Button>
                <Link href="/checkout" className="flex-1">
                  <Button variant="outline" className="w-full bg-transparent">
                    Choose Different Payment
                  </Button>
                </Link>
              </>
            )}

            {applicationDetails?.status === "rejected" && (
              <>
                <Link href="/checkout" className="flex-1">
                  <Button className="w-full bg-[#466cf4] hover:bg-[#3a5ce0]">Try Different Provider</Button>
                </Link>
                <Link href="/checkout" className="flex-1">
                  <Button variant="outline" className="w-full bg-transparent">
                    Use Different Payment Method
                  </Button>
                </Link>
              </>
            )}

            {applicationDetails?.status === "pending_review" && (
              <div className="text-center">
                <p className="text-gray-600 mb-4">We'll send you an email once your application is processed.</p>
                <Link href="/">
                  <Button variant="outline" className="bg-transparent">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Important Notice */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Important Information:</p>
                <ul className="space-y-1">
                  <li>• Loan funds will be credited to your Shopella wallet</li>
                  <li>• Your order will be processed immediately upon loan acceptance</li>
                  <li>• Repayment will be automatically deducted from your linked account</li>
                  <li>• Contact support if you have any questions about your loan</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
