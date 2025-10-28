import { useState } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, MapPin, Lock, Bell, Database, Activity, FileText } from "lucide-react";

export default function MISProfile() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "MIS Administrator",
    email: "mis@example.com",
    phone: "+1 234 567 8901",
    employeeId: "MIS001",
    department: "Management Information Systems",
    designation: "MIS Administrator",
    address: "456 Data Center Avenue, City",
    bio: "MIS Administrator responsible for data management, reporting, and system analytics.",
    joinDate: "2023-02-01",
    specialization: "Data Analytics & Reporting"
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: true,
    dataAlerts: true,
    reportGeneration: true,
    systemUpdates: true,
    auditAlerts: true
  });

  const [dataSettings, setDataSettings] = useState({
    autoBackup: true,
    dataRetention: "90",
    reportSchedule: "daily",
    auditLogging: true
  });

  const handleProfileUpdate = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    });
    setIsEditing(false);
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Password Changed",
      description: "Your password has been changed successfully.",
    });
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleNotificationUpdate = () => {
    toast({
      title: "Notifications Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const handleDataSettingsUpdate = () => {
    toast({
      title: "Data Settings Updated",
      description: "Your data management settings have been updated.",
    });
  };

  return (
    <MainLayout role="mis" title="Profile">
      <div className="space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="text-2xl">
                  {profileData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{profileData.name}</h2>
                <p className="text-muted-foreground">{profileData.designation}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">{profileData.specialization}</Badge>
                  <Badge variant="outline">ID: {profileData.employeeId}</Badge>
                </div>
              </div>
              <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different sections */}
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="data-settings">Data Settings</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details and professional information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="flex gap-2">
                      <User className="h-4 w-4 mt-3 text-muted-foreground" />
                      <Input
                        id="name"
                        value={profileData.name}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex gap-2">
                      <Mail className="h-4 w-4 mt-3 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <div className="flex gap-2">
                      <Phone className="h-4 w-4 mt-3 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={profileData.phone}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input
                      id="specialization"
                      value={profileData.specialization}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData({ ...profileData, specialization: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="flex gap-2">
                    <MapPin className="h-4 w-4 mt-3 text-muted-foreground" />
                    <Input
                      id="address"
                      value={profileData.address}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    disabled={!isEditing}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    rows={4}
                  />
                </div>
                {isEditing && (
                  <Button onClick={handleProfileUpdate}>Save Changes</Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive critical alerts via SMS</p>
                  </div>
                  <Switch
                    checked={notifications.smsNotifications}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, smsNotifications: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Data Alerts</Label>
                    <p className="text-sm text-muted-foreground">Notifications about data anomalies</p>
                  </div>
                  <Switch
                    checked={notifications.dataAlerts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, dataAlerts: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Report Generation</Label>
                    <p className="text-sm text-muted-foreground">Get notified when reports are ready</p>
                  </div>
                  <Switch
                    checked={notifications.reportGeneration}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, reportGeneration: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>System Updates</Label>
                    <p className="text-sm text-muted-foreground">MIS system update notifications</p>
                  </div>
                  <Switch
                    checked={notifications.systemUpdates}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, systemUpdates: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Audit Alerts</Label>
                    <p className="text-sm text-muted-foreground">Compliance and audit notifications</p>
                  </div>
                  <Switch
                    checked={notifications.auditAlerts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, auditAlerts: checked })}
                  />
                </div>
                <Button onClick={handleNotificationUpdate}>Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password regularly for better security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="flex gap-2">
                    <Lock className="h-4 w-4 mt-3 text-muted-foreground" />
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="flex gap-2">
                    <Lock className="h-4 w-4 mt-3 text-muted-foreground" />
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="flex gap-2">
                    <Lock className="h-4 w-4 mt-3 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={handlePasswordChange}>Change Password</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Settings Tab */}
          <TabsContent value="data-settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Data Management Settings</CardTitle>
                <CardDescription>Configure data backup, retention, and reporting preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Automatic Backup</Label>
                    <p className="text-sm text-muted-foreground">Enable automatic data backups</p>
                  </div>
                  <Switch
                    checked={dataSettings.autoBackup}
                    onCheckedChange={(checked) => setDataSettings({ ...dataSettings, autoBackup: checked })}
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="dataRetention">Data Retention Period (days)</Label>
                  <Input
                    id="dataRetention"
                    type="number"
                    value={dataSettings.dataRetention}
                    onChange={(e) => setDataSettings({ ...dataSettings, dataRetention: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reportSchedule">Report Schedule</Label>
                  <select
                    id="reportSchedule"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={dataSettings.reportSchedule}
                    onChange={(e) => setDataSettings({ ...dataSettings, reportSchedule: e.target.value })}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Audit Logging</Label>
                    <p className="text-sm text-muted-foreground">Track all data access and changes</p>
                  </div>
                  <Switch
                    checked={dataSettings.auditLogging}
                    onCheckedChange={(checked) => setDataSettings({ ...dataSettings, auditLogging: checked })}
                  />
                </div>
                <Button onClick={handleDataSettingsUpdate}>Save Data Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent data operations and system events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: "Generated monthly report", time: "1 hour ago", icon: FileText },
                    { action: "Executed data backup", time: "3 hours ago", icon: Database },
                    { action: "Updated data retention policy", time: "1 day ago", icon: Activity },
                    { action: "Reviewed audit logs", time: "2 days ago", icon: FileText },
                    { action: "Exported analytics data", time: "3 days ago", icon: Database }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                      <activity.icon className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
