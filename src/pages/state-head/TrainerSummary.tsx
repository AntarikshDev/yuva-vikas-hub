
import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { EnhancedFilterBar } from '@/components/common/EnhancedFilterBar';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Users, Star, MessageCircle, Eye, Phone, Mail, Video, Award } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const TrainerSummary: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<any>(null);
  
  // Filter options
  const filterOptions = [
    {
      id: 'district',
      label: 'District',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'All Districts' },
        { value: 'mumbai', label: 'Mumbai' },
        { value: 'pune', label: 'Pune' },
        { value: 'nagpur', label: 'Nagpur' },
        { value: 'nashik', label: 'Nashik' },
      ],
    },
    {
      id: 'center',
      label: 'Center',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'All Centers' },
        { value: 'mumbai-central', label: 'Mumbai Central' },
        { value: 'andheri', label: 'Andheri' },
        { value: 'pune-east', label: 'Pune East' },
      ],
    },
    {
      id: 'specialization',
      label: 'Specialization',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'All Specializations' },
        { value: 'healthcare', label: 'Healthcare' },
        { value: 'retail', label: 'Retail' },
        { value: 'logistics', label: 'Logistics' },
        { value: 'hospitality', label: 'Hospitality' },
      ],
    },
    {
      id: 'performance',
      label: 'Performance',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'All Performance Levels' },
        { value: 'excellent', label: 'Excellent' },
        { value: 'good', label: 'Good' },
        { value: 'average', label: 'Average' },
        { value: 'needs-improvement', label: 'Needs Improvement' },
      ],
    }
  ];
  
  // Handle filter changes
  const handleFilterChange = (filterId: string, value: any) => {
    console.log("Filter changed:", filterId, value);
  };
  
  // Mock data for trainers
  const trainerData = [
    {
      id: "TR-001",
      name: "Anjali Singh",
      center: "Mumbai Central Training Hub",
      district: "Mumbai",
      specialization: "Healthcare",
      experience: "5 years",
      activeBatches: 2,
      totalStudents: 56,
      rating: 4.8,
      performance: "Excellent",
      counselingSessions: 45,
      videoLogsCompleted: 38,
      videoComplianceRate: 84,
      contact: {
        phone: "+91 9876543210",
        email: "anjali.singh@lnjskills.com"
      },
      recentBatches: [
        { id: "BT-MUM-001", name: "Healthcare Assistant Batch 08", students: 32, status: "Ongoing" },
        { id: "BT-MUM-007", name: "Healthcare Assistant Batch 14", students: 24, status: "Ongoing" }
      ],
      achievements: ["Best Trainer Q1 2023", "100% Placement Rate", "Excellence in Student Engagement"],
      feedback: "Excellent communication skills and very supportive towards students.",
      lastActive: "2023-05-22"
    },
    {
      id: "TR-002",
      name: "Vikram Mehta",
      center: "Andheri Skill Center",
      district: "Mumbai",
      specialization: "Retail",
      experience: "3 years",
      activeBatches: 1,
      totalStudents: 36,
      rating: 4.6,
      performance: "Excellent",
      counselingSessions: 32,
      videoLogsCompleted: 28,
      videoComplianceRate: 88,
      contact: {
        phone: "+91 9876543211",
        email: "vikram.mehta@lnjskills.com"
      },
      recentBatches: [
        { id: "BT-MUM-002", name: "Retail Sales Batch 12", students: 36, status: "Ongoing" }
      ],
      achievements: ["Top Performer 2023", "Student Favorite Award"],
      feedback: "Very dedicated and maintains excellent batch discipline.",
      lastActive: "2023-05-22"
    },
    {
      id: "TR-003",
      name: "Sunil Khanna",
      center: "Pune Central Institute",
      district: "Pune",
      specialization: "Logistics",
      experience: "7 years",
      activeBatches: 2,
      totalStudents: 48,
      rating: 4.4,
      performance: "Good",
      counselingSessions: 52,
      videoLogsCompleted: 35,
      videoComplianceRate: 67,
      contact: {
        phone: "+91 9876543212",
        email: "sunil.khanna@lnjskills.com"
      },
      recentBatches: [
        { id: "BT-PUN-003", name: "Logistics Operations Batch 05", students: 28, status: "Completed" },
        { id: "BT-PUN-008", name: "Logistics Operations Batch 11", students: 20, status: "Ongoing" }
      ],
      achievements: ["7 Years Service Award", "Industry Expert"],
      feedback: "Very experienced trainer with deep industry knowledge.",
      lastActive: "2023-05-21"
    },
    {
      id: "TR-004",
      name: "Preeti Verma",
      center: "Nagpur Training Academy",
      district: "Nagpur",
      specialization: "Hospitality",
      experience: "4 years",
      activeBatches: 1,
      totalStudents: 30,
      rating: 4.2,
      performance: "Good",
      counselingSessions: 28,
      videoLogsCompleted: 18,
      videoComplianceRate: 64,
      contact: {
        phone: "+91 9876543213",
        email: "preeti.verma@lnjskills.com"
      },
      recentBatches: [
        { id: "BT-NAG-004", name: "Hospitality Services Batch 03", students: 30, status: "Ongoing" }
      ],
      achievements: ["Customer Service Excellence", "Team Player Award"],
      feedback: "Good trainer but needs to improve video log compliance.",
      lastActive: "2023-05-22"
    },
    {
      id: "TR-005",
      name: "Rajesh Kumar",
      center: "Pune East Center",
      district: "Pune",
      specialization: "IT Support",
      experience: "6 years",
      activeBatches: 1,
      totalStudents: 24,
      rating: 4.0,
      performance: "Average",
      counselingSessions: 18,
      videoLogsCompleted: 12,
      videoComplianceRate: 67,
      contact: {
        phone: "+91 9876543214",
        email: "rajesh.kumar@lnjskills.com"
      },
      recentBatches: [
        { id: "BT-PUN-005", name: "IT Support Batch 02", students: 24, status: "Upcoming" }
      ],
      achievements: ["Technical Excellence Award"],
      feedback: "Strong technical skills but needs improvement in student engagement.",
      lastActive: "2023-05-20"
    }
  ];

  // Define columns for DataTable
  const columns = [
    {
      id: 'trainer',
      header: 'Trainer',
      cell: (row: any) => (
        <div>
          <div className="font-medium">{row.name}</div>
          <div className="text-xs text-gray-500">{row.id} • {row.experience} exp</div>
        </div>
      ),
    },
    {
      id: 'center',
      header: 'Center',
      cell: (row: any) => (
        <div>
          <div>{row.center}</div>
          <div className="text-xs text-gray-500">{row.district}</div>
        </div>
      ),
    },
    {
      id: 'specialization',
      header: 'Specialization',
      cell: (row: any) => (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          row.specialization === 'Healthcare' ? 'bg-blue-100 text-blue-800' :
          row.specialization === 'Retail' ? 'bg-emerald-100 text-emerald-800' :
          row.specialization === 'Logistics' ? 'bg-amber-100 text-amber-800' :
          row.specialization === 'Hospitality' ? 'bg-purple-100 text-purple-800' :
          'bg-cyan-100 text-cyan-800'
        }`}>
          {row.specialization}
        </span>
      ),
    },
    {
      id: 'batches',
      header: 'Batches',
      cell: (row: any) => (
        <div className="text-center">
          <div className="font-medium">{row.activeBatches} Active</div>
          <div className="text-xs text-gray-500">{row.totalStudents} students</div>
        </div>
      ),
    },
    {
      id: 'rating',
      header: 'Rating',
      cell: (row: any) => (
        <div className="flex items-center">
          <span className="mr-1 font-medium">{row.rating}</span>
          <div className="flex text-amber-400">
            {'★'.repeat(Math.floor(row.rating))}
            {row.rating % 1 !== 0 && '☆'}
          </div>
        </div>
      ),
    },
    {
      id: 'counseling',
      header: 'Counseling',
      cell: (row: any) => (
        <div className="text-center">
          <div className="font-medium">{row.counselingSessions}</div>
          <div className="text-xs text-gray-500">sessions</div>
        </div>
      ),
    },
    {
      id: 'videoCompliance',
      header: 'Video Logs',
      cell: (row: any) => (
        <div className="text-center">
          <div className="font-medium">{row.videoComplianceRate}%</div>
          <div className="text-xs text-gray-500">{row.videoLogsCompleted} completed</div>
        </div>
      ),
    },
    {
      id: 'performance',
      header: 'Performance',
      cell: (row: any) => (
        <StatusBadge
          variant={
            row.performance === 'Excellent' ? 'success' : 
            row.performance === 'Good' ? 'info' : 
            row.performance === 'Average' ? 'warning' : 'error'
          }
          label={row.performance}
        />
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: (row: any) => (
        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setSelectedTrainer(row);
              setDetailsDialogOpen(true);
            }}
          >
            <Eye className="h-4 w-4 mr-1" />
            Details
          </Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={() => {
              setSelectedTrainer(row);
              setMessageDialogOpen(true);
            }}
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            Message
          </Button>
        </div>
      ),
    },
  ];

  // Function to handle export action
  const handleExport = () => {
    console.log("Exporting trainer data...");
  };

  return (
    <MainLayout role="state_head">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Trainer Summary</h1>
          <p className="text-muted-foreground">
            Overview of trainers, their performance, and counseling activities
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-500 font-medium">Total Trainers</div>
                <span className="bg-blue-100 p-2 rounded-full text-blue-600">
                  <Users className="h-4 w-4" />
                </span>
              </div>
              <div className="text-3xl font-bold">24</div>
              <div className="mt-1 text-xs text-gray-500">Across all centers</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-500 font-medium">Avg. Rating</div>
                <span className="bg-amber-100 p-2 rounded-full text-amber-600">
                  <Star className="h-4 w-4" />
                </span>
              </div>
              <div className="text-3xl font-bold">4.4</div>
              <div className="mt-1 text-xs text-emerald-500">+0.2 from last month</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-500 font-medium">Counseling Sessions</div>
                <span className="bg-emerald-100 p-2 rounded-full text-emerald-600">
                  <MessageCircle className="h-4 w-4" />
                </span>
              </div>
              <div className="text-3xl font-bold">175</div>
              <div className="mt-1 text-xs text-gray-500">This month</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-500 font-medium">Video Compliance</div>
                <span className="bg-purple-100 p-2 rounded-full text-purple-600">
                  <Video className="h-4 w-4" />
                </span>
              </div>
              <div className="text-3xl font-bold">74%</div>
              <div className="mt-1 text-xs text-amber-500">Below target (80%)</div>
            </CardContent>
          </Card>
        </div>
        
        <EnhancedFilterBar
          filters={filterOptions}
          onFilterChange={handleFilterChange}
          actions={
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleExport}
            >
              <Download className="h-4 w-4" />
              Export Trainer Data
            </Button>
          }
        />
        
        <div className="rounded-md border bg-white">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Trainer Overview</h2>
          </div>
          <DataTable
            columns={columns}
            data={trainerData}
            isLoading={isLoading}
          />
        </div>
      </div>
      
      {/* Trainer Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Trainer Details</DialogTitle>
          </DialogHeader>
          
          {selectedTrainer && (
            <div className="py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">{selectedTrainer.name}</h3>
                  <p className="text-sm text-neutral-500">
                    {selectedTrainer.id} • {selectedTrainer.specialization} Specialist
                  </p>
                </div>
                <StatusBadge
                  variant={
                    selectedTrainer.performance === 'Excellent' ? 'success' : 
                    selectedTrainer.performance === 'Good' ? 'info' : 
                    selectedTrainer.performance === 'Average' ? 'warning' : 'error'
                  }
                  label={selectedTrainer.performance}
                />
              </div>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-4">Basic Information</h4>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 border rounded-md">
                        <div className="text-xs text-neutral-500">Experience</div>
                        <div className="font-medium">{selectedTrainer.experience}</div>
                      </div>
                      
                      <div className="p-3 border rounded-md">
                        <div className="text-xs text-neutral-500">Rating</div>
                        <div className="flex items-center">
                          <span className="mr-1 font-medium">{selectedTrainer.rating}</span>
                          <div className="flex text-amber-400">
                            {'★'.repeat(Math.floor(selectedTrainer.rating))}
                            {selectedTrainer.rating % 1 !== 0 && '☆'}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 border rounded-md">
                      <div className="text-xs text-neutral-500">Training Center</div>
                      <div className="font-medium">{selectedTrainer.center}</div>
                      <div className="text-xs text-neutral-500 mt-1">{selectedTrainer.district} District</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 border rounded-md">
                        <div className="text-xs text-neutral-500">Active Batches</div>
                        <div className="font-medium">{selectedTrainer.activeBatches}</div>
                      </div>
                      
                      <div className="p-3 border rounded-md">
                        <div className="text-xs text-neutral-500">Total Students</div>
                        <div className="font-medium">{selectedTrainer.totalStudents}</div>
                      </div>
                    </div>
                    
                    <div className="p-3 border rounded-md">
                      <div className="text-xs text-neutral-500">Contact Information</div>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-neutral-400" />
                          <span className="text-sm">{selectedTrainer.contact.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-neutral-400" />
                          <span className="text-sm">{selectedTrainer.contact.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-4">Performance & Activities</h4>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 border rounded-md">
                        <div className="text-xs text-neutral-500">Counseling Sessions</div>
                        <div className="font-medium">{selectedTrainer.counselingSessions}</div>
                      </div>
                      
                      <div className="p-3 border rounded-md">
                        <div className="text-xs text-neutral-500">Video Logs</div>
                        <div className="font-medium">{selectedTrainer.videoLogsCompleted}</div>
                      </div>
                    </div>
                    
                    <div className="p-3 border rounded-md">
                      <div className="text-xs text-neutral-500">Video Compliance Rate</div>
                      <div className="font-medium">{selectedTrainer.videoComplianceRate}%</div>
                      <div className="w-full bg-neutral-200 rounded-full h-1.5 mt-1">
                        <div 
                          className={`h-1.5 rounded-full ${
                            selectedTrainer.videoComplianceRate >= 80 ? 'bg-emerald-500' :
                            selectedTrainer.videoComplianceRate >= 60 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${selectedTrainer.videoComplianceRate}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="p-3 border rounded-md">
                      <div className="text-xs text-neutral-500 mb-2">Recent Batches</div>
                      <div className="space-y-2">
                        {selectedTrainer.recentBatches.map((batch: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center p-2 bg-neutral-50 rounded">
                            <div>
                              <div className="text-sm font-medium">{batch.name}</div>
                              <div className="text-xs text-neutral-500">{batch.id} • {batch.students} students</div>
                            </div>
                            <StatusBadge
                              variant={
                                batch.status === 'Ongoing' ? 'info' : 
                                batch.status === 'Completed' ? 'success' : 'secondary'
                              }
                              label={batch.status}
                              size="sm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-3 border rounded-md">
                      <div className="text-xs text-neutral-500 mb-2">Achievements</div>
                      <div className="space-y-1">
                        {selectedTrainer.achievements.map((achievement: string, idx: number) => (
                          <div key={idx} className="flex items-center text-sm">
                            <Award className="h-3 w-3 text-amber-500 mr-2" />
                            {achievement}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-3 border rounded-md">
                      <div className="text-xs text-neutral-500">Feedback</div>
                      <div className="mt-1 text-sm">{selectedTrainer.feedback}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline"
              onClick={() => {
                setDetailsDialogOpen(false);
                setMessageDialogOpen(true);
              }}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Message Trainer
            </Button>
            <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Message Trainer Dialog */}
      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Message Trainer</DialogTitle>
          </DialogHeader>
          
          {selectedTrainer && (
            <div className="py-4">
              <div className="mb-4">
                <div className="font-medium">{selectedTrainer.name}</div>
                <div className="text-sm text-neutral-500">
                  {selectedTrainer.center} • {selectedTrainer.specialization}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <input 
                    type="text" 
                    placeholder="Enter message subject"
                    className="w-full rounded-md border border-input px-3 py-2 text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea 
                    placeholder="Enter your message or remarks..." 
                    rows={5}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Priority</div>
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="priority-low" name="priority" value="low" defaultChecked />
                      <label htmlFor="priority-low" className="text-sm">Normal</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="priority-high" name="priority" value="high" />
                      <label htmlFor="priority-high" className="text-sm">High Priority</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="priority-urgent" name="priority" value="urgent" />
                      <label htmlFor="priority-urgent" className="text-sm">Urgent</label>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="copy-manager" />
                  <label htmlFor="copy-manager" className="text-sm">Copy center manager</label>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setMessageDialogOpen(false)}>Cancel</Button>
            <Button>Send Message</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default TrainerSummary;
