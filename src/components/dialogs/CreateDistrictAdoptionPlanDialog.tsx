import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Upload, 
  Download, 
  FileSpreadsheet, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  PlayCircle,
  BarChart3,
  TrendingUp,
  MapPin,
  Route,
  AlertCircle,
  Info,
  CalendarDays
} from 'lucide-react';
import { toast } from 'sonner';
import { downloadTemplate, getJharkhandMockData, DistrictAnalysisData } from '@/utils/districtTemplateGenerator';
import { parseCSV, readFileAsText, validateEnrolmentData, validateDensityData, validateDistanceData } from '@/utils/csvParser';
import { useCreateDistrictAdoptionPlanMutation } from '@/store/api/apiSlice';

interface CreateDistrictAdoptionPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workOrderId: string;
  onPlanCreated: (data: DistrictAnalysisData, year: string) => void;
}

interface UploadedFile {
  file: File;
  status: 'pending' | 'success' | 'error';
  data?: any[];
  errors?: string[];
}

// Financial years for selection
const financialYears = [
  { value: '2024-25', label: 'FY 2024-25' },
  { value: '2023-24', label: 'FY 2023-24' },
  { value: '2022-23', label: 'FY 2022-23' },
  { value: '2021-22', label: 'FY 2021-22' },
  { value: '2020-21', label: 'FY 2020-21' },
];

// Trade categories - SSMO, SMO, ST, GDA, HHA, IT, FMA
const tradeCategories = ['SSMO', 'SMO', 'ST', 'GDA', 'HHA', 'IT', 'FMA'];

const dataTypes = [
  { id: 'enrolment', label: 'Enrolment', icon: BarChart3, requiredCols: ['District', 'Total', ...tradeCategories] },
  { id: 'tradewise', label: 'Trade-wise', icon: TrendingUp, requiredCols: ['District', ...tradeCategories] },
  { id: 'density', label: 'Density', icon: MapPin, requiredCols: ['District', 'Population', 'Area_SqKm', 'Density'] },
  { id: 'distance', label: 'Distance', icon: Route, requiredCols: ['District', 'TC1_Name', 'TC1_Distance_Km', 'TC2_Name', 'TC2_Distance_Km'] },
];

export const CreateDistrictAdoptionPlanDialog: React.FC<CreateDistrictAdoptionPlanDialogProps> = ({
  open,
  onOpenChange,
  workOrderId,
  onPlanCreated
}) => {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFile>>({});
  const [selectedYear, setSelectedYear] = useState('2023-24');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingTutorial, setIsLoadingTutorial] = useState(false);

  // RTK Query mutation
  const [createPlan] = useCreateDistrictAdoptionPlanMutation();

  const handleFileUpload = useCallback(async (dataType: string, file: File) => {
    setUploadedFiles(prev => ({
      ...prev,
      [dataType]: { file, status: 'pending' }
    }));

    try {
      const content = await readFileAsText(file);
      const dataConfig = dataTypes.find(dt => dt.id === dataType);
      
      if (!dataConfig) {
        throw new Error('Unknown data type');
      }

      const result = parseCSV(content, dataConfig.requiredCols);
      
      if (!result.success) {
        setUploadedFiles(prev => ({
          ...prev,
          [dataType]: { file, status: 'error', errors: result.errors }
        }));
        return;
      }

      // Additional validation based on type
      let validationErrors: string[] = [];
      switch (dataType) {
        case 'enrolment':
          validationErrors = validateEnrolmentData(result.data);
          break;
        case 'density':
          validationErrors = validateDensityData(result.data);
          break;
        case 'distance':
          validationErrors = validateDistanceData(result.data);
          break;
      }

      if (validationErrors.length > 0) {
        setUploadedFiles(prev => ({
          ...prev,
          [dataType]: { file, status: 'error', errors: validationErrors }
        }));
        return;
      }

      setUploadedFiles(prev => ({
        ...prev,
        [dataType]: { file, status: 'success', data: result.data }
      }));

      toast.success(`${file.name} uploaded successfully`);
    } catch (error) {
      setUploadedFiles(prev => ({
        ...prev,
        [dataType]: { file, status: 'error', errors: ['Failed to parse file'] }
      }));
    }
  }, []);

  const handleDrop = useCallback((dataType: string) => (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.csv') || file.name.endsWith('.xlsx'))) {
      handleFileUpload(dataType, file);
    } else {
      toast.error('Please upload a CSV or Excel file');
    }
  }, [handleFileUpload]);

  const handleFileSelect = (dataType: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(dataType, file);
    }
  };

  const handleDownloadTemplate = (type: 'enrolment' | 'density' | 'distance' | 'blocks' | 'tradewise' | 'all') => {
    downloadTemplate(type);
    toast.success('Template downloaded successfully');
  };

  const handleLoadTutorialData = async () => {
    setIsLoadingTutorial(true);
    try {
      const jharkhandData = getJharkhandMockData();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onPlanCreated(jharkhandData, '2022-23');
      toast.success('Tutorial data loaded successfully! Viewing Jharkhand FY 2022-23 demo data.');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to load tutorial data');
    } finally {
      setIsLoadingTutorial(false);
    }
  };

  const handleCreatePlan = async () => {
    setIsProcessing(true);
    try {
      const currentUser = 'current-user-id'; // Would come from auth context
      const uploadedDate = new Date().toISOString();

      // Build unified payload with all 4 CSVs data
      const payload = {
        workOrderId,
        financialYear: selectedYear,
        createdBy: currentUser,
        uploadedDate,
        enrolmentData: uploadedFiles.enrolment?.data?.map((d: any) => ({
          district: d.District,
          total: Number(d.Total) || 0,
          ssmo: Number(d.SSMO) || 0,
          smo: Number(d.SMO) || 0,
          st: Number(d.ST) || 0,
          gda: Number(d.GDA) || 0,
          hha: Number(d.HHA) || 0,
          it: Number(d.IT) || 0,
          fma: Number(d.FMA) || 0,
          workOrderId,
          createdBy: currentUser,
          uploadedDate,
          financialYear: selectedYear
        })) || [],
        tradewiseData: uploadedFiles.tradewise?.data?.map((d: any) => ({
          district: d.District,
          ssmo: Number(d.SSMO) || 0,
          smo: Number(d.SMO) || 0,
          st: Number(d.ST) || 0,
          gda: Number(d.GDA) || 0,
          hha: Number(d.HHA) || 0,
          it: Number(d.IT) || 0,
          fma: Number(d.FMA) || 0,
          workOrderId,
          createdBy: currentUser,
          uploadedDate,
          financialYear: selectedYear
        })) || [],
        densityData: uploadedFiles.density?.data?.map((d: any) => ({
          district: d.District,
          population: Number(d.Population) || 0,
          area: Number(d.Area_SqKm) || 0,
          density: Number(d.Density) || 0,
          literacy: Number(d.Literacy_Percent) || 0,
          bplPercentage: Number(d.BPL_Percent) || 0,
          workOrderId,
          createdBy: currentUser,
          uploadedDate,
          financialYear: selectedYear
        })) || [],
        distanceData: uploadedFiles.distance?.data?.map((d: any) => ({
          district: d.District,
          tc1Name: d.TC1_Name || '',
          tc1Distance: Number(d.TC1_Distance_Km) || 0,
          tc2Name: d.TC2_Name || '',
          tc2Distance: Number(d.TC2_Distance_Km) || 0,
          workOrderId,
          createdBy: currentUser,
          uploadedDate,
          financialYear: selectedYear
        })) || []
      };

      // Try to call API, fallback to mock on failure
      try {
        await createPlan(payload).unwrap();
      } catch {
        // API failed, use mock data flow
      }

      // If not all data provided, fill with defaults
      const mockData = getJharkhandMockData();
      const fullData: DistrictAnalysisData = {
        enrolment: payload.enrolmentData.length > 0 
          ? payload.enrolmentData.map(d => ({
              district: d.district,
              total: d.total,
              ssmo: d.ssmo,
              smo: d.smo,
              st: d.st,
              gda: d.gda,
              hha: d.hha,
              it: d.it,
              fma: d.fma
            }))
          : mockData.enrolment,
        tradeWise: payload.tradewiseData.length > 0
          ? payload.tradewiseData.flatMap(d => 
              tradeCategories.map(trade => ({
                district: d.district,
                trade,
                count: d[trade.toLowerCase() as keyof typeof d] as number || 0
              }))
            )
          : mockData.tradeWise,
        density: payload.densityData.length > 0
          ? payload.densityData.map(d => ({
              district: d.district,
              population: d.population,
              area: d.area,
              density: d.density,
              literacy: d.literacy,
              bplPercentage: d.bplPercentage
            }))
          : mockData.density,
        distance: payload.distanceData.length > 0
          ? payload.distanceData.map(d => ({
              district: d.district,
              tc1Name: d.tc1Name,
              tc1Distance: d.tc1Distance,
              tc2Name: d.tc2Name,
              tc2Distance: d.tc2Distance
            }))
          : mockData.distance,
        blocks: mockData.blocks
      };

      onPlanCreated(fullData, selectedYear);
      toast.success(`District adoption plan created for ${selectedYear} successfully!`);
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to create plan');
    } finally {
      setIsProcessing(false);
    }
  };

  const uploadedCount = Object.values(uploadedFiles).filter(f => f.status === 'success').length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Create District Adoption Plan
          </DialogTitle>
          <DialogDescription>
            Upload your district analysis data or use the Jharkhand tutorial data to get started.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Data
            </TabsTrigger>
            <TabsTrigger value="tutorial" className="flex items-center gap-2">
              <PlayCircle className="h-4 w-4" />
              Tutorial Mode
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-4 space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Upload CSV files for each analysis type. Download templates pre-filled with Jharkhand sample data for reference.
              </AlertDescription>
            </Alert>

            {/* Single Year Selection for All Data */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Financial Year (for all data)
                </CardTitle>
                <CardDescription className="text-xs">
                  Select the financial year for all uploaded data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {financialYears.map((fy) => (
                      <SelectItem key={fy.value} value={fy.value}>
                        {fy.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dataTypes.map((type) => {
                const uploadState = uploadedFiles[type.id];
                const Icon = type.icon;

                return (
                  <Card key={type.id} className={uploadState?.status === 'success' ? 'border-green-500' : uploadState?.status === 'error' ? 'border-destructive' : ''}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {type.label} Data
                        </span>
                        {uploadState?.status === 'success' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                        {uploadState?.status === 'error' && <XCircle className="h-4 w-4 text-destructive" />}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Required: {type.requiredCols.slice(0, 4).join(', ')}{type.requiredCols.length > 4 ? '...' : ''}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div
                        className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                        onDrop={handleDrop(type.id)}
                        onDragOver={(e) => e.preventDefault()}
                      >
                        {uploadState?.status === 'pending' ? (
                          <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                        ) : uploadState?.status === 'success' ? (
                          <div className="space-y-1">
                            <CheckCircle2 className="h-6 w-6 mx-auto text-green-500" />
                            <p className="text-xs text-muted-foreground">{uploadState.file.name}</p>
                            <Badge variant="secondary">{uploadState.data?.length} rows</Badge>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                            <p className="text-xs text-muted-foreground">Drop CSV here or click to browse</p>
                          </>
                        )}
                        <input
                          type="file"
                          accept=".csv,.xlsx"
                          className="hidden"
                          id={`file-${type.id}`}
                          onChange={handleFileSelect(type.id)}
                        />
                      </div>

                      {uploadState?.status === 'error' && uploadState.errors && (
                        <Alert variant="destructive" className="py-2">
                          <AlertCircle className="h-3 w-3" />
                          <AlertDescription className="text-xs">
                            {uploadState.errors[0]}
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => document.getElementById(`file-${type.id}`)?.click()}
                        >
                          <Upload className="h-3 w-3 mr-1" />
                          Browse
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadTemplate(type.id as any)}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2">
                <Badge variant={uploadedCount > 0 ? 'default' : 'secondary'}>
                  {uploadedCount}/4 files uploaded
                </Badge>
                <Badge variant="outline">{selectedYear}</Badge>
                <Button 
                  variant="link" 
                  size="sm"
                  onClick={() => handleDownloadTemplate('all')}
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download All Templates
                </Button>
              </div>
              <Button
                onClick={handleCreatePlan}
                disabled={uploadedCount === 0 || isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                )}
                Create Plan
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="tutorial" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlayCircle className="h-5 w-5 text-primary" />
                  Tutorial Mode - Jharkhand Demo Data
                </CardTitle>
                <CardDescription>
                  Load pre-configured Jharkhand state data to explore the District Adoption features. 
                  This is perfect for client demonstrations and understanding the system.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg bg-muted text-center">
                    <p className="text-2xl font-bold">24</p>
                    <p className="text-xs text-muted-foreground">Districts</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted text-center">
                    <p className="text-2xl font-bold">260+</p>
                    <p className="text-xs text-muted-foreground">Blocks</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted text-center">
                    <p className="text-2xl font-bold">3</p>
                    <p className="text-xs text-muted-foreground">Training Centers</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted text-center">
                    <p className="text-2xl font-bold">FY 22-23</p>
                    <p className="text-xs text-muted-foreground">Data Year</p>
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>What's included:</strong> Census population data, district density metrics, 
                    distance from training centers, historical enrolment figures, and block-level statistics.
                  </AlertDescription>
                </Alert>

                <Button 
                  onClick={handleLoadTutorialData}
                  disabled={isLoadingTutorial}
                  className="w-full"
                  size="lg"
                >
                  {isLoadingTutorial ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <PlayCircle className="h-4 w-4 mr-2" />
                  )}
                  Load Jharkhand Tutorial Data
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDistrictAdoptionPlanDialog;
