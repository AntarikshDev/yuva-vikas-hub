import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, AtSign, Cloud, Bell, Webhook, Key, RefreshCw, Save, Globe, Smartphone, Mail, Phone, CheckCircle2, FileText, Image, Upload, Database } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const SystemSettings = () => {
  const { toast } = useToast();
  const [isTestingWhatsApp, setIsTestingWhatsApp] = useState(false);
  const [storageUsage, setStorageUsage] = useState(64);
  
  const handleTestWhatsApp = () => {
    setIsTestingWhatsApp(true);
    setTimeout(() => {
      setIsTestingWhatsApp(false);
      toast({
        title: "Connection Successful",
        description: "WhatsApp API connection was tested successfully.",
        // Changed from "success" to "default" as "success" is not a valid variant
        variant: "default", 
      });
    }, 2000);
  };

  return (
    <MainLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground">
            Configure and manage system-wide settings and integrations.
          </p>
        </div>

        <Tabs defaultValue="integrations" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
            <TabsTrigger value="integrations" className="flex gap-2 items-center">
              <Globe className="h-4 w-4" />
              API Integrations
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex gap-2 items-center">
              <Bell className="h-4 w-4" />
              Notification Settings
            </TabsTrigger>
            <TabsTrigger value="storage" className="flex gap-2 items-center">
              <Cloud className="h-4 w-4" />
              Storage Settings
            </TabsTrigger>
            <TabsTrigger value="system" className="flex gap-2 items-center">
              <Smartphone className="h-4 w-4" />
              System Info
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="integrations" className="space-y-6 pt-6">
            <Card>
              <CardHeader>
                <CardTitle>WhatsApp API Integration</CardTitle>
                <CardDescription>
                  Configure WhatsApp Business API for automated messaging.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp-api-key">API Key</Label>
                    <Input id="whatsapp-api-key" type="password" placeholder="Enter WhatsApp API Key" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp-sender">Sender ID</Label>
                    <Input id="whatsapp-sender" placeholder="Enter WhatsApp Sender ID" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp-template">Default Template</Label>
                    <Input id="whatsapp-template" placeholder="Enter Default Template Name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp-callback">Callback URL</Label>
                    <Input id="whatsapp-callback" placeholder="Enter Callback URL" />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="whatsapp-active" />
                  <Label htmlFor="whatsapp-active">Enable WhatsApp Integration</Label>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t p-4">
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="gap-1"
                    onClick={handleTestWhatsApp}
                    disabled={isTestingWhatsApp}
                  >
                    <RefreshCw className={`h-4 w-4 ${isTestingWhatsApp ? "animate-spin" : ""}`} />
                    Test Connection
                  </Button>
                  <Button className="gap-1">
                    <Save className="h-4 w-4" />
                    Save Settings
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Email Server Setup (SMTP)</CardTitle>
                <CardDescription>
                  Configure SMTP server for sending automated emails.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-host">SMTP Host</Label>
                    <Input id="smtp-host" placeholder="e.g., smtp.gmail.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-port">SMTP Port</Label>
                    <Input id="smtp-port" placeholder="e.g., 587" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-username">Username</Label>
                    <Input id="smtp-username" placeholder="Enter SMTP username" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-password">Password</Label>
                    <Input id="smtp-password" type="password" placeholder="Enter SMTP password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-from">From Email</Label>
                    <Input id="smtp-from" placeholder="e.g., noreply@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-name">From Name</Label>
                    <Input id="smtp-name" placeholder="e.g., LNJ Skills" />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="smtp-ssl" />
                  <Label htmlFor="smtp-ssl">Use SSL/TLS</Label>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-4">
                <Button variant="outline" className="gap-1">
                  <AtSign className="h-4 w-4" />
                  Send Test Email
                </Button>
                <Button className="gap-1">
                  <Save className="h-4 w-4" />
                  Save Settings
                </Button>
              </CardFooter>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>SMS Gateway</CardTitle>
                  <CardDescription>
                    Configure SMS gateway for automated text messaging.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="sms-api-key">API Key</Label>
                      <Input id="sms-api-key" type="password" placeholder="Enter SMS API Key" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sms-sender">Sender ID</Label>
                      <Input id="sms-sender" placeholder="Enter SMS Sender ID" />
                    </div>
                    <div className="flex items-center space-x-2 mt-4">
                      <Switch id="sms-active" />
                      <Label htmlFor="sms-active">Enable SMS Integration</Label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t p-4">
                  <Button className="gap-1">
                    <MessageSquare className="h-4 w-4" />
                    Test SMS
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>API Keys & Webhooks</CardTitle>
                  <CardDescription>
                    Manage API keys and webhook endpoints.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="api-key">API Key</Label>
                      <div className="flex">
                        <Input id="api-key" readOnly value="sk_test_abc123def456" className="rounded-r-none" />
                        <Button className="rounded-l-none gap-1">
                          <RefreshCw className="h-4 w-4" />
                          Regenerate
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="webhook-url">Webhook URL</Label>
                      <Input id="webhook-url" placeholder="https://your-app.com/api/webhook" />
                    </div>
                    <div className="flex items-center space-x-2 mt-4">
                      <Switch id="webhook-active" />
                      <Label htmlFor="webhook-active">Enable Webhooks</Label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t p-4">
                  <div className="flex gap-3">
                    <Button variant="outline" className="gap-1">
                      <Key className="h-4 w-4" />
                      View Secret Key
                    </Button>
                    <Button variant="outline" className="gap-1">
                      <Webhook className="h-4 w-4" />
                      Test Webhook
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure when and how notifications are sent to users.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Email Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Checkbox id="email-alerts" />
                      <div>
                        <Label className="text-sm font-medium" htmlFor="email-alerts">System Alerts</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications about system issues and updates</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Checkbox id="email-reports" defaultChecked />
                      <div>
                        <Label className="text-sm font-medium" htmlFor="email-reports">Scheduled Reports</Label>
                        <p className="text-sm text-muted-foreground">Receive scheduled reports via email</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Checkbox id="email-user" defaultChecked />
                      <div>
                        <Label className="text-sm font-medium" htmlFor="email-user">User Activities</Label>
                        <p className="text-sm text-muted-foreground">Get notified about important user activities</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">SMS Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Checkbox id="sms-alerts" />
                      <div>
                        <Label className="text-sm font-medium" htmlFor="sms-alerts">Critical Alerts</Label>
                        <p className="text-sm text-muted-foreground">Receive SMS notifications for critical system alerts</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Checkbox id="sms-auth" />
                      <div>
                        <Label className="text-sm font-medium" htmlFor="sms-auth">Authentication Codes</Label>
                        <p className="text-sm text-muted-foreground">Send authentication codes via SMS</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">In-App Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Checkbox id="app-messages" defaultChecked />
                      <div>
                        <Label className="text-sm font-medium" htmlFor="app-messages">Messages</Label>
                        <p className="text-sm text-muted-foreground">Show notifications for new messages</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Checkbox id="app-updates" defaultChecked />
                      <div>
                        <Label className="text-sm font-medium" htmlFor="app-updates">System Updates</Label>
                        <p className="text-sm text-muted-foreground">Show notifications for system updates</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Checkbox id="app-tasks" defaultChecked />
                      <div>
                        <Label className="text-sm font-medium" htmlFor="app-tasks">Task Assignments</Label>
                        <p className="text-sm text-muted-foreground">Show notifications for task assignments</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Templates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-5 w-5 text-blue-500" />
                          <span className="font-medium">Welcome Email</span>
                        </div>
                        <Badge variant="outline">Email</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">Sent when a new user registers</p>
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Phone className="h-5 w-5 text-green-500" />
                          <span className="font-medium">Verification SMS</span>
                        </div>
                        <Badge variant="outline">SMS</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">Sent for mobile verification</p>
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Bell className="h-5 w-5 text-amber-500" />
                          <span className="font-medium">Task Assignment</span>
                        </div>
                        <Badge variant="outline">In-App</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">Shown when assigning new tasks</p>
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="h-5 w-5 text-purple-500" />
                          <span className="font-medium">Completion Notice</span>
                        </div>
                        <Badge variant="outline">Email</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">Sent when a task is completed</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Edit Templates
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t p-4">
                <Button className="gap-1">
                  <Save className="h-4 w-4" />
                  Save Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="storage" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Cloud Storage Settings</CardTitle>
                <CardDescription>
                  Configure cloud storage for documents and media files.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Storage Usage</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Used: 12.8 GB</span>
                      <span>Total: 20 GB</span>
                    </div>
                    <Progress value={storageUsage} className="h-2" />
                    <p className="text-xs text-muted-foreground text-right">{storageUsage}% used</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Storage Provider</h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox id="storage-aws" defaultChecked />
                      <div className="flex-1">
                        <Label className="text-sm font-medium" htmlFor="storage-aws">Amazon S3</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                          <div className="space-y-2">
                            <Label htmlFor="aws-key" className="text-sm">Access Key</Label>
                            <Input id="aws-key" type="password" placeholder="AWS Access Key" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="aws-secret" className="text-sm">Secret Key</Label>
                            <Input id="aws-secret" type="password" placeholder="AWS Secret Key" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="aws-bucket" className="text-sm">Bucket Name</Label>
                            <Input id="aws-bucket" placeholder="S3 Bucket Name" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="aws-region" className="text-sm">Region</Label>
                            <Input id="aws-region" placeholder="e.g., us-east-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Checkbox id="storage-azure" />
                      <div className="flex-1">
                        <Label className="text-sm font-medium" htmlFor="storage-azure">Azure Blob Storage</Label>
                        <p className="text-sm text-muted-foreground">Configure Microsoft Azure for cloud storage</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Checkbox id="storage-gcp" />
                      <div className="flex-1">
                        <Label className="text-sm font-medium" htmlFor="storage-gcp">Google Cloud Storage</Label>
                        <p className="text-sm text-muted-foreground">Configure Google Cloud for cloud storage</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Checkbox id="storage-local" />
                      <div className="flex-1">
                        <Label className="text-sm font-medium" htmlFor="storage-local">Local Storage</Label>
                        <div className="space-y-2 mt-2">
                          <Label htmlFor="local-path" className="text-sm">Storage Path</Label>
                          <Input id="local-path" placeholder="/path/to/storage" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">File Type Restrictions</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Image className="h-4 w-4 text-blue-500" />
                        <Label className="text-sm">Images</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Label className="text-sm text-muted-foreground">Max size:</Label>
                        <Input className="w-24 h-8" defaultValue="10" />
                        <span className="text-sm">MB</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-green-500" />
                        <Label className="text-sm">Documents</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Label className="text-sm text-muted-foreground">Max size:</Label>
                        <Input className="w-24 h-8" defaultValue="20" />
                        <span className="text-sm">MB</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Database className="h-4 w-4 text-amber-500" />
                        <Label className="text-sm">Database Backups</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Label className="text-sm text-muted-foreground">Max size:</Label>
                        <Input className="w-24 h-8" defaultValue="500" />
                        <span className="text-sm">MB</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Test Storage Connection</h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="gap-1">
                          <Upload className="h-4 w-4" />
                          Test Upload
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Test File Upload</DialogTitle>
                          <DialogDescription>
                            Upload a test file to verify storage configuration.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="flex items-center gap-4">
                            <Label htmlFor="test-file" className="text-right">
                              File
                            </Label>
                            <Input id="test-file" type="file" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Upload</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button className="gap-1">
                      <Cloud className="h-4 w-4" />
                      Test Connection
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t p-4">
                <Button className="gap-1">
                  <Save className="h-4 w-4" />
                  Save Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="system" className="pt-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>System Information</CardTitle>
                    <CardDescription>Current system version and status</CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    Online
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    <div className="rounded-lg border p-3">
                      <div className="text-sm font-medium text-gray-500">System Version</div>
                      <div className="mt-1 text-lg font-semibold">v2.3.0</div>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="text-sm font-medium text-gray-500">Last Updated</div>
                      <div className="mt-1 text-lg font-semibold">2023-10-25</div>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="text-sm font-medium text-gray-500">Database Size</div>
                      <div className="mt-1 text-lg font-semibold">1.2 GB</div>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="text-sm font-medium text-gray-500">Total Users</div>
                      <div className="mt-1 text-lg font-semibold">246</div>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="text-sm font-medium text-gray-500">Storage Used</div>
                      <div className="mt-1 text-lg font-semibold">14.8 GB</div>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="text-sm font-medium text-gray-500">API Requests Today</div>
                      <div className="mt-1 text-lg font-semibold">12,346</div>
                    </div>
                  </div>
                  
                  <div className="rounded-md bg-yellow-50 p-4 mt-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="h-5 w-5 text-yellow-400">!</div>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">Update Available</h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>Version 2.4.0 is now available. Contains security fixes and performance improvements.</p>
                        </div>
                        <div className="mt-4">
                          <div className="flex">
                            <Button size="sm" variant="outline" className="py-1 px-2 text-xs text-yellow-800 bg-yellow-100 hover:bg-yellow-200 border-yellow-300">
                              View Release Notes
                            </Button>
                            <Button size="sm" className="py-1 px-2 ml-3 text-xs">
                              Update Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default SystemSettings;
