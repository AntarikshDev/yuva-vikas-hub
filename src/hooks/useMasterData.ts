import { useMemo } from 'react';
import { 
  // Programs
  useGetProgramsQuery, 
  useGetProgramByIdQuery,
  useCreateProgramMutation, 
  useUpdateProgramMutation, 
  useDeleteProgramMutation,
  useBulkUploadProgramsMutation,
  // Locations - States
  useGetStatesQuery,
  useGetStateByIdQuery,
  useCreateStateMutation,
  useUpdateStateMutation,
  useDeleteStateMutation,
  // Locations - Districts
  useGetDistrictsQuery,
  useGetDistrictByIdQuery,
  useCreateDistrictMutation,
  useUpdateDistrictMutation,
  useDeleteDistrictMutation,
  // Locations - Blocks
  useGetBlocksQuery,
  useCreateBlockMutation,
  useUpdateBlockMutation,
  useDeleteBlockMutation,
  // Locations - Panchayats
  useGetPanchayatsQuery,
  useCreatePanchayatMutation,
  useUpdatePanchayatMutation,
  useDeletePanchayatMutation,
  // Locations - Villages
  useGetVillagesQuery,
  useCreateVillageMutation,
  useUpdateVillageMutation,
  useDeleteVillageMutation,
  // Locations - Pincodes
  useGetPincodesQuery,
  useCreatePincodeMutation,
  useUpdatePincodeMutation,
  useDeletePincodeMutation,
  // Locations - Bulk
  useBulkUploadLocationsMutation,
  // Sectors
  useGetSectorsQuery,
  useGetSectorByIdQuery,
  useCreateSectorMutation,
  useUpdateSectorMutation,
  useDeleteSectorMutation,
  useBulkUploadSectorsMutation,
  // Job Roles
  useGetJobRolesQuery,
  useGetJobRoleByIdQuery,
  useCreateJobRoleMutation,
  useUpdateJobRoleMutation,
  useDeleteJobRoleMutation,
  useBulkUploadJobRolesMutation,
  // Document Types
  useGetDocumentTypesQuery,
  useGetDocumentTypeByIdQuery,
  useCreateDocumentTypeMutation,
  useUpdateDocumentTypeMutation,
  useDeleteDocumentTypeMutation,
  useBulkUploadDocumentTypesMutation,
} from '@/store/api/apiSlice';
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
          p.code.toLowerCase().includes(search)
        );
      }
      return filtered;
    }
    return data;
  }, [data, error, params.search]);

  return { programs, isLoading, error, refetch };
}

export function useProgramMutations() {
  const [createProgram, createState] = useCreateProgramMutation();
  const [updateProgram, updateState] = useUpdateProgramMutation();
  const [deleteProgram, deleteState] = useDeleteProgramMutation();
  const [bulkUpload, bulkUploadState] = useBulkUploadProgramsMutation();

  return {
    createProgram,
    updateProgram,
    deleteProgram,
    bulkUpload,
    isCreating: createState.isLoading,
    isUpdating: updateState.isLoading,
    isDeleting: deleteState.isLoading,
    isBulkUploading: bulkUploadState.isLoading,
  };
}

// ============ LOCATIONS HOOKS ============
interface LocationsParams {
  type: LocationType;
  search?: string;
  stateId?: string;
  districtId?: string;
  blockId?: string;
  panchayatId?: string;
}

export function useLocations(params: LocationsParams) {
  const { type, search, stateId, districtId, blockId, panchayatId } = params;

  const statesQuery = useGetStatesQuery({ search }, { skip: type !== 'state' });
  const districtsQuery = useGetDistrictsQuery({ search, stateId }, { skip: type !== 'district' });
  const blocksQuery = useGetBlocksQuery({ search, districtId }, { skip: type !== 'block' });
  const panchayatsQuery = useGetPanchayatsQuery({ search, blockId }, { skip: type !== 'panchayat' });
  const villagesQuery = useGetVillagesQuery({ search, panchayatId }, { skip: type !== 'village' });
  const pincodesQuery = useGetPincodesQuery({ search, districtId }, { skip: type !== 'pincode' });

  const locations = useMemo(() => {
    const getMockData = () => {
      switch (type) {
        case 'state': return mockStates;
        case 'district': return mockDistricts;
        case 'block': return mockBlocks;
        case 'panchayat': return mockPanchayats;
        case 'village': return mockVillages;
        case 'pincode': return mockPincodes;
        default: return [];
      }
    };

    const getApiData = () => {
      switch (type) {
        case 'state': return statesQuery.data;
        case 'district': return districtsQuery.data;
        case 'block': return blocksQuery.data;
        case 'panchayat': return panchayatsQuery.data;
        case 'village': return villagesQuery.data;
        case 'pincode': return pincodesQuery.data;
        default: return undefined;
      }
    };

    const apiData = getApiData();
    if (apiData) return apiData;

    let mockData = getMockData();
    if (search) {
      const searchLower = search.toLowerCase();
      mockData = mockData.filter((item: { name?: string; code?: string }) => 
        item.name?.toLowerCase().includes(searchLower) || 
        item.code?.toLowerCase().includes(searchLower)
      );
    }
    return mockData;
  }, [type, search, statesQuery.data, districtsQuery.data, blocksQuery.data, panchayatsQuery.data, villagesQuery.data, pincodesQuery.data]);

  const isLoading = 
    statesQuery.isLoading || 
    districtsQuery.isLoading || 
    blocksQuery.isLoading || 
    panchayatsQuery.isLoading || 
    villagesQuery.isLoading || 
    pincodesQuery.isLoading;

  const refetch = () => {
    switch (type) {
      case 'state': return statesQuery.refetch();
      case 'district': return districtsQuery.refetch();
      case 'block': return blocksQuery.refetch();
      case 'panchayat': return panchayatsQuery.refetch();
      case 'village': return villagesQuery.refetch();
      case 'pincode': return pincodesQuery.refetch();
    }
  };

  return { locations, isLoading, refetch };
}

export function useLocationMutations(type: LocationType) {
  // States
  const [createState, createStateStatus] = useCreateStateMutation();
  const [updateState, updateStateStatus] = useUpdateStateMutation();
  const [deleteState, deleteStateStatus] = useDeleteStateMutation();
  
  // Districts
  const [createDistrict, createDistrictStatus] = useCreateDistrictMutation();
  const [updateDistrict, updateDistrictStatus] = useUpdateDistrictMutation();
  const [deleteDistrict, deleteDistrictStatus] = useDeleteDistrictMutation();
  
  // Blocks
  const [createBlock, createBlockStatus] = useCreateBlockMutation();
  const [updateBlock, updateBlockStatus] = useUpdateBlockMutation();
  const [deleteBlock, deleteBlockStatus] = useDeleteBlockMutation();
  
  // Panchayats
  const [createPanchayat, createPanchayatStatus] = useCreatePanchayatMutation();
  const [updatePanchayat, updatePanchayatStatus] = useUpdatePanchayatMutation();
  const [deletePanchayat, deletePanchayatStatus] = useDeletePanchayatMutation();
  
  // Villages
  const [createVillage, createVillageStatus] = useCreateVillageMutation();
  const [updateVillage, updateVillageStatus] = useUpdateVillageMutation();
  const [deleteVillage, deleteVillageStatus] = useDeleteVillageMutation();
  
  // Pincodes
  const [createPincode, createPincodeStatus] = useCreatePincodeMutation();
  const [updatePincode, updatePincodeStatus] = useUpdatePincodeMutation();
  const [deletePincode, deletePincodeStatus] = useDeletePincodeMutation();
  
  // Bulk upload
  const [bulkUpload, bulkUploadStatus] = useBulkUploadLocationsMutation();

  const getMutations = () => {
    switch (type) {
      case 'state':
        return {
          create: createState,
          update: updateState,
          delete: deleteState,
          isCreating: createStateStatus.isLoading,
          isUpdating: updateStateStatus.isLoading,
          isDeleting: deleteStateStatus.isLoading,
        };
      case 'district':
        return {
          create: createDistrict,
          update: updateDistrict,
          delete: deleteDistrict,
          isCreating: createDistrictStatus.isLoading,
          isUpdating: updateDistrictStatus.isLoading,
          isDeleting: deleteDistrictStatus.isLoading,
        };
      case 'block':
        return {
          create: createBlock,
          update: updateBlock,
          delete: deleteBlock,
          isCreating: createBlockStatus.isLoading,
          isUpdating: updateBlockStatus.isLoading,
          isDeleting: deleteBlockStatus.isLoading,
        };
      case 'panchayat':
        return {
          create: createPanchayat,
          update: updatePanchayat,
          delete: deletePanchayat,
          isCreating: createPanchayatStatus.isLoading,
          isUpdating: updatePanchayatStatus.isLoading,
          isDeleting: deletePanchayatStatus.isLoading,
        };
      case 'village':
        return {
          create: createVillage,
          update: updateVillage,
          delete: deleteVillage,
          isCreating: createVillageStatus.isLoading,
          isUpdating: updateVillageStatus.isLoading,
          isDeleting: deleteVillageStatus.isLoading,
        };
      case 'pincode':
        return {
          create: createPincode,
          update: updatePincode,
          delete: deletePincode,
          isCreating: createPincodeStatus.isLoading,
          isUpdating: updatePincodeStatus.isLoading,
          isDeleting: deletePincodeStatus.isLoading,
        };
      default:
        throw new Error(`Unknown location type: ${type}`);
    }
  };

  return {
    ...getMutations(),
    bulkUpload: (formData: FormData) => bulkUpload({ type, formData }),
    isBulkUploading: bulkUploadStatus.isLoading,
  };
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
          s.code.toLowerCase().includes(search)
        );
      }
      return filtered;
    }
    return data;
  }, [data, error, params.search]);

  return { sectors, isLoading, error, refetch };
}

