import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Settings, Bell, Shield, Camera, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProfileSettings = () => {
  const [profileData, setProfileData] = useState({
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@center.gov.in',
    phone: '+91-9876543210',
    designation: 'Centre Manager',
    centerId: 'CM-001',
    centerName: 'Delhi Skill Development Center',
    address: 'Sector 15, Rohini, New Delhi - 110085',
    joiningDate: '2023-01-15',
    experience: '5 years',
    qualifications: 'MBA in Operations Management'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyReports: true,
    placementAlerts: true,
    attendanceAlerts: false,
    documentAlerts: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30',
    loginAlerts: true
  });

  const { toast } = useToast();

  const handleProfileSave = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handleNotificationSave = () => {
    toast({
      title: "Notifications Updated",
      description: "Your notification preferences have been saved successfully.",
    });
  };

  const handleSecuritySave = () => {
    toast({
      title: "Security Settings Updated",
      description: "Your security settings have been updated successfully.",
    });
  };

  const handlePasswordChange = () => {
    toast({
      title: "Password Change Request",
      description: "Password reset link has been sent to your email address.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Profile & Settings</h1>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Picture */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Picture
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                      <img 
                        src="https://randomuser.me/api/portraits/men/32.jpg" 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <Button variant="outline" className="w-full">
                      <Camera className="h-4 w-4 mr-2" />
                      Change Picture
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Candidates</span>
                    <span className="font-medium">245</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Active Batches</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Placements</span>
                    <span className="font-medium">142</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Success Rate</span>
                    <span className="font-medium text-green-600">89%</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Information */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="designation">Designation</Label>
                      <Input
                        id="designation"
                        value={profileData.designation}
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Center Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="centerId">Center ID</Label>
                        <Input
                          id="centerId"
                          value={profileData.centerId}
                          readOnly
                          className="bg-gray-50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="centerName">Center Name</Label>
                        <Input
                          id="centerName"
                          value={profileData.centerName}
                          readOnly
                          className="bg-gray-50"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Center Address</Label>
                      <Textarea
                        id="address"
                        value={profileData.address}
                        onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                        rows={3}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Professional Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="joiningDate">Joining Date</Label>
                        <Input
                          id="joiningDate"
                          type="date"
                          value={profileData.joiningDate}
                          readOnly
                          className="bg-gray-50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="experience">Total Experience</Label>
                        <Input
                          id="experience"
                          value={profileData.experience}
                          onChange={(e) => setProfileData({...profileData, experience: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="qualifications">Qualifications</Label>
                      <Textarea
                        id="qualifications"
                        value={profileData.qualifications}
                        onChange={(e) => setProfileData({...profileData, qualifications: e.target.value})}
                        rows={2}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleProfileSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">General Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, emailNotifications: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sms-notifications">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                    </div>
                    <Switch
                      id="sms-notifications"
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, smsNotifications: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, pushNotifications: checked})
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Alert Types</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="placement-alerts">Placement Alerts</Label>
                      <p className="text-sm text-muted-foreground">Get notified about placement updates</p>
                    </div>
                    <Switch
                      id="placement-alerts"
                      checked={notificationSettings.placementAlerts}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, placementAlerts: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="attendance-alerts">Attendance Alerts</Label>
                      <p className="text-sm text-muted-foreground">Get notified about attendance issues</p>
                    </div>
                    <Switch
                      id="attendance-alerts"
                      checked={notificationSettings.attendanceAlerts}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, attendanceAlerts: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="document-alerts">Document Alerts</Label>
                      <p className="text-sm text-muted-foreground">Get notified about document compliance</p>
                    </div>
                    <Switch
                      id="document-alerts"
                      checked={notificationSettings.documentAlerts}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, documentAlerts: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="weekly-reports">Weekly Reports</Label>
                      <p className="text-sm text-muted-foreground">Receive weekly summary reports</p>
                    </div>
                    <Switch
                      id="weekly-reports"
                      checked={notificationSettings.weeklyReports}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, weeklyReports: checked})
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleNotificationSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Password Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Change Password</Label>
                      <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                    </div>
                    <Button variant="outline" onClick={handlePasswordChange}>
                      Change Password
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="two-factor">Enable 2FA</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    id="two-factor"
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) => 
                      setSecuritySettings({...securitySettings, twoFactorAuth: checked})
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Session Management</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label htmlFor="session-timeout">Session Timeout</Label>
                      <p className="text-sm text-muted-foreground">Automatically log out after inactivity</p>
                    </div>
                    <Select 
                      value={securitySettings.sessionTimeout} 
                      onValueChange={(value) => 
                        setSecuritySettings({...securitySettings, sessionTimeout: value})
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="login-alerts">Login Alerts</Label>
                      <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
                    </div>
                    <Switch
                      id="login-alerts"
                      checked={securitySettings.loginAlerts}
                      onCheckedChange={(checked) => 
                        setSecuritySettings({...securitySettings, loginAlerts: checked})
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSecuritySave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Security Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Application Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Display Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                        <SelectItem value="mr">Marathi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="ist">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ist">India Standard Time (IST)</SelectItem>
                        <SelectItem value="utc">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Data & Privacy</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Usage Analytics</Label>
                      <p className="text-sm text-muted-foreground">Help improve the application by sharing usage data</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-save Forms</Label>
                      <p className="text-sm text-muted-foreground">Automatically save form data as you type</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileSettings;