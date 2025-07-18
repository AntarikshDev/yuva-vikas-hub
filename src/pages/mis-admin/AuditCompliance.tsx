import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Download, Shield, FileText, Clock, User, Settings } from 'lucide-react';
import { DateRange } from 'react-day-picker';

const AuditCompliance = () => {
  const [activeTab, setActiveTab] = useState('audit-logs');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUser, setFilterUser] = useState('all');
  const [filterModule, setFilterModule] = useState('all');

  // Mock audit log data
  const auditLogs = [
    {
      id: 1,
      user: 'MIS Admin',
      action: 'User Role Updated',
      module: 'User Management',
      dateTime: '2025-07-18 10:30:15',
      ipAddress: '192.168.1.100',
      before: '{"role": "counsellor"}',
      after: '{"role": "center_manager"}',
      severity: 'Medium'
    },
    {
      id: 2,
      user: 'State Head',
      action: 'Report Generated',
      module: 'Reports',
      dateTime: '2025-07-18 09:45:22',
      ipAddress: '192.168.1.101',
      before: null,
      after: '{"report": "monthly_placement", "exported": true}',
      severity: 'Low'
    },
    {
      id: 3,
      user: 'Center Manager',
      action: 'Document Status Changed',
      module: 'Document Management',
      dateTime: '2025-07-18 08:20:45',
      ipAddress: '192.168.1.102',
      before: '{"status": "pending"}',
      after: '{"status": "approved"}',
      severity: 'High'
    },
    {
      id: 4,
      user: 'Counsellor',
      action: 'Candidate Data Modified',
      module: 'Candidate Management',
      dateTime: '2025-07-17 16:30:10',
      ipAddress: '192.168.1.103',
      before: '{"phone": "+91-9876543210"}',
      after: '{"phone": "+91-9876543211"}',
      severity: 'Medium'
    },
    {
      id: 5,
      user: 'Super Admin',
      action: 'System Settings Changed',
      module: 'System Settings',
      dateTime: '2025-07-17 14:15:30',
      ipAddress: '192.168.1.104',
      before: '{"auto_backup": false}',
      after: '{"auto_backup": true}',
      severity: 'High'
    }
  ];

  // Mock compliance reports
  const complianceReports = [
    {
      id: 1,
      reportName: 'Document Compliance Report',
      category: 'Documentation',
      generatedDate: '2025-07-18',
      status: 'Completed',
      complianceScore: 95,
      issues: 3
    },
    {
      id: 2,
      reportName: 'Counselling Verification Report',
      category: 'Process Compliance',
      generatedDate: '2025-07-17',
      status: 'Completed',
      complianceScore: 88,
      issues: 8
    },
    {
      id: 3,
      reportName: 'Financial Disbursement Audit',
      category: 'Financial',
      generatedDate: '2025-07-16',
      status: 'In Progress',
      complianceScore: null,
      issues: null
    },
    {
      id: 4,
      reportName: 'Data Privacy Compliance',
      category: 'Data Protection',
      generatedDate: '2025-07-15',
      status: 'Completed',
      complianceScore: 92,
      issues: 5
    }
  ];

  // Mock user activity summary
  const userActivitySummary = [
    { user: 'MIS Admin', totalActions: 45, highRiskActions: 8, lastActivity: '2025-07-18 10:30' },
    { user: 'State Head', totalActions: 23, highRiskActions: 2, lastActivity: '2025-07-18 09:45' },
    { user: 'Center Manager', totalActions: 67, highRiskActions: 12, lastActivity: '2025-07-18 08:20' },
    { user: 'Counsellor', totalActions: 89, highRiskActions: 3, lastActivity: '2025-07-17 16:30' }
  ];

  const users = ['All Users', 'MIS Admin', 'State Head', 'Center Manager', 'Counsellor'];
  const modules = ['All Modules', 'User Management', 'Document Management', 'Reports', 'System Settings', 'Candidate Management'];

  const filteredAuditLogs = auditLogs.filter(log => {
    return (
      (searchTerm === '' || 
       log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
       log.module.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterUser === 'all' || log.user === filterUser) &&
      (filterModule === 'all' || log.module === filterModule)
    );
  });

  const getSeverityBadge = (severity: string) => {
    const colors = {
      'High': 'bg-red-100 text-red-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Low': 'bg-blue-100 text-blue-800'
    };
    return <Badge className={colors[severity as keyof typeof colors]}>{severity}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      'Completed': 'bg-green-100 text-green-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Failed': 'bg-red-100 text-red-800'
    };
    return <Badge className={colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>{status}</Badge>;
  };

  const getComplianceScoreColor = (score: number | null) => {
    if (score === null) return 'text-gray-500';
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="h-8 w-8" />
          Audit & Compliance
        </h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="audit-logs">Audit Log Viewer</TabsTrigger>
          <TabsTrigger value="compliance-reports">Compliance Reports</TabsTrigger>
          <TabsTrigger value="user-activity">User Activity</TabsTrigger>
        </TabsList>

        {/* Audit Log Viewer Tab */}
        <TabsContent value="audit-logs" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Audit Log Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search actions, modules..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>

                <DateRangePicker
                  dateRange={dateRange}
                  onDateRangeChange={setDateRange}
                  className="w-64"
                  placeholder="Select Date Range"
                />

                <Select value={filterUser} onValueChange={setFilterUser}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user} value={user === 'All Users' ? 'all' : user}>
                        {user}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterModule} onValueChange={setFilterModule}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by module" />
                  </SelectTrigger>
                  <SelectContent>
                    {modules.map((module) => (
                      <SelectItem key={module} value={module === 'All Modules' ? 'all' : module}>
                        {module}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export Audit Logs
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Audit Logs Table */}
          <Card>
            <CardHeader>
              <CardTitle>Audit Log Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>Date/Time</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAuditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{log.user}</span>
                      </TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.module}</TableCell>
                      <TableCell className="font-mono text-sm">{log.dateTime}</TableCell>
                      <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                      <TableCell>{getSeverityBadge(log.severity)}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Audit Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Actions Today</p>
                    <p className="text-2xl font-bold">234</p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">High Risk Actions</p>
                    <p className="text-2xl font-bold text-red-600">25</p>
                  </div>
                  <Shield className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Users</p>
                    <p className="text-2xl font-bold">89</p>
                  </div>
                  <User className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Failed Actions</p>
                    <p className="text-2xl font-bold">7</p>
                  </div>
                  <Settings className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Compliance Reports Tab */}
        <TabsContent value="compliance-reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Compliance Reports
                </span>
                <Button>Generate New Report</Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Generated Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Compliance Score</TableHead>
                    <TableHead>Issues Found</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complianceReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.reportName}</TableCell>
                      <TableCell>{report.category}</TableCell>
                      <TableCell>{report.generatedDate}</TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell>
                        {report.complianceScore !== null ? (
                          <span className={`font-bold ${getComplianceScoreColor(report.complianceScore)}`}>
                            {report.complianceScore}%
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {report.issues !== null ? (
                          <span className={report.issues > 5 ? 'text-red-600 font-medium' : 'text-muted-foreground'}>
                            {report.issues}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            View Report
                          </Button>
                          {report.status === 'Completed' && (
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Compliance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Document Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Overall Score</span>
                    <span className="font-bold text-green-600">95%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Pending Reviews</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Critical Issues</span>
                    <span className="font-medium text-red-600">3</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Process Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Overall Score</span>
                    <span className="font-bold text-yellow-600">88%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Process Violations</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Workflow Issues</span>
                    <span className="font-medium text-orange-600">5</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Data Protection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Overall Score</span>
                    <span className="font-bold text-green-600">92%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Privacy Violations</span>
                    <span className="font-medium">2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Access Issues</span>
                    <span className="font-medium text-yellow-600">3</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* User Activity Tab */}
        <TabsContent value="user-activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Activity Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Total Actions</TableHead>
                    <TableHead>High Risk Actions</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userActivitySummary.map((activity, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{activity.user}</TableCell>
                      <TableCell>{activity.totalActions}</TableCell>
                      <TableCell>
                        <span className={activity.highRiskActions > 5 ? 'text-red-600 font-medium' : 'text-muted-foreground'}>
                          {activity.highRiskActions}
                        </span>
                      </TableCell>
                      <TableCell>{activity.lastActivity}</TableCell>
                      <TableCell>
                        {activity.highRiskActions > 5 ? 
                          getSeverityBadge('High') : 
                          activity.highRiskActions > 2 ? 
                            getSeverityBadge('Medium') : 
                            getSeverityBadge('Low')
                        }
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuditCompliance;