import { useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, BookOpen, Lock, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: "Rajesh Kumar",
    email: "rajesh.kumar@lnj.com",
    phone: "+91 98765 43210",
    employeeId: "TRN001",
    designation: "Senior Trainer",
    department: "Skill Development",
    joinDate: "2023-01-15",
    address: "123 Training Center, Mumbai, Maharashtra",
    bio: "Experienced trainer with 5+ years in retail and customer service training."
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    inApp: true,
    reportDigest: true
  });

  const assignedBatches = [
    {
      id: "RSD-101",
      name: "Retail Sales Development - Batch 101",
      candidates: 25,
      startDate: "2025-06-01",
      endDate: "2025-08-31",
      status: "Active",
      progress: 65
    },
    {
      id: "CSS-102",
      name: "Customer Service Skills - Batch 102", 
      candidates: 20,
      startDate: "2025-07-01",
      endDate: "2025-09-30",
      status: "Active",
      progress: 35
    },
    {
      id: "BFS-100",
      name: "Banking & Financial Services - Batch 100",
      candidates: 22,
      startDate: "2025-05-01", 
      endDate: "2025-07-31",
      status: "Completed",
      progress: 100
    }
  ];

  const curriculum = [
    {
      module: "Retail Sales Fundamentals",
      courses: ["Customer Service", "Product Knowledge", "Sales Techniques"],
      certification: "Level 1 Certified"
    },
    {
      module: "Soft Skills Development",
      courses: ["Communication", "Team Building", "Time Management"],
      certification: "Level 2 Certified"
    },
    {
      module: "Technical Skills",
      courses: ["POS Systems", "Digital Payment", "Inventory Management"],
      certification: "Level 1 Certified"
    }
  ];

  const handleProfileUpdate = () => {
    console.log("Profile updated:", profileData);
  };

  const handleNotificationUpdate = () => {
    console.log("Notifications updated:", notifications);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h1 className="text-3xl font-bold">Profile & Settings</h1>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="batches">Assigned Batches</TabsTrigger>
          <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Picture & Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src="/placeholder.svg" alt="Profile" />
                  <AvatarFallback className="text-2xl">RK</AvatarFallback>
                </Avatar>
                <Button variant="outline">Change Photo</Button>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{profileData.name}</h3>
                  <p className="text-muted-foreground">{profileData.designation}</p>
                  <Badge variant="outline" className="mt-2">
                    {profileData.employeeId}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Profile Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
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
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <Input 
                        id="designation"
                        value={profileData.designation}
                        onChange={(e) => setProfileData({...profileData, designation: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input 
                        id="department"
                        value={profileData.department}
                        onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="joinDate">Join Date</Label>
                      <Input 
                        id="joinDate"
                        type="date"
                        value={profileData.joinDate}
                        onChange={(e) => setProfileData({...profileData, joinDate: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea 
                      id="address"
                      value={profileData.address}
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      rows={3}
                    />
                  </div>

                  <Button onClick={handleProfileUpdate}>
                    Update Profile
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="batches" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Batches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignedBatches.map((batch) => (
                  <Card key={batch.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{batch.name}</h3>
                            <Badge variant={batch.status === "Active" ? "default" : "secondary"}>
                              {batch.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Batch ID: {batch.id} • {batch.candidates} Candidates
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {batch.startDate} to {batch.endDate}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{batch.progress}%</div>
                          <div className="text-sm text-muted-foreground">Progress</div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${batch.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="curriculum" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Curriculum & Certifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {curriculum.map((module, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h3 className="font-semibold">{module.module}</h3>
                          <div className="flex flex-wrap gap-2">
                            {module.courses.map((course, idx) => (
                              <Badge key={idx} variant="outline">
                                {course}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Badge variant="default">
                          {module.certification}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Email Notifications</div>
                    <div className="text-sm text-muted-foreground">Receive updates via email</div>
                  </div>
                  <Switch 
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">SMS Notifications</div>
                    <div className="text-sm text-muted-foreground">Receive updates via SMS</div>
                  </div>
                  <Switch 
                    checked={notifications.sms}
                    onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">In-App Notifications</div>
                    <div className="text-sm text-muted-foreground">Show notifications in the app</div>
                  </div>
                  <Switch 
                    checked={notifications.inApp}
                    onCheckedChange={(checked) => setNotifications({...notifications, inApp: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Weekly Report Digest</div>
                    <div className="text-sm text-muted-foreground">Weekly summary of activities</div>
                  </div>
                  <Switch 
                    checked={notifications.reportDigest}
                    onCheckedChange={(checked) => setNotifications({...notifications, reportDigest: checked})}
                  />
                </div>

                <Button onClick={handleNotificationUpdate}>
                  Save Preferences
                </Button>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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

                <Button>
                  Change Password
                </Button>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Add an extra layer of security to your account
                  </p>
                  <Button variant="outline">
                    Enable 2FA
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;