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
import { useToast } from "@/hooks/use-toast";
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
  Calendar,
  IndianRupee
} from "lucide-react";

const ExpenseManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    requestedBy: "",
    paymentMethod: "",
    date: "",
    receiptFile: null as File | null
  });

  const [expenseData, setExpenseData] = useState([
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
  ]);

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
    setExpenseData(prev => prev.map(expense => 
      expense.id === expenseId ? { ...expense, status: "Approved" } : expense
    ));
    toast({
      title: "Expense Approved",
      description: "The expense has been successfully approved.",
    });
  };

  const handleRejectExpense = (expenseId: number) => {
    setExpenseData(prev => prev.map(expense => 
      expense.id === expenseId ? { ...expense, status: "Rejected" } : expense
    ));
    toast({
      title: "Expense Rejected",
      description: "The expense has been rejected.",
    });
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.category || !formData.description || !formData.requestedBy || !formData.paymentMethod || !formData.date) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newExpense = {
      id: expenseData.length + 1,
      date: formData.date,
      amount: `₹${formData.amount}`,
      category: formData.category,
      description: formData.description,
      requestedBy: formData.requestedBy,
      paymentMethod: formData.paymentMethod,
      status: "Pending",
      receiptUploaded: formData.receiptFile ? true : false,
      submittedDate: new Date().toISOString().split('T')[0]
    };
    
    setExpenseData(prev => [newExpense, ...prev]);
    setIsAddExpenseOpen(false);
    setFormData({
      amount: "",
      category: "",
      description: "",
      requestedBy: "",
      paymentMethod: "",
      date: "",
      receiptFile: null
    });
    toast({
      title: "Expense Added",
      description: "New expense request has been submitted successfully.",
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, receiptFile: e.target.files![0] }));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 lg:p-6 space-y-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Expense & Petty Cash Management</h1>
            <p className="text-muted-foreground">Manage expenses, petty cash, and approval workflows</p>
          </div>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <Button variant="outline" className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddExpense} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Amount *</Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="amount"
                        type="number"
                        placeholder="Enter amount"
                        value={formData.amount}
                        onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Travel">Travel</SelectItem>
                        <SelectItem value="Supplies">Supplies</SelectItem>
                        <SelectItem value="Miscellaneous">Miscellaneous</SelectItem>
                        <SelectItem value="Food">Food</SelectItem>
                        <SelectItem value="Utilities">Utilities</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="requestedBy">Requested By *</Label>
                    <Input
                      id="requestedBy"
                      placeholder="Enter requester name"
                      value={formData.requestedBy}
                      onChange={(e) => setFormData(prev => ({ ...prev, requestedBy: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="paymentMethod">Payment Method *</Label>
                    <Select value={formData.paymentMethod} onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                        <SelectItem value="UPI">UPI</SelectItem>
                        <SelectItem value="Cheque">Cheque</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter expense description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="receipt">Upload Receipt</Label>
                  <div className="mt-1">
                    <Input
                      id="receipt"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Accepted formats: PDF, JPG, PNG (Max 5MB)</p>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddExpenseOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Submit Expense
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

        {/* Stats Overview - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Wallet className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{pettyCashData.currentBalance}</p>
                  <p className="text-sm text-muted-foreground">Current Balance</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{pettyCashData.monthlyBudget}</p>
                  <p className="text-sm text-muted-foreground">Monthly Budget</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Receipt className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">{pettyCashData.totalSpent}</p>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-600">{pettyCashData.pendingExpenses}</p>
                  <p className="text-sm text-muted-foreground">Pending Expenses</p>
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
            <div className="space-y-4">
              <div className="flex justify-between text-sm font-medium">
                <span>Used: ₹55,000</span>
                <span>Remaining: ₹45,000</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-4">
                <div 
                  className="bg-primary h-4 rounded-full transition-all duration-500 ease-in-out" 
                  style={{ width: "55%" }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground">55% of monthly budget used</p>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search expenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:grid-cols-none lg:flex lg:space-x-4">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full lg:w-48">
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
                  <SelectTrigger className="w-full lg:w-48">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="w-full lg:w-auto">
                  <Calendar className="h-4 w-4 mr-2" />
                  Date Range
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expenses List - Responsive */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Requests</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Mobile Card View - Hidden on larger screens */}
            <div className="block lg:hidden">
              <div className="space-y-4 p-4">
                {filteredExpenseData.map((expense) => (
                  <Card key={expense.id} className="border">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-lg font-bold text-primary">{expense.amount}</p>
                            <p className="text-sm text-muted-foreground">{expense.date}</p>
                          </div>
                          <Badge className={getStatusColor(expense.status)} variant="secondary">
                            {expense.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Category:</span>
                            <Badge className={getCategoryColor(expense.category)} variant="secondary">
                              {expense.category}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Requested by:</span>
                            <span className="text-sm font-medium">{expense.requestedBy}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Payment:</span>
                            <span className="text-sm">{expense.paymentMethod}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Receipt:</span>
                            <Badge className={expense.receiptUploaded ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                              {expense.receiptUploaded ? "Uploaded" : "Missing"}
                            </Badge>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Description:</p>
                          <p className="text-sm">{expense.description}</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 pt-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => setSelectedExpense(expense)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Expense Details - #{expense.id}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-6">
                                {/* Expense Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label>Amount</Label>
                                    <p className="font-semibold text-lg text-primary">{expense.amount}</p>
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
                                    <Label>Expense Date</Label>
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
                                  <p className="mt-1 p-3 bg-muted rounded-md">{expense.description}</p>
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
                                    <div className="mt-2 p-4 border-2 border-dashed border-destructive/30 rounded-lg text-center">
                                      <p className="text-destructive">No receipt uploaded</p>
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
                                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                                    <Button 
                                      variant="outline" 
                                      onClick={() => handleRejectExpense(expense.id)}
                                      className="w-full sm:w-auto"
                                    >
                                      <X className="h-4 w-4 mr-2" />
                                      Reject
                                    </Button>
                                    <Button 
                                      onClick={() => handleApproveExpense(expense.id)}
                                      className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
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
                                className="bg-green-600 hover:bg-green-700 flex-1"
                              >
                                <Check className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRejectExpense(expense.id)}
                                className="flex-1"
                              >
                                <X className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Desktop Table View - Hidden on mobile */}
            <div className="hidden lg:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Receipt</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenseData.map((expense) => (
                    <TableRow key={expense.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{expense.date}</TableCell>
                      <TableCell className="font-semibold text-primary">{expense.amount}</TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(expense.category)} variant="secondary">
                          {expense.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <div className="truncate" title={expense.description}>
                          {expense.description}
                        </div>
                      </TableCell>
                      <TableCell>{expense.requestedBy}</TableCell>
                      <TableCell>{expense.paymentMethod}</TableCell>
                      <TableCell>
                        {expense.receiptUploaded ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Uploaded
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            Missing
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(expense.status)} variant="secondary">
                          {expense.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
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
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Expense Details - #{expense.id}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-6">
                                {/* Expense Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label>Amount</Label>
                                    <p className="font-semibold text-lg text-primary">{expense.amount}</p>
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
                                    <Label>Expense Date</Label>
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
                                  <p className="mt-1 p-3 bg-muted rounded-md">{expense.description}</p>
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
                                    <div className="mt-2 p-4 border-2 border-dashed border-destructive/30 rounded-lg text-center">
                                      <p className="text-destructive">No receipt uploaded</p>
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
                                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                                    <Button 
                                      variant="outline" 
                                      onClick={() => handleRejectExpense(expense.id)}
                                      className="w-full sm:w-auto"
                                    >
                                      <X className="h-4 w-4 mr-2" />
                                      Reject
                                    </Button>
                                    <Button 
                                      onClick={() => handleApproveExpense(expense.id)}
                                      className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
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
            </div>
        </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExpenseManagement;