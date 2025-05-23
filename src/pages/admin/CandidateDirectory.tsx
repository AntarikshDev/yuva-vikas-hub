import React from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Filter, Plus, Edit, UserMinus, RotateCw, User, Mail } from 'lucide-react';

const CandidateDirectory = () => {
  // Dummy data for candidates
  const candidates = [
    { id: 1, name: 'John Doe', email: 'john@example.com', mobile: '9876543210', course: 'Web Development', batch: 'WD001', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', mobile: '9876543211', course: 'Graphic Design', batch: 'GD002', status: 'placed' },
    { id: 3, name: 'Alice Johnson', email: 'alice@example.com', mobile: '9876543212', course: 'Digital Marketing', batch: 'DM003', status: 'dropout' },
    { id: 4, name: 'Bob Wilson', email: 'bob@example.com', mobile: '9876543213', course: 'Mobile App Development', batch: 'MD004', status: 'active' },
    { id: 5, name: 'Carol Williams', email: 'carol@example.com', mobile: '9876543214', course: 'Data Science', batch: 'DS005', status: 'active' },
  ];

  return (
    <MainLayout role="super_admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Candidate Directory</h1>
            <p className="text-muted-foreground">
              Manage candidate profiles and track their progress.
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add New Candidate
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>All Candidates</CardTitle>
              <div className="flex items-center gap-2">
                <Input type="search" placeholder="Search candidates..." className="max-w-sm" />
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Filter className="h-3.5 w-3.5" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>List of all candidates in the system</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell className="font-medium">{candidate.name}</TableCell>
                    <TableCell>{candidate.email}</TableCell>
                    <TableCell>{candidate.mobile}</TableCell>
                    <TableCell>{candidate.course}</TableCell>
                    <TableCell>{candidate.batch}</TableCell>
                    <TableCell>
                      <Badge variant={candidate.status === "active" ? "default" : 
                        candidate.status === "placed" ? "secondary" : 
                        candidate.status === "dropout" ? "destructive" : "outline"}>
                        {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <Mail className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <UserMinus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CandidateDirectory;

