import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserPlus, FileSignature, Smartphone, Calendar, DollarSign, CheckCircle, XCircle, Loader2, Eye, Pencil, Check, X, IndianRupee, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { crpCategories, jharkhandDistricts } from '@/data/jharkhandCensusData';
import { useGetCRPNetworkQuery } from '@/store/api/apiSlice';
import { CRPForm } from '@/components/forms/CRPForm';
import { CRPPaymentsDialog } from '@/components/dialogs/CRPPaymentsDialog';
import { CRPAccountsSection } from '@/components/district-adoption/CRPAccountsSection';
import { CRPAnalyticsDashboard } from '@/components/district-adoption/CRPAnalyticsDashboard';
import type { CRP } from '@/types/crp';

interface Meeting {
  id: string;
  date: string;
  venue: string;
  attendees: number;
  totalCRPs: number;
  notes: string;
}

interface CRPNetworkSectionProps {
  canEdit: boolean;
  adoptedDistricts: string[];
  workOrderId?: string;
}

// Mock CRP data with new fields
const mockCRPs: CRP[] = [
  { 
    id: '1', 
    name: 'Ram Kumar Sharma', 
    category: 'School Principal', 
    homeLocation: 'Kanke', 
    workLocation: 'Kanke Block', 
    phone: '9876543210', 
    districtId: 'ranchi', 
    aadhaarNumber: '123456789012',
    panNumber: 'ABCDE1234F',
    bankDetails: {
      accountHolderName: 'Ram Kumar Sharma',
      accountNumber: '1234567890123',
      ifscCode: 'SBIN0001234',
      bankName: 'State Bank of India',
      branchName: 'Ranchi Main Branch',
    },
    documents: [],
    loi: true, 
    loiDate: '2024-01-15', 
    appRegistered: true, 
    appRegistrationDate: '2024-01-16', 
    lastPaymentDate: '2024-02-01', 
    totalPayments: 2, 
    isActive: true,
    createdAt: '2024-01-10',
    createdBy: 'admin',
    workOrderId: '1',
  },
  { 
    id: '2', 
    name: 'Sunita Devi', 
    category: 'SHG Member', 
    homeLocation: 'Ratu', 
    workLocation: 'Ratu Block', 
    phone: '9876543211', 
    districtId: 'ranchi', 
    aadhaarNumber: '234567890123',
    panNumber: 'BCDEF2345G',
    bankDetails: {
      accountHolderName: 'Sunita Devi',
      accountNumber: '2345678901234',
      ifscCode: 'HDFC0002345',
      bankName: 'HDFC Bank',
      branchName: 'Ranchi Branch',
    },
    documents: [],
    loi: true, 
    loiDate: '2024-01-18', 
    appRegistered: true, 
    appRegistrationDate: '2024-01-19', 
    lastPaymentDate: '2024-02-01', 
    totalPayments: 2, 
    isActive: true,
    createdAt: '2024-01-12',
    createdBy: 'admin',
    workOrderId: '1',
  },
  { 
    id: '3', 
    name: 'Vikash Oraon', 
    category: 'Teacher', 
    homeLocation: 'Burmu', 
    workLocation: 'Burmu Block', 
    phone: '9876543212', 
    districtId: 'ranchi', 
    aadhaarNumber: '345678901234',
    panNumber: 'CDEFG3456H',
    bankDetails: {
      accountHolderName: 'Vikash Oraon',
      accountNumber: '3456789012345',
      ifscCode: 'ICIC0003456',
      bankName: 'ICICI Bank',
      branchName: 'Burmu Branch',
    },
    documents: [],
    loi: true, 
    loiDate: '2024-01-20', 
    appRegistered: false, 
    totalPayments: 0, 
    isActive: true,
    createdAt: '2024-01-15',
    createdBy: 'admin',
    workOrderId: '1',
  },
  { 
    id: '4', 
    name: 'Meena Kumari', 
    category: 'Alumni', 
    homeLocation: 'Hazaribag', 
    workLocation: 'Hazaribag Block', 
    phone: '9876543213', 
    districtId: 'hazaribagh', 
    aadhaarNumber: '456789012345',
    panNumber: 'DEFGH4567I',
    bankDetails: {
      accountHolderName: 'Meena Kumari',
      accountNumber: '4567890123456',
      ifscCode: 'PUNB0004567',
      bankName: 'Punjab National Bank',
      branchName: 'Hazaribagh Branch',
    },
    documents: [],
    loi: false, 
    appRegistered: false, 
    totalPayments: 0, 
    isActive: true,
    createdAt: '2024-01-18',
    createdBy: 'admin',
    workOrderId: '1',
  },
  { 
    id: '5', 
    name: 'Rajesh Munda', 
    category: 'Local Influencer', 
    homeLocation: 'Dhanbad', 
    workLocation: 'Dhanbad Block', 
    phone: '9876543214', 
    districtId: 'dhanbad', 
    aadhaarNumber: '567890123456',
    panNumber: 'EFGHI5678J',
    bankDetails: {
      accountHolderName: 'Rajesh Munda',
      accountNumber: '5678901234567',
      ifscCode: 'BARB0005678',
      bankName: 'Bank of Baroda',
      branchName: 'Dhanbad Branch',
    },
    documents: [],
    loi: true, 
    loiDate: '2024-01-25', 
    appRegistered: true, 
    appRegistrationDate: '2024-01-26', 
    lastPaymentDate: '2024-02-15', 
    totalPayments: 1, 
    isActive: true,
    createdAt: '2024-01-20',
    createdBy: 'admin',
    workOrderId: '1',
  },
];

