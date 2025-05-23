
import React from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Search, Upload, Play, Eye, Tag, Info } from 'lucide-react';

const VideoLogManager = () => {
  // Dummy data for videos
  const videos = [
    { 
      id: 1, 
      title: 'Introduction to Customer Service', 
      jobRole: 'Customer Service Executive',
      duration: '08:45',
      uploadDate: '2023-10-05',
      views: 342,
      completionRate: 78
    },
    { 
      id: 2, 
      title: 'Field Sales Techniques', 
      jobRole: 'Field Sales Executive',
      duration: '12:30',
      uploadDate: '2023-09-18',
      views: 256,
      completionRate: 65
    },
    { 
      id: 3, 
      title: 'Healthcare Basics Training', 
      jobRole: 'General Duty Assistant',
      duration: '15:20',
      uploadDate: '2023-10-22',
      views: 189,
      completionRate: 82
    },
    { 
      id: 4, 
      title: 'Customer Interaction Skills', 
      jobRole: 'BPO Voice',
      duration: '10:15',
      uploadDate: '2023-11-01',
      views: 210,
      completionRate: 70
    },
    { 
      id: 5, 
      title: 'Retail Display Techniques', 
      jobRole: 'Retail Sales Associate',
      duration: '07:50',
      uploadDate: '2023-09-30',
      views: 175,
      completionRate: 60
    },
  ];

  return (
    <MainLayout role="super_admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Video Log Manager</h1>
            <p className="text-muted-foreground">
              Manage counselling videos and track candidate viewing progress.
            </p>
          </div>
          <Button className="gap-2">
            <Upload className="h-4 w-4" />
            Upload Video
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-blue-800">Total Videos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-700">24</div>
              <p className="text-sm text-blue-600 mt-1">Across all job roles</p>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-purple-800">Total Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-purple-700">3,842</div>
              <p className="text-sm text-purple-600 mt-1">By all candidates</p>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-green-800">Average Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-700">72%</div>
              <p className="text-sm text-green-600 mt-1">Across all videos</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>Video Library</CardTitle>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input className="pl-8 w-full sm:w-[250px]" placeholder="Search videos..." />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>All counselling and training videos</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Job Role</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Completion Rate</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {videos.map((video) => (
                  <TableRow key={video.id}>
                    <TableCell className="font-medium">{video.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{video.jobRole}</Badge>
                    </TableCell>
                    <TableCell>{video.duration}</TableCell>
                    <TableCell>{video.uploadDate}</TableCell>
                    <TableCell>{video.views}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Progress value={video.completionRate} className="h-2" />
                        <span className="text-xs text-gray-500">{video.completionRate}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Play className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Tag className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Video Viewing Analytics</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <div className="text-center">
              <Info className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-muted-foreground">Detailed video viewing analytics will be displayed here.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default VideoLogManager;