export function useSectorMutations() {
  const [createSector, createStatus] = useCreateSectorMutation();
  const [updateSector, updateStatus] = useUpdateSectorMutation();
  const [deleteSector, deleteStatus] = useDeleteSectorMutation();
  const [bulkUpload, bulkUploadStatus] = useBulkUploadSectorsMutation();

  return {
    createSector,
    updateSector,
    deleteSector,
    bulkUpload,
    isCreating: createStatus.isLoading,
    isUpdating: updateStatus.isLoading,
    isDeleting: deleteStatus.isLoading,
    isBulkUploading: bulkUploadStatus.isLoading,
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
          j.code.toLowerCase().includes(search)
        );
      }
      if (params.sectorId) {
        filtered = filtered.filter(j => j.sectorId === params.sectorId);
      }
      return filtered;
    }
    return data;
  }, [data, error, params.search, params.sectorId]);

  return { jobRoles, isLoading, error, refetch };
}

export function useJobRoleMutations() {
  const [createJobRole, createStatus] = useCreateJobRoleMutation();
  const [updateJobRole, updateStatus] = useUpdateJobRoleMutation();
  const [deleteJobRole, deleteStatus] = useDeleteJobRoleMutation();
  const [bulkUpload, bulkUploadStatus] = useBulkUploadJobRolesMutation();

  return {
    createJobRole,
    updateJobRole,
    deleteJobRole,
    bulkUpload,
    isCreating: createStatus.isLoading,
    isUpdating: updateStatus.isLoading,
    isDeleting: deleteStatus.isLoading,
    isBulkUploading: bulkUploadStatus.isLoading,
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
          d.code.toLowerCase().includes(search)
        );
      }
      if (params.category) {
        filtered = filtered.filter(d => d.category === params.category);
      }
      return filtered;
    }
    return data;
  }, [data, error, params.search, params.category]);

  return { documentTypes, isLoading, error, refetch };
}

export function useDocumentTypeMutations() {
  const [createDocumentType, createStatus] = useCreateDocumentTypeMutation();
  const [updateDocumentType, updateStatus] = useUpdateDocumentTypeMutation();
  const [deleteDocumentType, deleteStatus] = useDeleteDocumentTypeMutation();
  const [bulkUpload, bulkUploadStatus] = useBulkUploadDocumentTypesMutation();

  return {
    createDocumentType,
    updateDocumentType,
    deleteDocumentType,
    bulkUpload,
    isCreating: createStatus.isLoading,
    isUpdating: updateStatus.isLoading,
    isDeleting: deleteStatus.isLoading,
    isBulkUploading: bulkUploadStatus.isLoading,
  };
}

// Re-export individual hooks for direct usage
export {
  // Programs
  useGetProgramsQuery,
  useGetProgramByIdQuery,
  useCreateProgramMutation,
  useUpdateProgramMutation,
  useDeleteProgramMutation,
  useBulkUploadProgramsMutation,
  // States
  useGetStatesQuery,
  useGetStateByIdQuery,
  useCreateStateMutation,
  useUpdateStateMutation,
  useDeleteStateMutation,
  // Districts
  useGetDistrictsQuery,
  useGetDistrictByIdQuery,
  useCreateDistrictMutation,
  useUpdateDistrictMutation,
  useDeleteDistrictMutation,
  // Blocks
  useGetBlocksQuery,
  useCreateBlockMutation,
  useUpdateBlockMutation,
  useDeleteBlockMutation,
  // Panchayats
  useGetPanchayatsQuery,
  useCreatePanchayatMutation,
  useUpdatePanchayatMutation,
  useDeletePanchayatMutation,
  // Villages
  useGetVillagesQuery,
  useCreateVillageMutation,
  useUpdateVillageMutation,
  useDeleteVillageMutation,
  // Pincodes
  useGetPincodesQuery,
  useCreatePincodeMutation,
  useUpdatePincodeMutation,
  useDeletePincodeMutation,
  // Locations Bulk
  useBulkUploadLocationsMutation,
  // Sectors
  useGetSectorsQuery,
  useGetSectorByIdQuery,
  useCreateSectorMutation,
  useUpdateSectorMutation,
  useDeleteSectorMutation,
  useBulkUploadSectorsMutation,
  // Job Roles
  useGetJobRolesQuery,
  useGetJobRoleByIdQuery,
  useCreateJobRoleMutation,
  useUpdateJobRoleMutation,
  useDeleteJobRoleMutation,
  useBulkUploadJobRolesMutation,
  // Document Types
  useGetDocumentTypesQuery,
  useGetDocumentTypeByIdQuery,
  useCreateDocumentTypeMutation,
  useUpdateDocumentTypeMutation,
  useDeleteDocumentTypeMutation,
  useBulkUploadDocumentTypesMutation,
};
