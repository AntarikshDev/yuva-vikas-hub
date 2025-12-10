import { useMemo } from 'react';
import { 
  useGetProgramsQuery, 
  useGetProgramByIdQuery,
  useCreateProgramMutation, 
  useUpdateProgramMutation, 
  useDeleteProgramMutation,
  useBulkUploadProgramsMutation,
} from '@/store/api/programsApi';
import {
  useGetStatesQuery,
  useGetStateByIdQuery,
  useGetDistrictsQuery,
  useGetDistrictByIdQuery,
  useGetBlocksQuery,
  useGetPanchayatsQuery,
  useGetVillagesQuery,
  useGetPincodesQuery,
  useCreateStateMutation,
  useUpdateStateMutation,
  useDeleteStateMutation,
  useCreateDistrictMutation,
  useUpdateDistrictMutation,
  useDeleteDistrictMutation,
  useCreateBlockMutation,
  useUpdateBlockMutation,
  useDeleteBlockMutation,
  useCreatePanchayatMutation,
  useUpdatePanchayatMutation,
  useDeletePanchayatMutation,
  useCreateVillageMutation,
  useUpdateVillageMutation,
  useDeleteVillageMutation,
  useCreatePincodeMutation,
  useUpdatePincodeMutation,
  useDeletePincodeMutation,
  useBulkUploadLocationsMutation,
} from '@/store/api/locationsApi';
import {
  useGetSectorsQuery,
  useGetSectorByIdQuery,
  useCreateSectorMutation,
  useUpdateSectorMutation,
  useDeleteSectorMutation,
  useBulkUploadSectorsMutation,
} from '@/store/api/sectorsApi';
import {
  useGetJobRolesQuery,
  useGetJobRoleByIdQuery,
  useCreateJobRoleMutation,
  useUpdateJobRoleMutation,
  useDeleteJobRoleMutation,
  useBulkUploadJobRolesMutation,
} from '@/store/api/jobRolesApi';
import {
  useGetDocumentTypesQuery,
  useGetDocumentTypeByIdQuery,
  useCreateDocumentTypeMutation,
  useUpdateDocumentTypeMutation,
  useDeleteDocumentTypeMutation,
  useBulkUploadDocumentTypesMutation,
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

// ============ PROGRAMS HOOKS ============
export function usePrograms(params: ProgramsQueryParams = {}) {
  const { data, isLoading, error, refetch } = useGetProgramsQuery(params);

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

  return { programs, isLoading, error, refetch };
}

export function useProgramById(id: string) {
  const { data, isLoading, error } = useGetProgramByIdQuery(id, { skip: !id });
  return { program: data, isLoading, error };
}

export function useProgramMutations() {
  const [createProgram, { isLoading: isCreating }] = useCreateProgramMutation();
  const [updateProgram, { isLoading: isUpdating }] = useUpdateProgramMutation();
  const [deleteProgram, { isLoading: isDeleting }] = useDeleteProgramMutation();
  const [bulkUploadPrograms, { isLoading: isBulkUploading }] = useBulkUploadProgramsMutation();

  return {
    createProgram,
    updateProgram,
    deleteProgram,
    bulkUploadPrograms,
    isCreating,
    isUpdating,
    isDeleting,
    isBulkUploading,
  };
}

// ============ LOCATIONS HOOKS ============
interface LocationsParams {
  search?: string;
  status?: 'active' | 'inactive' | 'all';
  stateId?: string;
  districtId?: string;
  blockId?: string;
  panchayatId?: string;
}

export function useLocations(locationType: LocationType, params: LocationsParams = {}) {
  const statesQuery = useGetStatesQuery(params, { skip: locationType !== 'state' });
  const districtsQuery = useGetDistrictsQuery(params, { skip: locationType !== 'district' });
  const blocksQuery = useGetBlocksQuery(params, { skip: locationType !== 'block' });
  const panchayatsQuery = useGetPanchayatsQuery(params, { skip: locationType !== 'panchayat' });
  const villagesQuery = useGetVillagesQuery(params, { skip: locationType !== 'village' });
  const pincodesQuery = useGetPincodesQuery(params, { skip: locationType !== 'pincode' });

  const getMockData = () => {
    switch (locationType) {
      case 'state': return mockStates;
      case 'district': return mockDistricts;
      case 'block': return mockBlocks;
      case 'panchayat': return mockPanchayats;
      case 'village': return mockVillages;
      case 'pincode': return mockPincodes;
      default: return [];
    }
  };

  const filterMockData = (data: any[]) => {
    let filtered = [...data];
    if (params.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter(item => 
        (item.name?.toLowerCase().includes(search)) ||
        (item.code?.toLowerCase().includes(search)) ||
        (item.area?.toLowerCase().includes(search))
      );
    }
    if (params.status && params.status !== 'all') {
      filtered = filtered.filter(item => item.isActive === (params.status === 'active'));
    }
    return filtered;
  };

  const getQueryResult = () => {
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

  const { data, isLoading, error, refetch } = getQueryResult();

  const locations = useMemo(() => {
    if (error || !data) {
      return filterMockData(getMockData());
    }
    return data;
  }, [data, error, locationType, params.search, params.status]);

  return { locations, isLoading, error, refetch };
}

export function useStateById(id: string) {
  const { data, isLoading, error } = useGetStateByIdQuery(id, { skip: !id });
  return { state: data, isLoading, error };
}

export function useDistrictById(id: string) {
  const { data, isLoading, error } = useGetDistrictByIdQuery(id, { skip: !id });
  return { district: data, isLoading, error };
}

export function useStateMutations() {
  const [createState, { isLoading: isCreating }] = useCreateStateMutation();
  const [updateState, { isLoading: isUpdating }] = useUpdateStateMutation();
  const [deleteState, { isLoading: isDeleting }] = useDeleteStateMutation();

  return { createState, updateState, deleteState, isCreating, isUpdating, isDeleting };
}

export function useDistrictMutations() {
  const [createDistrict, { isLoading: isCreating }] = useCreateDistrictMutation();
  const [updateDistrict, { isLoading: isUpdating }] = useUpdateDistrictMutation();
  const [deleteDistrict, { isLoading: isDeleting }] = useDeleteDistrictMutation();

  return { createDistrict, updateDistrict, deleteDistrict, isCreating, isUpdating, isDeleting };
}

export function useBlockMutations() {
  const [createBlock, { isLoading: isCreating }] = useCreateBlockMutation();
  const [updateBlock, { isLoading: isUpdating }] = useUpdateBlockMutation();
  const [deleteBlock, { isLoading: isDeleting }] = useDeleteBlockMutation();

  return { createBlock, updateBlock, deleteBlock, isCreating, isUpdating, isDeleting };
}

export function usePanchayatMutations() {
  const [createPanchayat, { isLoading: isCreating }] = useCreatePanchayatMutation();
  const [updatePanchayat, { isLoading: isUpdating }] = useUpdatePanchayatMutation();
  const [deletePanchayat, { isLoading: isDeleting }] = useDeletePanchayatMutation();

  return { createPanchayat, updatePanchayat, deletePanchayat, isCreating, isUpdating, isDeleting };
}

export function useVillageMutations() {
  const [createVillage, { isLoading: isCreating }] = useCreateVillageMutation();
  const [updateVillage, { isLoading: isUpdating }] = useUpdateVillageMutation();
  const [deleteVillage, { isLoading: isDeleting }] = useDeleteVillageMutation();

  return { createVillage, updateVillage, deleteVillage, isCreating, isUpdating, isDeleting };
}

export function usePincodeMutations() {
  const [createPincode, { isLoading: isCreating }] = useCreatePincodeMutation();
  const [updatePincode, { isLoading: isUpdating }] = useUpdatePincodeMutation();
  const [deletePincode, { isLoading: isDeleting }] = useDeletePincodeMutation();

  return { createPincode, updatePincode, deletePincode, isCreating, isUpdating, isDeleting };
}

export function useLocationBulkUpload() {
  const [bulkUploadLocations, { isLoading }] = useBulkUploadLocationsMutation();
  return { bulkUploadLocations, isLoading };
}

// ============ SECTORS HOOKS ============
export function useSectors(params: SectorsQueryParams = {}) {
  const { data, isLoading, error, refetch } = useGetSectorsQuery(params);

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

  return { sectors, isLoading, error, refetch };
}

export function useSectorById(id: string) {
  const { data, isLoading, error } = useGetSectorByIdQuery(id, { skip: !id });
  return { sector: data, isLoading, error };
}

export function useSectorMutations() {
  const [createSector, { isLoading: isCreating }] = useCreateSectorMutation();
  const [updateSector, { isLoading: isUpdating }] = useUpdateSectorMutation();
  const [deleteSector, { isLoading: isDeleting }] = useDeleteSectorMutation();
  const [bulkUploadSectors, { isLoading: isBulkUploading }] = useBulkUploadSectorsMutation();

  return {
    createSector,
    updateSector,
    deleteSector,
    bulkUploadSectors,
    isCreating,
    isUpdating,
    isDeleting,
    isBulkUploading,
  };
}

// ============ JOB ROLES HOOKS ============
export function useJobRoles(params: JobRolesQueryParams = {}) {
  const { data, isLoading, error, refetch } = useGetJobRolesQuery(params);

  const jobRoles = useMemo(() => {
    if (error || !data) {
      let filtered = mockJobRoles;
      if (params.search) {
        const search = params.search.toLowerCase();
        filtered = filtered.filter(j => 
          j.title.toLowerCase().includes(search) || 
          j.sectorName.toLowerCase().includes(search)
        );
      }
      if (params.status && params.status !== 'all') {
        filtered = filtered.filter(j => j.isActive === (params.status === 'active'));
      }
      return filtered;
    }
    return data;
  }, [data, error, params.search, params.status]);

  return { jobRoles, isLoading, error, refetch };
}

export function useJobRoleById(id: string) {
  const { data, isLoading, error } = useGetJobRoleByIdQuery(id, { skip: !id });
  return { jobRole: data, isLoading, error };
}

export function useJobRoleMutations() {
  const [createJobRole, { isLoading: isCreating }] = useCreateJobRoleMutation();
  const [updateJobRole, { isLoading: isUpdating }] = useUpdateJobRoleMutation();
  const [deleteJobRole, { isLoading: isDeleting }] = useDeleteJobRoleMutation();
  const [bulkUploadJobRoles, { isLoading: isBulkUploading }] = useBulkUploadJobRolesMutation();

  return {
    createJobRole,
    updateJobRole,
    deleteJobRole,
    bulkUploadJobRoles,
    isCreating,
    isUpdating,
    isDeleting,
    isBulkUploading,
  };
}

// ============ DOCUMENT TYPES HOOKS ============
export function useDocumentTypes(params: DocumentTypesQueryParams = {}) {
  const { data, isLoading, error, refetch } = useGetDocumentTypesQuery(params);

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
      if (params.status && params.status !== 'all') {
        filtered = filtered.filter(d => d.isActive === (params.status === 'active'));
      }
      return filtered;
    }
    return data;
  }, [data, error, params.search, params.status]);

  return { documentTypes, isLoading, error, refetch };
}

export function useDocumentTypeById(id: string) {
  const { data, isLoading, error } = useGetDocumentTypeByIdQuery(id, { skip: !id });
  return { documentType: data, isLoading, error };
}

export function useDocumentTypeMutations() {
  const [createDocumentType, { isLoading: isCreating }] = useCreateDocumentTypeMutation();
  const [updateDocumentType, { isLoading: isUpdating }] = useUpdateDocumentTypeMutation();
  const [deleteDocumentType, { isLoading: isDeleting }] = useDeleteDocumentTypeMutation();
  const [bulkUploadDocumentTypes, { isLoading: isBulkUploading }] = useBulkUploadDocumentTypesMutation();

  return {
    createDocumentType,
    updateDocumentType,
    deleteDocumentType,
    bulkUploadDocumentTypes,
    isCreating,
    isUpdating,
    isDeleting,
    isBulkUploading,
  };
}