// Mock meetings data
const mockMeetings: Meeting[] = [
  { id: '1', date: '2024-02-01', venue: 'Ranchi Training Centre', attendees: 45, totalCRPs: 50, notes: 'Monthly review meeting. Discussed mobilization targets.' },
  { id: '2', date: '2024-01-15', venue: 'Hazaribagh Training Centre', attendees: 38, totalCRPs: 42, notes: 'Initial onboarding meeting for new CRPs.' },
];

export const CRPNetworkSection: React.FC<CRPNetworkSectionProps> = ({ 
  canEdit, 
  adoptedDistricts,
  workOrderId = ''
}) => {
  // RTK Query hooks
  const { data: crpData, isLoading, refetch } = useGetCRPNetworkQuery(workOrderId, { skip: !workOrderId });

  // Mock fallback pattern
  const [crps, setCrps] = useState<CRP[]>(mockCRPs);
  const [meetings, setMeetings] = useState<Meeting[]>(mockMeetings);

  useEffect(() => {
    if (crpData && Array.isArray(crpData) && crpData.length > 0) {
      setCrps(crpData as CRP[]);
    }
  }, [crpData]);

  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCrpId, setEditingCrpId] = useState<string | undefined>();
  const [isScheduleMeetingOpen, setIsScheduleMeetingOpen] = useState(false);
  const [isPaymentsDialogOpen, setIsPaymentsDialogOpen] = useState(false);
  const [selectedCrpForPayments, setSelectedCrpForPayments] = useState<CRP | null>(null);
  
  const [newMeeting, setNewMeeting] = useState<Partial<Meeting>>({});
  const [filterDistrict, setFilterDistrict] = useState<string>('all');

  const filteredCRPs = filterDistrict === 'all' 
    ? crps 
    : crps.filter(c => c.districtId === filterDistrict);

  const stats = {
    total: crps.length,
    loiSigned: crps.filter(c => c.loi).length,
    appRegistered: crps.filter(c => c.appRegistered).length,
    active: crps.filter(c => c.isActive).length
  };

  const handleAddCRP = () => {
    setEditingCrpId(undefined);
    setIsFormOpen(true);
  };

  const handleEditCRP = (crpId: string) => {
    setEditingCrpId(crpId);
    setIsFormOpen(true);
  };

  const handleViewPayments = (crp: CRP) => {
    setSelectedCrpForPayments(crp);
    setIsPaymentsDialogOpen(true);
  };

  const handleFormSuccess = () => {
    refetch();
  };

  const handleScheduleMeeting = () => {
    if (!newMeeting.date || !newMeeting.venue) {
      toast.error('Please fill required fields');
      return;
    }

    const meeting: Meeting = {
      id: Date.now().toString(),
      date: newMeeting.date!,
      venue: newMeeting.venue!,
      attendees: 0,
      totalCRPs: stats.total,
      notes: newMeeting.notes || ''
    };

    setMeetings([meeting, ...meetings]);
    setIsScheduleMeetingOpen(false);
    setNewMeeting({});
    toast.success('Meeting scheduled successfully!');
  };

  const toggleAppRegistration = (crpId: string) => {
    setCrps(crps.map(c => {
      if (c.id === crpId) {
        const newStatus = !c.appRegistered;
        return { ...c, appRegistered: newStatus, appRegistrationDate: newStatus ? new Date().toISOString().split('T')[0] : undefined };
      }
      return c;
    }));
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="network" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="network">
            <Users className="h-4 w-4 mr-2" /> CRP Network
          </TabsTrigger>
          <TabsTrigger value="accounts">
            <IndianRupee className="h-4 w-4 mr-2" /> Accounts
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" /> Analytics
          </TabsTrigger>
        </TabsList>

        {/* CRP Network Tab */}
        <TabsContent value="network" className="mt-4 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total CRPs</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">LOI Signed</p>
                    <p className="text-2xl font-bold">{stats.loiSigned}</p>
                  </div>
                  <FileSignature className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">App Registered</p>
                    <p className="text-2xl font-bold">{stats.appRegistered}</p>
                  </div>
                  <Smartphone className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active CRPs</p>
                    <p className="text-2xl font-bold">{stats.active}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-emerald-500" />
                </div>
              </CardContent>
            </Card>
          </div>

      {/* CRP Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>CRP Network</CardTitle>
            <CardDescription>Community Resource Persons management</CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={filterDistrict} onValueChange={setFilterDistrict}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by district" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                {adoptedDistricts.map(id => {
                  const district = jharkhandDistricts.find(d => d.id === id);
                  return <SelectItem key={id} value={id}>{district?.name}</SelectItem>;
                })}
              </SelectContent>
            </Select>
            <Button disabled={!canEdit} onClick={handleAddCRP}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add CRP
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>District</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-center">LOI</TableHead>
                <TableHead className="text-center">App</TableHead>
                <TableHead className="text-center">Payments & OFRs</TableHead>
                {canEdit && <TableHead className="text-center">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCRPs.map(crp => {
                const district = jharkhandDistricts.find(d => d.id === crp.districtId);
                return (
                  <TableRow key={crp.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{crp.name}</p>
                        <p className="text-xs text-muted-foreground">{crp.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{crp.category}</Badge>
                    </TableCell>
                    <TableCell>{district?.name}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>Home: {crp.homeLocation}</p>
                        <p className="text-muted-foreground">Work: {crp.workLocation}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {crp.loi ? (
                        <div className="flex items-center justify-center">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <X className="h-5 w-5 text-red-500" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleAppRegistration(crp.id)}
                        disabled={!canEdit || !crp.loi}
                      >
                        {crp.appRegistered ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewPayments(crp)}
                        title="View Payments & OFRs"
                      >
                        <Eye className="h-5 w-5 text-blue-500" />
                      </Button>
                    </TableCell>
                    {canEdit && (
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditCRP(crp.id)}
                          title="Edit CRP"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Monthly Meetings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Monthly CRP Meetings
            </CardTitle>
            <CardDescription>Schedule and track monthly meetings at Training Centres</CardDescription>
          </div>
          <Dialog open={isScheduleMeetingOpen} onOpenChange={setIsScheduleMeetingOpen}>
            <DialogTrigger asChild>
              <Button disabled={!canEdit}>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule CRP Meeting</DialogTitle>
                <DialogDescription>Plan a monthly meeting for CRP network</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Date *</Label>
                  <Input type="date" value={newMeeting.date || ''} onChange={e => setNewMeeting({ ...newMeeting, date: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Venue *</Label>
                  <Input value={newMeeting.venue || ''} onChange={e => setNewMeeting({ ...newMeeting, venue: e.target.value })} placeholder="e.g., Ranchi Training Centre" />
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Input value={newMeeting.notes || ''} onChange={e => setNewMeeting({ ...newMeeting, notes: e.target.value })} placeholder="Meeting agenda..." />
                </div>
                <Button className="w-full" onClick={handleScheduleMeeting}>Schedule Meeting</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {meetings.map(meeting => (
              <div key={meeting.id} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{meeting.venue}</p>
                    <p className="text-sm text-muted-foreground">{new Date(meeting.date).toLocaleDateString()}</p>
                    {meeting.notes && <p className="text-sm mt-1">{meeting.notes}</p>}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{meeting.attendees}/{meeting.totalCRPs}</p>
                  <p className="text-sm text-muted-foreground">Attendance</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

        </TabsContent>

        {/* Accounts Tab */}
        <TabsContent value="accounts" className="mt-4">
          <CRPAccountsSection canEdit={canEdit} workOrderId={workOrderId} />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-4">
          <CRPAnalyticsDashboard workOrderId={workOrderId} />
        </TabsContent>
      </Tabs>

      {/* CRP Form Dialog */}
      <CRPForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        crpId={editingCrpId}
        workOrderId={workOrderId}
        adoptedDistricts={adoptedDistricts}
        onSuccess={handleFormSuccess}
      />

      {/* Payments Dialog */}
      {selectedCrpForPayments && (
        <CRPPaymentsDialog
          open={isPaymentsDialogOpen}
          onOpenChange={setIsPaymentsDialogOpen}
          crpId={selectedCrpForPayments.id}
          crpName={selectedCrpForPayments.name}
          workOrderId={workOrderId}
        />
      )}
    </div>
  );
};
