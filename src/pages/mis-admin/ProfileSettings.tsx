import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Settings, Bell, Shield, Key, Mail, Smartphone, Save, Edit } from 'lucide-react';

const ProfileSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  // Mock user profile data
  const [profileData, setProfileData] = useState({
    name: 'Admin User',
    email: 'admin@lnjskill.org',
    phone: '+91-9876543210',
    role: 'MIS Administrator',
    department: 'Information Technology',
    employeeId: 'EMP-001',
    joinDate: '2024-01-15',
    lastLogin: '2025-07-18 10:30:00'
  });

  // Mock notification preferences
  const [notificationPrefs, setNotificationPrefs] = useState({
    emailAlerts: true,
    smsAlerts: false,
    inAppNotifications: true,
    reportDigests: true,
    systemMaintenance: true,
    securityAlerts: true,
    weeklyReports: false,
    monthlyReports: true
  });

  // Mock security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    passwordExpiry: 90,
    sessionTimeout: 30,
    allowMultipleSessions: false,
    requirePasswordChange: false
  });

  const handleProfileSave = () => {
    setIsEditing(false);
    // Here you would normally save to backend
    console.log('Profile saved:', profileData);
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotificationPrefs(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSecurityChange = (key: string, value: boolean | number) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <User className="h-8 w-8" />
          Profile & Settings
        </h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        {/* Profile Information Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Profile Information</span>
                <Button
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => isEditing ? handleProfileSave() : setIsEditing(true)}
                  className="flex items-center gap-2"
                >
                  {isEditing ? (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Picture Section */}
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src="/placeholder.svg" alt="Profile" />
                    <AvatarFallback className="text-2xl">AU</AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button variant="outline" size="sm">
                      Change Photo
                    </Button>
                  )}
                  <div className="text-center">
                    <h3 className="font-semibold text-lg">{profileData.name}</h3>
                    <p className="text-muted-foreground">{profileData.role}</p>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="col-span-2 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Full Name</Label>
                      <Input
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label>Employee ID</Label>
                      <Input value={profileData.employeeId} disabled className="bg-gray-50" />
                    </div>
                    <div>
                      <Label>Email Address</Label>
                      <Input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label>Phone Number</Label>
                      <Input
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label>Role</Label>
                      <Input value={profileData.role} disabled className="bg-gray-50" />
                    </div>
                    <div>
                      <Label>Department</Label>
                      <Input
                        value={profileData.department}
                        onChange={(e) => setProfileData(prev => ({ ...prev, department: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label>Join Date</Label>
                      <Input value={profileData.joinDate} disabled className="bg-gray-50" />
                    </div>
                    <div>
                      <Label>Last Login</Label>
                      <Input value={profileData.lastLogin} disabled className="bg-gray-50" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Alert Notifications */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Alert Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <Label className="text-base">Email Alerts</Label>
                          <p className="text-sm text-muted-foreground">Receive important alerts via email</p>
                        </div>
                      </div>
                      <Switch
                        checked={notificationPrefs.emailAlerts}
                        onCheckedChange={(checked) => handleNotificationChange('emailAlerts', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <Label className="text-base">SMS Alerts</Label>
                          <p className="text-sm text-muted-foreground">Receive critical alerts via SMS</p>
                        </div>
                      </div>
                      <Switch
                        checked={notificationPrefs.smsAlerts}
                        onCheckedChange={(checked) => handleNotificationChange('smsAlerts', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Bell className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <Label className="text-base">In-App Notifications</Label>
                          <p className="text-sm text-muted-foreground">Show notifications in the application</p>
                        </div>
                      </div>
                      <Switch
                        checked={notificationPrefs.inAppNotifications}
                        onCheckedChange={(checked) => handleNotificationChange('inAppNotifications', checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* System Notifications */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">System Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Security Alerts</Label>
                        <p className="text-sm text-muted-foreground">Login attempts, security breaches</p>
                      </div>
                      <Switch
                        checked={notificationPrefs.securityAlerts}
                        onCheckedChange={(checked) => handleNotificationChange('securityAlerts', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">System Maintenance</Label>
                        <p className="text-sm text-muted-foreground">Scheduled maintenance notifications</p>
                      </div>
                      <Switch
                        checked={notificationPrefs.systemMaintenance}
                        onCheckedChange={(checked) => handleNotificationChange('systemMaintenance', checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Report Notifications */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Report Digests</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Weekly Reports</Label>
                        <p className="text-sm text-muted-foreground">Weekly system activity digest</p>
                      </div>
                      <Switch
                        checked={notificationPrefs.weeklyReports}
                        onCheckedChange={(checked) => handleNotificationChange('weeklyReports', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Monthly Reports</Label>
                        <p className="text-sm text-muted-foreground">Monthly compliance and performance reports</p>
                      </div>
                      <Switch
                        checked={notificationPrefs.monthlyReports}
                        onCheckedChange={(checked) => handleNotificationChange('monthlyReports', checked)}
                      />
                    </div>
                  </div>
                </div>

                <Button className="w-full">Save Notification Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Password Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Password & Authentication</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                      <Switch
                        checked={securitySettings.twoFactorEnabled}
                        onCheckedChange={(checked) => handleSecurityChange('twoFactorEnabled', checked)}
                      />
                    </div>
                    <div>
                      <Label>Password Expiry (days)</Label>
                      <Input
                        type="number"
                        value={securitySettings.passwordExpiry}
                        onChange={(e) => handleSecurityChange('passwordExpiry', parseInt(e.target.value))}
                        className="w-32"
                      />
                    </div>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      Change Password
                    </Button>
                  </div>
                </div>

                {/* Session Management */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Session Management</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Session Timeout (minutes)</Label>
                      <Input
                        type="number"
                        value={securitySettings.sessionTimeout}
                        onChange={(e) => handleSecurityChange('sessionTimeout', parseInt(e.target.value))}
                        className="w-32"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Allow Multiple Sessions</Label>
                        <p className="text-sm text-muted-foreground">Allow login from multiple devices simultaneously</p>
                      </div>
                      <Switch
                        checked={securitySettings.allowMultipleSessions}
                        onCheckedChange={(checked) => handleSecurityChange('allowMultipleSessions', checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Account Security */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Account Security</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Require Password Change</Label>
                        <p className="text-sm text-muted-foreground">Force password change on next login</p>
                      </div>
                      <Switch
                        checked={securitySettings.requirePasswordChange}
                        onCheckedChange={(checked) => handleSecurityChange('requirePasswordChange', checked)}
                      />
                    </div>
                    <Button variant="outline" className="w-full">
                      View Active Sessions
                    </Button>
                  </div>
                </div>

                <Button className="w-full">Save Security Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Application Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Dashboard Preferences */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Dashboard Preferences</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Default Dashboard View</Label>
                      <select className="w-full p-2 border rounded-md">
                        <option>System Overview</option>
                        <option>User Activity</option>
                        <option>Reports Summary</option>
                      </select>
                    </div>
                    <div>
                      <Label>Refresh Interval (minutes)</Label>
                      <Input type="number" defaultValue="5" className="w-32" />
                    </div>
                  </div>
                </div>

                {/* Data Display */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Data Display</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Records per Page</Label>
                      <select className="w-full p-2 border rounded-md">
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                        <option>100</option>
                      </select>
                    </div>
                    <div>
                      <Label>Date Format</Label>
                      <select className="w-full p-2 border rounded-md">
                        <option>DD/MM/YYYY</option>
                        <option>MM/DD/YYYY</option>
                        <option>YYYY-MM-DD</option>
                      </select>
                    </div>
                    <div>
                      <Label>Time Zone</Label>
                      <select className="w-full p-2 border rounded-md">
                        <option>Asia/Kolkata (IST)</option>
                        <option>UTC</option>
                        <option>America/New_York</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Language & Region */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Language & Region</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Language</Label>
                      <select className="w-full p-2 border rounded-md">
                        <option>English</option>
                        <option>Hindi</option>
                        <option>Marathi</option>
                      </select>
                    </div>
                    <div>
                      <Label>Number Format</Label>
                      <select className="w-full p-2 border rounded-md">
                        <option>1,234.56 (International)</option>
                        <option>1,23,456.78 (Indian)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <Button className="w-full">Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileSettings;