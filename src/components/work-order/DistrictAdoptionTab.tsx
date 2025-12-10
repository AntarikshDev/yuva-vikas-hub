import { useState } from "react";
import { Upload, FileText, Download, Trash2, MapPin, Users, Baby, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

interface DistrictAdoptionTabProps {
  workOrderId: string;
  role: 'director' | 'national-head';
  isStarted: boolean;
}

// Census 2011 based mock data for Indian states
const mockStates = [
  { id: "MH", name: "Maharashtra" },
  { id: "UP", name: "Uttar Pradesh" },
  { id: "BR", name: "Bihar" },
  { id: "RJ", name: "Rajasthan" },
  { id: "MP", name: "Madhya Pradesh" },
  { id: "GJ", name: "Gujarat" },
  { id: "KA", name: "Karnataka" },
  { id: "TN", name: "Tamil Nadu" },
];

// Census 2011 based district data with demographics
const mockDistricts: Record<string, Array<{
  id: string;
  name: string;
  population: number;
  male: number;
  female: number;
  sexRatio: number;
  literacy: number;
  age0_6: number;
  age7_14: number;
  age15_59: number;
  age60Plus: number;
  bplPopulation: number;
  bplPercentage: number;
  ruralPopulation: number;
  urbanPopulation: number;
  adoptionStatus: 'not_adopted' | 'proposed' | 'adopted' | 'active';
}>> = {
  MH: [
    { id: "MH001", name: "Mumbai", population: 12442373, male: 6715931, female: 5726442, sexRatio: 853, literacy: 89.21, age0_6: 1046376, age7_14: 1368661, age15_59: 8651276, age60Plus: 1376060, bplPopulation: 1244237, bplPercentage: 10.0, ruralPopulation: 0, urbanPopulation: 12442373, adoptionStatus: 'not_adopted' },
    { id: "MH002", name: "Pune", population: 9426959, male: 4936463, female: 4490496, sexRatio: 910, literacy: 87.19, age0_6: 942696, age7_14: 1036965, age15_59: 6598871, age60Plus: 848427, bplPopulation: 1414044, bplPercentage: 15.0, ruralPopulation: 4241632, urbanPopulation: 5185327, adoptionStatus: 'adopted' },
    { id: "MH003", name: "Nagpur", population: 4653171, male: 2364078, female: 2289093, sexRatio: 968, literacy: 89.52, age0_6: 465317, age7_14: 512049, age15_59: 3257220, age60Plus: 418585, bplPopulation: 698976, bplPercentage: 15.0, ruralPopulation: 2326586, urbanPopulation: 2326585, adoptionStatus: 'active' },
    { id: "MH004", name: "Thane", population: 11054131, male: 5896395, female: 5157736, sexRatio: 875, literacy: 84.53, age0_6: 1326496, age7_14: 1215954, age15_59: 7737892, age60Plus: 773789, bplPopulation: 1658120, bplPercentage: 15.0, ruralPopulation: 5527066, urbanPopulation: 5527065, adoptionStatus: 'proposed' },
  ],
  UP: [
    { id: "UP001", name: "Lucknow", population: 4589838, male: 2417968, female: 2171870, sexRatio: 898, literacy: 77.29, age0_6: 596778, age7_14: 596078, age15_59: 3029093, age60Plus: 367889, bplPopulation: 1284354, bplPercentage: 28.0, ruralPopulation: 1836735, urbanPopulation: 2753103, adoptionStatus: 'not_adopted' },
    { id: "UP002", name: "Varanasi", population: 3676841, male: 1921992, female: 1754849, sexRatio: 913, literacy: 75.60, age0_6: 515358, age7_14: 478389, age15_59: 2389947, age60Plus: 293147, bplPopulation: 1176589, bplPercentage: 32.0, ruralPopulation: 2573789, urbanPopulation: 1103052, adoptionStatus: 'adopted' },
    { id: "UP003", name: "Kanpur Nagar", population: 4581268, male: 2441289, female: 2139979, sexRatio: 877, literacy: 79.65, age0_6: 595565, age7_14: 595565, age15_59: 3023237, age60Plus: 366901, bplPopulation: 1374380, bplPercentage: 30.0, ruralPopulation: 1832507, urbanPopulation: 2748761, adoptionStatus: 'not_adopted' },
  ],
  BR: [
    { id: "BR001", name: "Patna", population: 5838465, male: 3078512, female: 2759953, sexRatio: 897, literacy: 70.68, age0_6: 817385, age7_14: 759000, age15_59: 3795003, age60Plus: 467077, bplPopulation: 1984078, bplPercentage: 34.0, ruralPopulation: 4087726, urbanPopulation: 1750739, adoptionStatus: 'not_adopted' },
    { id: "BR002", name: "Gaya", population: 4391418, male: 2282903, female: 2108515, sexRatio: 924, literacy: 63.67, age0_6: 658713, age7_14: 571284, age15_59: 2854422, age60Plus: 306999, bplPopulation: 1581111, bplPercentage: 36.0, ruralPopulation: 3952276, urbanPopulation: 439142, adoptionStatus: 'proposed' },
  ],
  RJ: [
    { id: "RJ001", name: "Jaipur", population: 6626178, male: 3468477, female: 3157701, sexRatio: 911, literacy: 75.51, age0_6: 861004, age7_14: 861003, age15_59: 4306015, age60Plus: 598156, bplPopulation: 1127050, bplPercentage: 17.0, ruralPopulation: 3974507, urbanPopulation: 2651671, adoptionStatus: 'active' },
    { id: "RJ002", name: "Jodhpur", population: 3687165, male: 1925028, female: 1762137, sexRatio: 915, literacy: 65.94, age0_6: 516603, age7_14: 479332, age15_59: 2396658, age60Plus: 294572, bplPopulation: 811176, bplPercentage: 22.0, ruralPopulation: 2581016, urbanPopulation: 1106149, adoptionStatus: 'not_adopted' },
  ],
  MP: [
    { id: "MP001", name: "Indore", population: 3276697, male: 1697044, female: 1579653, sexRatio: 930, literacy: 85.18, age0_6: 393204, age7_14: 426771, age15_59: 2130853, age60Plus: 325869, bplPopulation: 655339, bplPercentage: 20.0, ruralPopulation: 1310679, urbanPopulation: 1966018, adoptionStatus: 'adopted' },
    { id: "MP002", name: "Bhopal", population: 2371061, male: 1239378, female: 1131683, sexRatio: 913, literacy: 82.26, age0_6: 308238, age7_14: 308238, age15_59: 1541190, age60Plus: 213395, bplPopulation: 521633, bplPercentage: 22.0, ruralPopulation: 711318, urbanPopulation: 1659743, adoptionStatus: 'not_adopted' },
  ],
  GJ: [
    { id: "GJ001", name: "Ahmedabad", population: 7214225, male: 3801780, female: 3412445, sexRatio: 898, literacy: 85.31, age0_6: 793565, age7_14: 865707, age15_59: 4977214, age60Plus: 577739, bplPopulation: 1010391, bplPercentage: 14.0, ruralPopulation: 2885690, urbanPopulation: 4328535, adoptionStatus: 'active' },
    { id: "GJ002", name: "Surat", population: 6081322, male: 3400988, female: 2680334, sexRatio: 788, literacy: 85.53, age0_6: 729759, age7_14: 669345, age15_59: 4196112, age60Plus: 486106, bplPopulation: 851385, bplPercentage: 14.0, ruralPopulation: 1824397, urbanPopulation: 4256925, adoptionStatus: 'not_adopted' },
  ],
  KA: [
    { id: "KA001", name: "Bengaluru Urban", population: 9621551, male: 5022661, female: 4598890, sexRatio: 916, literacy: 87.67, age0_6: 866540, age7_14: 1058371, age15_59: 6831501, age60Plus: 865139, bplPopulation: 962155, bplPercentage: 10.0, ruralPopulation: 962155, urbanPopulation: 8659396, adoptionStatus: 'adopted' },
    { id: "KA002", name: "Mysuru", population: 2994744, male: 1509690, female: 1485054, sexRatio: 984, literacy: 72.79, age0_6: 329422, age7_14: 359369, age15_59: 1947584, age60Plus: 358369, bplPopulation: 598949, bplPercentage: 20.0, ruralPopulation: 2096321, urbanPopulation: 898423, adoptionStatus: 'proposed' },
  ],
  TN: [
    { id: "TN001", name: "Chennai", population: 4646732, male: 2335844, female: 2310888, sexRatio: 989, literacy: 90.18, age0_6: 418206, age7_14: 510340, age15_59: 3253712, age60Plus: 464474, bplPopulation: 464673, bplPercentage: 10.0, ruralPopulation: 0, urbanPopulation: 4646732, adoptionStatus: 'active' },
    { id: "TN002", name: "Coimbatore", population: 3458045, male: 1742704, female: 1715341, sexRatio: 985, literacy: 84.69, age0_6: 311224, age7_14: 380385, age15_59: 2419232, age60Plus: 347204, bplPopulation: 518707, bplPercentage: 15.0, ruralPopulation: 1729023, urbanPopulation: 1729022, adoptionStatus: 'not_adopted' },
  ],
};

// Block level data (Census 2011 based)
const mockBlocks: Record<string, Array<{
  id: string;
  name: string;
  population: number;
  male: number;
  female: number;
  bplPercentage: number;
  villages: number;
  panchayats: number;
}>> = {
  MH003: [ // Nagpur blocks
    { id: "BLK001", name: "Nagpur Urban", population: 1234567, male: 640000, female: 594567, bplPercentage: 12.0, villages: 0, panchayats: 0 },
    { id: "BLK002", name: "Kamptee", population: 234567, male: 121000, female: 113567, bplPercentage: 18.0, villages: 145, panchayats: 42 },
    { id: "BLK003", name: "Hingna", population: 189456, male: 98000, female: 91456, bplPercentage: 22.0, villages: 112, panchayats: 38 },
    { id: "BLK004", name: "Saoner", population: 156789, male: 81000, female: 75789, bplPercentage: 25.0, villages: 98, panchayats: 32 },
    { id: "BLK005", name: "Kalmeshwar", population: 143210, male: 74000, female: 69210, bplPercentage: 20.0, villages: 87, panchayats: 28 },
  ],
  MH002: [ // Pune blocks
    { id: "BLK006", name: "Pune City", population: 3115431, male: 1620000, female: 1495431, bplPercentage: 8.0, villages: 0, panchayats: 0 },
    { id: "BLK007", name: "Haveli", population: 945678, male: 490000, female: 455678, bplPercentage: 15.0, villages: 234, panchayats: 65 },
    { id: "BLK008", name: "Mulshi", population: 234567, male: 121500, female: 113067, bplPercentage: 18.0, villages: 156, panchayats: 48 },
    { id: "BLK009", name: "Maval", population: 312456, male: 162000, female: 150456, bplPercentage: 20.0, villages: 189, panchayats: 52 },
  ],
};

// Panchayat level data
const mockPanchayats: Record<string, Array<{
  id: string;
  name: string;
  population: number;
  male: number;
  female: number;
  bplFamilies: number;
  villages: number;
}>> = {
  BLK002: [
    { id: "PAN001", name: "Kamptee Gram Panchayat", population: 45678, male: 23500, female: 22178, bplFamilies: 1823, villages: 12 },
    { id: "PAN002", name: "Koradi Gram Panchayat", population: 32456, male: 16800, female: 15656, bplFamilies: 1298, villages: 8 },
    { id: "PAN003", name: "Kanhan Gram Panchayat", population: 28765, male: 14900, female: 13865, bplFamilies: 1150, villages: 6 },
    { id: "PAN004", name: "Mauda Gram Panchayat", population: 18234, male: 9400, female: 8834, bplFamilies: 729, villages: 5 },
  ],
};

// Village level data
const mockVillages: Record<string, Array<{
  id: string;
  name: string;
  population: number;
  male: number;
  female: number;
  bplFamilies: number;
  households: number;
}>> = {
  PAN001: [
    { id: "VIL001", name: "Kamptee Khurd", population: 4567, male: 2350, female: 2217, bplFamilies: 182, households: 912 },
    { id: "VIL002", name: "Kamptee Bk", population: 3456, male: 1780, female: 1676, bplFamilies: 138, households: 691 },
    { id: "VIL003", name: "Pardi", population: 2345, male: 1210, female: 1135, bplFamilies: 94, households: 469 },
    { id: "VIL004", name: "Satak", population: 1890, male: 975, female: 915, bplFamilies: 76, households: 378 },
  ],
};

interface PolicyDocument {
  id: string;
  name: string;
  uploadedDate: string;
  size: string;
  type: string;
}

const DistrictAdoptionTab = ({ workOrderId, role, isStarted }: DistrictAdoptionTabProps) => {
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("");
  const [selectedPanchayat, setSelectedPanchayat] = useState("");
  const [policyDocuments, setPolicyDocuments] = useState<PolicyDocument[]>([
    { id: "1", name: "District_Adoption_Policy_2024.pdf", uploadedDate: "2024-01-15", size: "2.5 MB", type: "Policy" },
    { id: "2", name: "Census_Report_2011.pdf", uploadedDate: "2024-01-10", size: "5.8 MB", type: "Census" },
  ]);
  const [hierarchyTab, setHierarchyTab] = useState("district");

  const canEdit = role === 'national-head' && isStarted;

  const districts = selectedState ? mockDistricts[selectedState] || [] : [];
  const selectedDistrictData = districts.find(d => d.id === selectedDistrict);
  const blocks = selectedDistrict ? mockBlocks[selectedDistrict] || [] : [];
  const selectedBlockData = blocks.find(b => b.id === selectedBlock);
  const panchayats = selectedBlock ? mockPanchayats[selectedBlock] || [] : [];
  const selectedPanchayatData = panchayats.find(p => p.id === selectedPanchayat);
  const villages = selectedPanchayat ? mockVillages[selectedPanchayat] || [] : [];

  const handleAdoptDistrict = (districtId: string) => {
    toast({
      title: "District Adopted",
      description: "District has been marked for adoption in this work order.",
    });
  };

  const handleUploadDocument = () => {
    const newDoc: PolicyDocument = {
      id: String(Date.now()),
      name: `Policy_Document_${new Date().toISOString().split('T')[0]}.pdf`,
      uploadedDate: new Date().toISOString().split('T')[0],
      size: "1.2 MB",
      type: "Policy",
    };
    setPolicyDocuments([...policyDocuments, newDoc]);
    toast({
      title: "Document Uploaded",
      description: "Policy document has been uploaded successfully.",
    });
  };

  const handleDeleteDocument = (docId: string) => {
    setPolicyDocuments(policyDocuments.filter(d => d.id !== docId));
    toast({
      title: "Document Deleted",
      description: "Policy document has been removed.",
    });
  };

  const getAdoptionBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      not_adopted: { variant: "outline", label: "Not Adopted" },
      proposed: { variant: "secondary", label: "Proposed" },
      adopted: { variant: "default", label: "Adopted" },
      active: { variant: "default", label: "Active" },
    };
    const config = variants[status] || variants.not_adopted;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatNumber = (num: number) => num.toLocaleString('en-IN');

  return (
    <div className="space-y-6">
      {/* Location Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>State</Label>
              <Select value={selectedState} onValueChange={(value) => {
                setSelectedState(value);
                setSelectedDistrict("");
                setSelectedBlock("");
                setSelectedPanchayat("");
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  {mockStates.map((state) => (
                    <SelectItem key={state.id} value={state.id}>{state.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>District</Label>
              <Select value={selectedDistrict} onValueChange={(value) => {
                setSelectedDistrict(value);
                setSelectedBlock("");
                setSelectedPanchayat("");
              }} disabled={!selectedState}>
                <SelectTrigger>
                  <SelectValue placeholder="Select District" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((district) => (
                    <SelectItem key={district.id} value={district.id}>{district.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Block</Label>
              <Select value={selectedBlock} onValueChange={(value) => {
                setSelectedBlock(value);
                setSelectedPanchayat("");
              }} disabled={!selectedDistrict || blocks.length === 0}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Block" />
                </SelectTrigger>
                <SelectContent>
                  {blocks.map((block) => (
                    <SelectItem key={block.id} value={block.id}>{block.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Panchayat</Label>
              <Select value={selectedPanchayat} onValueChange={setSelectedPanchayat} disabled={!selectedBlock || panchayats.length === 0}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Panchayat" />
                </SelectTrigger>
                <SelectContent>
                  {panchayats.map((panchayat) => (
                    <SelectItem key={panchayat.id} value={panchayat.id}>{panchayat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* District Demographics - Census 2011 Data */}
      {selectedDistrictData && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {selectedDistrictData.name} - Census 2011 Demographics
              </CardTitle>
              {getAdoptionBadge(selectedDistrictData.adoptionStatus)}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Population Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-primary/10 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Total Population</p>
                <p className="text-2xl font-bold">{formatNumber(selectedDistrictData.population)}</p>
              </div>
              <div className="bg-blue-500/10 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Literacy Rate</p>
                <p className="text-2xl font-bold">{selectedDistrictData.literacy}%</p>
              </div>
              <div className="bg-amber-500/10 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Sex Ratio</p>
                <p className="text-2xl font-bold">{selectedDistrictData.sexRatio}</p>
                <p className="text-xs text-muted-foreground">females per 1000 males</p>
              </div>
              <div className="bg-destructive/10 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">BPL Population</p>
                <p className="text-2xl font-bold">{selectedDistrictData.bplPercentage}%</p>
                <p className="text-xs text-muted-foreground">{formatNumber(selectedDistrictData.bplPopulation)}</p>
              </div>
            </div>

            {/* Gender Distribution */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Gender Distribution
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Male</span>
                    <span>{formatNumber(selectedDistrictData.male)} ({((selectedDistrictData.male / selectedDistrictData.population) * 100).toFixed(1)}%)</span>
                  </div>
                  <Progress value={(selectedDistrictData.male / selectedDistrictData.population) * 100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Female</span>
                    <span>{formatNumber(selectedDistrictData.female)} ({((selectedDistrictData.female / selectedDistrictData.population) * 100).toFixed(1)}%)</span>
                  </div>
                  <Progress value={(selectedDistrictData.female / selectedDistrictData.population) * 100} className="h-2" />
                </div>
              </div>
            </div>

            {/* Age Distribution */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Baby className="h-4 w-4" />
                Age Distribution
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="border rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">0-6 Years</p>
                  <p className="font-semibold">{formatNumber(selectedDistrictData.age0_6)}</p>
                  <p className="text-xs text-muted-foreground">{((selectedDistrictData.age0_6 / selectedDistrictData.population) * 100).toFixed(1)}%</p>
                </div>
                <div className="border rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">7-14 Years</p>
                  <p className="font-semibold">{formatNumber(selectedDistrictData.age7_14)}</p>
                  <p className="text-xs text-muted-foreground">{((selectedDistrictData.age7_14 / selectedDistrictData.population) * 100).toFixed(1)}%</p>
                </div>
                <div className="border rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">15-59 Years</p>
                  <p className="font-semibold">{formatNumber(selectedDistrictData.age15_59)}</p>
                  <p className="text-xs text-muted-foreground">{((selectedDistrictData.age15_59 / selectedDistrictData.population) * 100).toFixed(1)}%</p>
                </div>
                <div className="border rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">60+ Years</p>
                  <p className="font-semibold">{formatNumber(selectedDistrictData.age60Plus)}</p>
                  <p className="text-xs text-muted-foreground">{((selectedDistrictData.age60Plus / selectedDistrictData.population) * 100).toFixed(1)}%</p>
                </div>
              </div>
            </div>

            {/* Rural/Urban Distribution */}
            <div className="space-y-3">
              <h4 className="font-medium">Rural/Urban Distribution</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Rural Population</p>
                  <p className="font-semibold">{formatNumber(selectedDistrictData.ruralPopulation)}</p>
                  <p className="text-xs text-muted-foreground">{((selectedDistrictData.ruralPopulation / selectedDistrictData.population) * 100).toFixed(1)}%</p>
                </div>
                <div className="border rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Urban Population</p>
                  <p className="font-semibold">{formatNumber(selectedDistrictData.urbanPopulation)}</p>
                  <p className="text-xs text-muted-foreground">{((selectedDistrictData.urbanPopulation / selectedDistrictData.population) * 100).toFixed(1)}%</p>
                </div>
              </div>
            </div>

            {/* Adopt District Button */}
            {canEdit && selectedDistrictData.adoptionStatus === 'not_adopted' && (
              <Button onClick={() => handleAdoptDistrict(selectedDistrictData.id)} className="w-full">
                Adopt {selectedDistrictData.name} District
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Hierarchy Data Tabs */}
      {selectedDistrictData && (
        <Card>
          <CardHeader>
            <CardTitle>Administrative Hierarchy Data</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={hierarchyTab} onValueChange={setHierarchyTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="district">Districts</TabsTrigger>
                <TabsTrigger value="block">Blocks</TabsTrigger>
                <TabsTrigger value="village">Villages</TabsTrigger>
              </TabsList>

              <TabsContent value="district" className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>District</TableHead>
                      <TableHead className="text-right">Population</TableHead>
                      <TableHead className="text-right">Male</TableHead>
                      <TableHead className="text-right">Female</TableHead>
                      <TableHead className="text-right">BPL %</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {districts.map((district) => (
                      <TableRow key={district.id} className={district.id === selectedDistrict ? "bg-muted/50" : ""}>
                        <TableCell className="font-medium">{district.name}</TableCell>
                        <TableCell className="text-right">{formatNumber(district.population)}</TableCell>
                        <TableCell className="text-right">{formatNumber(district.male)}</TableCell>
                        <TableCell className="text-right">{formatNumber(district.female)}</TableCell>
                        <TableCell className="text-right">{district.bplPercentage}%</TableCell>
                        <TableCell>{getAdoptionBadge(district.adoptionStatus)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="block" className="mt-4">
                {blocks.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Block</TableHead>
                        <TableHead className="text-right">Population</TableHead>
                        <TableHead className="text-right">Male</TableHead>
                        <TableHead className="text-right">Female</TableHead>
                        <TableHead className="text-right">BPL %</TableHead>
                        <TableHead className="text-right">Villages</TableHead>
                        <TableHead className="text-right">Panchayats</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {blocks.map((block) => (
                        <TableRow key={block.id} className={block.id === selectedBlock ? "bg-muted/50" : ""}>
                          <TableCell className="font-medium">{block.name}</TableCell>
                          <TableCell className="text-right">{formatNumber(block.population)}</TableCell>
                          <TableCell className="text-right">{formatNumber(block.male)}</TableCell>
                          <TableCell className="text-right">{formatNumber(block.female)}</TableCell>
                          <TableCell className="text-right">{block.bplPercentage}%</TableCell>
                          <TableCell className="text-right">{block.villages}</TableCell>
                          <TableCell className="text-right">{block.panchayats}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Select a district to view block-level data
                  </div>
                )}
              </TabsContent>

              <TabsContent value="village" className="mt-4">
                {villages.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Village</TableHead>
                        <TableHead className="text-right">Population</TableHead>
                        <TableHead className="text-right">Male</TableHead>
                        <TableHead className="text-right">Female</TableHead>
                        <TableHead className="text-right">BPL Families</TableHead>
                        <TableHead className="text-right">Households</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {villages.map((village) => (
                        <TableRow key={village.id}>
                          <TableCell className="font-medium">{village.name}</TableCell>
                          <TableCell className="text-right">{formatNumber(village.population)}</TableCell>
                          <TableCell className="text-right">{formatNumber(village.male)}</TableCell>
                          <TableCell className="text-right">{formatNumber(village.female)}</TableCell>
                          <TableCell className="text-right">{formatNumber(village.bplFamilies)}</TableCell>
                          <TableCell className="text-right">{formatNumber(village.households)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Select a panchayat to view village-level data
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Policy Documents */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Policy Documents
            </CardTitle>
            {canEdit && (
              <Button onClick={handleUploadDocument} size="sm" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Document
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Size</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {policyDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{doc.type}</Badge>
                  </TableCell>
                  <TableCell>{doc.uploadedDate}</TableCell>
                  <TableCell>{doc.size}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                      {canEdit && (
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteDocument(doc.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DistrictAdoptionTab;
