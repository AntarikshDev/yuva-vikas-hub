import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Archive, Download, BookOpen, Building, Briefcase, Globe, Video, File, MapPin } from 'lucide-react';

// Type for master data categories
type MasterDataCategory = 'jobroles' | 'companies' | 'centers' | 'travelmodes' | 'videos' | 'documents' | 'locations';

const MasterDataManagement = () => {
  const [activeCategory, setActiveCategory] = useState<MasterDataCategory>('jobroles');

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
                    <Button className="gap-1">
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
                    <Button className="gap-1">
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
                    <Button className="gap-1">
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
          
          {/* Other tabs would have similar structure */}
          <TabsContent value="travelmodes" className="pt-6">
            <Card className="min-h-[300px]">
              <CardHeader>
                <CardTitle>Travel Modes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">Travel modes management interface will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="videos" className="pt-6">
            <Card className="min-h-[300px]">
              <CardHeader>
                <CardTitle>Counselling Videos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">Counselling videos management interface will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents" className="pt-6">
            <Card className="min-h-[300px]">
              <CardHeader>
                <CardTitle>Document Types</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">Document types management interface will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="locations" className="pt-6">
            <Card className="min-h-[300px]">
              <CardHeader>
                <CardTitle>Districts & States</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">Districts and states management interface will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default MasterDataManagement;
