import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, MapPin, Phone, Mail, Calendar, Settings, Bell, Shield, Camera } from "lucide-react";

const Profile = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [sosAlerts, setSosAlerts] = useState(true);
  const [visitReminders, setVisitReminders] = useState(true);

  const profileData = {
    name: "Rajesh Verma",
    pocId: "POC001",
    contactNumber: "+91 9876543210",
    email: "rajesh.verma@lnj.com",
    state: "Karnataka",
    joiningDate: "2025-01-15",
    assignedBatches: 3,
    photo: "/placeholder.svg"
  };

  const assignedBatches = [
    {
      batchName: "Batch X",
      company: "TechCorp India",
      location: "Bangalore",
      candidateCount: 15,
      assignedDate: "2025-06-01",
      status: "Active"
    },
    {
      batchName: "Batch Y",
      company: "RetailMax Ltd",
      location: "Bangalore",
      candidateCount: 20,
      assignedDate: "2025-06-15",
      status: "Active"
    },
    {
      batchName: "Batch A",
      company: "ServicePro Pvt",
      location: "Mysore",
      candidateCount: 12,
      assignedDate: "2025-07-01",
      status: "Active"
    }
  ];

  const performanceStats = [
    { label: "Total Visits Completed", value: 45, trend: "+12%" },
    { label: "SOS Resolved", value: 23, trend: "+8%" },
    { label: "Travel Plans Facilitated", value: 8, trend: "+15%" },
    { label: "Welfare Reports Submitted", value: 18, trend: "+5%" }
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gradient-to-br from-slate-50 to-purple-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Profile & Settings</h1>
          <p className="text-gray-600">Manage your profile and notification preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profileData.photo} alt={profileData.name} />
                    <AvatarFallback className="text-2xl">
                      {profileData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Button size="sm" variant="outline" className="absolute -bottom-2 -right-2">
                    <Camera className="w-3 h-3" />
                  </Button>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{profileData.name}</h3>
                  <p className="text-gray-600">POC ID: {profileData.pocId}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="default">Active POC</Badge>
                    <Badge variant="outline">{profileData.assignedBatches} Batches Assigned</Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <Input defaultValue={profileData.name} />
                </div>
                <div>
                  <Label>POC ID</Label>
                  <Input defaultValue={profileData.pocId} disabled />
                </div>
                <div>
                  <Label>Contact Number</Label>
                  <Input defaultValue={profileData.contactNumber} />
                </div>
                <div>
                  <Label>Email Address</Label>
                  <Input defaultValue={profileData.email} />
                </div>
                <div>
                  <Label>Assigned State</Label>
                  <Input defaultValue={profileData.state} disabled />
                </div>
                <div>
                  <Label>Joining Date</Label>
                  <Input defaultValue={profileData.joiningDate} disabled />
                </div>
              </div>

              <Button className="bg-purple-600 hover:bg-purple-700">
                Update Profile
              </Button>
            </CardContent>
          </Card>

          {/* Assigned Batches */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Assigned Batches & Regions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Batch Name</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Candidates</TableHead>
                      <TableHead>Assigned Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignedBatches.map((batch, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{batch.batchName}</TableCell>
                        <TableCell>{batch.company}</TableCell>
                        <TableCell>{batch.location}</TableCell>
                        <TableCell>{batch.candidateCount}</TableCell>
                        <TableCell>{batch.assignedDate}</TableCell>
                        <TableCell>
                          <Badge variant="default">{batch.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Current Password</Label>
                <Input type="password" placeholder="Enter current password" />
              </div>
              <div>
                <Label>New Password</Label>
                <Input type="password" placeholder="Enter new password" />
              </div>
              <div>
                <Label>Confirm New Password</Label>
                <Input type="password" placeholder="Confirm new password" />
              </div>
              <Button variant="outline">
                Update Password
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Performance Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Performance This Month
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {performanceStats.map((stat, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-lg font-semibold">{stat.value}</p>
                  </div>
                  <Badge variant="outline" className="text-green-600">
                    {stat.trend}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive updates via email</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-gray-500">Receive updates via SMS</p>
                </div>
                <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">SOS Alerts</p>
                  <p className="text-sm text-gray-500">Instant SOS notifications</p>
                </div>
                <Switch checked={sosAlerts} onCheckedChange={setSosAlerts} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Visit Reminders</p>
                  <p className="text-sm text-gray-500">Scheduled visit notifications</p>
                </div>
                <Switch checked={visitReminders} onCheckedChange={setVisitReminders} />
              </div>

              <Button variant="outline" className="w-full">
                Save Preferences
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Phone className="w-4 h-4 mr-2" />
                Emergency Contacts
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="w-4 h-4 mr-2" />
                Support Center
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                App Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;