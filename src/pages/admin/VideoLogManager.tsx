
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Search, Upload, Play, Eye, Tag, Info, Video } from 'lucide-react';
import { VideoUploadDialog, VideoData } from '@/components/dialogs/VideoUploadDialog';
import { VideoPlayerDialog } from '@/components/dialogs/VideoPlayerDialog';
import { TagsManagementDialog } from '@/components/dialogs/TagsManagementDialog';
import { MasterDataActionDialog } from '@/components/dialogs/MasterDataActionDialog';
import { useToast } from '@/hooks/use-toast';

// Mock video analytics data for the chart
const analyticsData = [
  { name: 'Customer Service', views: 342, completionRate: 78 },
  { name: 'Field Sales', views: 256, completionRate: 65 },
  { name: 'Healthcare', views: 189, completionRate: 82 },
  { name: 'BPO Voice', views: 210, completionRate: 70 },
  { name: 'Retail Sales', views: 175, completionRate: 60 },
];

const VideoLogManager = () => {
  const { toast } = useToast();
  // Dialogs state
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [playerDialogOpen, setPlayerDialogOpen] = useState(false);
  const [tagsDialogOpen, setTagsDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  
  // Current video state
  const [currentVideo, setCurrentVideo] = useState<{
    id: number;
    title: string;
    url: string;
    tags: string[];
  }>({
    id: 0,
    title: '',
    url: '',
    tags: []
  });
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Dummy data for videos
  const [videos, setVideos] = useState([
    { 
      id: 1, 
      title: 'Introduction to Customer Service', 
      jobRole: 'Customer Service Executive',
      duration: '08:45',
      uploadDate: '2023-10-05',
      views: 342,
      completionRate: 78,
      status: 'active',
      url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
      tags: ['customer service', 'introduction', 'training'],
      lang: 'English',
    },
    { 
      id: 2, 
      title: 'Field Sales Techniques', 
      jobRole: 'Field Sales Executive',
      duration: '12:30',
      uploadDate: '2023-09-18',
      views: 256,
      completionRate: 65,
      status: 'active',
      url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
      tags: ['sales', 'field work'],
      lang: 'Hindi',
    },
    { 
      id: 3, 
      title: 'Healthcare Basics Training', 
      jobRole: 'General Duty Assistant',
      duration: '15:20',
      uploadDate: '2023-10-22',
      views: 189,
      completionRate: 82,
      status: 'active',
      url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
      tags: ['healthcare', 'basics'],
      lang: 'English',
    },
    { 
      id: 4, 
      title: 'Customer Interaction Skills', 
      jobRole: 'BPO Voice',
      duration: '10:15',
      uploadDate: '2023-11-01',
      views: 210,
      completionRate: 70,
      status: 'inactive',
      url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
      tags: ['customer service', 'interaction', 'communication'],
      lang: 'English',
    },
    { 
      id: 5, 
      title: 'Retail Display Techniques', 
      jobRole: 'Retail Sales Associate',
      duration: '07:50',
      uploadDate: '2023-09-30',
      views: 175,
      completionRate: 60,
      status: 'active',
      url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
      tags: ['retail', 'display'],
      lang: 'Tamil',
    },
  ]);

  // Filter videos based on search query
  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.jobRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (video.tags && video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  // Handle video upload
  const handleVideoUpload = (videoData: VideoData) => {
    const newVideo = {
      id: videos.length + 1,
      title: videoData.title,
      jobRole: videoData.jobRole,
      duration: '00:00', // Would be calculated from actual file
      uploadDate: new Date().toISOString().split('T')[0],
      views: 0,
      completionRate: 0,
      status: 'active',
      url: videoData.file ? URL.createObjectURL(videoData.file) : '',
      tags: [],
      lang: videoData.language || 'English',
    };
    
    setVideos([newVideo, ...videos]);
    
    toast({
      title: "Video uploaded",
      description: `"${videoData.title}" has been added to the video library.`,
    });
  };

  // Handle playing a video
  const handlePlayVideo = (video: any) => {
    setCurrentVideo({
      id: video.id,
      title: video.title,
      url: video.url,
      tags: video.tags
    });
    setPlayerDialogOpen(true);
  };

  // Handle viewing video stats
  const handleViewStats = (video: any) => {
    toast({
      title: "Video statistics",
      description: `Statistics for "${video.title}" - ${video.views} views with ${video.completionRate}% completion rate.`,
    });
  };

  // Handle managing video tags
  const handleManageTags = (video: any) => {
    setCurrentVideo({
      id: video.id,
      title: video.title,
      url: video.url,
      tags: video.tags
    });
    setTagsDialogOpen(true);
  };

  // Save updated tags
  const handleTagsSave = (updatedTags: string[]) => {
    setVideos(videos.map(video => 
      video.id === currentVideo.id 
        ? { ...video, tags: updatedTags } 
        : video
    ));
  };

  // Handle archiving a video
  const handleArchiveVideo = (video: any) => {
    setCurrentVideo({
      id: video.id,
      title: video.title,
      url: video.url,
      tags: video.tags
    });
    setActionDialogOpen(true);
  };

  // Confirm archive action
  const handleActionConfirm = () => {
    setVideos(videos.map(video => 
      video.id === currentVideo.id 
        ? { ...video, status: video.status === 'active' ? 'inactive' : 'active' } 
        : video
    ));
  };

  return (
    <MainLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Video Log Manager</h1>
            <p className="text-muted-foreground">
              Manage counselling videos and track candidate viewing progress.
            </p>
          </div>
          <Button className="gap-2" onClick={() => setUploadDialogOpen(true)}>
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
              <div className="text-4xl font-bold text-blue-700">{videos.length}</div>
              <p className="text-sm text-blue-600 mt-1">Across all job roles</p>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-purple-800">Total Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-purple-700">
                {videos.reduce((total, video) => total + video.views, 0).toLocaleString()}
              </div>
              <p className="text-sm text-purple-600 mt-1">By all candidates</p>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-green-800">Average Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-700">
                {Math.round(videos.reduce((total, video) => total + video.completionRate, 0) / videos.length)}%
              </div>
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
                <Input 
                  className="pl-8 w-full sm:w-[250px]" 
                  placeholder="Search videos..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
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
                {filteredVideos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      No videos match your search criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVideos.map((video) => (
                    <TableRow key={video.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {video.title}
                          {video.status === 'inactive' && 
                            <Badge variant="outline" className="text-gray-500 border-gray-300">Archived</Badge>
                          }
                        </div>
                        {video.tags && video.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {video.tags.map((tag, idx) => (
                              <Badge 
                                key={idx} 
                                variant="secondary" 
                                className="px-1 py-0 text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </TableCell>
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
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={() => handlePlayVideo(video)}
                          >
                            <Play className="h-3.5 w-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={() => handleViewStats(video)}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={() => handleManageTags(video)}
                          >
                            <Tag className="h-3.5 w-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={() => handleArchiveVideo(video)}
                          >
                            <Video className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Video Viewing Analytics</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium mb-3">Completion Rate by Job Role</h3>
                <div className="space-y-4">
                  {analyticsData.map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{item.name}</span>
                        <span className="font-medium">{item.completionRate}%</span>
                      </div>
                      <Progress value={item.completionRate} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Most Viewed Videos</h3>
                <div className="space-y-4">
                  {videos
                    .sort((a, b) => b.views - a.views)
                    .slice(0, 5)
                    .map((video, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="bg-gray-100 rounded-full h-6 w-6 flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </div>
                          <span className="text-sm truncate max-w-[180px]">{video.title}</span>
                        </div>
                        <span className="text-sm font-medium">{video.views} views</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Video Upload Dialog */}
      <VideoUploadDialog 
        open={uploadDialogOpen} 
        onOpenChange={setUploadDialogOpen} 
        onUpload={handleVideoUpload}
      />

      {/* Video Player Dialog */}
      <VideoPlayerDialog 
        open={playerDialogOpen}
        onOpenChange={setPlayerDialogOpen}
        videoTitle={currentVideo.title}
        videoUrl={currentVideo.url}
      />

      {/* Tags Management Dialog */}
      <TagsManagementDialog 
        open={tagsDialogOpen}
        onOpenChange={setTagsDialogOpen}
        initialTags={currentVideo.tags || []}
        videoTitle={currentVideo.title}
        onSave={handleTagsSave}
      />

      {/* Archive/Delete Dialog */}
      <MasterDataActionDialog 
        type="archive"
        open={actionDialogOpen}
        onOpenChange={setActionDialogOpen}
        itemName={currentVideo.title}
        category="Video"
        onConfirm={handleActionConfirm}
      />
    </MainLayout>
  );
};

export default VideoLogManager;
