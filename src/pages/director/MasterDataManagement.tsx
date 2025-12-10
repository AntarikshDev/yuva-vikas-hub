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
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);

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
      { id: 1, code: 'AP', name: 'Andhra Pradesh', districts: 26, status: 'active' },
      { id: 2, code: 'AR', name: 'Arunachal Pradesh', districts: 25, status: 'active' },
      { id: 3, code: 'AS', name: 'Assam', districts: 35, status: 'active' },
      { id: 4, code: 'BR', name: 'Bihar', districts: 38, status: 'active' },
      { id: 5, code: 'CG', name: 'Chhattisgarh', districts: 33, status: 'active' },
      { id: 6, code: 'GA', name: 'Goa', districts: 2, status: 'active' },
      { id: 7, code: 'GJ', name: 'Gujarat', districts: 33, status: 'active' },
      { id: 8, code: 'HR', name: 'Haryana', districts: 22, status: 'active' },
      { id: 9, code: 'HP', name: 'Himachal Pradesh', districts: 12, status: 'active' },
      { id: 10, code: 'JH', name: 'Jharkhand', districts: 24, status: 'active' },
      { id: 11, code: 'KA', name: 'Karnataka', districts: 31, status: 'active' },
      { id: 12, code: 'KL', name: 'Kerala', districts: 14, status: 'active' },
      { id: 13, code: 'MP', name: 'Madhya Pradesh', districts: 55, status: 'active' },
      { id: 14, code: 'MH', name: 'Maharashtra', districts: 36, status: 'active' },
      { id: 15, code: 'MN', name: 'Manipur', districts: 16, status: 'active' },
      { id: 16, code: 'ML', name: 'Meghalaya', districts: 12, status: 'active' },
      { id: 17, code: 'MZ', name: 'Mizoram', districts: 11, status: 'active' },
      { id: 18, code: 'NL', name: 'Nagaland', districts: 16, status: 'active' },
      { id: 19, code: 'OD', name: 'Odisha', districts: 30, status: 'active' },
      { id: 20, code: 'PB', name: 'Punjab', districts: 23, status: 'active' },
      { id: 21, code: 'RJ', name: 'Rajasthan', districts: 33, status: 'active' },
      { id: 22, code: 'SK', name: 'Sikkim', districts: 6, status: 'active' },
      { id: 23, code: 'TN', name: 'Tamil Nadu', districts: 38, status: 'active' },
      { id: 24, code: 'TS', name: 'Telangana', districts: 33, status: 'active' },
      { id: 25, code: 'TR', name: 'Tripura', districts: 8, status: 'active' },
      { id: 26, code: 'UP', name: 'Uttar Pradesh', districts: 75, status: 'active' },
      { id: 27, code: 'UK', name: 'Uttarakhand', districts: 13, status: 'active' },
      { id: 28, code: 'WB', name: 'West Bengal', districts: 23, status: 'active' },
    ],
    district: [
      { id: 1, code: 'MUM', name: 'Mumbai', state: 'Maharashtra', blocks: 24, status: 'active' },
      { id: 2, code: 'PUN', name: 'Pune', state: 'Maharashtra', blocks: 14, status: 'active' },
      { id: 3, code: 'NGP', name: 'Nagpur', state: 'Maharashtra', blocks: 14, status: 'active' },
      { id: 4, code: 'THA', name: 'Thane', state: 'Maharashtra', blocks: 15, status: 'active' },
      { id: 5, code: 'NAS', name: 'Nashik', state: 'Maharashtra', blocks: 15, status: 'active' },
      { id: 6, code: 'BLR', name: 'Bangalore Urban', state: 'Karnataka', blocks: 8, status: 'active' },
      { id: 7, code: 'MYS', name: 'Mysore', state: 'Karnataka', blocks: 11, status: 'active' },
      { id: 8, code: 'BEL', name: 'Belgaum', state: 'Karnataka', blocks: 13, status: 'active' },
      { id: 9, code: 'CHN', name: 'Chennai', state: 'Tamil Nadu', blocks: 10, status: 'active' },
      { id: 10, code: 'COI', name: 'Coimbatore', state: 'Tamil Nadu', blocks: 12, status: 'active' },
      { id: 11, code: 'MAD', name: 'Madurai', state: 'Tamil Nadu', blocks: 13, status: 'active' },
      { id: 12, code: 'AHM', name: 'Ahmedabad', state: 'Gujarat', blocks: 11, status: 'active' },
      { id: 13, code: 'SUR', name: 'Surat', state: 'Gujarat', blocks: 10, status: 'active' },
      { id: 14, code: 'VAD', name: 'Vadodara', state: 'Gujarat', blocks: 12, status: 'active' },
      { id: 15, code: 'JAI', name: 'Jaipur', state: 'Rajasthan', blocks: 16, status: 'active' },
      { id: 16, code: 'JOD', name: 'Jodhpur', state: 'Rajasthan', blocks: 10, status: 'active' },
      { id: 17, code: 'UDA', name: 'Udaipur', state: 'Rajasthan', blocks: 11, status: 'active' },
      { id: 18, code: 'LKO', name: 'Lucknow', state: 'Uttar Pradesh', blocks: 8, status: 'active' },
      { id: 19, code: 'KAN', name: 'Kanpur', state: 'Uttar Pradesh', blocks: 10, status: 'active' },
      { id: 20, code: 'VAR', name: 'Varanasi', state: 'Uttar Pradesh', blocks: 8, status: 'active' },
      { id: 21, code: 'PAT', name: 'Patna', state: 'Bihar', blocks: 23, status: 'active' },
      { id: 22, code: 'GAY', name: 'Gaya', state: 'Bihar', blocks: 24, status: 'active' },
      { id: 23, code: 'KOL', name: 'Kolkata', state: 'West Bengal', blocks: 5, status: 'active' },
      { id: 24, code: 'HWH', name: 'Howrah', state: 'West Bengal', blocks: 14, status: 'active' },
      { id: 25, code: 'HYD', name: 'Hyderabad', state: 'Telangana', blocks: 16, status: 'active' },
      { id: 26, code: 'RNG', name: 'Rangareddy', state: 'Telangana', blocks: 33, status: 'active' },
      { id: 27, code: 'BHO', name: 'Bhopal', state: 'Madhya Pradesh', blocks: 7, status: 'active' },
      { id: 28, code: 'IND', name: 'Indore', state: 'Madhya Pradesh', blocks: 6, status: 'active' },
      { id: 29, code: 'EKM', name: 'Ernakulam', state: 'Kerala', blocks: 7, status: 'active' },
      { id: 30, code: 'TVM', name: 'Thiruvananthapuram', state: 'Kerala', blocks: 12, status: 'active' },
    ],
    block: [
      { id: 1, code: 'ANH', name: 'Andheri', district: 'Mumbai', panchayats: 12, status: 'active' },
      { id: 2, code: 'BAN', name: 'Bandra', district: 'Mumbai', panchayats: 8, status: 'active' },
      { id: 3, code: 'BOR', name: 'Borivali', district: 'Mumbai', panchayats: 15, status: 'active' },
      { id: 4, code: 'KUR', name: 'Kurla', district: 'Mumbai', panchayats: 10, status: 'active' },
      { id: 5, code: 'HAV', name: 'Haveli', district: 'Pune', panchayats: 18, status: 'active' },
      { id: 6, code: 'MUL', name: 'Mulshi', district: 'Pune', panchayats: 14, status: 'active' },
      { id: 7, code: 'KHD', name: 'Khed', district: 'Pune', panchayats: 16, status: 'active' },
      { id: 8, code: 'BVL', name: 'Baramati', district: 'Pune', panchayats: 12, status: 'active' },
      { id: 9, code: 'YEL', name: 'Yelahanka', district: 'Bangalore Urban', panchayats: 8, status: 'active' },
      { id: 10, code: 'ANE', name: 'Anekal', district: 'Bangalore Urban', panchayats: 12, status: 'active' },
      { id: 11, code: 'HSR', name: 'HSR Layout', district: 'Bangalore Urban', panchayats: 6, status: 'active' },
      { id: 12, code: 'THO', name: 'Thondamuthur', district: 'Coimbatore', panchayats: 22, status: 'active' },
      { id: 13, code: 'SUL', name: 'Sulur', district: 'Coimbatore', panchayats: 18, status: 'active' },
      { id: 14, code: 'ANN', name: 'Annur', district: 'Coimbatore', panchayats: 15, status: 'active' },
      { id: 15, code: 'SAN', name: 'Sanand', district: 'Ahmedabad', panchayats: 20, status: 'active' },
      { id: 16, code: 'DHO', name: 'Dholka', district: 'Ahmedabad', panchayats: 25, status: 'active' },
      { id: 17, code: 'VIR', name: 'Viramgam', district: 'Ahmedabad', panchayats: 22, status: 'active' },
      { id: 18, code: 'SAM', name: 'Sambhar', district: 'Jaipur', panchayats: 18, status: 'active' },
      { id: 19, code: 'CHO', name: 'Chomu', district: 'Jaipur', panchayats: 20, status: 'active' },
      { id: 20, code: 'AMB', name: 'Amber', district: 'Jaipur', panchayats: 15, status: 'active' },
      { id: 21, code: 'MAL', name: 'Malihabad', district: 'Lucknow', panchayats: 28, status: 'active' },
      { id: 22, code: 'MOH', name: 'Mohanlalganj', district: 'Lucknow', panchayats: 32, status: 'active' },
      { id: 23, code: 'BAK', name: 'Bakshi Ka Talab', district: 'Lucknow', panchayats: 24, status: 'active' },
      { id: 24, code: 'DAN', name: 'Danapur', district: 'Patna', panchayats: 18, status: 'active' },
      { id: 25, code: 'PHU', name: 'Phulwari', district: 'Patna', panchayats: 22, status: 'active' },
    ],
    panchayat: [
      { id: 1, code: 'PAN001', name: 'Versova Gram Panchayat', block: 'Andheri', villages: 5, status: 'active' },
      { id: 2, code: 'PAN002', name: 'Marol Gram Panchayat', block: 'Andheri', villages: 4, status: 'active' },
      { id: 3, code: 'PAN003', name: 'Jogeshwari Gram Panchayat', block: 'Andheri', villages: 6, status: 'active' },
      { id: 4, code: 'PAN004', name: 'Vile Parle Gram Panchayat', block: 'Andheri', villages: 3, status: 'active' },
      { id: 5, code: 'PAN005', name: 'Khar Gram Panchayat', block: 'Bandra', villages: 4, status: 'active' },
      { id: 6, code: 'PAN006', name: 'Santacruz Gram Panchayat', block: 'Bandra', villages: 5, status: 'active' },
      { id: 7, code: 'PAN007', name: 'Haveli Gram Panchayat', block: 'Haveli', villages: 8, status: 'active' },
      { id: 8, code: 'PAN008', name: 'Wagholi Gram Panchayat', block: 'Haveli', villages: 6, status: 'active' },
      { id: 9, code: 'PAN009', name: 'Lohegaon Gram Panchayat', block: 'Haveli', villages: 7, status: 'active' },
      { id: 10, code: 'PAN010', name: 'Pirangut Gram Panchayat', block: 'Mulshi', villages: 9, status: 'active' },
      { id: 11, code: 'PAN011', name: 'Lavasa Gram Panchayat', block: 'Mulshi', villages: 4, status: 'active' },
      { id: 12, code: 'PAN012', name: 'Yelahanka Gram Panchayat', block: 'Yelahanka', villages: 6, status: 'active' },
      { id: 13, code: 'PAN013', name: 'Jakkur Gram Panchayat', block: 'Yelahanka', villages: 5, status: 'active' },
      { id: 14, code: 'PAN014', name: 'Sarjapur Gram Panchayat', block: 'Anekal', villages: 7, status: 'active' },
      { id: 15, code: 'PAN015', name: 'Chandapura Gram Panchayat', block: 'Anekal', villages: 8, status: 'active' },
      { id: 16, code: 'PAN016', name: 'Perur Gram Panchayat', block: 'Thondamuthur', villages: 5, status: 'active' },
      { id: 17, code: 'PAN017', name: 'Narasipuram Gram Panchayat', block: 'Thondamuthur', villages: 6, status: 'active' },
      { id: 18, code: 'PAN018', name: 'Sanand Gram Panchayat', block: 'Sanand', villages: 10, status: 'active' },
      { id: 19, code: 'PAN019', name: 'Bol Gram Panchayat', block: 'Sanand', villages: 8, status: 'active' },
      { id: 20, code: 'PAN020', name: 'Chomu Gram Panchayat', block: 'Chomu', villages: 12, status: 'active' },
    ],
    village: [
      { id: 1, code: 'VIL001', name: 'Versova Village', panchayat: 'Versova Gram Panchayat', pincode: '400061', status: 'active' },
      { id: 2, code: 'VIL002', name: 'Marol Village', panchayat: 'Marol Gram Panchayat', pincode: '400059', status: 'active' },
      { id: 3, code: 'VIL003', name: 'Seven Bungalows', panchayat: 'Versova Gram Panchayat', pincode: '400061', status: 'active' },
      { id: 4, code: 'VIL004', name: 'Yari Road Village', panchayat: 'Versova Gram Panchayat', pincode: '400061', status: 'active' },
      { id: 5, code: 'VIL005', name: 'Jogeshwari East', panchayat: 'Jogeshwari Gram Panchayat', pincode: '400060', status: 'active' },
      { id: 6, code: 'VIL006', name: 'Jogeshwari West', panchayat: 'Jogeshwari Gram Panchayat', pincode: '400102', status: 'active' },
      { id: 7, code: 'VIL007', name: 'Khar West Village', panchayat: 'Khar Gram Panchayat', pincode: '400052', status: 'active' },
      { id: 8, code: 'VIL008', name: 'Santacruz East Village', panchayat: 'Santacruz Gram Panchayat', pincode: '400055', status: 'active' },
      { id: 9, code: 'VIL009', name: 'Wagholi Village', panchayat: 'Wagholi Gram Panchayat', pincode: '412207', status: 'active' },
      { id: 10, code: 'VIL010', name: 'Kesnand Village', panchayat: 'Wagholi Gram Panchayat', pincode: '412207', status: 'active' },
      { id: 11, code: 'VIL011', name: 'Lohegaon Village', panchayat: 'Lohegaon Gram Panchayat', pincode: '411047', status: 'active' },
      { id: 12, code: 'VIL012', name: 'Dhanori Village', panchayat: 'Lohegaon Gram Panchayat', pincode: '411015', status: 'active' },
      { id: 13, code: 'VIL013', name: 'Pirangut Village', panchayat: 'Pirangut Gram Panchayat', pincode: '412115', status: 'active' },
      { id: 14, code: 'VIL014', name: 'Paud Village', panchayat: 'Pirangut Gram Panchayat', pincode: '412108', status: 'active' },
      { id: 15, code: 'VIL015', name: 'Jakkur Village', panchayat: 'Jakkur Gram Panchayat', pincode: '560064', status: 'active' },
      { id: 16, code: 'VIL016', name: 'Sarjapur Village', panchayat: 'Sarjapur Gram Panchayat', pincode: '562125', status: 'active' },
      { id: 17, code: 'VIL017', name: 'Dommasandra Village', panchayat: 'Sarjapur Gram Panchayat', pincode: '562125', status: 'active' },
      { id: 18, code: 'VIL018', name: 'Perur Village', panchayat: 'Perur Gram Panchayat', pincode: '641010', status: 'active' },
      { id: 19, code: 'VIL019', name: 'Sanand Village', panchayat: 'Sanand Gram Panchayat', pincode: '382110', status: 'active' },
      { id: 20, code: 'VIL020', name: 'Chomu Village', panchayat: 'Chomu Gram Panchayat', pincode: '303702', status: 'active' },
    ],
    pincode: [
      { id: 1, code: '400061', area: 'Versova', district: 'Mumbai', state: 'Maharashtra', status: 'active' },
      { id: 2, code: '400059', area: 'Marol', district: 'Mumbai', state: 'Maharashtra', status: 'active' },
      { id: 3, code: '400060', area: 'Jogeshwari East', district: 'Mumbai', state: 'Maharashtra', status: 'active' },
      { id: 4, code: '400102', area: 'Jogeshwari West', district: 'Mumbai', state: 'Maharashtra', status: 'active' },
      { id: 5, code: '400052', area: 'Khar West', district: 'Mumbai', state: 'Maharashtra', status: 'active' },
      { id: 6, code: '400055', area: 'Santacruz East', district: 'Mumbai', state: 'Maharashtra', status: 'active' },
      { id: 7, code: '411001', area: 'Pune City', district: 'Pune', state: 'Maharashtra', status: 'active' },
      { id: 8, code: '412207', area: 'Wagholi', district: 'Pune', state: 'Maharashtra', status: 'active' },
      { id: 9, code: '411047', area: 'Lohegaon', district: 'Pune', state: 'Maharashtra', status: 'active' },
      { id: 10, code: '411015', area: 'Dhanori', district: 'Pune', state: 'Maharashtra', status: 'active' },
      { id: 11, code: '412115', area: 'Pirangut', district: 'Pune', state: 'Maharashtra', status: 'active' },
      { id: 12, code: '412108', area: 'Paud', district: 'Pune', state: 'Maharashtra', status: 'active' },
      { id: 13, code: '560001', area: 'Bangalore GPO', district: 'Bangalore Urban', state: 'Karnataka', status: 'active' },
      { id: 14, code: '560064', area: 'Jakkur', district: 'Bangalore Urban', state: 'Karnataka', status: 'active' },
      { id: 15, code: '562125', area: 'Sarjapur', district: 'Bangalore Urban', state: 'Karnataka', status: 'active' },
      { id: 16, code: '600001', area: 'Chennai GPO', district: 'Chennai', state: 'Tamil Nadu', status: 'active' },
      { id: 17, code: '641010', area: 'Perur', district: 'Coimbatore', state: 'Tamil Nadu', status: 'active' },
      { id: 18, code: '641001', area: 'Coimbatore City', district: 'Coimbatore', state: 'Tamil Nadu', status: 'active' },
      { id: 19, code: '380001', area: 'Ahmedabad GPO', district: 'Ahmedabad', state: 'Gujarat', status: 'active' },
      { id: 20, code: '382110', area: 'Sanand', district: 'Ahmedabad', state: 'Gujarat', status: 'active' },
      { id: 21, code: '302001', area: 'Jaipur GPO', district: 'Jaipur', state: 'Rajasthan', status: 'active' },
      { id: 22, code: '303702', area: 'Chomu', district: 'Jaipur', state: 'Rajasthan', status: 'active' },
      { id: 23, code: '226001', area: 'Lucknow GPO', district: 'Lucknow', state: 'Uttar Pradesh', status: 'active' },
      { id: 24, code: '226010', area: 'Gomti Nagar', district: 'Lucknow', state: 'Uttar Pradesh', status: 'active' },
      { id: 25, code: '800001', area: 'Patna GPO', district: 'Patna', state: 'Bihar', status: 'active' },
      { id: 26, code: '700001', area: 'Kolkata GPO', district: 'Kolkata', state: 'West Bengal', status: 'active' },
      { id: 27, code: '500001', area: 'Hyderabad GPO', district: 'Hyderabad', state: 'Telangana', status: 'active' },
      { id: 28, code: '462001', area: 'Bhopal GPO', district: 'Bhopal', state: 'Madhya Pradesh', status: 'active' },
      { id: 29, code: '682001', area: 'Kochi', district: 'Ernakulam', state: 'Kerala', status: 'active' },
      { id: 30, code: '695001', area: 'Trivandrum', district: 'Thiruvananthapuram', state: 'Kerala', status: 'active' },
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
    if (category === 'locations') {
      setBulkUploadOpen(true);
    } else {
      toast({
        title: "Bulk Upload",
        description: `Opening bulk upload for ${category}...`,
      });
    }
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
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <CardTitle>Location Management</CardTitle>
                      <CardDescription>Manage hierarchical location data</CardDescription>
                    </div>
                  </div>
                  
                  {/* Controls Row - Responsive */}
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
                  
                  {/* Hierarchy Breadcrumb - Hidden on mobile */}
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
