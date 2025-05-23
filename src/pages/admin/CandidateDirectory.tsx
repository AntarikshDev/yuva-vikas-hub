
import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { FilterBar } from '@/components/common/FilterBar';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';

interface Candidate {
  id: string;
  name: string;
  center: string;
  jobRole: string;
  batch: string;
  category: 'A' | 'B' | 'C';
  status: 'active' | 'placed' | 'dropout' | 'pending';
  mobilizer: string;
  documents: number;
}

const CandidateDirectory: React.FC = () => {
  const [isLoading] = useState(false);

  // Mock data for candidates
  const mockCandidates: Candidate[] = [
    {
      id: 'C001',
      name: 'Rahul Sharma',
      center: 'Delhi Center',
      jobRole: 'Healthcare',
      batch: 'B001',
      category: 'A',
      status: 'active',
      mobilizer: 'Amit Kumar',
      documents: 5,
    },
    {
      id: 'C002',
      name: 'Priya Patel',
      center: 'Mumbai Center',
      jobRole: 'Retail',
      batch: 'B005',
      category: 'B',
      status: 'placed',
      mobilizer: 'Rakesh Verma',
      documents: 4,
    },
    {
      id: 'C003',
      name: 'Anil Singh',
      center: 'Bengaluru Center',
      jobRole: 'Hospitality',
      batch: 'B008',
      category: 'A',
      status: 'placed',
      mobilizer: 'Neha Gupta',
      documents: 6,
    },
    {
      id: 'C004',
      name: 'Meera Shah',
      center: 'Chennai Center',
      jobRole: 'IT Support',
      batch: 'B003',
      category: 'C',
      status: 'dropout',
      mobilizer: 'Sunil Reddy',
      documents: 2,
    },
    {
      id: 'C005',
      name: 'Vikram Desai',
      center: 'Pune Center',
      jobRole: 'Retail',
      batch: 'B005',
      category: 'B',
      status: 'active',
      mobilizer: 'Amit Kumar',
      documents: 5,
    },
    {
      id: 'C006',
      name: 'Sneha Joshi',
      center: 'Hyderabad Center',
      jobRole: 'Healthcare',
      batch: 'B010',
      category: 'A',
      status: 'pending',
      mobilizer: 'Rakesh Verma',
      documents: 3,
    },
  ];

  const filterOptions = [
    {
      id: 'state',
      label: 'State',
      type: 'select' as const,
      options: [
        { value: 'delhi', label: 'Delhi' },
        { value: 'maharashtra', label: 'Maharashtra' },
        { value: 'karnataka', label: 'Karnataka' },
        { value: 'tamil-nadu', label: 'Tamil Nadu' },
      ],
    },
    {
      id: 'center',
      label: 'Center',
      type: 'select' as const,
      options: [
        { value: 'delhi', label: 'Delhi Center' },
        { value: 'mumbai', label: 'Mumbai Center' },
        { value: 'bengaluru', label: 'Bengaluru Center' },
        { value: 'chennai', label: 'Chennai Center' },
      ],
    },
    {
      id: 'jobRole',
      label: 'Job Role',
      type: 'select' as const,
      options: [
        { value: 'healthcare', label: 'Healthcare' },
        { value: 'retail', label: 'Retail' },
        { value: 'hospitality', label: 'Hospitality' },
        { value: 'it-support', label: 'IT Support' },
      ],
    },
    {
      id: 'batch',
      label: 'Batch',
      type: 'select' as const,
      options: [
        { value: 'B001', label: 'B001' },
        { value: 'B003', label: 'B003' },
        { value: 'B005', label: 'B005' },
        { value: 'B008', label: 'B008' },
        { value: 'B010', label: 'B010' },
      ],
    },
    {
      id: 'category',
      label: 'Category',
      type: 'select' as const,
      options: [
        { value: 'A', label: 'Category A' },
        { value: 'B', label: 'Category B' },
        { value: 'C', label: 'Category C' },
      ],
    },
    {
      id: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'placed', label: 'Placed' },
        { value: 'dropout', label: 'Dropout' },
        { value: 'pending', label: 'Pending' },
      ],
    },
    {
      id: 'mobilizer',
      label: 'Mobilizer',
      type: 'select' as const,
      options: [
        { value: 'amit-kumar', label: 'Amit Kumar' },
        { value: 'rakesh-verma', label: 'Rakesh Verma' },
        { value: 'neha-gupta', label: 'Neha Gupta' },
        { value: 'sunil-reddy', label: 'Sunil Reddy' },
      ],
    },
  ];

  const handleSearch = (query: string) => {
    console.log(`Searching for: ${query}`);
    // In a real app, this would filter the data
  };

  const handleFilterChange = (filters: Record<string, any>) => {
    console.log('Filters changed:', filters);
    // In a real app, this would filter the data
  };

  const handleViewProfile = (candidate: Candidate) => {
    console.log(`Viewing profile for: ${candidate.name}`);
    // In a real app, this would navigate to the candidate profile
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'info';
      case 'placed': return 'success';
      case 'dropout': return 'error';
      default: return 'warning';
    }
  };

  const getCategoryVariant = (category: string) => {
    switch (category) {
      case 'A': return 'success';
      case 'B': return 'warning';
      case 'C': return 'error';
      default: return 'default';
    }
  };

  const columns = [
    {
      id: 'id',
      header: 'ID',
      cell: (candidate: Candidate) => candidate.id,
      className: 'w-16',
    },
    {
      id: 'name',
      header: 'Candidate Name',
      cell: (candidate: Candidate) => (
        <div className="font-medium">{candidate.name}</div>
      ),
    },
    {
      id: 'center',
      header: 'Center',
      cell: (candidate: Candidate) => candidate.center,
    },
    {
      id: 'jobRole',
      header: 'Job Role',
      cell: (candidate: Candidate) => candidate.jobRole,
    },
    {
      id: 'batch',
      header: 'Batch',
      cell: (candidate: Candidate) => candidate.batch,
    },
    {
      id: 'category',
      header: 'Category',
      cell: (candidate: Candidate) => (
        <StatusBadge
          variant={getCategoryVariant(candidate.category)}
          label={`Category ${candidate.category}`}
          withDot
        />
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (candidate: Candidate) => (
        <StatusBadge
          variant={getStatusVariant(candidate.status)}
          label={candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
          withDot
        />
      ),
    },
    {
      id: 'mobilizer',
      header: 'Mobilizer',
      cell: (candidate: Candidate) => candidate.mobilizer,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (candidate: Candidate) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewProfile(candidate)}
          >
            View Profile
          </Button>
          <Button variant="outline" size="sm">
            Download Docs
          </Button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout role="super_admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Candidate Directory</h1>
          <p className="text-muted-foreground">
            View, search and manage all candidates in the system.
          </p>
        </div>

        <FilterBar
          onSearch={handleSearch}
          filters={filterOptions}
          onFilterChange={handleFilterChange}
          actions={
            <Button>Advanced Search</Button>
          }
        />

        <DataTable
          columns={columns}
          data={mockCandidates}
          isLoading={isLoading}
          onRowClick={handleViewProfile}
        />
      </div>
    </MainLayout>
  );
};

export default CandidateDirectory;
