import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload, FileSpreadsheet, Download, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface ExpenseRow {
  employeeId: string;
  employeeName: string;
  date: string;
  category: string;
  amount: number;
  description: string;
}

interface BulkExpenseUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (expenses: ExpenseRow[]) => void;
}

export const BulkExpenseUploadDialog: React.FC<BulkExpenseUploadDialogProps> = ({
  open,
  onOpenChange,
  onUpload
}) => {
  const [uploadedExpenses, setUploadedExpenses] = useState<ExpenseRow[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Mock parsed data for demo
  const mockParsedData: ExpenseRow[] = [
    { employeeId: 'LNJ001', employeeName: 'Rahul Sharma', date: '2024-01-05', category: 'Fuel', amount: 2500, description: 'Field visit to Ranchi district' },
    { employeeId: 'LNJ002', employeeName: 'Priya Singh', date: '2024-01-06', category: 'Accommodation', amount: 1500, description: 'Overnight stay - Jamshedpur' },
    { employeeId: 'LNJ003', employeeName: 'Amit Kumar', date: '2024-01-07', category: 'Food', amount: 800, description: 'Team meeting expenses' },
    { employeeId: 'LNJ004', employeeName: 'Neha Gupta', date: '2024-01-08', category: 'Transport', amount: 1200, description: 'Auto fare - multiple villages' },
    { employeeId: 'LNJ005', employeeName: 'Sanjay Verma', date: '2024-01-08', category: 'Fuel', amount: 3000, description: 'Mobilisation drive' },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrors([]);

    // Simulate file parsing
    setTimeout(() => {
      // In real implementation, parse CSV/Excel file here
      if (file.name.endsWith('.csv') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        setUploadedExpenses(mockParsedData);
        toast.success(`Parsed ${mockParsedData.length} expense records from ${file.name}`);
      } else {
        setErrors(['Invalid file format. Please upload CSV or Excel file.']);
      }
      setIsUploading(false);
    }, 1000);
  };

  const handleDownloadTemplate = () => {
    // Create CSV template
    const headers = 'Employee ID,Employee Name,Date,Category,Amount,Description\n';
    const sampleRow = 'LNJ001,John Doe,2024-01-01,Fuel,1000,Sample expense description\n';
    const csvContent = headers + sampleRow;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expense_upload_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Template downloaded');
  };

  const handleSubmit = () => {
    if (uploadedExpenses.length === 0) {
      toast.error('No expenses to upload');
      return;
    }
    
    onUpload(uploadedExpenses);
    toast.success(`${uploadedExpenses.length} expense records uploaded successfully`);
    setUploadedExpenses([]);
  };

  const totalAmount = uploadedExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Bulk Expense Upload
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Upload Section */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 bg-muted/50">
                <FileSpreadsheet className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground mb-3">
                  Upload CSV or Excel file with expense data
                </p>
                <div className="flex gap-2">
                  <Label htmlFor="expense-file" className="cursor-pointer">
                    <Input
                      id="expense-file"
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <Button variant="outline" asChild disabled={isUploading}>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        {isUploading ? 'Processing...' : 'Select File'}
                      </span>
                    </Button>
                  </Label>
                  <Button variant="ghost" onClick={handleDownloadTemplate}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <div className="flex items-center gap-2 text-destructive mb-2">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Upload Errors</span>
              </div>
              <ul className="text-sm text-destructive list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Preview Table */}
          {uploadedExpenses.length > 0 && (
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm font-medium">{uploadedExpenses.length} records ready to upload</span>
                  </div>
                  <span className="text-sm font-semibold">Total: {formatCurrency(totalAmount)}</span>
                </div>
                
                <div className="border rounded-lg overflow-hidden max-h-64 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {uploadedExpenses.map((expense, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-mono text-sm">{expense.employeeId}</TableCell>
                          <TableCell>{expense.employeeName}</TableCell>
                          <TableCell>{expense.date}</TableCell>
                          <TableCell>{expense.category}</TableCell>
                          <TableCell className="text-right">{formatCurrency(expense.amount)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info */}
          <div className="bg-muted/50 p-3 rounded text-sm text-muted-foreground">
            <p className="font-medium mb-1">Required columns:</p>
            <p>Employee ID, Employee Name, Date, Category, Amount, Description</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={uploadedExpenses.length === 0}>
            Upload {uploadedExpenses.length} Records
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
