import { useMemo } from 'react';
import { 
  useGetProgramsQuery, 
  useCreateProgramMutation, 
  useUpdateProgramMutation, 
  useDeleteProgramMutation 
} from '@/store/api/programsApi';
import {
  useGetStatesQuery,
  useGetDistrictsQuery,
  useGetBlocksQuery,
  useGetPanchayatsQuery,
  useGetVillagesQuery,
  useGetPincodesQuery,
  useCreateStateMutation,
  useUpdateStateMutation,
  useDeleteStateMutation,
  useCreateDistrictMutation,
  useCreateBlockMutation,
  useCreatePanchayatMutation,
  useCreateVillageMutation,
  useCreatePincodeMutation,
  useBulkUploadLocationsMutation,
} from '@/store/api/locationsApi';
import {
  useGetSectorsQuery,
  useCreateSectorMutation,
  useUpdateSectorMutation,
  useDeleteSectorMutation,
} from '@/store/api/sectorsApi';
import {
  useGetJobRolesQuery,
  useCreateJobRoleMutation,
  useUpdateJobRoleMutation,
  useDeleteJobRoleMutation,
} from '@/store/api/jobRolesApi';
import {
  useGetDocumentTypesQuery,
  useCreateDocumentTypeMutation,
  useUpdateDocumentTypeMutation,
  useDeleteDocumentTypeMutation,
} from '@/store/api/documentTypesApi';
import type { LocationType } from '@/types/location';
import type { ProgramsQueryParams } from '@/types/program';
import type { SectorsQueryParams } from '@/types/sector';
import type { JobRolesQueryParams } from '@/types/jobRole';
import type { DocumentTypesQueryParams } from '@/types/documentType';

// Mock data for development (used when API is not available)
const mockPrograms = [
  { id: '1', code: 'PRG001', name: 'DDU-GKY', fullName: 'Deen Dayal Upadhyaya Grameen Kaushalya Yojana', ministry: 'MoRD', isActive: true, centres: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', code: 'PRG002', name: 'PMKVY', fullName: 'Pradhan Mantri Kaushal Vikas Yojana', ministry: 'MSDE', isActive: true, centres: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '3', code: 'PRG003', name: 'NULM', fullName: 'National Urban Livelihoods Mission', ministry: 'MoHUA', isActive: true, centres: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '4', code: 'PRG004', name: 'RSETI', fullName: 'Rural Self Employment Training Institutes', ministry: 'MoRD', isActive: false, centres: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const mockStates = [
  { id: '1', code: 'AP', name: 'Andhra Pradesh', districtCount: 26, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', code: 'AR', name: 'Arunachal Pradesh', districtCount: 25, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '3', code: 'AS', name: 'Assam', districtCount: 35, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '4', code: 'BR', name: 'Bihar', districtCount: 38, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '5', code: 'CG', name: 'Chhattisgarh', districtCount: 33, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '6', code: 'GA', name: 'Goa', districtCount: 2, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '7', code: 'GJ', name: 'Gujarat', districtCount: 33, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '8', code: 'HR', name: 'Haryana', districtCount: 22, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '9', code: 'HP', name: 'Himachal Pradesh', districtCount: 12, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '10', code: 'JH', name: 'Jharkhand', districtCount: 24, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '11', code: 'KA', name: 'Karnataka', districtCount: 31, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '12', code: 'KL', name: 'Kerala', districtCount: 14, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '13', code: 'MP', name: 'Madhya Pradesh', districtCount: 55, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '14', code: 'MH', name: 'Maharashtra', districtCount: 36, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '15', code: 'MN', name: 'Manipur', districtCount: 16, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '16', code: 'ML', name: 'Meghalaya', districtCount: 12, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '17', code: 'MZ', name: 'Mizoram', districtCount: 11, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '18', code: 'NL', name: 'Nagaland', districtCount: 16, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '19', code: 'OD', name: 'Odisha', districtCount: 30, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '20', code: 'PB', name: 'Punjab', districtCount: 23, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '21', code: 'RJ', name: 'Rajasthan', districtCount: 33, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '22', code: 'SK', name: 'Sikkim', districtCount: 6, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '23', code: 'TN', name: 'Tamil Nadu', districtCount: 38, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '24', code: 'TS', name: 'Telangana', districtCount: 33, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '25', code: 'TR', name: 'Tripura', districtCount: 8, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '26', code: 'UP', name: 'Uttar Pradesh', districtCount: 75, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '27', code: 'UK', name: 'Uttarakhand', districtCount: 13, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '28', code: 'WB', name: 'West Bengal', districtCount: 23, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const mockDistricts = [
  { id: '1', name: 'Mumbai', stateId: '14', stateName: 'Maharashtra', stateCode: 'MH', blockCount: 24, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', name: 'Pune', stateId: '14', stateName: 'Maharashtra', stateCode: 'MH', blockCount: 14, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '3', name: 'Nagpur', stateId: '14', stateName: 'Maharashtra', stateCode: 'MH', blockCount: 14, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '4', name: 'Thane', stateId: '14', stateName: 'Maharashtra', stateCode: 'MH', blockCount: 15, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '5', name: 'Nashik', stateId: '14', stateName: 'Maharashtra', stateCode: 'MH', blockCount: 15, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '6', name: 'Bangalore Urban', stateId: '11', stateName: 'Karnataka', stateCode: 'KA', blockCount: 8, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '7', name: 'Mysore', stateId: '11', stateName: 'Karnataka', stateCode: 'KA', blockCount: 11, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '8', name: 'Belgaum', stateId: '11', stateName: 'Karnataka', stateCode: 'KA', blockCount: 13, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '9', name: 'Chennai', stateId: '23', stateName: 'Tamil Nadu', stateCode: 'TN', blockCount: 10, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '10', name: 'Coimbatore', stateId: '23', stateName: 'Tamil Nadu', stateCode: 'TN', blockCount: 12, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const mockBlocks = [
  { id: '1', name: 'Andheri', districtId: '1', districtName: 'Mumbai', stateName: 'Maharashtra', panchayatCount: 12, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', name: 'Bandra', districtId: '1', districtName: 'Mumbai', stateName: 'Maharashtra', panchayatCount: 8, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '3', name: 'Borivali', districtId: '1', districtName: 'Mumbai', stateName: 'Maharashtra', panchayatCount: 15, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '4', name: 'Kurla', districtId: '1', districtName: 'Mumbai', stateName: 'Maharashtra', panchayatCount: 10, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '5', name: 'Haveli', districtId: '2', districtName: 'Pune', stateName: 'Maharashtra', panchayatCount: 18, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '6', name: 'Mulshi', districtId: '2', districtName: 'Pune', stateName: 'Maharashtra', panchayatCount: 14, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '7', name: 'Khed', districtId: '2', districtName: 'Pune', stateName: 'Maharashtra', panchayatCount: 16, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '8', name: 'Baramati', districtId: '2', districtName: 'Pune', stateName: 'Maharashtra', panchayatCount: 12, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const mockPanchayats = [
  { id: '1', name: 'Versova Gram Panchayat', blockId: '1', blockName: 'Andheri', districtName: 'Mumbai', stateName: 'Maharashtra', villageCount: 5, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', name: 'Marol Gram Panchayat', blockId: '1', blockName: 'Andheri', districtName: 'Mumbai', stateName: 'Maharashtra', villageCount: 4, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '3', name: 'Jogeshwari Gram Panchayat', blockId: '1', blockName: 'Andheri', districtName: 'Mumbai', stateName: 'Maharashtra', villageCount: 6, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '4', name: 'Khar Gram Panchayat', blockId: '2', blockName: 'Bandra', districtName: 'Mumbai', stateName: 'Maharashtra', villageCount: 4, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '5', name: 'Santacruz Gram Panchayat', blockId: '2', blockName: 'Bandra', districtName: 'Mumbai', stateName: 'Maharashtra', villageCount: 5, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const mockVillages = [
  { id: '1', name: 'Versova Village', panchayatId: '1', panchayatName: 'Versova Gram Panchayat', blockName: 'Andheri', districtName: 'Mumbai', stateName: 'Maharashtra', pincode: '400061', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', name: 'Marol Village', panchayatId: '2', panchayatName: 'Marol Gram Panchayat', blockName: 'Andheri', districtName: 'Mumbai', stateName: 'Maharashtra', pincode: '400059', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '3', name: 'Seven Bungalows', panchayatId: '1', panchayatName: 'Versova Gram Panchayat', blockName: 'Andheri', districtName: 'Mumbai', stateName: 'Maharashtra', pincode: '400061', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '4', name: 'Jogeshwari East', panchayatId: '3', panchayatName: 'Jogeshwari Gram Panchayat', blockName: 'Andheri', districtName: 'Mumbai', stateName: 'Maharashtra', pincode: '400060', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '5', name: 'Khar West Village', panchayatId: '4', panchayatName: 'Khar Gram Panchayat', blockName: 'Bandra', districtName: 'Mumbai', stateName: 'Maharashtra', pincode: '400052', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const mockPincodes = [
  { id: '1', code: '400061', area: 'Versova', districtId: '1', districtName: 'Mumbai', stateName: 'Maharashtra', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', code: '400059', area: 'Marol', districtId: '1', districtName: 'Mumbai', stateName: 'Maharashtra', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '3', code: '400060', area: 'Jogeshwari East', districtId: '1', districtName: 'Mumbai', stateName: 'Maharashtra', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '4', code: '400102', area: 'Jogeshwari West', districtId: '1', districtName: 'Mumbai', stateName: 'Maharashtra', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '5', code: '400052', area: 'Khar West', districtId: '1', districtName: 'Mumbai', stateName: 'Maharashtra', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '6', code: '411001', area: 'Pune City', districtId: '2', districtName: 'Pune', stateName: 'Maharashtra', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '7', code: '560001', area: 'Bangalore GPO', districtId: '6', districtName: 'Bangalore Urban', stateName: 'Karnataka', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '8', code: '600001', area: 'Chennai GPO', districtId: '9', districtName: 'Chennai', stateName: 'Tamil Nadu', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const mockSectors = [
  { id: '1', code: 'SEC001', name: 'IT-ITES', ssc: 'NASSCOM', jobRolesCount: 15, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', code: 'SEC002', name: 'Retail', ssc: 'RASCI', jobRolesCount: 12, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '3', code: 'SEC003', name: 'Healthcare', ssc: 'HSSC', jobRolesCount: 18, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '4', code: 'SEC004', name: 'Hospitality', ssc: 'THSC', jobRolesCount: 10, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '5', code: 'SEC005', name: 'Banking & Finance', ssc: 'BFSI SSC', jobRolesCount: 8, isActive: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const mockJobRoles = [
  { id: '1', code: 'JR001', title: 'Customer Service Executive', sectorId: '1', sectorName: 'IT-ITES', nsqfLevel: 4, trainingHours: 400, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', code: 'JR002', title: 'Field Sales Executive', sectorId: '2', sectorName: 'Retail', nsqfLevel: 3, trainingHours: 350, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '3', code: 'JR003', title: 'General Duty Assistant', sectorId: '3', sectorName: 'Healthcare', nsqfLevel: 4, trainingHours: 450, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '4', code: 'JR004', title: 'F&B Service Steward', sectorId: '4', sectorName: 'Hospitality', nsqfLevel: 4, trainingHours: 380, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '5', code: 'JR005', title: 'Business Correspondent', sectorId: '5', sectorName: 'Banking & Finance', nsqfLevel: 4, trainingHours: 400, isActive: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const mockDocumentTypes = [
  { id: '1', code: 'DOC001', name: 'Aadhaar Card', category: 'Identity Proof', isRequired: true, allowedFormats: ['PDF', 'JPG'], isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', code: 'DOC002', name: 'PAN Card', category: 'Identity Proof', isRequired: false, allowedFormats: ['PDF', 'JPG'], isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '3', code: 'DOC003', name: 'Bank Passbook', category: 'Banking', isRequired: true, allowedFormats: ['PDF', 'JPG'], isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '4', code: 'DOC004', name: '10th Marksheet', category: 'Education', isRequired: true, allowedFormats: ['PDF'], isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '5', code: 'DOC005', name: 'Caste Certificate', category: 'Category Proof', isRequired: false, allowedFormats: ['PDF'], isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '6', code: 'DOC006', name: 'Income Certificate', category: 'Income Proof', isRequired: false, allowedFormats: ['PDF'], isActive: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

// Custom hook for Programs with mock fallback
export function usePrograms(params: ProgramsQueryParams = {}) {
  const { data, isLoading, error, refetch } = useGetProgramsQuery(params);
  const [createProgram, { isLoading: isCreating }] = useCreateProgramMutation();
  const [updateProgram, { isLoading: isUpdating }] = useUpdateProgramMutation();
  const [deleteProgram, { isLoading: isDeleting }] = useDeleteProgramMutation();

  // Use mock data if API fails or returns no data
  const programs = useMemo(() => {
    if (error || !data) {
      let filtered = mockPrograms;
      if (params.search) {
        const search = params.search.toLowerCase();
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(search) || 
          p.fullName.toLowerCase().includes(search)
        );
      }
      if (params.status && params.status !== 'all') {
        filtered = filtered.filter(p => p.isActive === (params.status === 'active'));
      }
      return filtered;
    }
    return data;
  }, [data, error, params.search, params.status]);

  return {
    programs,
    isLoading,
    error,
    refetch,
    createProgram,
    updateProgram,
    deleteProgram,
    isCreating,
    isUpdating,
    isDeleting,
  };
}

// Custom hook for Locations with mock fallback
export function useLocations(locationType: LocationType, params: { search?: string; stateId?: string; districtId?: string; blockId?: string; panchayatId?: string } = {}) {
  // Fetch data based on location type
  const statesQuery = useGetStatesQuery(params, { skip: locationType !== 'state' });
  const districtsQuery = useGetDistrictsQuery(params, { skip: locationType !== 'district' });
  const blocksQuery = useGetBlocksQuery(params, { skip: locationType !== 'block' });
  const panchayatsQuery = useGetPanchayatsQuery(params, { skip: locationType !== 'panchayat' });
  const villagesQuery = useGetVillagesQuery(params, { skip: locationType !== 'village' });
  const pincodesQuery = useGetPincodesQuery(params, { skip: locationType !== 'pincode' });

  // Mutations
  const [createState] = useCreateStateMutation();
  const [updateState] = useUpdateStateMutation();
  const [deleteState] = useDeleteStateMutation();
  const [createDistrict] = useCreateDistrictMutation();
  const [createBlock] = useCreateBlockMutation();
  const [createPanchayat] = useCreatePanchayatMutation();
  const [createVillage] = useCreateVillageMutation();
  const [createPincode] = useCreatePincodeMutation();
  const [bulkUploadLocations] = useBulkUploadLocationsMutation();

  // Get current query based on type
  const getCurrentQuery = () => {
    switch (locationType) {
      case 'state': return statesQuery;
      case 'district': return districtsQuery;
      case 'block': return blocksQuery;
      case 'panchayat': return panchayatsQuery;
      case 'village': return villagesQuery;
      case 'pincode': return pincodesQuery;
      default: return statesQuery;
    }
  };

  const currentQuery = getCurrentQuery();

  // Get mock data based on type
  const getMockData = () => {
    let mockData: any[];
    switch (locationType) {
      case 'state': mockData = mockStates; break;
      case 'district': mockData = mockDistricts; break;
      case 'block': mockData = mockBlocks; break;
      case 'panchayat': mockData = mockPanchayats; break;
      case 'village': mockData = mockVillages; break;
      case 'pincode': mockData = mockPincodes; break;
      default: mockData = [];
    }

    // Apply search filter
    if (params.search) {
      const search = params.search.toLowerCase();
      mockData = mockData.filter((item: any) => 
        item.name?.toLowerCase().includes(search) ||
        item.code?.toLowerCase().includes(search) ||
        item.area?.toLowerCase().includes(search)
      );
    }

    return mockData;
  };

  const locations = useMemo(() => {
    if (currentQuery.error || !currentQuery.data) {
      return getMockData();
    }
    return currentQuery.data;
  }, [currentQuery.data, currentQuery.error, locationType, params.search]);

  return {
    locations,
    isLoading: currentQuery.isLoading,
    error: currentQuery.error,
    refetch: currentQuery.refetch,
    createState,
    updateState,
    deleteState,
    createDistrict,
    createBlock,
    createPanchayat,
    createVillage,
    createPincode,
    bulkUploadLocations,
  };
}

// Custom hook for Sectors with mock fallback
export function useSectors(params: SectorsQueryParams = {}) {
  const { data, isLoading, error, refetch } = useGetSectorsQuery(params);
  const [createSector, { isLoading: isCreating }] = useCreateSectorMutation();
  const [updateSector, { isLoading: isUpdating }] = useUpdateSectorMutation();
  const [deleteSector, { isLoading: isDeleting }] = useDeleteSectorMutation();

  const sectors = useMemo(() => {
    if (error || !data) {
      let filtered = mockSectors;
      if (params.search) {
        const search = params.search.toLowerCase();
        filtered = filtered.filter(s => 
          s.name.toLowerCase().includes(search) || 
          s.ssc.toLowerCase().includes(search)
        );
      }
      if (params.status && params.status !== 'all') {
        filtered = filtered.filter(s => s.isActive === (params.status === 'active'));
      }
      return filtered;
    }
    return data;
  }, [data, error, params.search, params.status]);

  return {
    sectors,
    isLoading,
    error,
    refetch,
    createSector,
    updateSector,
    deleteSector,
    isCreating,
    isUpdating,
    isDeleting,
  };
}

// Custom hook for Job Roles with mock fallback
export function useJobRoles(params: JobRolesQueryParams = {}) {
  const { data, isLoading, error, refetch } = useGetJobRolesQuery(params);
  const [createJobRole, { isLoading: isCreating }] = useCreateJobRoleMutation();
  const [updateJobRole, { isLoading: isUpdating }] = useUpdateJobRoleMutation();
  const [deleteJobRole, { isLoading: isDeleting }] = useDeleteJobRoleMutation();

  const jobRoles = useMemo(() => {
    if (error || !data) {
      let filtered = mockJobRoles;
      if (params.search) {
        const search = params.search.toLowerCase();
        filtered = filtered.filter(j => 
          j.title.toLowerCase().includes(search) || 
          j.sectorName?.toLowerCase().includes(search)
        );
      }
      if (params.sectorId) {
        filtered = filtered.filter(j => j.sectorId === params.sectorId);
      }
      if (params.status && params.status !== 'all') {
        filtered = filtered.filter(j => j.isActive === (params.status === 'active'));
      }
      return filtered;
    }
    return data;
  }, [data, error, params.search, params.sectorId, params.status]);

  return {
    jobRoles,
    isLoading,
    error,
    refetch,
    createJobRole,
    updateJobRole,
    deleteJobRole,
    isCreating,
    isUpdating,
    isDeleting,
  };
}

// Custom hook for Document Types with mock fallback
export function useDocumentTypes(params: DocumentTypesQueryParams = {}) {
  const { data, isLoading, error, refetch } = useGetDocumentTypesQuery(params);
  const [createDocumentType, { isLoading: isCreating }] = useCreateDocumentTypeMutation();
  const [updateDocumentType, { isLoading: isUpdating }] = useUpdateDocumentTypeMutation();
  const [deleteDocumentType, { isLoading: isDeleting }] = useDeleteDocumentTypeMutation();

  const documentTypes = useMemo(() => {
    if (error || !data) {
      let filtered = mockDocumentTypes;
      if (params.search) {
        const search = params.search.toLowerCase();
        filtered = filtered.filter(d => 
          d.name.toLowerCase().includes(search) || 
          d.category.toLowerCase().includes(search)
        );
      }
      if (params.category) {
        filtered = filtered.filter(d => d.category === params.category);
      }
      if (params.status && params.status !== 'all') {
        filtered = filtered.filter(d => d.isActive === (params.status === 'active'));
      }
      return filtered;
    }
    return data;
  }, [data, error, params.search, params.category, params.status]);

  return {
    documentTypes,
    isLoading,
    error,
    refetch,
    createDocumentType,
    updateDocumentType,
    deleteDocumentType,
    isCreating,
    isUpdating,
    isDeleting,
  };
}
