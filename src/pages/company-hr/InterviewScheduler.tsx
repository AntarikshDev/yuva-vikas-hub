import React, { useState } from 'react';
import { Calendar, Clock, Users, Video, MapPin, Plus, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data
const mockInterviews = [
  {
    id: 1,
    date: "2025-07-22",
    time: "10:00 AM",
    jobRole: "Retail Sales Associate",
    batch: "Batch RSA-001",
    mode: "Offline",
    location: "LNJ Office, Bangalore",
    meetingLink: null,
    panelMembers: ["Rajesh Kumar", "Priya Nair"],
    candidates: ["Ravi Kumar", "Amit Patel"],
    status: "Scheduled"
  },
  {
    id: 2,
    date: "2025-07-23",
    time: "02:00 PM",
    jobRole: "Customer Service Executive",
    batch: "Batch CSE-002",
    mode: "Online",
    location: null,
    meetingLink: "https://meet.google.com/abc-def-ghi",
    panelMembers: ["Suresh Babu", "Meera Devi"],
    candidates: ["Priya Sharma", "Lakshmi Reddy"],
    status: "Scheduled"
  }
];

const mockGuestSessions = [
  {
    id: 1,
    date: "2025-07-21",
    time: "11:00 AM",
    topic: "Retail Excellence Workshop",
    sessionType: "Training",
    trainer: "Expert Trainer",
    contact: "+91 9876543210",
    location: "Training Hall A",
    notes: "Interactive session on customer service excellence"
  },
  {
    id: 2,
    date: "2025-07-24",
    time: "03:00 PM",
    topic: "Industry Insights Session",
    sessionType: "Knowledge Sharing",
    trainer: "Industry Expert",
    contact: "+91 9876543211",
    location: "Conference Room B",
    notes: "Current market trends and opportunities"
  }
];

const InterviewScheduler: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [selectedJobRole, setSelectedJobRole] = useState<string>("");
  const [activeTab, setActiveTab] = useState("interviews");
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [isGuestSessionModalOpen, setIsGuestSessionModalOpen] = useState(false);

  // Interview form state
  const [interviewData, setInterviewData] = useState({
    date: "",
    time: "",
    jobRole: "",
    batch: "",
    mode: "",
    location: "",
    meetingLink: "",
    panelMembers: [""],
    notes: ""
  });

  // Guest session form state
  const [guestSessionData, setGuestSessionData] = useState({
    date: "",
    time: "",
    topic: "",
    sessionType: "",
    trainer: "",
    contact: "",
    location: "",
    notes: ""
  });

  const getModeColor = (mode: string) => {
    return mode === 'Online' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const addPanelMember = () => {
    setInterviewData({
      ...interviewData,
      panelMembers: [...interviewData.panelMembers, ""]
    });
  };

  const updatePanelMember = (index: number, value: string) => {
    const updatedMembers = [...interviewData.panelMembers];
    updatedMembers[index] = value;
    setInterviewData({
      ...interviewData,
      panelMembers: updatedMembers
    });
  };

  const removePanelMember = (index: number) => {
    const updatedMembers = interviewData.panelMembers.filter((_, i) => i !== index);
    setInterviewData({
      ...interviewData,
      panelMembers: updatedMembers
    });
  };

  const resetInterviewForm = () => {
    setInterviewData({
      date: "",
      time: "",
      jobRole: "",
      batch: "",
      mode: "",
      location: "",
      meetingLink: "",
      panelMembers: [""],
      notes: ""
    });
  };

  const resetGuestSessionForm = () => {
    setGuestSessionData({
      date: "",
      time: "",
      topic: "",
      sessionType: "",
      trainer: "",
      contact: "",
      location: "",
      notes: ""
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Interview & Session Scheduler</h1>
          <p className="text-gray-600 mt-1">Schedule interviews and guest sessions for candidates</p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={() => setIsInterviewModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Interview
          </Button>
          <Button variant="outline" onClick={() => setIsGuestSessionModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Plan Guest Session
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger>
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="karnataka">Karnataka</SelectItem>
                <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                <SelectItem value="kerala">Kerala</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedBatch} onValueChange={setSelectedBatch}>
              <SelectTrigger>
                <SelectValue placeholder="Batch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Batch RSA-001">Batch RSA-001</SelectItem>
                <SelectItem value="Batch CSE-002">Batch CSE-002</SelectItem>
                <SelectItem value="Batch DEO-003">Batch DEO-003</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedJobRole} onValueChange={setSelectedJobRole}>
              <SelectTrigger>
                <SelectValue placeholder="Job Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Retail Sales Associate">Retail Sales Associate</SelectItem>
                <SelectItem value="Customer Service Executive">Customer Service Executive</SelectItem>
                <SelectItem value="Data Entry Operator">Data Entry Operator</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => {
              setSelectedState("");
              setSelectedBatch("");
              setSelectedJobRole("");
            }}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Interviews and Guest Sessions */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
          <TabsTrigger value="guest-sessions">Guest Sessions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="interviews">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Scheduled Interviews ({mockInterviews.length})
              </CardTitle>
              <CardDescription>Manage interview schedules and panel members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockInterviews.map((interview) => (
                  <div key={interview.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-4">
                          <h3 className="font-semibold text-lg">{interview.jobRole}</h3>
                          <Badge className={getStatusColor(interview.status)} variant="secondary">
                            {interview.status}
                          </Badge>
                          <Badge className={getModeColor(interview.mode)} variant="secondary">
                            {interview.mode}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span>{interview.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span>{interview.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-500" />
                            <span>{interview.batch}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {interview.mode === 'Online' ? (
                              <Video className="h-4 w-4 text-gray-500" />
                            ) : (
                              <MapPin className="h-4 w-4 text-gray-500" />
                            )}
                            <span>{interview.mode === 'Online' ? 'Online Meeting' : interview.location}</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm"><strong>Panel Members:</strong> {interview.panelMembers.join(", ")}</p>
                          <p className="text-sm"><strong>Candidates:</strong> {interview.candidates.join(", ")}</p>
                          {interview.meetingLink && (
                            <p className="text-sm"><strong>Meeting Link:</strong> 
                              <a href={interview.meetingLink} className="text-blue-600 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                                Join Meeting
                              </a>
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="guest-sessions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Guest Sessions ({mockGuestSessions.length})
              </CardTitle>
              <CardDescription>Manage guest sessions and training workshops</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockGuestSessions.map((session) => (
                  <div key={session.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-4">
                          <h3 className="font-semibold text-lg">{session.topic}</h3>
                          <Badge variant="secondary">{session.sessionType}</Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span>{session.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span>{session.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-500" />
                            <span>{session.trainer}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span>{session.location}</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm"><strong>Contact:</strong> {session.contact}</p>
                          {session.notes && (
                            <p className="text-sm"><strong>Notes:</strong> {session.notes}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Interview Modal */}
      <Dialog open={isInterviewModalOpen} onOpenChange={(open) => {
        setIsInterviewModalOpen(open);
        if (!open) resetInterviewForm();
      }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
            <DialogDescription>
              Set up a new interview session with panel members and candidates
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="interviewDate">Date</Label>
                <Input
                  id="interviewDate"
                  type="date"
                  value={interviewData.date}
                  onChange={(e) => setInterviewData({...interviewData, date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="interviewTime">Time</Label>
                <Input
                  id="interviewTime"
                  type="time"
                  value={interviewData.time}
                  onChange={(e) => setInterviewData({...interviewData, time: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="jobRole">Job Role</Label>
                <Select value={interviewData.jobRole} onValueChange={(value) => setInterviewData({...interviewData, jobRole: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Job Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Retail Sales Associate">Retail Sales Associate</SelectItem>
                    <SelectItem value="Customer Service Executive">Customer Service Executive</SelectItem>
                    <SelectItem value="Data Entry Operator">Data Entry Operator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="batch">Batch</Label>
                <Select value={interviewData.batch} onValueChange={(value) => setInterviewData({...interviewData, batch: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Batch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Batch RSA-001">Batch RSA-001</SelectItem>
                    <SelectItem value="Batch CSE-002">Batch CSE-002</SelectItem>
                    <SelectItem value="Batch DEO-003">Batch DEO-003</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="mode">Interview Mode</Label>
              <Select value={interviewData.mode} onValueChange={(value) => setInterviewData({...interviewData, mode: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="Offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {interviewData.mode === 'Offline' ? (
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Enter interview location"
                  value={interviewData.location}
                  onChange={(e) => setInterviewData({...interviewData, location: e.target.value})}
                />
              </div>
            ) : (
              <div>
                <Label htmlFor="meetingLink">Meeting Link</Label>
                <Input
                  id="meetingLink"
                  placeholder="Enter meeting link"
                  value={interviewData.meetingLink}
                  onChange={(e) => setInterviewData({...interviewData, meetingLink: e.target.value})}
                />
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Panel Members</Label>
                <Button size="sm" variant="outline" onClick={addPanelMember}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Member
                </Button>
              </div>
              <div className="space-y-2">
                {interviewData.panelMembers.map((member, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Enter panel member name and email"
                      value={member}
                      onChange={(e) => updatePanelMember(index, e.target.value)}
                    />
                    {interviewData.panelMembers.length > 1 && (
                      <Button size="sm" variant="outline" onClick={() => removePanelMember(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any additional notes for the interview"
                value={interviewData.notes}
                onChange={(e) => setInterviewData({...interviewData, notes: e.target.value})}
                rows={3}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button className="flex-1" onClick={() => setIsInterviewModalOpen(false)}>
                Schedule Interview
              </Button>
              <Button className="flex-1" variant="outline" onClick={resetInterviewForm}>
                Reset Form
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Guest Session Modal */}
      <Dialog open={isGuestSessionModalOpen} onOpenChange={(open) => {
        setIsGuestSessionModalOpen(open);
        if (!open) resetGuestSessionForm();
      }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Plan Guest Session</DialogTitle>
            <DialogDescription>
              Organize a guest session or training workshop
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sessionDate">Date</Label>
                <Input
                  id="sessionDate"
                  type="date"
                  value={guestSessionData.date}
                  onChange={(e) => setGuestSessionData({...guestSessionData, date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="sessionTime">Time</Label>
                <Input
                  id="sessionTime"
                  type="time"
                  value={guestSessionData.time}
                  onChange={(e) => setGuestSessionData({...guestSessionData, time: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                placeholder="Enter session topic"
                value={guestSessionData.topic}
                onChange={(e) => setGuestSessionData({...guestSessionData, topic: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="sessionType">Session Type</Label>
              <Select value={guestSessionData.sessionType} onValueChange={(value) => setGuestSessionData({...guestSessionData, sessionType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Session Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Training">Training</SelectItem>
                  <SelectItem value="Workshop">Workshop</SelectItem>
                  <SelectItem value="Knowledge Sharing">Knowledge Sharing</SelectItem>
                  <SelectItem value="Industry Insights">Industry Insights</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="trainer">Trainer/Speaker</Label>
                <Input
                  id="trainer"
                  placeholder="Enter trainer name"
                  value={guestSessionData.trainer}
                  onChange={(e) => setGuestSessionData({...guestSessionData, trainer: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="contact">Contact</Label>
                <Input
                  id="contact"
                  placeholder="Enter contact number"
                  value={guestSessionData.contact}
                  onChange={(e) => setGuestSessionData({...guestSessionData, contact: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="sessionLocation">Location</Label>
              <Input
                id="sessionLocation"
                placeholder="Enter session location"
                value={guestSessionData.location}
                onChange={(e) => setGuestSessionData({...guestSessionData, location: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="sessionNotes">Notes</Label>
              <Textarea
                id="sessionNotes"
                placeholder="Session description and additional details"
                value={guestSessionData.notes}
                onChange={(e) => setGuestSessionData({...guestSessionData, notes: e.target.value})}
                rows={3}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button className="flex-1" onClick={() => setIsGuestSessionModalOpen(false)}>
                Plan Session
              </Button>
              <Button className="flex-1" variant="outline" onClick={resetGuestSessionForm}>
                Reset Form
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InterviewScheduler;