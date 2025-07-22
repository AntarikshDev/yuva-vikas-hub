import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, MapPin, Key, Bell, Camera, Save } from "lucide-react";

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: "Rajesh Kumar",
    email: "rajesh.kumar@lnj.com",
    phone: "+91 9876543210",
    designation: "PPC Admin",
    empId: "LNJ-PPC-001",
    assignedRegions: ["Karnataka", "Maharashtra", "Delhi"],
    joiningDate: "2023-01-15"
  });

  const [notifications, setNotifications] = useState({
    emailSOS: true,
    smsDeclarations: false,
    emailReports: true,
    smsPOCUpdates: true,
    emailWelfare: true,
    smsTravel: false
  });

  const assignedRegions = [
    { state: "Karnataka", centers: 5, activeBatches: 8 },
    { state: "Maharashtra", centers: 4, activeBatches: 6 },
    { state: "Delhi", centers: 3, activeBatches: 4 }
  ];

  const recentActivity = [
    { action: "Approved Declaration Letter", item: "Batch X - Bangalore Center", time: "2 hours ago" },
    { action: "Resolved SOS Request", item: "Ravi Kumar - Salary Delay", time: "4 hours ago" },
    { action: "Scheduled POC Visit", item: "Mumbai Hostel Inspection", time: "1 day ago" },
    { action: "Generated Welfare Report", item: "Monthly Post-Placement Report", time: "2 days ago" }
  ];

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">PPC Admin Profile</h1>
          <p className="text-gray-600">Manage your profile and system preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="text-lg bg-purple-100 text-purple-700">
                    {profileData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Button size="sm" variant="outline" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0">
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              
              <h3 className="text-xl font-semibold">{profileData.name}</h3>
              <p className="text-gray-600">{profileData.designation}</p>
              <Badge variant="secondary" className="mt-2">{profileData.empId}</Badge>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{profileData.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{profileData.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{profileData.assignedRegions.join(', ')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="profile-settings" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile-settings">Profile</TabsTrigger>
              <TabsTrigger value="regions">Assigned Regions</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="profile-settings">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="empId">Employee ID</Label>
                      <Input id="empId" value={profileData.empId} disabled />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="designation">Designation</Label>
                      <Input id="designation" value={profileData.designation} disabled />
                    </div>
                    <div>
                      <Label htmlFor="joiningDate">Joining Date</Label>
                      <Input id="joiningDate" value={profileData.joiningDate} disabled />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Key className="w-5 h-5" />
                      Change Password
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" />
                      </div>
                      <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input id="confirmPassword" type="password" />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline">Reset</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="regions">
              <Card>
                <CardHeader>
                  <CardTitle>Assigned Regions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {assignedRegions.map((region, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-lg">{region.state}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {region.centers} Centers • {region.activeBatches} Active Batches
                            </p>
                          </div>
                          <Badge variant="default">{region.activeBatches}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">SOS Alerts</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Email Notifications for SOS</Label>
                          <p className="text-sm text-gray-600">Get immediate email alerts for new SOS requests</p>
                        </div>
                        <Switch 
                          checked={notifications.emailSOS}
                          onCheckedChange={(checked) => setNotifications({...notifications, emailSOS: checked})}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Declaration Updates</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>SMS for Declaration Letters</Label>
                          <p className="text-sm text-gray-600">SMS alerts when declaration letters require verification</p>
                        </div>
                        <Switch 
                          checked={notifications.smsDeclarations}
                          onCheckedChange={(checked) => setNotifications({...notifications, smsDeclarations: checked})}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Reports</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Email Report Delivery</Label>
                          <p className="text-sm text-gray-600">Receive scheduled reports via email</p>
                        </div>
                        <Switch 
                          checked={notifications.emailReports}
                          onCheckedChange={(checked) => setNotifications({...notifications, emailReports: checked})}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">POC Updates</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>SMS for POC Visit Updates</Label>
                          <p className="text-sm text-gray-600">SMS when POC completes visits or reports issues</p>
                        </div>
                        <Switch 
                          checked={notifications.smsPOCUpdates}
                          onCheckedChange={(checked) => setNotifications({...notifications, smsPOCUpdates: checked})}
                        />
                      </div>
                    </div>
                  </div>

                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="p-4 border-l-4 border-purple-500 bg-purple-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{activity.action}</h4>
                            <p className="text-sm text-gray-600">{activity.item}</p>
                          </div>
                          <span className="text-xs text-gray-500">{activity.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;