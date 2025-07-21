import { useState } from "react";
import { Star, MessageSquare, Phone, User, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FeedbackManagement = () => {
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");

  const candidateFeedback = [
    {
      id: 1,
      candidateName: "Ravi Kumar",
      candidateId: "RSD101001",
      attendance: 85,
      behaviourRating: 4,
      participationRating: 5,
      skillsRating: 4,
      comments: "Good participation and willingness to learn",
      lastUpdated: "2025-07-18"
    },
    {
      id: 2,
      candidateName: "Priya Sharma",
      candidateId: "RSD101002",
      attendance: 92,
      behaviourRating: 5,
      participationRating: 5,
      skillsRating: 5,
      comments: "Excellent candidate, shows leadership qualities",
      lastUpdated: "2025-07-17"
    },
    {
      id: 3,
      candidateName: "Amit Singh",
      candidateId: "RSD101003",
      attendance: 78,
      behaviourRating: 3,
      participationRating: 3,
      skillsRating: 3,
      comments: "Needs improvement in attendance and participation",
      lastUpdated: "2025-07-16"
    },
    {
      id: 4,
      candidateName: "Sneha Patel",
      candidateId: "RSD101004",
      attendance: 95,
      behaviourRating: 4,
      participationRating: 4,
      skillsRating: 4,
      comments: "Consistent performer, good technical skills",
      lastUpdated: "2025-07-19"
    }
  ];

  const parentInteractions = [
    {
      id: 1,
      candidateName: "Ravi Kumar",
      parentName: "Mr. Suresh Kumar",
      contactNumber: "+91 98765 43210",
      interactionDate: "2025-07-15",
      interactionType: "Phone Call",
      purpose: "Progress Discussion",
      notes: "Parent satisfied with progress. Discussed attendance concerns.",
      followUp: "Weekly progress updates"
    },
    {
      id: 2,
      candidateName: "Priya Sharma", 
      parentName: "Mrs. Sunita Sharma",
      contactNumber: "+91 98765 43211",
      interactionDate: "2025-07-10",
      interactionType: "In-Person Meeting",
      purpose: "Career Guidance",
      notes: "Discussed career opportunities in retail sector",
      followUp: "Update on placement activities"
    },
    {
      id: 3,
      candidateName: "Amit Singh",
      parentName: "Mr. Rajesh Singh", 
      contactNumber: "+91 98765 43212",
      interactionDate: "2025-07-12",
      interactionType: "Phone Call",
      purpose: "Attendance Issues",
      notes: "Discussed attendance concerns and motivation strategies",
      followUp: "Monitor attendance improvement"
    }
  ];

  const renderStarRating = (rating: number, interactive: boolean = false) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? "fill-yellow-400 text-yellow-400" 
                : "text-gray-300"
            } ${interactive ? "cursor-pointer" : ""}`}
            onClick={() => interactive && setRating(star)}
          />
        ))}
      </div>
    );
  };

  const getPerformanceColor = (rating: number) => {
    if (rating >= 4) return "text-green-600";
    if (rating >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h1 className="text-3xl font-bold">Feedback & Counselling</h1>
        <div className="flex gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <MessageSquare className="h-4 w-4 mr-2" />
                Add Feedback
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Candidate Feedback</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="candidate">Select Candidate</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose candidate" />
                    </SelectTrigger>
                    <SelectContent>
                      {candidateFeedback.map(candidate => (
                        <SelectItem key={candidate.id} value={candidate.id.toString()}>
                          {candidate.candidateName} ({candidate.candidateId})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Behaviour Rating</Label>
                    {renderStarRating(rating, true)}
                  </div>
                  <div>
                    <Label>Participation Rating</Label>
                    {renderStarRating(rating, true)}
                  </div>
                  <div>
                    <Label>Skills Rating</Label>
                    {renderStarRating(rating, true)}
                  </div>
                </div>

                <div>
                  <Label htmlFor="comments">Comments & Feedback</Label>
                  <Textarea 
                    id="comments"
                    placeholder="Provide detailed feedback on candidate's performance..."
                    rows={4}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Feedback</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Record Parent Interaction
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Record Parent Interaction</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="candidate">Select Candidate</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose candidate" />
                      </SelectTrigger>
                      <SelectContent>
                        {candidateFeedback.map(candidate => (
                          <SelectItem key={candidate.id} value={candidate.id.toString()}>
                            {candidate.candidateName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="parent">Parent Name</Label>
                    <Input id="parent" placeholder="Enter parent's name" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact">Contact Number</Label>
                    <Input id="contact" placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div>
                    <Label htmlFor="type">Interaction Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="phone">Phone Call</SelectItem>
                        <SelectItem value="meeting">In-Person Meeting</SelectItem>
                        <SelectItem value="video">Video Call</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Interaction Date</Label>
                    <Input type="date" id="date" />
                  </div>
                  <div>
                    <Label htmlFor="purpose">Purpose</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="progress">Progress Discussion</SelectItem>
                        <SelectItem value="attendance">Attendance Issues</SelectItem>
                        <SelectItem value="career">Career Guidance</SelectItem>
                        <SelectItem value="placement">Placement Support</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Discussion Notes</Label>
                  <Textarea 
                    id="notes"
                    placeholder="Record the key points discussed..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="followup">Follow-up Actions</Label>
                  <Input id="followup" placeholder="Any follow-up required..." />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Interaction</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Feedbacks</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{candidateFeedback.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.0/5</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Parent Interactions</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parentInteractions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="feedback" className="space-y-6">
        <TabsList>
          <TabsTrigger value="feedback">Candidate Feedback</TabsTrigger>
          <TabsTrigger value="interactions">Parent Interactions</TabsTrigger>
        </TabsList>

        <TabsContent value="feedback" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Candidate Performance Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Behaviour</TableHead>
                    <TableHead>Participation</TableHead>
                    <TableHead>Skills</TableHead>
                    <TableHead>Comments</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {candidateFeedback.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{candidate.candidateName}</div>
                          <div className="text-sm text-muted-foreground">{candidate.candidateId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={candidate.attendance >= 80 ? "text-green-600" : "text-red-600"}>
                          {candidate.attendance}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {renderStarRating(candidate.behaviourRating)}
                          <span className={`text-sm ${getPerformanceColor(candidate.behaviourRating)}`}>
                            {candidate.behaviourRating}/5
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {renderStarRating(candidate.participationRating)}
                          <span className={`text-sm ${getPerformanceColor(candidate.participationRating)}`}>
                            {candidate.participationRating}/5
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {renderStarRating(candidate.skillsRating)}
                          <span className={`text-sm ${getPerformanceColor(candidate.skillsRating)}`}>
                            {candidate.skillsRating}/5
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {candidate.comments}
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          Edit Feedback
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Parent Interaction Records</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Parent Details</TableHead>
                    <TableHead>Interaction</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Follow-up</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parentInteractions.map((interaction) => (
                    <TableRow key={interaction.id}>
                      <TableCell>
                        <div className="font-medium">{interaction.candidateName}</div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{interaction.parentName}</div>
                          <div className="text-sm text-muted-foreground">{interaction.contactNumber}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <Badge variant="outline">{interaction.interactionType}</Badge>
                          <div className="text-sm text-muted-foreground mt-1">{interaction.interactionDate}</div>
                        </div>
                      </TableCell>
                      <TableCell>{interaction.purpose}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {interaction.notes}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {interaction.followUp}
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeedbackManagement;