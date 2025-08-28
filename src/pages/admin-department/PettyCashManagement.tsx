import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  Download,
  FileText,
  Wallet,
  Plus,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Calendar
} from "lucide-react";

const PettyCashManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showAddMoneyDialog, setShowAddMoneyDialog] = useState(false);
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const { toast } = useToast();

  // Mock data for petty cash overview
  const walletData = {
    currentBalance: "₹45,000",
    monthlyBudget: "₹1,00,000",
    totalSpent: "₹55,000",
    pendingExpenses: "₹8,200",
    lastRefill: "2025-07-01",
    nextRefill: "2025-08-01"
  };

  // Mock data for recent transactions
  const transactionData = [
    {
      id: 1,
      date: "2025-07-22",
      description: "Office supplies - A4 papers, pens",
      amount: "₹850",
      type: "Expense",
      category: "Supplies",
      addedBy: "Rahul Sharma",
      receipt: true
    },
    {
      id: 2,
      date: "2025-07-22",
      description: "Monthly budget refill",
      amount: "₹1,00,000",
      type: "Credit",
      category: "Budget Refill",
      addedBy: "System",
      receipt: false
    },
    {
      id: 3,
      date: "2025-07-21",
      description: "Taxi fare for urgent delivery",
      amount: "₹450",
      type: "Expense",
      category: "Transport",
      addedBy: "Priya Patel",
      receipt: true
    },
    {
      id: 4,
      date: "2025-07-21",
      description: "Tea/Coffee for meeting",
      amount: "₹320",
      type: "Expense",
      category: "Refreshments",
      addedBy: "Amit Kumar",
      receipt: true
    },
    {
      id: 5,
      date: "2025-07-20",
      description: "Courier charges",
      amount: "₹180",
      type: "Expense",
      category: "Courier",
      addedBy: "Neha Singh",
      receipt: true
    }
  ];

  // Mock data for category-wise spending
  const categorySpending = [
    { category: "Supplies", amount: "₹15,000", percentage: 27 },
    { category: "Transport", amount: "₹12,000", percentage: 22 },
    { category: "Refreshments", amount: "₹8,000", percentage: 15 },
    { category: "Courier", amount: "₹6,000", percentage: 11 },
    { category: "Miscellaneous", amount: "₹14,000", percentage: 25 }
  ];

  const getTypeColor = (type: string) => {
    return type === "Credit" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Supplies": "bg-blue-100 text-blue-800",
      "Transport": "bg-purple-100 text-purple-800",
      "Refreshments": "bg-orange-100 text-orange-800",
      "Courier": "bg-yellow-100 text-yellow-800",
      "Budget Refill": "bg-green-100 text-green-800",
      "Miscellaneous": "bg-gray-100 text-gray-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const budgetUsedPercentage = (55000 / 100000) * 100;

  const filteredTransactions = transactionData.filter(transaction =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddExpense = () => {
    toast({
      title: "Expense Added",
      description: "New expense has been added successfully.",
    });
    setShowAddExpense(false);
  };

  const handleImportExpenses = () => {
    toast({
      title: "Expenses Imported",
      description: "Expenses have been imported from Excel successfully.",
    });
    setShowImportDialog(false);
  };

  const handleAddMoney = () => {
    toast({
      title: "Money Added",
      description: `₹${amount} has been added to the wallet successfully.`,
    });
    setShowAddMoneyDialog(false);
    setAmount("");
    setRemarks("");
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Petty Cash Management</h1>
          <p className="text-muted-foreground mt-1">Virtual wallet for managing daily expenses and budget tracking</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <Upload className="h-4 w-4 mr-2" />
                Import Excel
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Expenses from Excel</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Upload Excel File</Label>
                  <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div className="mt-4">
                      <Button variant="outline">
                        Choose Excel File
                      </Button>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Upload .xlsx or .csv file with expenses data
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setShowImportDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleImportExpenses}>
                    Import Expenses
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={showAddExpense} onOpenChange={setShowAddExpense}>
            <DialogTrigger asChild>
              <Button size="sm" className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Date</Label>
                    <Input type="date" />
                  </div>
                  <div>
                    <Label>Amount</Label>
                    <Input placeholder="Enter amount" />
                  </div>
                </div>
                <div>
                  <Label>Category</Label>
                  <Input placeholder="e.g., Supplies, Transport, etc." />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea placeholder="Enter expense description" />
                </div>
                <div>
                  <Label>Upload Receipt</Label>
                  <div className="mt-2 border-2 border-dashed border-border rounded-lg p-4 text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                    <Button variant="outline" size="sm" className="mt-2">
                      Choose File
                    </Button>
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setShowAddExpense(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddExpense}>
                    Add Expense
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Virtual Wallet Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wallet className="h-5 w-5 mr-2" />
            Virtual Wallet Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Wallet Balance */}
            <div className="space-y-4">
              <div className="text-center p-6 bg-primary/5 rounded-lg">
                <Wallet className="h-12 w-12 mx-auto text-primary mb-2" />
                <p className="text-3xl font-bold text-foreground">{walletData.currentBalance}</p>
                <p className="text-muted-foreground mb-4">Current Balance</p>
                <Dialog open={showAddMoneyDialog} onOpenChange={setShowAddMoneyDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Money to Wallet
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Money to Virtual Wallet</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Amount to Add</Label>
                        <Input 
                          placeholder="Enter amount" 
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          type="number"
                        />
                      </div>
                      <div>
                        <Label>Remarks/Purpose</Label>
                        <Textarea 
                          placeholder="Enter purpose for adding money (e.g., Monthly refill, Emergency fund, etc.)" 
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                        />
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <CreditCard className="h-5 w-5 text-blue-600" />
                          <span className="font-medium text-blue-800">Transaction Summary</span>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Current Balance:</span>
                            <span className="font-medium">{walletData.currentBalance}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Adding:</span>
                            <span className="font-medium text-green-600">₹{amount || "0"}</span>
                          </div>
                          <div className="flex justify-between border-t pt-1 font-semibold">
                            <span>New Balance:</span>
                            <span className="text-green-600">₹{(45000 + (parseInt(amount) || 0)).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-3">
                        <Button variant="outline" onClick={() => {
                          setShowAddMoneyDialog(false);
                          setAmount("");
                          setRemarks("");
                        }}>
                          Cancel
                        </Button>
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={handleAddMoney}
                  >
                    Add Money
                  </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-6 w-6 mx-auto text-green-600 mb-1" />
                    <p className="text-lg font-semibold text-green-600">{walletData.monthlyBudget}</p>
                    <p className="text-xs text-muted-foreground">Monthly Budget</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <TrendingDown className="h-6 w-6 mx-auto text-red-600 mb-1" />
                    <p className="text-lg font-semibold text-red-600">{walletData.totalSpent}</p>
                    <p className="text-xs text-muted-foreground">Total Spent</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Budget Usage */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Budget Usage</span>
                  <span className="text-sm text-muted-foreground">{budgetUsedPercentage.toFixed(1)}%</span>
                </div>
                <Progress value={budgetUsedPercentage} className="h-3" />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>Used: {walletData.totalSpent}</span>
                  <span>Remaining: {walletData.currentBalance}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between p-3 bg-secondary/50 rounded">
                  <span className="text-sm">Pending Expenses</span>
                  <span className="font-medium text-yellow-600">{walletData.pendingExpenses}</span>
                </div>
                <div className="flex justify-between p-3 bg-secondary/50 rounded">
                  <span className="text-sm">Last Refill</span>
                  <span className="font-medium">{walletData.lastRefill}</span>
                </div>
                <div className="flex justify-between p-3 bg-secondary/50 rounded">
                  <span className="text-sm">Next Refill</span>
                  <span className="font-medium">{walletData.nextRefill}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category-wise Spending */}
      <Card>
        <CardHeader>
          <CardTitle>Category-wise Spending</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categorySpending.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge className={getCategoryColor(item.category)}>
                    {item.category}
                  </Badge>
                  <span className="font-medium">{item.amount}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-muted-foreground w-10">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transaction Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Date Range
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Added By</TableHead>
                <TableHead>Receipt</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate">{transaction.description}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor(transaction.category)}>
                      {transaction.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {transaction.type === "Credit" ? (
                        <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-600 mr-1" />
                      )}
                      <Badge className={getTypeColor(transaction.type)}>
                        {transaction.type}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">{transaction.amount}</TableCell>
                  <TableCell>{transaction.addedBy}</TableCell>
                  <TableCell>
                    {transaction.receipt ? (
                      <Badge className="bg-green-100 text-green-800">
                        Available
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800">
                        N/A
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
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

export default PettyCashManagement;