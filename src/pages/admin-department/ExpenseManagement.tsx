import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  Plus, 
  Eye, 
  Check, 
  X, 
  Upload, 
  Download,
  Wallet,
  Receipt,
  DollarSign,
  Calendar
} from "lucide-react";

const ExpenseManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedExpense, setSelectedExpense] = useState<any>(null);

  // Mock data for expenses
  const expenseData = [
    {
      id: 1,
      date: "2025-07-22",
      amount: "₹5,000",
      category: "Travel",
      description: "Travel expenses for site visit",
      requestedBy: "Rahul Sharma",
      paymentMethod: "Bank Transfer",
      status: "Pending",
      receiptUploaded: true,
      submittedDate: "2025-07-20"
    },
    {
      id: 2,
      date: "2025-07-21",
      amount: "₹2,500",
      category: "Supplies",
      description: "Office supplies and stationery",
      requestedBy: "Priya Patel",
      paymentMethod: "Cash",
      status: "Approved",
      receiptUploaded: true,
      submittedDate: "2025-07-19"
    },
    {
      id: 3,
      date: "2025-07-20",
      amount: "₹15,000",
      category: "Miscellaneous",
      description: "Emergency facility repair",
      requestedBy: "Amit Kumar",
      paymentMethod: "Bank Transfer",
      status: "Rejected",
      receiptUploaded: false,
      submittedDate: "2025-07-18"
    },
    {
      id: 4,
      date: "2025-07-19",
      amount: "₹3,200",
      category: "Travel",
      description: "Transportation for candidate interviews",
      requestedBy: "Neha Singh",
      paymentMethod: "Cash",
      status: "Pending",
      receiptUploaded: true,
      submittedDate: "2025-07-17"
    }
  ];

  // Mock data for petty cash balance
  const pettyCashData = {
    currentBalance: "₹45,000",
    monthlyBudget: "₹1,00,000",
    totalSpent: "₹55,000",
    pendingExpenses: "₹8,200"
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "bg-green-100 text-green-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Travel": return "bg-blue-100 text-blue-800";
      case "Supplies": return "bg-purple-100 text-purple-800";
      case "Miscellaneous": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredExpenseData = expenseData.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || expense.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleApproveExpense = (expenseId: number) => {
    console.log("Approving expense:", expenseId);
    // Implementation for expense approval
  };

  const handleRejectExpense = (expenseId: number) => {
    console.log("Rejecting expense:", expenseId);
    // Implementation for expense rejection
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expense & Petty Cash Management</h1>
          <p className="text-gray-600 mt-1">Manage expenses, petty cash, and approval workflows</p>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Petty Cash Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Wallet className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">{pettyCashData.currentBalance}</p>
                <p className="text-sm text-gray-600">Current Balance</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-600">{pettyCashData.monthlyBudget}</p>
                <p className="text-sm text-gray-600">Monthly Budget</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Receipt className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-red-600">{pettyCashData.totalSpent}</p>
                <p className="text-sm text-gray-600">Total Spent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-yellow-600">{pettyCashData.pendingExpenses}</p>
                <p className="text-sm text-gray-600">Pending Expenses</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Usage Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Budget Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Used: ₹55,000</span>
              <span>Remaining: ₹45,000</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-blue-600 h-3 rounded-full" style={{ width: "55%" }}></div>
            </div>
            <p className="text-sm text-gray-600">55% of monthly budget used</p>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Travel">Travel</SelectItem>
                <SelectItem value="Supplies">Supplies</SelectItem>
                <SelectItem value="Miscellaneous">Miscellaneous</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Date Range
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Expenses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Receipt</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenseData.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{expense.date}</TableCell>
                  <TableCell className="font-semibold">{expense.amount}</TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor(expense.category)}>
                      {expense.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{expense.description}</TableCell>
                  <TableCell>{expense.requestedBy}</TableCell>
                  <TableCell>{expense.paymentMethod}</TableCell>
                  <TableCell>
                    {expense.receiptUploaded ? (
                      <Badge className="bg-green-100 text-green-800">
                        Uploaded
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">
                        Missing
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(expense.status)}>
                      {expense.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedExpense(expense)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Expense Approval - {expense.id}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* Expense Details */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Amount</Label>
                                <p className="font-semibold text-lg">{expense.amount}</p>
                              </div>
                              <div>
                                <Label>Category</Label>
                                <p className="font-medium">{expense.category}</p>
                              </div>
                              <div>
                                <Label>Requested By</Label>
                                <p className="font-medium">{expense.requestedBy}</p>
                              </div>
                              <div>
                                <Label>Payment Method</Label>
                                <p className="font-medium">{expense.paymentMethod}</p>
                              </div>
                              <div>
                                <Label>Date</Label>
                                <p className="font-medium">{expense.date}</p>
                              </div>
                              <div>
                                <Label>Submitted Date</Label>
                                <p className="font-medium">{expense.submittedDate}</p>
                              </div>
                            </div>

                            {/* Description */}
                            <div>
                              <Label>Description</Label>
                              <p className="mt-1 p-3 bg-gray-50 rounded-md">{expense.description}</p>
                            </div>

                            {/* Supporting Documents */}
                            <div>
                              <Label>Supporting Receipts</Label>
                              {expense.receiptUploaded ? (
                                <div className="mt-2 p-4 border rounded-lg">
                                  <div className="flex items-center space-x-2">
                                    <Receipt className="h-5 w-5 text-green-600" />
                                    <span className="text-sm">Receipt_001.pdf</span>
                                    <Button variant="outline" size="sm">
                                      View
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="mt-2 p-4 border-2 border-dashed border-red-300 rounded-lg text-center">
                                  <p className="text-red-600">No receipt uploaded</p>
                                </div>
                              )}
                            </div>

                            {/* Admin Remarks */}
                            <div>
                              <Label>Admin Remarks</Label>
                              <Textarea 
                                placeholder="Add remarks for approval/rejection..."
                                className="mt-1"
                              />
                            </div>

                            {/* Action Buttons */}
                            {expense.status === "Pending" && (
                              <div className="flex justify-end space-x-3">
                                <Button 
                                  variant="outline" 
                                  onClick={() => handleRejectExpense(expense.id)}
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Reject
                                </Button>
                                <Button 
                                  onClick={() => handleApproveExpense(expense.id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Check className="h-4 w-4 mr-2" />
                                  Approve
                                </Button>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      {expense.status === "Pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApproveExpense(expense.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRejectExpense(expense.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseManagement;