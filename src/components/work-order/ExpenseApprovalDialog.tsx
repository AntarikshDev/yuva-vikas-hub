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
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  CheckCircle, XCircle, Clock, IndianRupee, User, 
  Calendar, FileText, AlertCircle, ChevronDown, ChevronUp 
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

export interface ExpenseRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  amount: number;
  category: 'travel' | 'food' | 'accommodation' | 'fuel' | 'other';
  description: string;
  date: string;
  attachments?: string[];
  status: 'pending' | 'approved_l1' | 'approved_l2' | 'approved' | 'rejected';
  currentLevel: number;
  approvals: {
    level: number;
    approvedBy: string;
    approvedDate: string;
    remarks?: string;
  }[];
}

export interface TeamMemberForApproval {
  id: string;
  employeeId: string;
  name: string;
  role: string;
  totalPending: number;
  expenses: ExpenseRequest[];
}

interface ExpenseApprovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamMembers: TeamMemberForApproval[];
  onApprove: (expenseIds: string[], remarks: string) => void;
  onReject: (expenseIds: string[], reason: string) => void;
  currentUserLevel: number; // 1 = Mobilisation Manager, 2 = Centre Manager, 3 = Operation Manager/State Head
}

// Mock data for expenses
const mockExpenses: ExpenseRequest[] = [
  {
    id: 'exp-1',
    employeeId: 'LNJ005',
    employeeName: 'Sanjay Verma',
    role: 'Mobiliser',
    amount: 1500,
    category: 'travel',
    description: 'Village visit to Rampur for candidate mobilisation',
    date: '2024-01-10',
    status: 'pending',
    currentLevel: 1,
    approvals: [],
  },
  {
    id: 'exp-2',
    employeeId: 'LNJ005',
    employeeName: 'Sanjay Verma',
    role: 'Mobiliser',
    amount: 800,
    category: 'fuel',
    description: 'Fuel expenses for bike - 50km travel',
    date: '2024-01-11',
    status: 'pending',
    currentLevel: 1,
    approvals: [],
  },
  {
    id: 'exp-3',
    employeeId: 'LNJ006',
    employeeName: 'Kavita Das',
    role: 'Mobiliser',
    amount: 2200,
    category: 'travel',
    description: 'Bus fare for district visit',
    date: '2024-01-09',
    status: 'approved_l1',
    currentLevel: 2,
    approvals: [
      { level: 1, approvedBy: 'Neha Gupta', approvedDate: '2024-01-10', remarks: 'Verified travel' }
    ],
  },
  {
    id: 'exp-4',
    employeeId: 'LNJ004',
    employeeName: 'Neha Gupta',
    role: 'Mobilisation Manager',
    amount: 3500,
    category: 'accommodation',
    description: 'Night stay at block headquarters for Rozgaar Sabha',
    date: '2024-01-08',
    status: 'approved_l1',
    currentLevel: 2,
    approvals: [
      { level: 1, approvedBy: 'Self', approvedDate: '2024-01-08' }
    ],
  },
  {
    id: 'exp-5',
    employeeId: 'LNJ009',
    employeeName: 'Vikram Joshi',
    role: 'Mobiliser',
    amount: 1200,
    category: 'food',
    description: 'Food allowance during field visit',
    date: '2024-01-12',
    status: 'pending',
    currentLevel: 1,
    approvals: [],
  },
];

export const ExpenseApprovalDialog: React.FC<ExpenseApprovalDialogProps> = ({
  open,
  onOpenChange,
  teamMembers,
  onApprove,
  onReject,
  currentUserLevel,
}) => {
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);
  const [remarks, setRemarks] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [expandedMembers, setExpandedMembers] = useState<string[]>([]);

  // Group expenses by employee
  const expensesByEmployee = mockExpenses.reduce((acc, expense) => {
    if (!acc[expense.employeeId]) {
      acc[expense.employeeId] = {
        id: expense.employeeId,
        employeeId: expense.employeeId,
        name: expense.employeeName,
        role: expense.role,
        totalPending: 0,
        expenses: [],
      };
    }
    if (expense.currentLevel === currentUserLevel) {
      acc[expense.employeeId].expenses.push(expense);
      if (expense.status === 'pending' || expense.status === `approved_l${currentUserLevel - 1}`) {
        acc[expense.employeeId].totalPending += expense.amount;
      }
    }
    return acc;
  }, {} as Record<string, TeamMemberForApproval>);

  const employeesWithExpenses = Object.values(expensesByEmployee).filter(e => e.expenses.length > 0);

  const toggleMemberExpand = (memberId: string) => {
    setExpandedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const toggleExpenseSelection = (expenseId: string) => {
    setSelectedExpenses(prev =>
      prev.includes(expenseId)
        ? prev.filter(id => id !== expenseId)
        : [...prev, expenseId]
    );
  };

  const selectAllForMember = (memberId: string) => {
    const memberExpenses = expensesByEmployee[memberId]?.expenses.map(e => e.id) || [];
    const allSelected = memberExpenses.every(id => selectedExpenses.includes(id));
    
    if (allSelected) {
      setSelectedExpenses(prev => prev.filter(id => !memberExpenses.includes(id)));
    } else {
      setSelectedExpenses(prev => [...new Set([...prev, ...memberExpenses])]);
    }
  };

  const handleApprove = () => {
    onApprove(selectedExpenses, remarks);
    setSelectedExpenses([]);
    setRemarks('');
  };

  const handleReject = () => {
    onReject(selectedExpenses, rejectReason);
    setSelectedExpenses([]);
    setRejectReason('');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      travel: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      food: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
      accommodation: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      fuel: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      other: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300',
    };
    return <Badge className={colors[category]}>{category}</Badge>;
  };

  const getLevelLabel = (level: number) => {
    const labels: Record<number, string> = {
      1: 'Mobilisation Manager',
      2: 'Centre Manager / Operation Manager',
      3: 'State Head / Project Head',
    };
    return labels[level] || `Level ${level}`;
  };

  const totalSelectedAmount = selectedExpenses.reduce((sum, id) => {
    const expense = mockExpenses.find(e => e.id === id);
    return sum + (expense?.amount || 0);
  }, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Expense Approval - {getLevelLabel(currentUserLevel)}
          </DialogTitle>
        </DialogHeader>

        {/* Summary Bar */}
        <div className="bg-muted p-3 rounded-lg flex flex-wrap items-center justify-between gap-2 text-sm">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-muted-foreground">Pending for your approval: </span>
              <span className="font-semibold">{employeesWithExpenses.reduce((sum, e) => sum + e.expenses.length, 0)} requests</span>
            </div>
            <div>
              <span className="text-muted-foreground">Total Amount: </span>
              <span className="font-bold text-primary">
                {formatCurrency(employeesWithExpenses.reduce((sum, e) => sum + e.totalPending, 0))}
              </span>
            </div>
          </div>
          {selectedExpenses.length > 0 && (
            <div className="bg-primary text-primary-foreground px-3 py-1 rounded">
              Selected: {selectedExpenses.length} ({formatCurrency(totalSelectedAmount)})
            </div>
          )}
        </div>

        {/* Approval Level Info */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-2 rounded">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <span>
            Multi-level approval: L1 (Mobilisation Manager) → L2 (Centre/Operation Manager) → L3 (State Head)
          </span>
        </div>

        <ScrollArea className="h-[400px]">
          <div className="space-y-3 pr-4">
            {employeesWithExpenses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                <p>No pending expenses for your approval level</p>
              </div>
            ) : (
              employeesWithExpenses.map((member) => (
                <Collapsible
                  key={member.id}
                  open={expandedMembers.includes(member.id)}
                  onOpenChange={() => toggleMemberExpand(member.id)}
                >
                  <div className="border rounded-lg overflow-hidden">
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between p-3 bg-muted/50 cursor-pointer hover:bg-muted/80">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={member.expenses.every(e => selectedExpenses.includes(e.id))}
                            onCheckedChange={() => selectAllForMember(member.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="bg-primary/10 p-2 rounded-full">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {member.employeeId} • {member.role}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="font-semibold text-primary">{formatCurrency(member.totalPending)}</p>
                            <p className="text-xs text-muted-foreground">{member.expenses.length} requests</p>
                          </div>
                          {expandedMembers.includes(member.id) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <div className="divide-y">
                        {member.expenses.map((expense) => (
                          <div key={expense.id} className="p-3 flex items-start gap-3">
                            <Checkbox
                              checked={selectedExpenses.includes(expense.id)}
                              onCheckedChange={() => toggleExpenseSelection(expense.id)}
                            />
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {getCategoryBadge(expense.category)}
                                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {expense.date}
                                  </span>
                                </div>
                                <span className="font-semibold">{formatCurrency(expense.amount)}</span>
                              </div>
                              <p className="text-sm">{expense.description}</p>
                              {expense.approvals.length > 0 && (
                                <div className="flex items-center gap-2 text-xs text-green-600">
                                  <CheckCircle className="h-3 w-3" />
                                  Approved by {expense.approvals[expense.approvals.length - 1].approvedBy}
                                  {expense.approvals[expense.approvals.length - 1].remarks && (
                                    <span className="text-muted-foreground">
                                      - "{expense.approvals[expense.approvals.length - 1].remarks}"
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))
            )}
          </div>
        </ScrollArea>

        {selectedExpenses.length > 0 && (
          <div className="space-y-4 border-t pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Approval Remarks (Optional)</Label>
                <Textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Add any remarks for approval..."
                  rows={2}
                />
              </div>
              <div>
                <Label>Rejection Reason (if rejecting)</Label>
                <Textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Provide reason for rejection..."
                  rows={2}
                />
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {selectedExpenses.length > 0 && (
            <>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={!rejectReason}
                className="gap-2"
              >
                <XCircle className="h-4 w-4" />
                Reject ({selectedExpenses.length})
              </Button>
              <Button onClick={handleApprove} className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Approve ({selectedExpenses.length})
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseApprovalDialog;
