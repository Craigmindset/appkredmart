"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { MessageSquare, Clock, CheckCircle, AlertCircle, User, Store, Search, Send, Eye, Star } from "lucide-react"
import { RBACGuard } from "@/components/admin/rbac-guard"

interface SupportTicket {
  id: string
  type: "feedback" | "query" | "complaint"
  userType: "user" | "merchant"
  subject: string
  description: string
  status: "open" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  submittedBy: string
  submittedAt: string
  lastUpdated: string
  assignedTo?: string
  rating?: number
}

export default function SupportAdminPage() {
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [responseText, setResponseText] = useState("")
  const [isResponding, setIsResponding] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [userTypeFilter, setUserTypeFilter] = useState("all")

  // Demo support tickets
  const supportTickets: SupportTicket[] = [
    {
      id: "TKT-001",
      type: "complaint",
      userType: "user",
      subject: "Order not delivered",
      description:
        "I placed an order 5 days ago but haven't received it yet. The tracking shows it's still in processing.",
      status: "open",
      priority: "high",
      submittedBy: "John Doe (john@example.com)",
      submittedAt: "2024-01-15 10:30 AM",
      lastUpdated: "2024-01-15 10:30 AM",
    },
    {
      id: "TKT-002",
      type: "query",
      userType: "merchant",
      subject: "How to update product inventory?",
      description: "I need help updating my product inventory. The system seems to be showing incorrect stock levels.",
      status: "in-progress",
      priority: "medium",
      submittedBy: "Slot Store (slot@kredmart.com)",
      submittedAt: "2024-01-14 2:15 PM",
      lastUpdated: "2024-01-15 9:00 AM",
      assignedTo: "Admin User",
    },
    {
      id: "TKT-003",
      type: "feedback",
      userType: "user",
      subject: "Great shopping experience!",
      description: "I love the new interface and the fast delivery. Keep up the good work!",
      status: "resolved",
      priority: "low",
      submittedBy: "Jane Smith (jane@example.com)",
      submittedAt: "2024-01-13 4:45 PM",
      lastUpdated: "2024-01-14 11:20 AM",
      rating: 5,
    },
    {
      id: "TKT-004",
      type: "complaint",
      userType: "merchant",
      subject: "Payment settlement delay",
      description: "My payments have been delayed for the past week. This is affecting my business operations.",
      status: "open",
      priority: "urgent",
      submittedBy: "Gbam Inc (gbam@kredmart.com)",
      submittedAt: "2024-01-15 8:20 AM",
      lastUpdated: "2024-01-15 8:20 AM",
    },
    {
      id: "TKT-005",
      type: "query",
      userType: "user",
      subject: "How to apply for a loan?",
      description: "I'm interested in applying for a loan but can't find the application form. Can you guide me?",
      status: "resolved",
      priority: "medium",
      submittedBy: "Mike Johnson (mike@example.com)",
      submittedAt: "2024-01-12 11:30 AM",
      lastUpdated: "2024-01-13 3:15 PM",
      rating: 4,
    },
  ]

  const filteredTickets = supportTickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesType = typeFilter === "all" || ticket.type === typeFilter
    const matchesUserType = userTypeFilter === "all" || ticket.userType === userTypeFilter

    return matchesSearch && matchesStatus && matchesType && matchesUserType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500 text-white"
      case "high":
        return "bg-orange-500 text-white"
      case "medium":
        return "bg-yellow-500 text-white"
      case "low":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "feedback":
        return <Star className="h-4 w-4" />
      case "query":
        return <MessageSquare className="h-4 w-4" />
      case "complaint":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const handleSendResponse = async () => {
    if (!responseText.trim() || !selectedTicket) return

    setIsResponding(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Response Sent",
      description: `Your response has been sent to ${selectedTicket.submittedBy}`,
    })

    setResponseText("")
    setIsResponding(false)
    setSelectedTicket(null)
  }

  const handleStatusUpdate = async (ticketId: string, newStatus: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    toast({
      title: "Status Updated",
      description: `Ticket ${ticketId} status updated to ${newStatus}`,
    })
  }

  // Statistics
  const stats = {
    total: supportTickets.length,
    open: supportTickets.filter((t) => t.status === "open").length,
    inProgress: supportTickets.filter((t) => t.status === "in-progress").length,
    resolved: supportTickets.filter((t) => t.status === "resolved").length,
    avgRating:
      supportTickets.filter((t) => t.rating).reduce((acc, t) => acc + (t.rating || 0), 0) /
      supportTickets.filter((t) => t.rating).length,
  }

  return (
    <RBACGuard permissions={["view_support"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Support Center</h1>
            <p className="text-gray-600 mt-1">Manage customer feedback, queries, and complaints</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tickets</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Open</p>
                  <p className="text-2xl font-bold text-red-600">{stats.open}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.avgRating.toFixed(1)}</p>
                </div>
                <Star className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tickets List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Support Tickets
                </CardTitle>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search tickets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                      <SelectItem value="query">Query</SelectItem>
                      <SelectItem value="complaint">Complaint</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="User Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="user">Users</SelectItem>
                      <SelectItem value="merchant">Merchants</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
                {filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedTicket?.id === ticket.id ? "border-blue-500 bg-blue-50" : ""
                    }`}
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(ticket.type)}
                        <span className="font-medium">{ticket.id}</span>
                        <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {ticket.userType === "merchant" ? <Store className="h-4 w-4" /> : <User className="h-4 w-4" />}
                        <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                      </div>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">{ticket.subject}</h4>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{ticket.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>By: {ticket.submittedBy}</span>
                      <span>{ticket.submittedAt}</span>
                    </div>
                    {ticket.rating && (
                      <div className="flex items-center gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < ticket.rating! ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Ticket Details & Response */}
          <div>
            {selectedTicket ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Ticket Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{selectedTicket.id}</span>
                      <Badge className={getStatusColor(selectedTicket.status)}>{selectedTicket.status}</Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{selectedTicket.subject}</h3>
                    <p className="text-gray-600 mb-4">{selectedTicket.description}</p>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Submitted by:</span>
                        <span>{selectedTicket.submittedBy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Type:</span>
                        <span className="capitalize">{selectedTicket.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Priority:</span>
                        <Badge className={getPriorityColor(selectedTicket.priority)}>{selectedTicket.priority}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Submitted:</span>
                        <span>{selectedTicket.submittedAt}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Last updated:</span>
                        <span>{selectedTicket.lastUpdated}</span>
                      </div>
                    </div>
                  </div>

                  <RBACGuard permissions={["manage_support"]} requireAll={false}>
                    {/* Status Update */}
                    <div className="space-y-2">
                      <Label>Update Status</Label>
                      <Select
                        value={selectedTicket.status}
                        onValueChange={(value) => handleStatusUpdate(selectedTicket.id, value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Response */}
                    <div className="space-y-2">
                      <Label htmlFor="response">Send Response</Label>
                      <Textarea
                        id="response"
                        placeholder="Type your response here..."
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        rows={4}
                      />
                      <Button
                        onClick={handleSendResponse}
                        disabled={!responseText.trim() || isResponding}
                        className="w-full"
                      >
                        {isResponding ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Send Response
                          </>
                        )}
                      </Button>
                    </div>
                  </RBACGuard>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Ticket</h3>
                  <p className="text-gray-600">Choose a ticket from the list to view details and respond</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </RBACGuard>
  )
}
