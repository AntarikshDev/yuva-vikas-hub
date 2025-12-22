import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  DollarSign, Settings, History, TrendingUp, CheckCircle, Clock, 
  AlertCircle, Plus, Eye, Download, IndianRupee, Loader2 
} from 'lucide-react';
import { toast } from 'sonner';
import { jharkhandDistricts } from '@/data/jharkhandCensusData';
import type { CommissionRate, CRPTransaction, CRPAccountSummary } from '@/types/crpAccounts';
import {
  useGetCommissionRatesQuery,
  useCreateCommissionRateMutation,
  useGetCRPTransactionsQuery,
  useGetCRPAccountSummariesQuery,
  useGetCRPTransactionsBycrpIdQuery,
} from '@/store/api/apiSlice';

interface CRPAccountsSectionProps {
  canEdit: boolean;
  workOrderId?: string;
}

// Mock data for fallback
const mockCommissionRates: CommissionRate[] = [
  {
    id: '1',
    workOrderId: '1',
    ratePerOFR: 50,
    ratePerEnrollment: 200,
    effectiveFrom: '2024-01-01',
    isActive: true,
    createdAt: '2024-01-01',
    createdBy: 'admin',
  },
  {
    id: '2',
    workOrderId: '1',
    ratePerOFR: 40,
    ratePerEnrollment: 150,
    effectiveFrom: '2023-07-01',
    effectiveTo: '2023-12-31',
    isActive: false,
    createdAt: '2023-07-01',
    createdBy: 'admin',
  },
];

const mockTransactions: CRPTransaction[] = [
  {
    id: '1',
    crpId: '1',
    crpName: 'Ram Kumar Sharma',
    districtId: 'ranchi',
    workOrderId: '1',
    transactionType: 'ofr_commission',
    ofrCount: 25,
    enrollmentCount: 0,
    rateApplied: 50,
    amount: 1250,
    transactionDate: '2024-02-15',
    paymentStatus: 'paid',
    paymentDate: '2024-02-20',
    referenceNumber: 'TXN001',
    createdAt: '2024-02-15',
  },
  {
    id: '2',
    crpId: '1',
    crpName: 'Ram Kumar Sharma',
    districtId: 'ranchi',
    workOrderId: '1',
    transactionType: 'enrollment_commission',
    ofrCount: 0,
    enrollmentCount: 10,
    rateApplied: 200,
    amount: 2000,
    transactionDate: '2024-02-15',
    paymentStatus: 'paid',
    paymentDate: '2024-02-20',
    referenceNumber: 'TXN002',
    createdAt: '2024-02-15',
  },
  {
    id: '3',
    crpId: '2',
    crpName: 'Sunita Devi',
    districtId: 'ranchi',
    workOrderId: '1',
    transactionType: 'ofr_commission',
    ofrCount: 30,
    enrollmentCount: 0,
    rateApplied: 50,
    amount: 1500,
    transactionDate: '2024-02-10',
    paymentStatus: 'processed',
    createdAt: '2024-02-10',
  },
  {
    id: '4',
    crpId: '3',
    crpName: 'Vikash Oraon',
    districtId: 'ranchi',
    workOrderId: '1',
    transactionType: 'ofr_commission',
    ofrCount: 15,
    enrollmentCount: 0,
    rateApplied: 50,
    amount: 750,
    transactionDate: '2024-02-05',
    paymentStatus: 'pending',
    createdAt: '2024-02-05',
  },
  {
    id: '5',
    crpId: '4',
    crpName: 'Meena Kumari',
    districtId: 'hazaribagh',
    workOrderId: '1',
    transactionType: 'enrollment_commission',
    ofrCount: 0,
    enrollmentCount: 5,
    rateApplied: 200,
    amount: 1000,
    transactionDate: '2024-02-01',
    paymentStatus: 'pending',
    createdAt: '2024-02-01',
  },
];

