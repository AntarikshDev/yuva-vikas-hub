import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserPlus, FileSignature, Smartphone, Calendar, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { crpCategories, jharkhandDistricts } from '@/data/jharkhandCensusData';

interface CRP {
  id: string;
  name: string;
  category: string;
  homeLocation: string;
  workLocation: string;
  phone: string;
  districtId: string;
  loiSigned: boolean;
  loiDate?: string;
  appRegistered: boolean;
  appRegistrationDate?: string;
  lastPaymentDate?: string;
  totalPayments: number;
  isActive: boolean;
}

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
}

export const CRPNetworkSection: React.FC<CRPNetworkSectionProps> = ({ canEdit, adoptedDistricts }) => {
  const [crps, setCrps] = useState<CRP[]>([
    { id: '1', name: 'Ram Kumar Sharma', category: 'School Principal', homeLocation: 'Kanke', workLocation: 'Kanke Block', phone: '9876543210', districtId: 'ranchi', loiSigned: true, loiDate: '2024-01-15', appRegistered: true, appRegistrationDate: '2024-01-16', lastPaymentDate: '2024-02-01', totalPayments: 2, isActive: true },
    { id: '2', name: 'Sunita Devi', category: 'SHG Member', homeLocation: 'Ratu', workLocation: 'Ratu Block', phone: '9876543211', districtId: 'ranchi', loiSigned: true, loiDate: '2024-01-18', appRegistered: true, appRegistrationDate: '2024-01-19', lastPaymentDate: '2024-02-01', totalPayments: 2, isActive: true },
    { id: '3', name: 'Vikash Oraon', category: 'Teacher', homeLocation: 'Burmu', workLocation: 'Burmu Block', phone: '9876543212', districtId: 'ranchi', loiSigned: true, loiDate: '2024-01-20', appRegistered: false, totalPayments: 0, isActive: true },
    { id: '4', name: 'Meena Kumari', category: 'Alumni', homeLocation: 'Hazaribag', workLocation: 'Hazaribag Block', phone: '9876543213', districtId: 'hazaribagh', loiSigned: false, appRegistered: false, totalPayments: 0, isActive: true },
    { id: '5', name: 'Rajesh Munda', category: 'Local Influencer', homeLocation: 'Dhanbad', workLocation: 'Dhanbad Block', phone: '9876543214', districtId: 'dhanbad', loiSigned: true, loiDate: '2024-01-25', appRegistered: true, appRegistrationDate: '2024-01-26', lastPaymentDate: '2024-02-15', totalPayments: 1, isActive: true },
  ]);

  const [meetings, setMeetings] = useState<Meeting[]>([
    { id: '1', date: '2024-02-01', venue: 'Ranchi Training Centre', attendees: 45, totalCRPs: 50, notes: 'Monthly review meeting. Discussed mobilization targets.' },
    { id: '2', date: '2024-01-15', venue: 'Hazaribagh Training Centre', attendees: 38, totalCRPs: 42, notes: 'Initial onboarding meeting for new CRPs.' },
  ]);

  const [isAddCRPOpen, setIsAddCRPOpen] = useState(false);
  const [isScheduleMeetingOpen, setIsScheduleMeetingOpen] = useState(false);
  const [newCRP, setNewCRP] = useState<Partial<CRP>>({});
  const [newMeeting, setNewMeeting] = useState<Partial<Meeting>>({});
  const [filterDistrict, setFilterDistrict] = useState<string>('all');

  const filteredCRPs = filterDistrict === 'all' 
    ? crps 
    : crps.filter(c => c.districtId === filterDistrict);

  const stats = {
    total: crps.length,
    loiSigned: crps.filter(c => c.loiSigned).length,
    appRegistered: crps.filter(c => c.appRegistered).length,
    active: crps.filter(c => c.isActive).length
  };

  const handleAddCRP = () => {
    if (!newCRP.name || !newCRP.category || !newCRP.districtId) {
      toast.error('Please fill required fields');
      return;
    }

    const crp: CRP = {
      id: Date.now().toString(),
      name: newCRP.name!,
      category: newCRP.category!,
      homeLocation: newCRP.homeLocation || '',
      workLocation: newCRP.workLocation || '',
      phone: newCRP.phone || '',
      districtId: newCRP.districtId!,
      loiSigned: false,
      appRegistered: false,
      totalPayments: 0,
      isActive: true
    };

    setCrps([...crps, crp]);
    setIsAddCRPOpen(false);
    setNewCRP({});
    toast.success('CRP added successfully!');
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

  const toggleLOI = (crpId: string) => {
    setCrps(crps.map(c => {
      if (c.id === crpId) {
        const newStatus = !c.loiSigned;
        return { ...c, loiSigned: newStatus, loiDate: newStatus ? new Date().toISOString().split('T')[0] : undefined };
      }
      return c;
    }));
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
            <Dialog open={isAddCRPOpen} onOpenChange={setIsAddCRPOpen}>
              <DialogTrigger asChild>
                <Button disabled={!canEdit}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add CRP
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New CRP</DialogTitle>
                  <DialogDescription>Register a new Community Resource Person</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Name *</Label>
                    <Input value={newCRP.name || ''} onChange={e => setNewCRP({ ...newCRP, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select value={newCRP.category} onValueChange={v => setNewCRP({ ...newCRP, category: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {crpCategories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>District *</Label>
                    <Select value={newCRP.districtId} onValueChange={v => setNewCRP({ ...newCRP, districtId: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                      <SelectContent>
                        {adoptedDistricts.map(id => {
                          const district = jharkhandDistricts.find(d => d.id === id);
                          return <SelectItem key={id} value={id}>{district?.name}</SelectItem>;
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Home Location</Label>
                      <Input value={newCRP.homeLocation || ''} onChange={e => setNewCRP({ ...newCRP, homeLocation: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Work Location</Label>
                      <Input value={newCRP.workLocation || ''} onChange={e => setNewCRP({ ...newCRP, workLocation: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value={newCRP.phone || ''} onChange={e => setNewCRP({ ...newCRP, phone: e.target.value })} />
                  </div>
                  <Button className="w-full" onClick={handleAddCRP}>Add CRP</Button>
                </div>
              </DialogContent>
            </Dialog>
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
                <TableHead className="text-center">Payments</TableHead>
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleLOI(crp.id)}
                        disabled={!canEdit}
                      >
                        {crp.loiSigned ? (
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
                        onClick={() => toggleAppRegistration(crp.id)}
                        disabled={!canEdit || !crp.loiSigned}
                      >
                        {crp.appRegistered ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={crp.totalPayments > 0 ? 'default' : 'outline'}>
                        {crp.totalPayments}
                      </Badge>
                    </TableCell>
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

      {/* Payment Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Fortnightly Payment Tracking
          </CardTitle>
          <CardDescription>Track CRP incentive payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Payment tracking feature coming soon</p>
            <p className="text-sm mt-1">Fortnightly payment processing and tracking</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
