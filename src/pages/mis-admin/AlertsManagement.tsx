import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Bell, AlertTriangle, Plus, Edit, Eye, Key, TestTube, MessageSquare, Mail, Smartphone } from 'lucide-react';

const AlertsManagement = () => {
  const [activeTab, setActiveTab] = useState('alerts-config');
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [isIntegrationModalOpen, setIsIntegrationModalOpen] = useState(false);

  // Mock alert rules data
  const alertRules = [
    {
      id: 1,
      name: 'Low Attendance Alert',
      type: 'Threshold',
      triggerCondition: 'Attendance < 80%',
      lastTriggered: '2025-07-18 09:30',
      status: 'Active',
      channels: ['Email', 'SMS']
    },
    {
      id: 2,
      name: 'Document Compliance Alert',
      type: 'Exception',
      triggerCondition: 'Missing documents > 5',
      lastTriggered: '2025-07-17 14:15',
      status: 'Active',
      channels: ['Email', 'In-app']
    },
    {
      id: 3,
      name: 'Placement Target Alert',
      type: 'Threshold',
      triggerCondition: 'Placement rate < 70%',
      lastTriggered: '2025-07-16 11:20',
      status: 'Inactive',
      channels: ['Email']
    }
  ];

  // Mock alert history
  const alertHistory = [
    {
      id: 1,
      alertText: 'Low attendance detected at Delhi-001 center',
      date: '2025-07-18 09:30',
      triggeredBy: 'Attendance Monitor',
      status: 'Acknowledged',
      severity: 'High'
    },
    {
      id: 2,
      alertText: '5 candidates have incomplete documents',
      date: '2025-07-17 14:15',
      triggeredBy: 'Document Checker',
      status: 'Unacknowledged',
      severity: 'Medium'
    },
    {
      id: 3,
      alertText: 'Monthly placement target not met for Mumbai region',
      date: '2025-07-16 11:20',
      triggeredBy: 'Placement Monitor',
      status: 'Acknowledged',
      severity: 'Low'
    }
  ];

  // Mock API keys
  const apiKeys = [
    {
      id: 1,
      name: 'SMS Service Key',
      service: 'MSG91',
      status: 'Active',
      lastUsed: '2025-07-18 10:30',
      keyPreview: 'sk_*********************xyz'
    },
    {
      id: 2,
      name: 'WhatsApp Business Key',
      service: 'WhatsApp',
      status: 'Active',
      lastUsed: '2025-07-18 09:15',
      keyPreview: 'wa_*********************abc'
    },
    {
      id: 3,
      name: 'Cloud Storage Key',
      service: 'Cloud Storage',
      status: 'Inactive',
      lastUsed: '2025-07-15 16:45',
      keyPreview: 'cs_*********************def'
    }
  ];

  // Mock integrations
  const integrations = [
    {
      id: 1,
      name: 'MSG91 SMS Service',
      type: 'SMS',
      status: 'Connected',
      lastSync: '2025-07-18 10:30',
      config: 'API Key configured'
    },
    {
      id: 2,
      name: 'WhatsApp Business API',
      type: 'WhatsApp',
      status: 'Connected',
      lastSync: '2025-07-18 09:45',
      config: 'Webhook configured'
    },
    {
      id: 3,
      name: 'Cloud Storage Service',
      type: 'Storage',
      status: 'Disconnected',
      lastSync: '2025-07-15 16:20',
      config: 'Authentication failed'
    }
  ];

  const getStatusBadge = (status: string) => {
    const colors = {
      'Active': 'bg-green-100 text-green-800',
      'Inactive': 'bg-red-100 text-red-800',
      'Acknowledged': 'bg-blue-100 text-blue-800',
      'Unacknowledged': 'bg-orange-100 text-orange-800',
      'Connected': 'bg-green-100 text-green-800',
      'Disconnected': 'bg-red-100 text-red-800'
    };
    return <Badge className={colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>{status}</Badge>;
  };

  const getSeverityBadge = (severity: string) => {
    const colors = {
      'High': 'bg-red-100 text-red-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Low': 'bg-blue-100 text-blue-800'
    };
    return <Badge className={colors[severity as keyof typeof colors]}>{severity}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Bell className="h-8 w-8" />
          Notifications & System Management
        </h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="alerts-config">Alerts Configuration</TabsTrigger>
          <TabsTrigger value="alert-history">Alert History</TabsTrigger>
          <TabsTrigger value="api-keys">API Management</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        {/* Alerts Configuration Tab */}
        <TabsContent value="alerts-config" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Alert Rules Configuration</span>
                <Dialog open={isAlertModalOpen} onOpenChange={setIsAlertModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Alert Rule
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Alert Rule</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Alert Name</Label>
                        <Input placeholder="Enter alert name" />
                      </div>
                      <div>
                        <Label>Alert Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="threshold">Threshold</SelectItem>
                            <SelectItem value="exception">Exception</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Module</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select module" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="attendance">Attendance</SelectItem>
                            <SelectItem value="placement">Placement</SelectItem>
                            <SelectItem value="documents">Documents</SelectItem>
                            <SelectItem value="enrollment">Enrollment</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Trigger Condition</Label>
                        <Textarea placeholder="Define the condition that triggers this alert..." rows={3} />
                      </div>
                      <div>
                        <Label>Notification Channels</Label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Switch />
                            <Label>Email</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch />
                            <Label>SMS</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch />
                            <Label>In-app</Label>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => setIsAlertModalOpen(false)}>Create Alert</Button>
                        <Button variant="outline" onClick={() => setIsAlertModalOpen(false)}>Cancel</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alert Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Trigger Condition</TableHead>
                    <TableHead>Last Triggered</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Channels</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alertRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.name}</TableCell>
                      <TableCell>{rule.type}</TableCell>
                      <TableCell className="max-w-xs text-sm">{rule.triggerCondition}</TableCell>
                      <TableCell>{rule.lastTriggered}</TableCell>
                      <TableCell>{getStatusBadge(rule.status)}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {rule.channels.map((channel) => (
                            <Badge key={channel} variant="outline" className="text-xs">
                              {channel}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Switch defaultChecked={rule.status === 'Active'} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alert History Tab */}
        <TabsContent value="alert-history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alert History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alert Text</TableHead>
                    <TableHead>Date/Time</TableHead>
                    <TableHead>Triggered By</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alertHistory.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell className="max-w-xs">{alert.alertText}</TableCell>
                      <TableCell>{alert.date}</TableCell>
                      <TableCell>{alert.triggeredBy}</TableCell>
                      <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
                      <TableCell>{getStatusBadge(alert.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {alert.status === 'Unacknowledged' && (
                            <Button size="sm">Mark as Read</Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Management Tab */}
        <TabsContent value="api-keys" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  API Key Management
                </span>
                <Dialog open={isApiModalOpen} onOpenChange={setIsApiModalOpen}>
                  <DialogTrigger asChild>
                    <Button>Generate New Key</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Generate New API Key</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Service Name</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select service" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sms">SMS Service</SelectItem>
                            <SelectItem value="whatsapp">WhatsApp Business</SelectItem>
                            <SelectItem value="storage">Cloud Storage</SelectItem>
                            <SelectItem value="email">Email Service</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Key Name</Label>
                        <Input placeholder="Enter descriptive name for this key" />
                      </div>
                      <div>
                        <Label>Permissions</Label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Switch defaultChecked />
                            <Label>Read</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch defaultChecked />
                            <Label>Write</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch />
                            <Label>Admin</Label>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => setIsApiModalOpen(false)}>Generate Key</Button>
                        <Button variant="outline" onClick={() => setIsApiModalOpen(false)}>Cancel</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key Name</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Key Preview</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell className="font-medium">{key.name}</TableCell>
                      <TableCell>{key.service}</TableCell>
                      <TableCell>{getStatusBadge(key.status)}</TableCell>
                      <TableCell>{key.lastUsed}</TableCell>
                      <TableCell className="font-mono text-sm">{key.keyPreview}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Third-Party Integrations</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Integration Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Sync</TableHead>
                    <TableHead>Configuration</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {integrations.map((integration) => (
                    <TableRow key={integration.id}>
                      <TableCell className="flex items-center gap-2">
                        {integration.type === 'SMS' && <Smartphone className="h-4 w-4" />}
                        {integration.type === 'WhatsApp' && <MessageSquare className="h-4 w-4" />}
                        {integration.type === 'Storage' && <Key className="h-4 w-4" />}
                        <span className="font-medium">{integration.name}</span>
                      </TableCell>
                      <TableCell>{integration.type}</TableCell>
                      <TableCell>{getStatusBadge(integration.status)}</TableCell>
                      <TableCell>{integration.lastSync}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{integration.config}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog open={isIntegrationModalOpen} onOpenChange={setIsIntegrationModalOpen}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Configure {integration.name}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>API Key</Label>
                                  <Input placeholder="Enter API key" type="password" />
                                </div>
                                <div>
                                  <Label>Secret Key</Label>
                                  <Input placeholder="Enter secret key" type="password" />
                                </div>
                                <div>
                                  <Label>Endpoint URL</Label>
                                  <Input placeholder="https://api.example.com" />
                                </div>
                                <div className="flex gap-2">
                                  <Button onClick={() => setIsIntegrationModalOpen(false)}>Save Configuration</Button>
                                  <Button variant="outline">
                                    <TestTube className="h-4 w-4 mr-2" />
                                    Test Connection
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button variant="outline" size="sm">
                            <TestTube className="h-4 w-4" />
                          </Button>
                        </div>
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

export default AlertsManagement;