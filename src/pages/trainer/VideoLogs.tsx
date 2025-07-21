import { useState } from "react";
import { Upload, Play, FileText, Calendar, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const VideoLogs = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const videoLogs = [
    {
      id: 1,
      sessionName: "Retail Sales – Customer Service Basics",
      date: "2025-07-15",
      status: "uploaded",
      fileSize: "245 MB",
      remarks: "Good participation from candidates",
      uploadDate: "2025-07-15"
    },
    {
      id: 2,
      sessionName: "Soft Skills – Communication Training",
      date: "2025-07-16",
      status: "uploaded", 
      fileSize: "312 MB",
      remarks: "Interactive session with role-play exercises",
      uploadDate: "2025-07-16"
    },
    {
      id: 3,
      sessionName: "Retail Sales – Product Knowledge",
      date: "2025-07-17",
      status: "not_uploaded",
      fileSize: "-",
      remarks: "",
      uploadDate: "-"
    },
    {
      id: 4,
      sessionName: "Technical Skills – POS System Training",
      date: "2025-07-18",
      status: "not_uploaded",
      fileSize: "-", 
      remarks: "",
      uploadDate: "-"
    },
    {
      id: 5,
      sessionName: "Retail Sales – Sales Techniques",
      date: "2025-07-19",
      status: "pending",
      fileSize: "189 MB",
      remarks: "Upload in progress",
      uploadDate: "-"
    }
  ];

  const upcomingSessions = [
    {
      id: 6,
      sessionName: "Soft Skills – Team Building",
      date: "2025-07-20",
      time: "10:00 AM"
    },
    {
      id: 7,
      sessionName: "Retail Sales – Handling Objections", 
      date: "2025-07-21",
      time: "2:00 PM"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "uploaded": return "default";
      case "pending": return "secondary";
      default: return "destructive";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "uploaded": return "Uploaded";
      case "pending": return "Pending"; 
      default: return "Not Uploaded";
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h1 className="text-3xl font-bold">Video Logs & Upload</h1>
        <div className="flex gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="uploaded">Uploaded</SelectItem>
              <SelectItem value="not_uploaded">Not Uploaded</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload Video Log
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Upload Video Log</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="session">Select Session</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose session" />
                      </SelectTrigger>
                      <SelectContent>
                        {videoLogs
                          .filter(log => log.status === "not_uploaded")
                          .map(log => (
                            <SelectItem key={log.id} value={log.id.toString()}>
                              {log.sessionName}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="date">Session Date</Label>
                    <Input type="date" id="date" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="video">Video File (Max 500 MB)</Label>
                  <Input 
                    type="file" 
                    id="video" 
                    accept="video/mp4,video/avi,video/mov"
                    onChange={handleFileSelect}
                    className="mt-1"
                  />
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Selected: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="comments">Comments/Remarks</Label>
                  <Textarea 
                    id="comments" 
                    placeholder="Add any notes about the session..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button disabled={!selectedFile}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Video
                  </Button>
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
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{videoLogs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Videos Uploaded</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {videoLogs.filter(log => log.status === "uploaded").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Uploads</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {videoLogs.filter(log => log.status === "not_uploaded").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upload Rate</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((videoLogs.filter(log => log.status === "uploaded").length / videoLogs.length) * 100)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Video Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Session Video Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Session Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>File Size</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videoLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.sessionName}</TableCell>
                  <TableCell>{log.date}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(log.status)}>
                      {getStatusText(log.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{log.fileSize}</TableCell>
                  <TableCell>{log.uploadDate}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {log.remarks || "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {log.status === "uploaded" ? (
                        <Button size="sm" variant="outline">
                          <Play className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline">
                          <Upload className="h-4 w-4 mr-1" />
                          Upload
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Upcoming Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Sessions to Record</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{session.sessionName}</div>
                  <div className="text-sm text-muted-foreground">
                    {session.date} at {session.time}
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Set Reminder
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoLogs;