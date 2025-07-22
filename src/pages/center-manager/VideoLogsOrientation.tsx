import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Play, Upload, FileVideo, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VideoLogsOrientation = () => {
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const { toast } = useToast();

  // Mock data for video logs
  const videoLogs = [
    {
      id: 'V-001',
      title: 'Module 1: Computer Basics',
      batch: 'DDU-GKY-B5',
      duration: '45 mins',
      uploadDate: '2024-01-10',
      status: 'approved',
      trainer: 'Mr. Rajesh Kumar',
      viewCount: 28,
      completion: 85
    },
    {
      id: 'V-002',
      title: 'Module 2: Data Entry Techniques',
      batch: 'DDU-GKY-B5',
      duration: '30 mins',
      uploadDate: '2024-01-12',
      status: 'pending',
      trainer: 'Ms. Priya Sharma',
      viewCount: 22,
      completion: 68
    },
    {
      id: 'V-003',
      title: 'Module 3: Excel Fundamentals',
      batch: 'DDU-GKY-B6',
      duration: '60 mins',
      uploadDate: '2024-01-15',
      status: 'rejected',
      trainer: 'Mr. Amit Singh',
      viewCount: 15,
      completion: 42
    }
  ];

  // Mock data for orientation sessions
  const orientationSessions = [
    {
      id: 'O-001',
      title: 'Pre-Placement Orientation',
      batch: 'DDU-GKY-B5',
      date: '2024-01-20',
      facilitator: 'PPC Team',
      status: 'completed',
      attendees: 28,
      totalCandidates: 30
    },
    {
      id: 'O-002',
      title: 'Industry Readiness Session',
      batch: 'DDU-GKY-B6',
      date: '2024-01-22',
      facilitator: 'HR Team',
      status: 'scheduled',
      attendees: 0,
      totalCandidates: 25
    }
  ];

  const batches = [
    { id: 'all', name: 'All Batches' },
    { id: 'DDU-GKY-B5', name: 'DDU-GKY Batch 5' },
    { id: 'DDU-GKY-B6', name: 'DDU-GKY Batch 6' },
    { id: 'DDU-GKY-B7', name: 'DDU-GKY Batch 7' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleVideoAction = (action: 'approve' | 'reject') => {
    toast({
      title: `Video ${action}d`,
      description: `${selectedVideo?.title} has been ${action}d.`,
    });
    setIsVideoModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Video Logs & Orientation</h1>
        
        <div className="flex gap-3">
          <Select value={selectedBatch} onValueChange={setSelectedBatch}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by Batch" />
            </SelectTrigger>
            <SelectContent>
              {batches.map((batch) => (
                <SelectItem key={batch.id} value={batch.id}>
                  {batch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload Video
          </Button>
        </div>
      </div>

      {/* Video Logs Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileVideo className="h-5 w-5" />
            Training Video Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Video Title</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Trainer</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Completion %</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videoLogs.map((video) => (
                <TableRow key={video.id}>
                  <TableCell className="font-medium">{video.title}</TableCell>
                  <TableCell>{video.batch}</TableCell>
                  <TableCell>{video.duration}</TableCell>
                  <TableCell>{video.uploadDate}</TableCell>
                  <TableCell>{video.trainer}</TableCell>
                  <TableCell>{video.viewCount}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={video.completion} className="w-16" />
                      <span className="text-sm">{video.completion}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(video.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedVideo(video);
                          setIsVideoModalOpen(true);
                        }}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Orientation Sessions Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Orientation Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground">
              Track pre-placement orientation sessions
            </p>
            <Button>
              Schedule Orientation
            </Button>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Session Title</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Facilitator</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orientationSessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">{session.title}</TableCell>
                  <TableCell>{session.batch}</TableCell>
                  <TableCell>{session.date}</TableCell>
                  <TableCell>{session.facilitator}</TableCell>
                  <TableCell>{session.attendees}/{session.totalCandidates}</TableCell>
                  <TableCell>{getStatusBadge(session.status)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Video Review Modal */}
      <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Video Review - {selectedVideo?.title}</DialogTitle>
          </DialogHeader>
          
          {selectedVideo && (
            <div className="space-y-4">
              <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                <Play className="h-16 w-16 text-white" />
                <span className="ml-2 text-white">Video Player Placeholder</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p><strong>Trainer:</strong> {selectedVideo.trainer}</p>
                  <p><strong>Duration:</strong> {selectedVideo.duration}</p>
                  <p><strong>Upload Date:</strong> {selectedVideo.uploadDate}</p>
                </div>
                <div>
                  <p><strong>Views:</strong> {selectedVideo.viewCount}</p>
                  <p><strong>Completion Rate:</strong> {selectedVideo.completion}%</p>
                  <p><strong>Status:</strong> {selectedVideo.status}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Review Comments</label>
                <Textarea placeholder="Add review comments..." rows={3} />
              </div>
              
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsVideoModalOpen(false)}>
                  Close
                </Button>
                <Button variant="destructive" onClick={() => handleVideoAction('reject')}>
                  Reject
                </Button>
                <Button onClick={() => handleVideoAction('approve')}>
                  Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VideoLogsOrientation;