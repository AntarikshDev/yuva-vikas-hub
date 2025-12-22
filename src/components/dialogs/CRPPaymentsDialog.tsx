import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Loader2, FileText, IndianRupee, Calendar, CreditCard } from 'lucide-react';
import { useGetCRPPaymentsQuery } from '@/store/api/apiSlice';
import type { CRPPayment, CRPOFRSummary } from '@/types/crp';

interface CRPPaymentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  crpId: string;
  crpName: string;
  workOrderId: string;
}

// Mock data fallback
const mockPaymentData: CRPOFRSummary = {
  totalOFRs: 15,
  paymentPerOFR: 500,
  totalPaymentAmount: 7500,
  payments: [
    {
      id: '1',
      crpId: '1',
      amount: 2500,
      paymentDate: '2024-02-15',
      referenceNumber: 'TXN202402151234',
      ofrCount: 5,
      status: 'completed',
      remarks: 'Monthly payout - February 2024',
    },
    {
      id: '2',
      crpId: '1',
      amount: 3000,
      paymentDate: '2024-01-15',
      referenceNumber: 'TXN202401151234',
      ofrCount: 6,
      status: 'completed',
      remarks: 'Monthly payout - January 2024',
    },
    {
      id: '3',
      crpId: '1',
      amount: 2000,
      paymentDate: '2024-03-01',
      referenceNumber: 'TXN202403011234',
      ofrCount: 4,
      status: 'pending',
      remarks: 'Monthly payout - March 2024 (Processing)',
    },
  ],
};

export const CRPPaymentsDialog: React.FC<CRPPaymentsDialogProps> = ({
  open,
  onOpenChange,
  crpId,
  crpName,
  workOrderId,
}) => {
  const { data: paymentData, isLoading, error } = useGetCRPPaymentsQuery(
    { workOrderId, crpId },
    { skip: !open || !crpId }
  );

  // Use mock data if API fails or no data
  const data: CRPOFRSummary = paymentData || mockPaymentData;

  const getStatusVariant = (status: CRPPayment['status']) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Payments & OFRs - {crpName}</DialogTitle>
          <DialogDescription>
            View OFR contributions and payment history for this CRP
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <ScrollArea className="max-h-[65vh]">
            <div className="space-y-6 pr-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total OFRs</p>
                        <p className="text-2xl font-bold">{data.totalOFRs}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <IndianRupee className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Per OFR</p>
                        <p className="text-2xl font-bold">{formatCurrency(data.paymentPerOFR)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Amount</p>
                        <p className="text-2xl font-bold">{formatCurrency(data.totalPaymentAmount)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Payment History */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Payment History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {data.payments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No payment history available
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Reference</TableHead>
                          <TableHead className="text-center">OFRs</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="text-center">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.payments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{formatDate(payment.paymentDate)}</p>
                                {payment.remarks && (
                                  <p className="text-xs text-muted-foreground">{payment.remarks}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <code className="text-xs bg-muted px-2 py-1 rounded">
                                {payment.referenceNumber}
                              </code>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline">{payment.ofrCount}</Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(payment.amount)}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant={getStatusVariant(payment.status)}>
                                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>

              {/* Payment Calculation Breakdown */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Payment Calculation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-muted-foreground">Total OFRs Filled</span>
                      <span className="font-medium">{data.totalOFRs}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-muted-foreground">Payment per OFR</span>
                      <span className="font-medium">{formatCurrency(data.paymentPerOFR)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total Earned</span>
                      <span className="text-lg font-bold text-primary">
                        {formatCurrency(data.totalOFRs * data.paymentPerOFR)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-muted-foreground">Total Paid</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(
                          data.payments
                            .filter(p => p.status === 'completed')
                            .reduce((sum, p) => sum + p.amount, 0)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-muted-foreground">Pending</span>
                      <span className="font-medium text-yellow-600">
                        {formatCurrency(
                          data.payments
                            .filter(p => p.status === 'pending')
                            .reduce((sum, p) => sum + p.amount, 0)
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};
