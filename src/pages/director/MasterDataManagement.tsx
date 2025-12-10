import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2, Archive, Download, FileSpreadsheet, Layers, MapPin, Briefcase, FileText, ChevronRight, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MasterDataActionDialog } from '@/components/dialogs/MasterDataActionDialog';
import { ProgramForm } from '@/components/forms/ProgramForm';
import { SectorForm } from '@/components/forms/SectorForm';
import { DirectorLocationForm } from '@/components/forms/DirectorLocationForm';
import { DirectorJobRoleForm } from '@/components/forms/DirectorJobRoleForm';
import { DirectorDocumentForm } from '@/components/forms/DirectorDocumentForm';

type MasterDataCategory = 'programs' | 'locations' | 'sectors' | 'jobroles' | 'documents';
type LocationSubType = 'state' | 'district' | 'block' | 'panchayat' | 'village' | 'pincode';

const DirectorMasterDataManagement = () => {
  const [activeCategory, setActiveCategory] = useState<MasterDataCategory>('programs');
  const [locationSubType, setLocationSubType] = useState<LocationSubType>('state');
  const { toast } = useToast();

  // Form dialog states
  const [programFormOpen, setProgramFormOpen] = useState(false);
  const [sectorFormOpen, setSectorFormOpen] = useState(false);
  const [locationFormOpen, setLocationFormOpen] = useState(false);
  const [jobRoleFormOpen, setJobRoleFormOpen] = useState(false);
  const [documentFormOpen, setDocumentFormOpen] = useState(false);

  const [editingItemId, setEditingItemId] = useState<number | null>(null);

  // Action dialog state
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    type: 'archive' | 'delete';
    itemName: string;
    itemId: number;
    category: string;
  }>({
    open: false,
    type: 'archive',
    itemName: '',
    itemId: 0,
    category: ''
  });

  // Search states
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({
    programs: '',
    locations: '',
    sectors: '',
    jobroles: '',
    documents: ''
  });

  // Sample data
  const [programs, setPrograms] = useState([
    { id: 1, code: 'PRG001', name: 'DDU-GKY', fullName: 'Deen Dayal Upadhyaya Grameen Kaushalya Yojana', ministry: 'MoRD', status: 'active' },
    { id: 2, code: 'PRG002', name: 'PMKVY', fullName: 'Pradhan Mantri Kaushal Vikas Yojana', ministry: 'MSDE', status: 'active' },
    { id: 3, code: 'PRG003', name: 'NULM', fullName: 'National Urban Livelihoods Mission', ministry: 'MoHUA', status: 'active' },
    { id: 4, code: 'PRG004', name: 'RSETI', fullName: 'Rural Self Employment Training Institutes', ministry: 'MoRD', status: 'inactive' },
  ]);

  const [sectors, setSectors] = useState([
    { id: 1, code: 'SEC001', name: 'IT-ITES', ssc: 'NASSCOM', jobRoles: 15, status: 'active' },
    { id: 2, code: 'SEC002', name: 'Retail', ssc: 'RASCI', jobRoles: 12, status: 'active' },
    { id: 3, code: 'SEC003', name: 'Healthcare', ssc: 'HSSC', jobRoles: 18, status: 'active' },
    { id: 4, code: 'SEC004', name: 'Hospitality', ssc: 'THSC', jobRoles: 10, status: 'active' },
    { id: 5, code: 'SEC005', name: 'Banking & Finance', ssc: 'BFSI SSC', jobRoles: 8, status: 'inactive' },
  ]);

  const [locations, setLocations] = useState({
    state: [
      { id: 1, code: 'MH', name: 'Maharashtra', districts: 36, status: 'active' },
      { id: 2, code: 'KA', name: 'Karnataka', districts: 31, status: 'active' },
      { id: 3, code: 'TN', name: 'Tamil Nadu', districts: 38, status: 'active' },
      { id: 4, code: 'GJ', name: 'Gujarat', districts: 33, status: 'active' },
      { id: 5, code: 'RJ', name: 'Rajasthan', districts: 33, status: 'inactive' },
    ],
    district: [
      { id: 1, code: 'MUM', name: 'Mumbai', state: 'Maharashtra', blocks: 24, status: 'active' },
      { id: 2, code: 'PUN', name: 'Pune', state: 'Maharashtra', blocks: 14, status: 'active' },
      { id: 3, code: 'BLR', name: 'Bangalore Urban', state: 'Karnataka', blocks: 8, status: 'active' },
      { id: 4, code: 'CHN', name: 'Chennai', state: 'Tamil Nadu', blocks: 10, status: 'active' },
    ],
    block: [
      { id: 1, code: 'ANH', name: 'Andheri', district: 'Mumbai', panchayats: 12, status: 'active' },
      { id: 2, code: 'BAN', name: 'Bandra', district: 'Mumbai', panchayats: 8, status: 'active' },
      { id: 3, code: 'HAV', name: 'Haveli', district: 'Pune', panchayats: 15, status: 'active' },
    ],
    panchayat: [
      { id: 1, code: 'PAN001', name: 'Versova Gram Panchayat', block: 'Andheri', villages: 5, status: 'active' },
      { id: 2, code: 'PAN002', name: 'Marol Gram Panchayat', block: 'Andheri', villages: 4, status: 'active' },
    ],
    village: [
      { id: 1, code: 'VIL001', name: 'Versova Village', panchayat: 'Versova Gram Panchayat', pincode: '400061', status: 'active' },
      { id: 2, code: 'VIL002', name: 'Marol Village', panchayat: 'Marol Gram Panchayat', pincode: '400059', status: 'active' },
    ],
    pincode: [
      { id: 1, code: '400061', area: 'Versova', district: 'Mumbai', state: 'Maharashtra', status: 'active' },
      { id: 2, code: '400059', area: 'Marol', district: 'Mumbai', state: 'Maharashtra', status: 'active' },
      { id: 3, code: '411001', area: 'Pune City', district: 'Pune', state: 'Maharashtra', status: 'active' },
    ]
  });

  const [jobRoles, setJobRoles] = useState([
    { id: 1, code: 'JR001', title: 'Customer Service Executive', sector: 'IT-ITES', nsqfLevel: 4, hours: 400, status: 'active' },
    { id: 2, code: 'JR002', title: 'Field Sales Executive', sector: 'Retail', nsqfLevel: 3, hours: 350, status: 'active' },
    { id: 3, code: 'JR003', title: 'General Duty Assistant', sector: 'Healthcare', nsqfLevel: 4, hours: 450, status: 'active' },
    { id: 4, code: 'JR004', title: 'F&B Service Steward', sector: 'Hospitality', nsqfLevel: 4, hours: 380, status: 'active' },
    { id: 5, code: 'JR005', title: 'Business Correspondent', sector: 'Banking & Finance', nsqfLevel: 4, hours: 400, status: 'inactive' },
  ]);

  const [documents, setDocuments] = useState([
    { id: 1, code: 'DOC001', name: 'Aadhaar Card', category: 'Identity Proof', required: true, formats: 'PDF, JPG', status: 'active' },
    { id: 2, code: 'DOC002', name: 'PAN Card', category: 'Identity Proof', required: false, formats: 'PDF, JPG', status: 'active' },
    { id: 3, code: 'DOC003', name: 'Bank Passbook', category: 'Banking', required: true, formats: 'PDF, JPG', status: 'active' },
    { id: 4, code: 'DOC004', name: '10th Marksheet', category: 'Education', required: true, formats: 'PDF', status: 'active' },
    { id: 5, code: 'DOC005', name: 'Caste Certificate', category: 'Category Proof', required: false, formats: 'PDF', status: 'active' },
    { id: 6, code: 'DOC006', name: 'Income Certificate', category: 'Income Proof', required: false, formats: 'PDF', status: 'inactive' },
  ]);

  const handleSearchChange = (category: string, value: string) => {
    setSearchQueries({ ...searchQueries, [category]: value });
  };

  const handleEdit = (category: MasterDataCategory, id: number) => {
    setEditingItemId(id);
    switch (category) {
      case 'programs': setProgramFormOpen(true); break;
      case 'sectors': setSectorFormOpen(true); break;
      case 'locations': setLocationFormOpen(true); break;
      case 'jobroles': setJobRoleFormOpen(true); break;
      case 'documents': setDocumentFormOpen(true); break;
    }
  };

  const handleActionClick = (category: MasterDataCategory, type: 'archive' | 'delete', item: any) => {
    setActionDialog({
      open: true,
      type,
      itemName: item.name || item.title || item.code,
      itemId: item.id,
      category: getCategoryName(category)
    });
  };

  const getCategoryName = (category: MasterDataCategory): string => {
    const names: Record<MasterDataCategory, string> = {
      programs: 'Program',
      locations: 'Location',
      sectors: 'Sector',
      jobroles: 'Job Role',
      documents: 'Document'
    };
    return names[category];
  };

  const handleActionConfirm = () => {
    toast({
      title: `${actionDialog.type === 'archive' ? 'Archived' : 'Deleted'} successfully`,
      description: `${actionDialog.itemName} has been ${actionDialog.type === 'archive' ? 'archived' : 'deleted'}.`,
    });
  };

  const handleDownload = (category: string) => {
    toast({
      title: "Export initiated",
      description: `Exporting ${category} data to Excel...`,
    });
  };

  const handleBulkUpload = (category: string) => {
    toast({
      title: "Bulk Upload",
      description: `Opening bulk upload for ${category}...`,
    });
  };

  // Filter functions
  const filteredPrograms = programs.filter(p =>
    !searchQueries.programs ||
    p.name.toLowerCase().includes(searchQueries.programs.toLowerCase()) ||
    p.fullName.toLowerCase().includes(searchQueries.programs.toLowerCase())
  );

  const filteredSectors = sectors.filter(s =>
    !searchQueries.sectors ||
    s.name.toLowerCase().includes(searchQueries.sectors.toLowerCase()) ||
    s.ssc.toLowerCase().includes(searchQueries.sectors.toLowerCase())
  );

  const filteredJobRoles = jobRoles.filter(j =>
    !searchQueries.jobroles ||
    j.title.toLowerCase().includes(searchQueries.jobroles.toLowerCase()) ||
    j.sector.toLowerCase().includes(searchQueries.jobroles.toLowerCase())
  );

  const filteredDocuments = documents.filter(d =>
    !searchQueries.documents ||
    d.name.toLowerCase().includes(searchQueries.documents.toLowerCase()) ||
    d.category.toLowerCase().includes(searchQueries.documents.toLowerCase())
  );

  const getFilteredLocations = () => {
    const locationData = locations[locationSubType] || [];
    return locationData.filter((l: any) =>
      !searchQueries.locations ||
      l.name?.toLowerCase().includes(searchQueries.locations.toLowerCase()) ||
      l.code?.toLowerCase().includes(searchQueries.locations.toLowerCase())
    );
  };

  const renderLocationTable = () => {
    const data = getFilteredLocations();

    const getColumns = () => {
      switch (locationSubType) {
        case 'state':
          return ['Code', 'Name', 'Districts', 'Status', 'Actions'];
        case 'district':
          return ['Code', 'Name', 'State', 'Blocks', 'Status', 'Actions'];
        case 'block':
          return ['Code', 'Name', 'District', 'Panchayats', 'Status', 'Actions'];
        case 'panchayat':
          return ['Code', 'Name', 'Block', 'Villages', 'Status', 'Actions'];
        case 'village':
          return ['Code', 'Name', 'Panchayat', 'Pincode', 'Status', 'Actions'];
        case 'pincode':
          return ['Pincode', 'Area', 'District', 'State', 'Status', 'Actions'];
        default:
          return ['Code', 'Name', 'Status', 'Actions'];
      }
    };

    return (
      <Table>
        <TableHeader>
          <TableRow>
            {getColumns().map((col) => (
              <TableHead key={col}>{col}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item: any) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.code}</TableCell>
              <TableCell>{item.name || item.area}</TableCell>
              {locationSubType === 'state' && <TableCell>{item.districts}</TableCell>}
              {locationSubType === 'district' && (
                <>
                  <TableCell>{item.state}</TableCell>
                  <TableCell>{item.blocks}</TableCell>
                </>
              )}
              {locationSubType === 'block' && (
                <>
                  <TableCell>{item.district}</TableCell>
                  <TableCell>{item.panchayats}</TableCell>
                </>
              )}
              {locationSubType === 'panchayat' && (
                <>
                  <TableCell>{item.block}</TableCell>
                  <TableCell>{item.villages}</TableCell>
                </>
              )}
              {locationSubType === 'village' && (
                <>
                  <TableCell>{item.panchayat}</TableCell>
                  <TableCell>{item.pincode}</TableCell>
                </>
              )}
              {locationSubType === 'pincode' && (
                <>
                  <TableCell>{item.district}</TableCell>
                  <TableCell>{item.state}</TableCell>
                </>
              )}
              <TableCell>
                <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit('locations', item.id)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleActionClick('locations', 'archive', item)}>
                    <Archive className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleActionClick('locations', 'delete', item)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <MainLayout role="director">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Master Data Management</h1>
            <p className="text-muted-foreground">
              Manage all master data configurations for the platform.
            </p>
          </div>
        </div>

        <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as MasterDataCategory)} className="w-full">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="programs" className="flex gap-2 items-center">
              <Layers className="h-4 w-4" />
              <span className="hidden md:inline">Programs</span>
            </TabsTrigger>
            <TabsTrigger value="locations" className="flex gap-2 items-center">
              <MapPin className="h-4 w-4" />
              <span className="hidden md:inline">Locations</span>
            </TabsTrigger>
            <TabsTrigger value="sectors" className="flex gap-2 items-center">
              <FileSpreadsheet className="h-4 w-4" />
              <span className="hidden md:inline">Sectors</span>
            </TabsTrigger>
            <TabsTrigger value="jobroles" className="flex gap-2 items-center">
              <Briefcase className="h-4 w-4" />
              <span className="hidden md:inline">Job Roles</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex gap-2 items-center">
              <FileText className="h-4 w-4" />
              <span className="hidden md:inline">Documents</span>
            </TabsTrigger>
          </TabsList>

          {/* Programs Tab */}
          <TabsContent value="programs" className="pt-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Programs</CardTitle>
                    <CardDescription>Government skill development programs</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-8 w-[250px]"
                        placeholder="Search programs..."
                        value={searchQueries.programs}
                        onChange={(e) => handleSearchChange('programs', e.target.value)}
                      />
                    </div>
                    <Button variant="outline" onClick={() => handleDownload('programs')}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button onClick={() => { setEditingItemId(null); setProgramFormOpen(true); }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Program
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Ministry</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPrograms.map((program) => (
                      <TableRow key={program.id}>
                        <TableCell className="font-medium">{program.code}</TableCell>
                        <TableCell className="font-semibold">{program.name}</TableCell>
                        <TableCell className="max-w-[300px] truncate">{program.fullName}</TableCell>
                        <TableCell>{program.ministry}</TableCell>
                        <TableCell>
                          <Badge variant={program.status === 'active' ? 'default' : 'secondary'}>
                            {program.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit('programs', program.id)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleActionClick('programs', 'archive', program)}>
                              <Archive className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleActionClick('programs', 'delete', program)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
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
                  <div>
                    <CardTitle>Location Management</CardTitle>
                    <CardDescription>Manage hierarchical location data</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={locationSubType} onValueChange={(v) => setLocationSubType(v as LocationSubType)}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="state">States</SelectItem>
                        <SelectItem value="district">Districts</SelectItem>
                        <SelectItem value="block">Blocks</SelectItem>
                        <SelectItem value="panchayat">Panchayats</SelectItem>
                        <SelectItem value="village">Villages</SelectItem>
                        <SelectItem value="pincode">Pincodes</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-8 w-[200px]"
                        placeholder="Search locations..."
                        value={searchQueries.locations}
                        onChange={(e) => handleSearchChange('locations', e.target.value)}
                      />
                    </div>
                    <Button variant="outline" onClick={() => handleBulkUpload('locations')}>
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Bulk Upload
                    </Button>
                    <Button variant="outline" onClick={() => handleDownload('locations')}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button onClick={() => { setEditingItemId(null); setLocationFormOpen(true); }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add {locationSubType.charAt(0).toUpperCase() + locationSubType.slice(1)}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-4 text-sm text-muted-foreground">
                  <span>State</span>
                  <ChevronRight className="h-4 w-4" />
                  <span>District</span>
                  <ChevronRight className="h-4 w-4" />
                  <span>Block</span>
                  <ChevronRight className="h-4 w-4" />
                  <span>Panchayat</span>
                  <ChevronRight className="h-4 w-4" />
                  <span>Village</span>
                  <ChevronRight className="h-4 w-4" />
                  <span>Pincode</span>
                </div>
              </CardHeader>
              <CardContent>
                {renderLocationTable()}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sectors Tab */}
          <TabsContent value="sectors" className="pt-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Sectors</CardTitle>
                    <CardDescription>Industry sectors and Sector Skill Councils</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-8 w-[250px]"
                        placeholder="Search sectors..."
                        value={searchQueries.sectors}
                        onChange={(e) => handleSearchChange('sectors', e.target.value)}
                      />
                    </div>
                    <Button variant="outline" onClick={() => handleDownload('sectors')}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button onClick={() => { setEditingItemId(null); setSectorFormOpen(true); }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Sector
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Sector Skill Council</TableHead>
                      <TableHead>Job Roles</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSectors.map((sector) => (
                      <TableRow key={sector.id}>
                        <TableCell className="font-medium">{sector.code}</TableCell>
                        <TableCell className="font-semibold">{sector.name}</TableCell>
                        <TableCell>{sector.ssc}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{sector.jobRoles} roles</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={sector.status === 'active' ? 'default' : 'secondary'}>
                            {sector.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit('sectors', sector.id)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleActionClick('sectors', 'archive', sector)}>
                              <Archive className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleActionClick('sectors', 'delete', sector)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
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

          {/* Job Roles Tab */}
          <TabsContent value="jobroles" className="pt-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Job Roles</CardTitle>
                    <CardDescription>Training job roles with NSQF levels</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-8 w-[250px]"
                        placeholder="Search job roles..."
                        value={searchQueries.jobroles}
                        onChange={(e) => handleSearchChange('jobroles', e.target.value)}
                      />
                    </div>
                    <Button variant="outline" onClick={() => handleDownload('jobroles')}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button onClick={() => { setEditingItemId(null); setJobRoleFormOpen(true); }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Job Role
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Sector</TableHead>
                      <TableHead>NSQF Level</TableHead>
                      <TableHead>Training Hours</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredJobRoles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell className="font-medium">{role.code}</TableCell>
                        <TableCell className="font-semibold">{role.title}</TableCell>
                        <TableCell>{role.sector}</TableCell>
                        <TableCell>
                          <Badge variant="outline">Level {role.nsqfLevel}</Badge>
                        </TableCell>
                        <TableCell>{role.hours} hrs</TableCell>
                        <TableCell>
                          <Badge variant={role.status === 'active' ? 'default' : 'secondary'}>
                            {role.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit('jobroles', role.id)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleActionClick('jobroles', 'archive', role)}>
                              <Archive className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleActionClick('jobroles', 'delete', role)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
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
                  <div>
                    <CardTitle>Document Types</CardTitle>
                    <CardDescription>Required documents for candidate enrollment</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-8 w-[250px]"
                        placeholder="Search documents..."
                        value={searchQueries.documents}
                        onChange={(e) => handleSearchChange('documents', e.target.value)}
                      />
                    </div>
                    <Button variant="outline" onClick={() => handleDownload('documents')}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button onClick={() => { setEditingItemId(null); setDocumentFormOpen(true); }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Document
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Required</TableHead>
                      <TableHead>Formats</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.code}</TableCell>
                        <TableCell className="font-semibold">{doc.name}</TableCell>
                        <TableCell>{doc.category}</TableCell>
                        <TableCell>
                          <Badge variant={doc.required ? 'default' : 'outline'}>
                            {doc.required ? 'Required' : 'Optional'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{doc.formats}</TableCell>
                        <TableCell>
                          <Badge variant={doc.status === 'active' ? 'default' : 'secondary'}>
                            {doc.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit('documents', doc.id)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleActionClick('documents', 'archive', doc)}>
                              <Archive className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleActionClick('documents', 'delete', doc)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
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

        {/* Form Dialogs */}
        <ProgramForm
          open={programFormOpen}
          onOpenChange={setProgramFormOpen}
          itemId={editingItemId}
        />
        <SectorForm
          open={sectorFormOpen}
          onOpenChange={setSectorFormOpen}
          itemId={editingItemId}
        />
        <DirectorLocationForm
          open={locationFormOpen}
          onOpenChange={setLocationFormOpen}
          itemId={editingItemId}
          locationType={locationSubType}
        />
        <DirectorJobRoleForm
          open={jobRoleFormOpen}
          onOpenChange={setJobRoleFormOpen}
          itemId={editingItemId}
        />
        <DirectorDocumentForm
          open={documentFormOpen}
          onOpenChange={setDocumentFormOpen}
          itemId={editingItemId}
        />

        <MasterDataActionDialog
          type={actionDialog.type}
          open={actionDialog.open}
          onOpenChange={(open) => setActionDialog({ ...actionDialog, open })}
          itemName={actionDialog.itemName}
          category={actionDialog.category}
          onConfirm={handleActionConfirm}
        />
      </div>
    </MainLayout>
  );
};

export default DirectorMasterDataManagement;