const mockAccountSummaries: CRPAccountSummary[] = [
  {
    crpId: '1',
    crpName: 'Ram Kumar Sharma',
    districtId: 'ranchi',
    totalOFRs: 45,
    totalEnrollments: 18,
    totalEarnings: 5850,
    totalPaid: 3250,
    pendingAmount: 2600,
    lastPaymentDate: '2024-02-20',
    transactions: [],
  },
  {
    crpId: '2',
    crpName: 'Sunita Devi',
    districtId: 'ranchi',
    totalOFRs: 52,
    totalEnrollments: 22,
    totalEarnings: 7000,
    totalPaid: 5500,
    pendingAmount: 1500,
    lastPaymentDate: '2024-02-10',
    transactions: [],
  },
  {
    crpId: '3',
    crpName: 'Vikash Oraon',
    districtId: 'ranchi',
    totalOFRs: 28,
    totalEnrollments: 10,
    totalEarnings: 3400,
    totalPaid: 2650,
    pendingAmount: 750,
    transactions: [],
  },
  {
    crpId: '4',
    crpName: 'Meena Kumari',
    districtId: 'hazaribagh',
    totalOFRs: 20,
    totalEnrollments: 8,
    totalEarnings: 2600,
    totalPaid: 1600,
    pendingAmount: 1000,
    transactions: [],
  },
  {
    crpId: '5',
    crpName: 'Rajesh Munda',
    districtId: 'dhanbad',
    totalOFRs: 35,
    totalEnrollments: 15,
    totalEarnings: 4750,
    totalPaid: 4750,
    pendingAmount: 0,
    lastPaymentDate: '2024-02-15',
    transactions: [],
  },
];

export const CRPAccountsSection: React.FC<CRPAccountsSectionProps> = ({ canEdit, workOrderId = '' }) => {
  // RTK Query hooks
  const { 
    data: apiCommissionRates, 
    isLoading: ratesLoading,
    error: ratesError 
  } = useGetCommissionRatesQuery(workOrderId, { skip: !workOrderId });
  
  const { 
    data: apiTransactions, 
    isLoading: transactionsLoading,
    error: transactionsError 
  } = useGetCRPTransactionsQuery(
    { workOrderId, districtId: undefined, status: undefined }, 
    { skip: !workOrderId }
  );
  
  const { 
    data: apiAccountSummaries, 
    isLoading: accountsLoading,
    error: accountsError 
  } = useGetCRPAccountSummariesQuery(workOrderId, { skip: !workOrderId });

  const [createCommissionRate, { isLoading: isCreatingRate }] = useCreateCommissionRateMutation();

  // Use API data or fallback to mock data
  const commissionRates = apiCommissionRates || mockCommissionRates;
  const transactions = apiTransactions || mockTransactions;
  const accountSummaries = apiAccountSummaries || mockAccountSummaries;

  const [isRateDialogOpen, setIsRateDialogOpen] = useState(false);
  const [selectedCRPId, setSelectedCRPId] = useState<string | null>(null);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [filterDistrict, setFilterDistrict] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  const [newRate, setNewRate] = useState({
    ratePerOFR: '',
    ratePerEnrollment: '',
    effectiveFrom: '',
  });

  // Query for selected CRP transactions
  const { 
    data: selectedCRPTransactions, 
    isLoading: crpTransactionsLoading 
  } = useGetCRPTransactionsBycrpIdQuery(
    { workOrderId, crpId: selectedCRPId || '' },
    { skip: !workOrderId || !selectedCRPId }
  );

  const activeRate = commissionRates.find((r: CommissionRate) => r.isActive);
  
  const filteredTransactions = transactions.filter((t: CRPTransaction) => {
    const districtMatch = filterDistrict === 'all' || t.districtId === filterDistrict;
    const statusMatch = filterStatus === 'all' || t.paymentStatus === filterStatus;
    return districtMatch && statusMatch;
  });

  const stats = {
    totalTransactions: transactions.length,
    totalAmount: transactions.reduce((sum: number, t: CRPTransaction) => sum + t.amount, 0),
    pendingAmount: transactions.filter((t: CRPTransaction) => t.paymentStatus === 'pending').reduce((sum: number, t: CRPTransaction) => sum + t.amount, 0),
    paidAmount: transactions.filter((t: CRPTransaction) => t.paymentStatus === 'paid').reduce((sum: number, t: CRPTransaction) => sum + t.amount, 0),
  };

  const handleSetNewRate = async () => {
    if (!newRate.ratePerOFR || !newRate.ratePerEnrollment || !newRate.effectiveFrom) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      await createCommissionRate({
        workOrderId,
        data: {
          ratePerOFR: parseFloat(newRate.ratePerOFR),
          ratePerEnrollment: parseFloat(newRate.ratePerEnrollment),
          effectiveFrom: newRate.effectiveFrom,
          createdBy: 'admin',
        },
      }).unwrap();
      
      setIsRateDialogOpen(false);
      setNewRate({ ratePerOFR: '', ratePerEnrollment: '', effectiveFrom: '' });
      toast.success('Commission rate updated successfully!');
    } catch (error) {
      toast.error('Failed to create commission rate');
    }
  };

  const handleViewCRPTransactions = (crpId: string) => {
    setSelectedCRPId(crpId);
    setIsTransactionDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" /> Paid</Badge>;
      case 'processed':
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="h-3 w-3 mr-1" /> Processed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="h-3 w-3 mr-1" /> Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get transactions for dialog - use API data or filter from main transactions
  const dialogTransactions = selectedCRPTransactions || 
    transactions.filter((t: CRPTransaction) => t.crpId === selectedCRPId);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current OFR Rate</p>
                <p className="text-2xl font-bold">₹{activeRate?.ratePerOFR || 0}</p>
              </div>
              <IndianRupee className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Enrollment Rate</p>
                <p className="text-2xl font-bold">₹{activeRate?.ratePerEnrollment || 0}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="text-2xl font-bold">₹{stats.paidAmount.toLocaleString()}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">₹{stats.pendingAmount.toLocaleString()}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="rates" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rates">
            <Settings className="h-4 w-4 mr-2" /> Commission Rates
          </TabsTrigger>
          <TabsTrigger value="transactions">
            <History className="h-4 w-4 mr-2" /> Transactions
          </TabsTrigger>
          <TabsTrigger value="accounts">
            <DollarSign className="h-4 w-4 mr-2" /> CRP Accounts
          </TabsTrigger>
        </TabsList>

        {/* Commission Rates Tab */}
        <TabsContent value="rates" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Commission Rate Settings</CardTitle>
                <CardDescription>Set OFR and Enrollment commission rates</CardDescription>
              </div>
              <Dialog open={isRateDialogOpen} onOpenChange={setIsRateDialogOpen}>
                <DialogTrigger asChild>
                  <Button disabled={!canEdit || isCreatingRate}>
                    {isCreatingRate ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    Set New Rate
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Set New Commission Rate</DialogTitle>
                    <DialogDescription>This will replace the current active rate</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Rate per OFR (₹) *</Label>
                      <Input
                        type="number"
                        value={newRate.ratePerOFR}
                        onChange={e => setNewRate({ ...newRate, ratePerOFR: e.target.value })}
                        placeholder="e.g., 50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Rate per Enrollment (₹) *</Label>
                      <Input
                        type="number"
                        value={newRate.ratePerEnrollment}
                        onChange={e => setNewRate({ ...newRate, ratePerEnrollment: e.target.value })}
                        placeholder="e.g., 200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Effective From *</Label>
                      <Input
                        type="date"
                        value={newRate.effectiveFrom}
                        onChange={e => setNewRate({ ...newRate, effectiveFrom: e.target.value })}
                      />
                    </div>
                    <Button className="w-full" onClick={handleSetNewRate} disabled={isCreatingRate}>
                      {isCreatingRate ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                      Save Rate
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {ratesLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Rate per OFR</TableHead>
                      <TableHead>Rate per Enrollment</TableHead>
                      <TableHead>Effective From</TableHead>
                      <TableHead>Effective To</TableHead>
                      <TableHead>Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {commissionRates.map((rate: CommissionRate) => (
                      <TableRow key={rate.id} className={rate.isActive ? 'bg-green-50 dark:bg-green-900/20' : ''}>
                        <TableCell>
                          {rate.isActive ? (
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          ) : (
                            <Badge variant="outline">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">₹{rate.ratePerOFR}</TableCell>
                        <TableCell className="font-medium">₹{rate.ratePerEnrollment}</TableCell>
                        <TableCell>{new Date(rate.effectiveFrom).toLocaleDateString()}</TableCell>
                        <TableCell>{rate.effectiveTo ? new Date(rate.effectiveTo).toLocaleDateString() : '-'}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(rate.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>All CRP commission transactions</CardDescription>
              </div>
              <div className="flex gap-2">
                <Select value={filterDistrict} onValueChange={setFilterDistrict}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="District" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Districts</SelectItem>
                    {jharkhandDistricts.map(d => (
                      <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processed">Processed</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {transactionsLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>CRP Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-center">OFRs</TableHead>
                      <TableHead className="text-center">Enrollments</TableHead>
                      <TableHead className="text-right">Rate</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Reference</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((txn: CRPTransaction) => (
                      <TableRow key={txn.id}>
                        <TableCell className="text-sm">
                          {new Date(txn.transactionDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="font-medium">{txn.crpName}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {txn.transactionType === 'ofr_commission' ? 'OFR' : 'Enrollment'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">{txn.ofrCount || '-'}</TableCell>
                        <TableCell className="text-center">{txn.enrollmentCount || '-'}</TableCell>
                        <TableCell className="text-right">₹{txn.rateApplied}</TableCell>
                        <TableCell className="text-right font-medium">₹{txn.amount.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(txn.paymentStatus)}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {txn.referenceNumber || '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* CRP Accounts Tab */}
        <TabsContent value="accounts" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>CRP Account Summaries</CardTitle>
              <CardDescription>Individual CRP earnings and payment status</CardDescription>
            </CardHeader>
            <CardContent>
              {accountsLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>CRP Name</TableHead>
                      <TableHead>District</TableHead>
                      <TableHead className="text-center">Total OFRs</TableHead>
                      <TableHead className="text-center">Enrollments</TableHead>
                      <TableHead className="text-right">Total Earnings</TableHead>
                      <TableHead className="text-right">Paid</TableHead>
                      <TableHead className="text-right">Pending</TableHead>
                      <TableHead>Last Payment</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accountSummaries.map((summary: CRPAccountSummary) => {
                      const district = jharkhandDistricts.find(d => d.id === summary.districtId);
                      return (
                        <TableRow key={summary.crpId}>
                          <TableCell className="font-medium">{summary.crpName}</TableCell>
                          <TableCell>{district?.name}</TableCell>
                          <TableCell className="text-center">{summary.totalOFRs}</TableCell>
                          <TableCell className="text-center">{summary.totalEnrollments}</TableCell>
                          <TableCell className="text-right font-medium">
                            ₹{summary.totalEarnings.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right text-green-600">
                            ₹{summary.totalPaid.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right text-yellow-600">
                            ₹{summary.pendingAmount.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {summary.lastPaymentDate 
                              ? new Date(summary.lastPaymentDate).toLocaleDateString() 
                              : '-'}
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewCRPTransactions(summary.crpId)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>CRP Transaction History</DialogTitle>
            <DialogDescription>
              {dialogTransactions?.[0]?.crpName}'s transaction details
            </DialogDescription>
          </DialogHeader>
          {crpTransactionsLoading ? (
            <div className="space-y-2 py-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-center">Count</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dialogTransactions?.map((txn: CRPTransaction) => (
                  <TableRow key={txn.id}>
                    <TableCell>{new Date(txn.transactionDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {txn.transactionType === 'ofr_commission' ? 'OFR' : 'Enrollment'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {txn.ofrCount || txn.enrollmentCount}
                    </TableCell>
                    <TableCell className="text-right">₹{txn.rateApplied}</TableCell>
                    <TableCell className="text-right font-medium">₹{txn.amount}</TableCell>
                    <TableCell>{getStatusBadge(txn.paymentStatus)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
