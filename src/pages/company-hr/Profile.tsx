import React, { useState } from 'react';
import { User, Building, Mail, Phone, MapPin, Camera, Save, Bell, Shield, Key } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock data
const mockProfileData = {
  companyName: "ABC Company Ltd.",
  hrName: "Rajesh Kumar",
  email: "rajesh.kumar@abccompany.com",
  phone: "+91 9876543210",
  address: "123 Business District, Bangalore, Karnataka",
  website: "www.abccompany.com",
  industryType: "Retail",
  employeeCount: "500-1000",
  profilePhoto: null,
  joinedDate: "2024-01-15"
};

const mockAssignedBatches = [
  {
    id: 1,
    batchName: "Batch RSA-001",
    jobRole: "Retail Sales Associate",
    centre: "LNJ Skills Centre - Bangalore",
    startDate: "2025-07-22",
    candidateCount: 25,
    status: "Active"
  },
  {
    id: 2,
    batchName: "Batch CSE-002",
    jobRole: "Customer Service Executive",
    centre: "LNJ Skills Centre - Chennai",
    startDate: "2025-07-15",
    candidateCount: 30,
    status: "Completed"
  },
  {
    id: 3,
    batchName: "Batch DEO-003",
    jobRole: "Data Entry Operator",
    centre: "LNJ Skills Centre - Hyderabad",
    startDate: "2025-08-01",
    candidateCount: 20,
    status: "Upcoming"
  }
];

const mockJobRoles = [
  { id: 1, role: "Retail Sales Associate", description: "Customer-facing sales position", requirements: "Communication skills, Customer service experience" },
  { id: 2, role: "Customer Service Executive", description: "Handle customer queries and support", requirements: "Communication skills, Problem solving" },
  { id: 3, role: "Data Entry Operator", description: "Data processing and entry tasks", requirements: "Computer literacy, Attention to detail" }
];

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(mockProfileData);
  const [notificationPreferences, setNotificationPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    offerLetterAlerts: true,
    travelPlanAlerts: true,
    feedbackAlerts: true,
    interviewScheduleAlerts: true
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      case 'Upcoming': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleProfileUpdate = () => {
    console.log("Updating profile:", profileData);
    setIsEditing(false);
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match");
      return;
    }
    console.log("Changing password");
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const updateNotificationPreference = (key: string, value: boolean) => {
    setNotificationPreferences({
      ...notificationPreferences,
      [key]: value
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile & Settings</h1>
          <p className="text-gray-600 mt-1">Manage your company profile and preferences</p>
        </div>
      </div>

      {/* Profile Overview Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profileData.profilePhoto || ""} alt={profileData.hrName} />
              <AvatarFallback className="text-2xl">
                {profileData.hrName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">{profileData.hrName}</h2>
              <p className="text-lg text-gray-600">{profileData.companyName}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  <span>{profileData.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  <span>{profileData.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="batches">Assigned Batches</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Company Profile
                  </CardTitle>
                  <CardDescription>Update your company and personal information</CardDescription>
                </div>
                <Button
                  onClick={() => isEditing ? handleProfileUpdate() : setIsEditing(true)}
                  className="flex items-center gap-2"
                >
                  {isEditing ? <Save className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  {isEditing ? 'Save Changes' : 'Edit Profile'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={profileData.companyName}
                      onChange={(e) => setProfileData({...profileData, companyName: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="hrName">HR Name</Label>
                    <Input
                      id="hrName"
                      value={profileData.hrName}
                      onChange={(e) => setProfileData({...profileData, hrName: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={profileData.website}
                      onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="industryType">Industry Type</Label>
                    <Input
                      id="industryType"
                      value={profileData.industryType}
                      onChange={(e) => setProfileData({...profileData, industryType: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="employeeCount">Employee Count</Label>
                    <Input
                      id="employeeCount"
                      value={profileData.employeeCount}
                      onChange={(e) => setProfileData({...profileData, employeeCount: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="profilePhoto">Profile Photo</Label>
                    <Input
                      id="profilePhoto"
                      type="file"
                      accept="image/*"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={profileData.address}
                  onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="batches">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Assigned Batches ({mockAssignedBatches.length})
                </CardTitle>
                <CardDescription>Batches assigned to your company for recruitment</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Batch Name</TableHead>
                      <TableHead>Job Role</TableHead>
                      <TableHead>Centre</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>Candidates</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockAssignedBatches.map((batch) => (
                      <TableRow key={batch.id}>
                        <TableCell className="font-medium">{batch.batchName}</TableCell>
                        <TableCell>{batch.jobRole}</TableCell>
                        <TableCell>{batch.centre}</TableCell>
                        <TableCell>{batch.startDate}</TableCell>
                        <TableCell>{batch.candidateCount}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(batch.status)} variant="secondary">
                            {batch.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Job Roles</CardTitle>
                <CardDescription>Job roles your company recruits for</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockJobRoles.map((jobRole) => (
                    <div key={jobRole.id} className="border rounded-lg p-4">
                      <h3 className="font-semibold text-lg mb-2">{jobRole.role}</h3>
                      <p className="text-gray-600 mb-2">{jobRole.description}</p>
                      <p className="text-sm text-gray-500">
                        <strong>Requirements:</strong> {jobRole.requirements}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">General Notifications</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={notificationPreferences.emailNotifications}
                    onCheckedChange={(checked) => updateNotificationPreference('emailNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsNotifications">SMS Notifications</Label>
                    <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                  </div>
                  <Switch
                    id="smsNotifications"
                    checked={notificationPreferences.smsNotifications}
                    onCheckedChange={(checked) => updateNotificationPreference('smsNotifications', checked)}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Specific Alerts</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="offerLetterAlerts">Offer Letter Alerts</Label>
                    <p className="text-sm text-gray-600">Alerts for pending offer letters</p>
                  </div>
                  <Switch
                    id="offerLetterAlerts"
                    checked={notificationPreferences.offerLetterAlerts}
                    onCheckedChange={(checked) => updateNotificationPreference('offerLetterAlerts', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="travelPlanAlerts">Travel Plan Alerts</Label>
                    <p className="text-sm text-gray-600">Alerts for travel confirmations</p>
                  </div>
                  <Switch
                    id="travelPlanAlerts"
                    checked={notificationPreferences.travelPlanAlerts}
                    onCheckedChange={(checked) => updateNotificationPreference('travelPlanAlerts', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="feedbackAlerts">Feedback Alerts</Label>
                    <p className="text-sm text-gray-600">Alerts for new candidate feedback</p>
                  </div>
                  <Switch
                    id="feedbackAlerts"
                    checked={notificationPreferences.feedbackAlerts}
                    onCheckedChange={(checked) => updateNotificationPreference('feedbackAlerts', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="interviewScheduleAlerts">Interview Schedule Alerts</Label>
                    <p className="text-sm text-gray-600">Alerts for upcoming interviews</p>
                  </div>
                  <Switch
                    id="interviewScheduleAlerts"
                    checked={notificationPreferences.interviewScheduleAlerts}
                    onCheckedChange={(checked) => updateNotificationPreference('interviewScheduleAlerts', checked)}
                  />
                </div>
              </div>
              
              <Button className="w-full">
                Save Notification Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Change Password
                </h3>
                
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  />
                </div>
                
                <Button onClick={handlePasswordChange} className="w-full">
                  Change Password
                </Button>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Account Information</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Member Since:</strong> {profileData.joinedDate}</p>
                  <p><strong>Last Login:</strong> 2025-07-21 10:30 AM</p>
                  <p><strong>Account Type:</strong> Company HR</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;