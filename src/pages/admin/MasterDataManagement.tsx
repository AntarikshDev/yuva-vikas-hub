
import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Archive, Download, BookOpen, Building, Briefcase, Globe, Video, File, MapPin } from 'lucide-react';

// Import the dialog forms
import { JobRoleForm } from '@/components/forms/JobRoleForm';
import { CompanyForm } from '@/components/forms/CompanyForm';
import { CenterForm } from '@/components/forms/CenterForm';
import { TravelModeForm } from '@/components/forms/TravelModeForm';
import { VideoForm } from '@/components/forms/VideoForm';
import { DocumentTypeForm } from '@/components/forms/DocumentTypeForm';
import { LocationForm } from '@/components/forms/LocationForm';

// Type for master data categories
type MasterDataCategory = 'jobroles' | 'companies' | 'centers' | 'travelmodes' | 'videos' | 'documents' | 'locations';

const MasterDataManagement = () => {
  const [activeCategory, setActiveCategory] = useState<MasterDataCategory>('jobroles');
  
  // Dialog state for various forms
  const [jobRoleFormOpen, setJobRoleFormOpen] = useState(false);
  const [companyFormOpen, setCompanyFormOpen] = useState(false);
  const [centerFormOpen, setCenterFormOpen] = useState(false);
  const [travelModeFormOpen, setTravelModeFormOpen] = useState(false);
  const [videoFormOpen, setVideoFormOpen] = useState(false);
  const [documentTypeFormOpen, setDocumentTypeFormOpen] = useState(false);
  const [locationFormOpen, setLocationFormOpen] = useState(false);

  // Dummy data for job roles
  const jobRoles = [
    { id: 1, code: 'JR001', title: 'Customer Service Executive', sector: 'IT-ITES', level: 'NSQF 4', status: 'active' },
    { id: 2, code: 'JR002', title: 'Field Sales Executive', sector: 'Retail', level: 'NSQF 3', status: 'active' },
    { id: 3, code: 'JR003', title: 'General Duty Assistant', sector: 'Healthcare', level: 'NSQF 4', status: 'active' },
    { id: 4, code: 'JR004', title: 'BPO Voice', sector: 'IT-ITES', level: 'NSQF 3', status: 'inactive' },
    { id: 5, code: 'JR005', title: 'Retail Sales Associate', sector: 'Retail', level: 'NSQF 4', status: 'active' },
  ];

  // Dummy data for companies
  const companies = [
    { id: 1, name: 'TechServices Ltd.', sector: 'IT-ITES', location: 'Multiple', contacts: 3, status: 'active' },
    { id: 2, name: 'RetailMart India', sector: 'Retail', location: 'Pan India', contacts: 2, status: 'active' },
    { id: 3, name: 'HealthCare Plus', sector: 'Healthcare', location: 'Delhi NCR', contacts: 4, status: 'active' },
    { id: 4, name: 'BPO Solutions', sector: 'IT-ITES', location: 'Bangalore', contacts: 1, status: 'inactive' },
    { id: 5, name: 'HotelChain Inc.', sector: 'Hospitality', location: 'Multiple', contacts: 2, status: 'active' },
  ];

  // Dummy data for centers
  const centers = [
    { id: 1, name: 'Delhi Center', state: 'Delhi', city: 'New Delhi', capacity: 120, manager: 'Amit Singh', status: 'active' },
    { id: 2, name: 'Mumbai Center', state: 'Maharashtra', city: 'Mumbai', capacity: 150, manager: 'Priya Sharma', status: 'active' },
    { id: 3, name: 'Bangalore Tech Hub', state: 'Karnataka', city: 'Bangalore', capacity: 100, manager: 'Rajesh Kumar', status: 'active' },
    { id: 4, name: 'Chennai Center', state: 'Tamil Nadu', city: 'Chennai', capacity: 80, manager: 'Lakshmi N', status: 'inactive' },
    { id: 5, name: 'Pune Training Hub', state: 'Maharashtra', city: 'Pune', capacity: 90, manager: 'Sanjay Patel', status: 'active' },
  ];

  // Dummy data for travel modes
  const travelModes = [
    { id: 1, code: 'BUS', name: 'Bus', baseRate: 50, perKmRate: 2, public: true, status: 'active' },
    { id: 2, code: 'TRAIN', name: 'Train', baseRate: 100, perKmRate: 1.5, public: true, status: 'active' },
    { id: 3, code: 'TAXI', name: 'Taxi', baseRate: 200, perKmRate: 10, public: false, status: 'active' },
    { id: 4, code: 'AUTO', name: 'Auto Rickshaw', baseRate: 30, perKmRate: 8, public: true, status: 'active' },
    { id: 5, code: 'FLIGHT', name: 'Flight', baseRate: 1000, perKmRate: 5, public: false, status: 'inactive' },
  ];

  // Dummy data for videos
  const videos = [
    { id: 1, title: 'Introduction to Customer Service', jobRole: 'Customer Service Executive', duration: '08:45', stage: 'Stage 1', lang: 'English', status: 'active' },
    { id: 2, title: 'Field Sales Techniques', jobRole: 'Field Sales Executive', duration: '12:30', stage: 'Stage 2', lang: 'Hindi', status: 'active' },
    { id: 3, title: 'Healthcare Basics Training', jobRole: 'General Duty Assistant', duration: '15:20', stage: 'Stage 1', lang: 'English', status: 'active' },
    { id: 4, title: 'Customer Interaction Skills', jobRole: 'BPO Voice', duration: '10:15', stage: 'Stage 3', lang: 'English', status: 'inactive' },
    { id: 5, title: 'Retail Display Techniques', jobRole: 'Retail Sales Associate', duration: '07:50', stage: 'Stage 2', lang: 'Tamil', status: 'active' },
  ];

  // Dummy data for document types
  const documentTypes = [
    { id: 1, code: 'AADHAR', name: 'Aadhar Card', category: 'Identity Proof', required: true, formats: 'PDF, JPG', status: 'active' },
    { id: 2, code: 'PAN', name: 'PAN Card', category: 'Identity Proof', required: true, formats: 'PDF, JPG', status: 'active' },
    { id: 3, code: 'EDUCER', name: 'Education Certificate', category: 'Educational Qualification', required: false, formats: 'PDF', status: 'active' },
    { id: 4, code: 'BANK', name: 'Bank Statement', category: 'Banking Information', required: false, formats: 'PDF', status: 'inactive' },
    { id: 5, code: 'EXPCERT', name: 'Experience Certificate', category: 'Work Experience', required: false, formats: 'PDF, DOC', status: 'active' },
  ];

  // Dummy data for locations
  const locations = [
    { id: 1, code: 'DL', name: 'Delhi', type: 'State', districts: 11, status: 'active' },
    { id: 2, code: 'MH', name: 'Maharashtra', type: 'State', districts: 36, status: 'active' },
    { id: 3, code: 'KA', name: 'Karnataka', type: 'State', districts: 31, status: 'active' },
    { id: 4, code: 'TN', name: 'Tamil Nadu', type: 'State', districts: 38, status: 'active' },
    { id: 5, code: 'GJ', name: 'Gujarat', type: 'State', districts: 33, status: 'inactive' },
  ];

  return (
    <MainLayout role="super_admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Master Data Management</h1>
            <p className="text-muted-foreground">
              Manage all master data across the platform.
            </p>
          </div>
        </div>

        <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as MasterDataCategory)} className="w-full">
          <TabsList className="grid grid-cols-7 w-full">
            <TabsTrigger value="jobroles" className="flex gap-1 items-center">
              <Briefcase className="h-4 w-4" />
              <span className="hidden md:inline">Job Roles</span>
            </TabsTrigger>
            <TabsTrigger value="companies" className="flex gap-1 items-center">
              <Building className="h-4 w-4" />
              <span className="hidden md:inline">Companies</span>
            </TabsTrigger>
            <TabsTrigger value="centers" className="flex gap-1 items-center">
              <BookOpen className="h-4 w-4" />
              <span className="hidden md:inline">Centers</span>
            </TabsTrigger>
            <TabsTrigger value="travelmodes" className="flex gap-1 items-center">
              <Globe className="h-4 w-4" />
              <span className="hidden md:inline">Travel Modes</span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex gap-1 items-center">
              <Video className="h-4 w-4" />
              <span className="hidden md:inline">Videos</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex gap-1 items-center">
              <File className="h-4 w-4" />
              <span className="hidden md:inline">Documents</span>
            </TabsTrigger>
            <TabsTrigger value="locations" className="flex gap-1 items-center">
              <MapPin className="h-4 w-4" />
              <span className="hidden md:inline">Locations</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Job Roles Tab */}
          <TabsContent value="jobroles" className="pt-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Job Roles</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input className="pl-8 w-[250px]" placeholder="Search job roles..." />
                    </div>
                    <Button className="gap-1" onClick={() => setJobRoleFormOpen(true)}>
                      <Plus className="h-4 w-4" />
                      Add Job Role
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>Job roles available for training programs</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Job Role Title</TableHead>
                      <TableHead>Sector</TableHead>
                      <TableHead>NSQF Level</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobRoles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell>{role.code}</TableCell>
                        <TableCell className="font-medium">{role.title}</TableCell>
                        <TableCell>{role.sector}</TableCell>
                        <TableCell>{role.level}</TableCell>
                        <TableCell>
                          <Badge variant={role.status === 'active' ? "default" : "secondary"}>
                            {role.status === 'active' ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <Archive className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <Download className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Companies Tab */}
          <TabsContent value="companies" className="pt-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Companies</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input className="pl-8 w-[250px]" placeholder="Search companies..." />
                    </div>
                    <Button className="gap-1" onClick={() => setCompanyFormOpen(true)}>
                      <Plus className="h-4 w-4" />
                      Add Company
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>Companies for placement opportunities</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Sector</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Contact Persons</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {companies.map((company) => (
                      <TableRow key={company.id}>
                        <TableCell className="font-medium">{company.name}</TableCell>
                        <TableCell>{company.sector}</TableCell>
                        <TableCell>{company.location}</TableCell>
                        <TableCell>{company.contacts}</TableCell>
                        <TableCell>
                          <Badge variant={company.status === 'active' ? "default" : "secondary"}>
                            {company.status === 'active' ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <Archive className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <Download className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Centers Tab */}
          <TabsContent value="centers" className="pt-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Training Centers</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input className="pl-8 w-[250px]" placeholder="Search centers..." />
                    </div>
                    <Button className="gap-1" onClick={() => setCenterFormOpen(true)}>
                      <Plus className="h-4 w-4" />
                      Add Center
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>Training centers across locations</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Center Manager</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {centers.map((center) => (
                      <TableRow key={center.id}>
                        <TableCell className="font-medium">{center.name}</TableCell>
                        <TableCell>{center.state}</TableCell>
                        <TableCell>{center.city}</TableCell>
                        <TableCell>{center.capacity}</TableCell>
                        <TableCell>{center.manager}</TableCell>
                        <TableCell>
                          <Badge variant={center.status === 'active' ? "default" : "secondary"}>
                            {center.status === 'active' ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <Archive className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <Download className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Travel Modes Tab */}
          <TabsContent value="travelmodes" className="pt-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Travel Modes</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input className="pl-8 w-[250px]" placeholder="Search travel modes..." />
                    </div>
                    <Button className="gap-1" onClick={() => setTravelModeFormOpen(true)}>
                      <Plus className="h-4 w-4" />
                      Add Travel Mode
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>Travel modes for expense calculation</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Base Rate (₹)</TableHead>
                      <TableHead>Rate per KM (₹)</TableHead>
                      <TableHead>Public Transport</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {travelModes.map((mode) => (
                      <TableRow key={mode.id}>
                        <TableCell>{mode.code}</TableCell>
                        <TableCell className="font-medium">{mode.name}</TableCell>
                        <TableCell>₹{mode.baseRate.toFixed(2)}</TableCell>
                        <TableCell>₹{mode.perKmRate.toFixed(2)}</TableCell>
                        <TableCell>{mode.public ? 'Yes' : 'No'}</TableCell>
                        <TableCell>
                          <Badge variant={mode.status === 'active' ? "default" : "secondary"}>
                            {mode.status === 'active' ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <Archive className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Videos Tab */}
          <TabsContent value="videos" className="pt-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Counselling Videos</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input className="pl-8 w-[250px]" placeholder="Search videos..." />
                    </div>
                    <Button className="gap-1" onClick={() => setVideoFormOpen(true)}>
                      <Plus className="h-4 w-4" />
                      Add Video
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>Counselling videos for candidates</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Job Role</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Counselling Stage</TableHead>
                      <TableHead>Language</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {videos.map((video) => (
                      <TableRow key={video.id}>
                        <TableCell className="font-medium">{video.title}</TableCell>
                        <TableCell>{video.jobRole}</TableCell>
                        <TableCell>{video.duration}</TableCell>
                        <TableCell>{video.stage}</TableCell>
                        <TableCell>{video.lang}</TableCell>
                        <TableCell>
                          <Badge variant={video.status === 'active' ? "default" : "secondary"}>
                            {video.status === 'active' ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <Archive className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <Video className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Documents Tab */}
          <TabsContent value="documents" className="pt-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Document Types</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input className="pl-8 w-[250px]" placeholder="Search document types..." />
                    </div>
                    <Button className="gap-1" onClick={() => setDocumentTypeFormOpen(true)}>
                      <Plus className="h-4 w-4" />
                      Add Document Type
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>Document types for candidate submissions</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Required</TableHead>
                      <TableHead>Allowed Formats</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documentTypes.map((docType) => (
                      <TableRow key={docType.id}>
                        <TableCell>{docType.code}</TableCell>
                        <TableCell className="font-medium">{docType.name}</TableCell>
                        <TableCell>{docType.category}</TableCell>
                        <TableCell>{docType.required ? 'Yes' : 'No'}</TableCell>
                        <TableCell>{docType.formats}</TableCell>
                        <TableCell>
                          <Badge variant={docType.status === 'active' ? "default" : "secondary"}>
                            {docType.status === 'active' ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <Archive className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Locations Tab */}
          <TabsContent value="locations" className="pt-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Districts & States</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input className="pl-8 w-[250px]" placeholder="Search locations..." />
                    </div>
                    <Button className="gap-1" onClick={() => setLocationFormOpen(true)}>
                      <Plus className="h-4 w-4" />
                      Add Location
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>States and their districts</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Districts</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {locations.map((location) => (
                      <TableRow key={location.id}>
                        <TableCell>{location.code}</TableCell>
                        <TableCell className="font-medium">{location.name}</TableCell>
                        <TableCell>{location.type}</TableCell>
                        <TableCell>{location.districts}</TableCell>
                        <TableCell>
                          <Badge variant={location.status === 'active' ? "default" : "secondary"}>
                            {location.status === 'active' ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <Archive className="h-3.5 w-3.5" />
                            </Button>
                          </div>
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

      {/* Dialog forms */}
      <JobRoleForm open={jobRoleFormOpen} onOpenChange={setJobRoleFormOpen} />
      <CompanyForm open={companyFormOpen} onOpenChange={setCompanyFormOpen} />
      <CenterForm open={centerFormOpen} onOpenChange={setCenterFormOpen} />
      <TravelModeForm open={travelModeFormOpen} onOpenChange={setTravelModeFormOpen} />
      <VideoForm open={videoFormOpen} onOpenChange={setVideoFormOpen} />
      <DocumentTypeForm open={documentTypeFormOpen} onOpenChange={setDocumentTypeFormOpen} />
      <LocationForm open={locationFormOpen} onOpenChange={setLocationFormOpen} />
    </MainLayout>
  );
};

export default MasterDataManagement;
