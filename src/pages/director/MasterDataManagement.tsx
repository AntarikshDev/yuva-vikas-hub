import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2, Archive, Download, FileSpreadsheet, Layers, MapPin, Briefcase, FileText, ChevronRight, FileDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MasterDataActionDialog } from '@/components/dialogs/MasterDataActionDialog';
import { ProgramForm } from '@/components/forms/ProgramForm';
import { SectorForm } from '@/components/forms/SectorForm';
import { DirectorLocationForm } from '@/components/forms/DirectorLocationForm';
import { DirectorJobRoleForm } from '@/components/forms/DirectorJobRoleForm';
import { DirectorDocumentForm } from '@/components/forms/DirectorDocumentForm';
import { downloadLocationTemplate } from '@/utils/locationTemplates';
import { LocationBulkUploadDialog } from '@/components/dialogs/LocationBulkUploadDialog';
import { 
  usePrograms, 
  useProgramMutations,
  useLocations, 
  useLocationMutations,
  useSectors, 
  useSectorMutations,
  useJobRoles, 
  useJobRoleMutations,
  useDocumentTypes,
  useDocumentTypeMutations,
} from '@/hooks/useMasterData';
import { Skeleton } from '@/components/ui/skeleton';
import type { LocationType } from '@/types/location';

type MasterDataCategory = 'programs' | 'locations' | 'sectors' | 'jobroles' | 'documents';
type LocationSubType = LocationType;

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
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);

  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Action dialog state
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    type: 'archive' | 'delete';
    itemName: string;
    itemId: string;
    category: MasterDataCategory;
  }>({
    open: false,
    type: 'archive',
    itemName: '',
    itemId: '',
    category: 'programs'
  });

  // Search states
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({
    programs: '',
    locations: '',
    sectors: '',
    jobroles: '',
    documents: ''
  });

  // RTK Query hooks for fetching data
  const { programs, isLoading: programsLoading } = usePrograms({ search: searchQueries.programs });
  const { locations, isLoading: locationsLoading } = useLocations({ type: locationSubType, search: searchQueries.locations });
  const { sectors, isLoading: sectorsLoading } = useSectors({ search: searchQueries.sectors });
  const { jobRoles, isLoading: jobRolesLoading } = useJobRoles({ search: searchQueries.jobroles });
  const { documentTypes, isLoading: documentsLoading } = useDocumentTypes({ search: searchQueries.documents });

  // RTK Query mutation hooks for CRUD operations
  const { deleteProgram } = useProgramMutations();
  const locationMutations = useLocationMutations(locationSubType);
  const { deleteSector } = useSectorMutations();
  const { deleteJobRole } = useJobRoleMutations();
  const { deleteDocumentType } = useDocumentTypeMutations();

  const handleSearchChange = (category: string, value: string) => {
    setSearchQueries({ ...searchQueries, [category]: value });
  };

  const handleEdit = (category: MasterDataCategory, id: string) => {
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
      category
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

  const handleActionConfirm = async () => {
    try {
      switch (actionDialog.category) {
        case 'programs':
          await deleteProgram(actionDialog.itemId);
          break;
        case 'locations':
          // Use the unified location mutations delete function
          await locationMutations.delete(actionDialog.itemId);
          break;
        case 'sectors':
          await deleteSector(actionDialog.itemId);
          break;
        case 'jobroles':
          await deleteJobRole(actionDialog.itemId);
          break;
        case 'documents':
          await deleteDocumentType(actionDialog.itemId);
          break;
      }
      
      toast({
        title: `${actionDialog.type === 'archive' ? 'Archived' : 'Deleted'} successfully`,
        description: `${actionDialog.itemName} has been ${actionDialog.type === 'archive' ? 'archived' : 'deleted'}.`,
      });
    } catch (error) {
      toast({
        title: 'Action failed',
        description: 'Failed to perform the action. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDownload = (category: string) => {
    toast({
      title: "Export initiated",
      description: `Exporting ${category} data to Excel...`,
    });
  };

  const handleBulkUpload = (category: string) => {
    if (category === 'locations') {
      setBulkUploadOpen(true);
    } else {
      toast({
        title: "Bulk Upload",
        description: `Opening bulk upload for ${category}...`,
      });
    }
  };

  const renderLoadingSkeleton = () => (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );

  const renderEmptyState = (category: string) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
        <FileText className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">No {category} found</h3>
      <p className="text-muted-foreground text-sm mt-1">
        Get started by adding your first {category.toLowerCase()}.
      </p>
    </div>
  );

  const renderLocationTable = () => {
    if (locationsLoading) return renderLoadingSkeleton();
    if (!locations || locations.length === 0) return renderEmptyState('Locations');

    const getColumns = () => {
      switch (locationSubType) {
        case 'state': return ['Code', 'Name', 'Districts', 'Status', 'Actions'];
        case 'district': return ['Name', 'State', 'Blocks', 'Status', 'Actions'];
        case 'block': return ['Name', 'District', 'Panchayats', 'Status', 'Actions'];
        case 'panchayat': return ['Name', 'Block', 'Villages', 'Status', 'Actions'];
        case 'village': return ['Name', 'Panchayat', 'Pincode', 'Status', 'Actions'];
        case 'pincode': return ['Pincode', 'Area', 'District', 'State', 'Status', 'Actions'];
        default: return ['Code', 'Name', 'Status', 'Actions'];
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
          {locations.map((item: any) => (
            <TableRow key={item.id}>
              {locationSubType === 'state' && <TableCell className="font-medium">{item.code}</TableCell>}
              {locationSubType === 'pincode' ? (
                <TableCell className="font-medium">{item.code}</TableCell>
              ) : (
                <TableCell>{item.name || item.area}</TableCell>
              )}
              {locationSubType === 'state' && <TableCell>{item.districtCount}</TableCell>}
              {locationSubType === 'district' && (
                <>
                  <TableCell>{item.stateName}</TableCell>
                  <TableCell>{item.blockCount}</TableCell>
                </>
              )}
              {locationSubType === 'block' && (
                <>
                  <TableCell>{item.districtName}</TableCell>
                  <TableCell>{item.panchayatCount}</TableCell>
                </>
              )}
              {locationSubType === 'panchayat' && (
                <>
                  <TableCell>{item.blockName}</TableCell>
                  <TableCell>{item.villageCount}</TableCell>
                </>
              )}
              {locationSubType === 'village' && (
                <>
                  <TableCell>{item.panchayatName}</TableCell>
                  <TableCell>{item.pincode}</TableCell>
                </>
              )}
              {locationSubType === 'pincode' && (
                <>
                  <TableCell>{item.area}</TableCell>
                  <TableCell>{item.districtName}</TableCell>
                  <TableCell>{item.stateName}</TableCell>
                </>
              )}
              <TableCell>
                <Badge variant={item.isActive ? 'default' : 'secondary'}>
                  {item.isActive ? 'active' : 'inactive'}
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

  const renderProgramsTable = () => {
    if (programsLoading) return renderLoadingSkeleton();
    if (!programs || programs.length === 0) return renderEmptyState('Programs');

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {programs.map((program: any) => (
            <TableRow key={program.id}>
              <TableCell className="font-medium">{program.code}</TableCell>
              <TableCell className="font-semibold">{program.name}</TableCell>
              <TableCell className="max-w-[300px] truncate">{program.fullName}</TableCell>
              <TableCell>
                <Badge variant={program.isActive ? 'default' : 'secondary'}>
                  {program.isActive ? 'active' : 'inactive'}
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
    );
  };

  const renderSectorsTable = () => {
    if (sectorsLoading) return renderLoadingSkeleton();
    if (!sectors || sectors.length === 0) return renderEmptyState('Sectors');

    return (
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
          {sectors.map((sector: any) => (
            <TableRow key={sector.id}>
              <TableCell className="font-medium">{sector.code}</TableCell>
              <TableCell className="font-semibold">{sector.name}</TableCell>
              <TableCell>{sector.ssc}</TableCell>
              <TableCell>
                <Badge variant="outline">{sector.jobRolesCount || 0} roles</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={sector.isActive ? 'default' : 'secondary'}>
                  {sector.isActive ? 'active' : 'inactive'}
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
    );
  };

  const renderJobRolesTable = () => {
    if (jobRolesLoading) return renderLoadingSkeleton();
    if (!jobRoles || jobRoles.length === 0) return renderEmptyState('Job Roles');

    return (
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
          {jobRoles.map((role: any) => (
            <TableRow key={role.id}>
              <TableCell className="font-medium">{role.code}</TableCell>
              <TableCell className="font-semibold">{role.title}</TableCell>
              <TableCell>{role.sectorName}</TableCell>
              <TableCell>
                <Badge variant="outline">Level {role.nsqfLevel}</Badge>
              </TableCell>
              <TableCell>{role.trainingHours} hrs</TableCell>
              <TableCell>
                <Badge variant={role.isActive ? 'default' : 'secondary'}>
                  {role.isActive ? 'active' : 'inactive'}
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
    );
  };

  const renderDocumentsTable = () => {
    if (documentsLoading) return renderLoadingSkeleton();
    if (!documentTypes || documentTypes.length === 0) return renderEmptyState('Documents');

    return (
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
          {documentTypes.map((doc: any) => (
            <TableRow key={doc.id}>
              <TableCell className="font-medium">{doc.code}</TableCell>
              <TableCell className="font-semibold">{doc.name}</TableCell>
              <TableCell>{doc.category}</TableCell>
              <TableCell>
                <Badge variant={doc.isRequired ? 'default' : 'outline'}>
                  {doc.isRequired ? 'Required' : 'Optional'}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {Array.isArray(doc.allowedFormats) ? doc.allowedFormats.join(', ') : doc.allowedFormats}
              </TableCell>
              <TableCell>
                <Badge variant={doc.isActive ? 'default' : 'secondary'}>
                  {doc.isActive ? 'active' : 'inactive'}
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
                {renderProgramsTable()}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Locations Tab */}
          <TabsContent value="locations" className="pt-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <CardTitle>Location Management</CardTitle>
                      <CardDescription>Manage hierarchical location data</CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <Select value={locationSubType} onValueChange={(v) => setLocationSubType(v as LocationSubType)}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg z-50">
                        <SelectItem value="state">States</SelectItem>
                        <SelectItem value="district">Districts</SelectItem>
                        <SelectItem value="block">Blocks</SelectItem>
                        <SelectItem value="panchayat">Panchayats</SelectItem>
                        <SelectItem value="village">Villages</SelectItem>
                        <SelectItem value="pincode">Pincodes</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <div className="relative flex-1 min-w-[150px] max-w-[250px]">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-8 w-full"
                        placeholder="Search..."
                        value={searchQueries.locations}
                        onChange={(e) => handleSearchChange('locations', e.target.value)}
                      />
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 ml-auto">
                      <Button variant="outline" size="sm" onClick={() => downloadLocationTemplate(locationSubType)}>
                        <FileDown className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Template</span>
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleBulkUpload('locations')}>
                        <FileSpreadsheet className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Bulk Upload</span>
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDownload('locations')}>
                        <Download className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Export</span>
                      </Button>
                      <Button size="sm" onClick={() => { setEditingItemId(null); setLocationFormOpen(true); }}>
                        <Plus className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Add</span>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground">
                    <span className={locationSubType === 'state' ? 'font-medium text-foreground' : ''}>State</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className={locationSubType === 'district' ? 'font-medium text-foreground' : ''}>District</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className={locationSubType === 'block' ? 'font-medium text-foreground' : ''}>Block</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className={locationSubType === 'panchayat' ? 'font-medium text-foreground' : ''}>Panchayat</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className={locationSubType === 'village' ? 'font-medium text-foreground' : ''}>Village</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className={locationSubType === 'pincode' ? 'font-medium text-foreground' : ''}>Pincode</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="overflow-x-auto">
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
                {renderSectorsTable()}
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
                {renderJobRolesTable()}
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
                {renderDocumentsTable()}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Form Dialogs */}
        <ProgramForm
          open={programFormOpen}
          onOpenChange={setProgramFormOpen}
          itemId={editingItemId ? parseInt(editingItemId) : null}
        />
        <SectorForm
          open={sectorFormOpen}
          onOpenChange={setSectorFormOpen}
          itemId={editingItemId ? parseInt(editingItemId) : null}
        />
        <DirectorLocationForm
          open={locationFormOpen}
          onOpenChange={setLocationFormOpen}
          itemId={editingItemId ? parseInt(editingItemId) : null}
          locationType={locationSubType}
        />
        <DirectorJobRoleForm
          open={jobRoleFormOpen}
          onOpenChange={setJobRoleFormOpen}
          itemId={editingItemId ? parseInt(editingItemId) : null}
        />
        <DirectorDocumentForm
          open={documentFormOpen}
          onOpenChange={setDocumentFormOpen}
          itemId={editingItemId ? parseInt(editingItemId) : null}
        />

        <MasterDataActionDialog
          type={actionDialog.type}
          open={actionDialog.open}
          onOpenChange={(open) => setActionDialog({ ...actionDialog, open })}
          itemName={actionDialog.itemName}
          category={getCategoryName(actionDialog.category)}
          onConfirm={handleActionConfirm}
        />

        <LocationBulkUploadDialog
          open={bulkUploadOpen}
          onOpenChange={setBulkUploadOpen}
          locationType={locationSubType}
        />
      </div>
    </MainLayout>
  );
};

export default DirectorMasterDataManagement;
