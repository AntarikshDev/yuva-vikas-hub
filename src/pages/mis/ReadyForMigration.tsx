import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Users, CheckCircle, Clock, MapPin, Phone, Mail, Eye } from 'lucide-react';
import { DataTable } from '@/components/common/DataTable';
import { CandidateDetailsDialog } from '@/components/dialogs/CandidateDetailsDialog';
import { BulkEnrollmentDialog } from '@/components/dialogs/BulkEnrollmentDialog';
import { MigrationReportDialog } from '@/components/dialogs/MigrationReportDialog';
import { NotificationDialog } from '@/components/dialogs/NotificationDialog';
import { useToast } from '@/hooks/use-toast';

const ReadyForMigration = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [candidates, setCandidates] = useState([
    {
      id: 'CND2024001',
      name: 'Aarav Kumar',
      phone: '+91 9876543210',
      email: 'aarav.kumar@email.com',
      batchId: 'B2024-01',
      jobRole: 'Retail Sales Associate',
      company: 'Reliance Retail',
      placementLocation: 'Delhi',
      counsellorApproval: '2025-08-18',
      migrationStatus: 'Ready for Migration',
      enrollmentStatus: 'Pending',
      travelDate: '2025-08-25'
    },
    {
      id: 'CND2024002', 
      name: 'Priya Sharma',
      phone: '+91 9876543211',
      email: 'priya.sharma@email.com',
      batchId: 'B2024-01',
      jobRole: 'Customer Service',
      company: 'HDFC Bank',
      placementLocation: 'Mumbai',
      counsellorApproval: '2025-08-19',
      migrationStatus: 'Migrated',
      enrollmentStatus: 'Pending',
      travelDate: '2025-08-24'
    },
    {
      id: 'CND2024003',
      name: 'Rohit Singh',
      phone: '+91 9876543212',
      email: 'rohit.singh@email.com',
      batchId: 'B2024-02',
      jobRole: 'Data Entry Operator',
      company: 'TCS',
      placementLocation: 'Bangalore',
      counsellorApproval: '2025-08-20',
      migrationStatus: 'Migrated',
      enrollmentStatus: 'Enrolled',
      travelDate: '2025-08-23'
    }
  ]);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const { toast } = useToast();

  const statusCounts = {
    readyForMigration: candidates.filter(c => c.migrationStatus === 'Ready for Migration').length,
    migrated: candidates.filter(c => c.migrationStatus === 'Migrated' && c.enrollmentStatus === 'Pending').length,
    enrolled: candidates.filter(c => c.enrollmentStatus === 'Enrolled').length,
    total: candidates.length
  };

  const handleStatusUpdate = (candidateId: string, newMigrationStatus: string, newEnrollmentStatus: string) => {
    setCandidates(prev => 
      prev.map(candidate => 
        candidate.id === candidateId 
          ? { ...candidate, migrationStatus: newMigrationStatus, enrollmentStatus: newEnrollmentStatus }
          : candidate
      )
    );
  };

  const handleBulkUpdate = (candidateIds: string[]) => {
    setCandidates(prev => 
      prev.map(candidate => 
        candidateIds.includes(candidate.id)
          ? { ...candidate, enrollmentStatus: 'Enrolled' }
          : candidate
      )
    );
  };

  const handleViewDetails = (candidate: any) => {
    setSelectedCandidate(candidate);
    setDetailsDialogOpen(true);
  };

  const handleQuickEnrollment = (candidateId: string) => {
    setCandidates(prev => 
      prev.map(candidate => 
        candidate.id === candidateId 
          ? { ...candidate, enrollmentStatus: 'Enrolled' }
          : candidate
      )
    );
    toast({
      title: "Status Updated",
      description: "Candidate marked as enrolled successfully",
    });
  };

  const columns = [
    {
      id: 'id',
      header: 'Candidate ID',
      cell: (item: any) => item.id,
    },
    {
      id: 'name',
      header: 'Name',
      cell: (item: any) => item.name,
    },
    {
      id: 'phone',
      header: 'Phone',
      cell: (item: any) => item.phone,
    },
    {
      id: 'batchId',
      header: 'Batch',
      cell: (item: any) => item.batchId,
    },
    {
      id: 'company',
      header: 'Company',
      cell: (item: any) => item.company,
    },
    {
      id: 'placementLocation',
      header: 'Location',
      cell: (item: any) => item.placementLocation,
    },
    {
      id: 'migrationStatus',
      header: 'Migration Status',
      cell: (item: any) => (
        <Badge variant={item.migrationStatus === 'Ready for Migration' ? 'secondary' : 'default'}>
          {item.migrationStatus}
        </Badge>
      ),
    },
    {
      id: 'enrollmentStatus',
      header: 'Enrollment Status',
      cell: (item: any) => (
        <Badge variant={item.enrollmentStatus === 'Enrolled' ? 'default' : 'secondary'}>
          {item.enrollmentStatus}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (item: any) => {
        const canUpdateToEnrolled = item.migrationStatus === 'Migrated' && item.enrollmentStatus === 'Pending';
        
        return (
          <div className="flex gap-2">
            {canUpdateToEnrolled && (
              <Button
                size="sm"
                onClick={() => handleQuickEnrollment(item.id)}
              >
                Mark as Enrolled
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleViewDetails(item)}
            >
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </Button>
          </div>
        );
      },
    },
  ];

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = 
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || 
      (selectedStatus === 'ready' && candidate.migrationStatus === 'Ready for Migration') ||
      (selectedStatus === 'migrated' && candidate.migrationStatus === 'Migrated' && candidate.enrollmentStatus === 'Pending') ||
      (selectedStatus === 'enrolled' && candidate.enrollmentStatus === 'Enrolled');
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold">Ready for Migration</h1>
        <p className="text-muted-foreground">Manage candidates ready for migration and enrollment status</p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ready for Migration
            </CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.readyForMigration}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Migrated (Pending Enrollment)
            </CardTitle>
            <Clock className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.migrated}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Enrolled
            </CardTitle>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.enrolled}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Candidates
            </CardTitle>
            <Users className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.total}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Candidate Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search by name, ID, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Candidates</SelectItem>
                  <SelectItem value="ready">Ready for Migration</SelectItem>
                  <SelectItem value="migrated">Migrated (Pending)</SelectItem>
                  <SelectItem value="enrolled">Enrolled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={filteredCandidates}
          />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setBulkDialogOpen(true)}
            >
              <CheckCircle className="h-4 w-4" />
              Bulk Mark as Enrolled
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setReportDialogOpen(true)}
            >
              <MapPin className="h-4 w-4" />
              Export Migration Report
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setNotificationDialogOpen(true)}
            >
              <Phone className="h-4 w-4" />
              Send Notifications
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Migration Process Info */}
      <Card>
        <CardHeader>
          <CardTitle>Migration Process</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">1</div>
              <div>
                <h4 className="font-medium">Counsellor Approval</h4>
                <p className="text-sm text-muted-foreground">Candidates approved by counsellor appear as "Ready for Migration"</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold text-sm">2</div>
              <div>
                <h4 className="font-medium">Migration by Mobilizers</h4>
                <p className="text-sm text-muted-foreground">Mobilizers complete the migration process and candidates travel to the LNJ Skill Centre</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold text-sm">3</div>
              <div>
                <h4 className="font-medium">Enrollment by MIS</h4>
                <p className="text-sm text-muted-foreground">MIS updates status from "Ready to Migrate" to "Migrated" and then "Migrated" to "Enrolled" once batch assignment is complete in government portal</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CandidateDetailsDialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        candidate={selectedCandidate}
        onStatusUpdate={handleStatusUpdate}
      />

      <BulkEnrollmentDialog
        open={bulkDialogOpen}
        onClose={() => setBulkDialogOpen(false)}
        candidates={candidates}
        onBulkUpdate={handleBulkUpdate}
      />

      <MigrationReportDialog
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
      />

      <NotificationDialog
        open={notificationDialogOpen}
        onClose={() => setNotificationDialogOpen(false)}
        candidates={candidates}
      />
    </div>
  );
};

export default ReadyForMigration;