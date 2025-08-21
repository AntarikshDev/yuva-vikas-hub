
import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Filter, Plus, Edit, UserMinus, RotateCw, User, Mail, Search } from 'lucide-react';
import { CandidateForm } from '@/components/forms/CandidateForm';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Define the Candidate interface
interface Candidate {
  id: number;
  name: string;
  email: string;
  mobile: string;
  course: string;
  batch: string;
  status: 'active' | 'placed' | 'dropout' | 'completed';
}

const CandidateDirectory = () => {
  // State for form dialogs
  const [addCandidateOpen, setAddCandidateOpen] = useState(false);
  const [editCandidateOpen, setEditCandidateOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    course: 'all',
  });

  const { toast } = useToast();

  // Dummy data for candidates
  const [candidates, setCandidates] = useState<Candidate[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com', mobile: '9876543210', course: 'Web Development', batch: 'WD001', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', mobile: '9876543211', course: 'Graphic Design', batch: 'GD002', status: 'placed' },
    { id: 3, name: 'Alice Johnson', email: 'alice@example.com', mobile: '9876543212', course: 'Digital Marketing', batch: 'DM003', status: 'dropout' },
    { id: 4, name: 'Bob Wilson', email: 'bob@example.com', mobile: '9876543213', course: 'Mobile App Development', batch: 'MD004', status: 'active' },
    { id: 5, name: 'Carol Williams', email: 'carol@example.com', mobile: '9876543214', course: 'Data Science', batch: 'DS005', status: 'active' },
  ]);

  // Available courses for filter
  const courses = [...new Set(candidates.map(c => c.course))];

  // Handle adding a new candidate
  const handleAddCandidate = (data) => {
    const newCandidate = {
      id: candidates.length + 1,
      name: data.name,
      email: data.email || '',
      mobile: data.mobile,
      course: data.education, // Mapping education field from form to course
      batch: 'Pending',
      status: 'active' as const
    };

    setCandidates([...candidates, newCandidate]);
    setAddCandidateOpen(false);
    toast({
      title: 'Candidate Added',
      description: `${data.name} has been added successfully.`
    });
  };

  // Handle editing a candidate
  const handleEditCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setEditCandidateOpen(true);
  };

  // Handle sending email to a candidate
  const handleSendEmail = (candidate: Candidate) => {
    toast({
      title: 'Email Sent',
      description: `Email has been sent to ${candidate.name}.`
    });
  };

  // Handle deleting a candidate
  const handleDeleteCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setDeleteDialogOpen(true);
  };

  // Confirm candidate deletion
  const confirmDelete = () => {
    if (selectedCandidate) {
      setCandidates(candidates.filter(c => c.id !== selectedCandidate.id));
      toast({
        title: 'Candidate Removed',
        description: `${selectedCandidate.name} has been removed.`
      });
      setDeleteDialogOpen(false);
    }
  };

  // Apply filters and search
  const filteredCandidates = candidates.filter(candidate => {
    // Apply search query
    const matchesSearch = 
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.mobile.includes(searchQuery);
    
    // Apply filters - update to use 'all' instead of empty string
    const matchesStatus = filters.status === 'all' ? true : candidate.status === filters.status;
    const matchesCourse = filters.course === 'all' ? true : candidate.course === filters.course;
    
    return matchesSearch && matchesStatus && matchesCourse;
  });

  // Reset filters
  const resetFilters = () => {
    setFilters({ status: 'all', course: 'all' });
    setFilterOpen(false);
  };

  return (
    <MainLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Candidate Directory</h1>
            <p className="text-muted-foreground">
              Manage candidate profiles and track their progress.
            </p>
          </div>
          <Button className="gap-2" onClick={() => setAddCandidateOpen(true)}>
            <Plus className="h-4 w-4" />
            Add New Candidate
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>All Candidates</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Search candidates..." 
                    className="pl-8 w-[250px]" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 gap-1">
                      <Filter className="h-3.5 w-3.5" />
                      Filter
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-4">
                    <div className="space-y-4">
                      <h4 className="font-medium leading-none">Filter Candidates</h4>
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select 
                          value={filters.status} 
                          onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                        >
                          <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="placed">Placed</SelectItem>
                            <SelectItem value="dropout">Dropout</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="course">Course</Label>
                        <Select 
                          value={filters.course} 
                          onValueChange={(value) => setFilters(prev => ({ ...prev, course: value }))}
                        >
                          <SelectTrigger id="course">
                            <SelectValue placeholder="Select course" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Courses</SelectItem>
                            {courses.map(course => (
                              <SelectItem key={course} value={course}>{course}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                        <Button variant="outline" size="sm" onClick={resetFilters}>
                          Reset
                        </Button>
                        <Button size="sm" onClick={() => setFilterOpen(false)}>
                          Apply
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
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
                {filteredCandidates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <User className="h-10 w-10 mb-2" />
                        <h3 className="font-medium text-lg">No candidates found</h3>
                        <p>Try adjusting your search or filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCandidates.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell className="font-medium">{candidate.name}</TableCell>
                      <TableCell>{candidate.email}</TableCell>
                      <TableCell>{candidate.mobile}</TableCell>
                      <TableCell>{candidate.course}</TableCell>
                      <TableCell>{candidate.batch}</TableCell>
                      <TableCell>
                        <Badge variant={
                          candidate.status === "active" ? "default" : 
                          candidate.status === "placed" ? "secondary" : 
                          candidate.status === "dropout" ? "destructive" : 
                          "outline"
                        }>
                          {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleEditCandidate(candidate)}
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleSendEmail(candidate)}
                          >
                            <Mail className="h-3.5 w-3.5" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleDeleteCandidate(candidate)}
                          >
                            <UserMinus className="h-3.5 w-3.5" />
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
      </div>

      {/* Add Candidate Form Dialog */}
      <CandidateForm 
        open={addCandidateOpen} 
        onOpenChange={setAddCandidateOpen}
        onSubmit={handleAddCandidate}
      />

      {/* Edit Candidate Form Dialog - Reusing the same form */}
      {selectedCandidate && (
        <CandidateForm 
          open={editCandidateOpen} 
          onOpenChange={setEditCandidateOpen}
          initialData={{
            name: selectedCandidate.name,
            mobile: selectedCandidate.mobile,
            email: selectedCandidate.email,
            // Map other fields as needed
          }}
          isEditing={true}
          onSubmit={(data) => {
            // Update candidate in the candidates list
            const updatedCandidates = candidates.map(c => 
              c.id === selectedCandidate.id ? { 
                ...c, 
                name: data.name, 
                mobile: data.mobile, 
                email: data.email || '' 
              } : c
            );
            setCandidates(updatedCandidates);
            setEditCandidateOpen(false);
            toast({
              title: 'Candidate Updated',
              description: `${data.name}'s information has been updated.`
            });
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove {selectedCandidate?.name} from the candidate directory.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default CandidateDirectory;
