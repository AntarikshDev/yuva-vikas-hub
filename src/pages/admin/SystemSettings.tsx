
import React from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, AtSign, Cloud, Bell, Webhook, Key, RefreshCw, Save, Globe, Smartphone } from 'lucide-react';

const SystemSettings = () => {
  return (
    <MainLayout role="super_admin">
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
                  <Button variant="outline" className="gap-1">
                    <RefreshCw className="h-4 w-4" />
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
              <CardContent className="min-h-[300px]">
                <p className="text-center text-muted-foreground py-16">Notification settings interface will be implemented here.</p>
              </CardContent>
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
              <CardContent className="min-h-[300px]">
                <p className="text-center text-muted-foreground py-16">Cloud storage settings interface will be implemented here.</p>
              </CardContent>
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
