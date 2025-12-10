import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';

// Types - Programs
import type {
  Program,
  CreateProgramDTO,
  UpdateProgramDTO,
  ProgramsQueryParams,
  BulkUploadResponse,
  Centre,
} from '@/types/program';

// Types - Locations
import type {
  State,
  District,
  Block,
  Panchayat,
  Village,
  Pincode,
  CreateStateDTO,
  UpdateStateDTO,
  CreateDistrictDTO,
  CreateBlockDTO,
  CreatePanchayatDTO,
  CreateVillageDTO,
  CreatePincodeDTO,
  LocationsQueryParams,
  LocationHierarchy,
  LocationType,
  BulkUploadLocationResponse,
} from '@/types/location';

// Types - Sectors
import type {
  Sector,
  CreateSectorDTO,
  UpdateSectorDTO,
  SectorsQueryParams,
} from '@/types/sector';

// Types - Job Roles
import type {
  JobRole,
  CreateJobRoleDTO,
  UpdateJobRoleDTO,
  JobRolesQueryParams,
} from '@/types/jobRole';

// Types - Document Types
import type {
  DocumentType,
  CreateDocumentTypeDTO,
  UpdateDocumentTypeDTO,
  DocumentTypesQueryParams,
} from '@/types/documentType';

// Bulk upload response type
interface BulkUploadGenericResponse {
  success: boolean;
  created: number;
  updated: number;
  errors: { row: number; message: string }[];
}

// Base API configuration for RTK Query
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth?.user ? 'mock-token' : null;
      
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: [
    'Program',
    'Centre',
    'State',
    'District',
    'Block',
    'Panchayat',
    'Village',
    'Pincode',
    'Sector',
    'JobRole',
    'DocumentType',
  ],
  endpoints: (builder) => ({
    // ==================== PROGRAMS ====================
    getPrograms: builder.query<Program[], ProgramsQueryParams>({
      query: (params) => ({
        url: 'programs',
        params: {
          search: params.search,
          status: params.status,
          page: params.page,
          limit: params.limit,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Program' as const, id })),
              { type: 'Program', id: 'LIST' },
            ]
          : [{ type: 'Program', id: 'LIST' }],
    }),

    getProgramById: builder.query<Program, string>({
      query: (id) => `programs/${id}`,
      providesTags: (result, error, id) => [{ type: 'Program', id }],
    }),

    createProgram: builder.mutation<Program, CreateProgramDTO>({
      query: (body) => ({
        url: 'programs',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Program', id: 'LIST' }],
    }),

    updateProgram: builder.mutation<Program, { id: string; data: UpdateProgramDTO }>({
      query: ({ id, data }) => ({
        url: `programs/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Program', id },
        { type: 'Program', id: 'LIST' },
      ],
    }),

    deleteProgram: builder.mutation<void, string>({
      query: (id) => ({
        url: `programs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Program', id: 'LIST' }],
    }),

    bulkUploadPrograms: builder.mutation<BulkUploadResponse, FormData>({
      query: (formData) => ({
        url: 'programs/bulk-upload',
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: [{ type: 'Program', id: 'LIST' }],
    }),

    getCentres: builder.query<Centre[], { stateId?: string; search?: string }>({
      query: (params) => ({
        url: 'centres',
        params,
      }),
      providesTags: ['Centre'],
    }),

    // ==================== STATES ====================
    getStates: builder.query<State[], LocationsQueryParams>({
      query: (params) => ({
        url: 'locations/states',
        params: {
          search: params.search,
          status: params.status,
          page: params.page,
          limit: params.limit,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'State' as const, id })),
              { type: 'State', id: 'LIST' },
            ]
          : [{ type: 'State', id: 'LIST' }],
    }),

    getStateById: builder.query<State, string>({
      query: (id) => `locations/states/${id}`,
      providesTags: (result, error, id) => [{ type: 'State', id }],
    }),

    createState: builder.mutation<State, CreateStateDTO>({
      query: (body) => ({
        url: 'locations/states',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'State', id: 'LIST' }],
    }),

    updateState: builder.mutation<State, { id: string; data: UpdateStateDTO }>({
      query: ({ id, data }) => ({
        url: `locations/states/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'State', id },
        { type: 'State', id: 'LIST' },
      ],
    }),

    deleteState: builder.mutation<void, string>({
      query: (id) => ({
        url: `locations/states/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['State', 'District', 'Block', 'Panchayat', 'Village'],
    }),

    // ==================== DISTRICTS ====================
    getDistricts: builder.query<District[], LocationsQueryParams>({
      query: (params) => ({
        url: 'locations/districts',
        params: {
          search: params.search,
          status: params.status,
          stateId: params.stateId,
          page: params.page,
          limit: params.limit,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'District' as const, id })),
              { type: 'District', id: 'LIST' },
            ]
          : [{ type: 'District', id: 'LIST' }],
    }),

    getDistrictById: builder.query<District, string>({
      query: (id) => `locations/districts/${id}`,
      providesTags: (result, error, id) => [{ type: 'District', id }],
    }),

    createDistrict: builder.mutation<District, CreateDistrictDTO>({
      query: (body) => ({
        url: 'locations/districts',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'District', id: 'LIST' }, 'State'],
    }),

    updateDistrict: builder.mutation<District, { id: string; data: Partial<CreateDistrictDTO> }>({
      query: ({ id, data }) => ({
        url: `locations/districts/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'District', id },
        { type: 'District', id: 'LIST' },
      ],
    }),

    deleteDistrict: builder.mutation<void, string>({
      query: (id) => ({
        url: `locations/districts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['District', 'Block', 'Panchayat', 'Village'],
    }),

    // ==================== BLOCKS ====================
    getBlocks: builder.query<Block[], LocationsQueryParams>({
      query: (params) => ({
        url: 'locations/blocks',
        params: {
          search: params.search,
          status: params.status,
          districtId: params.districtId,
          page: params.page,
          limit: params.limit,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Block' as const, id })),
              { type: 'Block', id: 'LIST' },
            ]
          : [{ type: 'Block', id: 'LIST' }],
    }),

    createBlock: builder.mutation<Block, CreateBlockDTO>({
      query: (body) => ({
        url: 'locations/blocks',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Block', id: 'LIST' }, 'District'],
    }),

    updateBlock: builder.mutation<Block, { id: string; data: Partial<CreateBlockDTO> }>({
      query: ({ id, data }) => ({
        url: `locations/blocks/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Block', id },
        { type: 'Block', id: 'LIST' },
      ],
    }),

    deleteBlock: builder.mutation<void, string>({
      query: (id) => ({
        url: `locations/blocks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Block', 'Panchayat', 'Village'],
    }),

    // ==================== PANCHAYATS ====================
    getPanchayats: builder.query<Panchayat[], LocationsQueryParams>({
      query: (params) => ({
        url: 'locations/panchayats',
        params: {
          search: params.search,
          status: params.status,
          blockId: params.blockId,
          page: params.page,
          limit: params.limit,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Panchayat' as const, id })),
              { type: 'Panchayat', id: 'LIST' },
            ]
          : [{ type: 'Panchayat', id: 'LIST' }],
    }),

    createPanchayat: builder.mutation<Panchayat, CreatePanchayatDTO>({
      query: (body) => ({
        url: 'locations/panchayats',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Panchayat', id: 'LIST' }, 'Block'],
    }),

    updatePanchayat: builder.mutation<Panchayat, { id: string; data: Partial<CreatePanchayatDTO> }>({
      query: ({ id, data }) => ({
        url: `locations/panchayats/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Panchayat', id },
        { type: 'Panchayat', id: 'LIST' },
      ],
    }),

    deletePanchayat: builder.mutation<void, string>({
      query: (id) => ({
        url: `locations/panchayats/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Panchayat', 'Village'],
    }),

    // ==================== VILLAGES ====================
    getVillages: builder.query<Village[], LocationsQueryParams>({
      query: (params) => ({
        url: 'locations/villages',
        params: {
          search: params.search,
          status: params.status,
          panchayatId: params.panchayatId,
          page: params.page,
          limit: params.limit,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Village' as const, id })),
              { type: 'Village', id: 'LIST' },
            ]
          : [{ type: 'Village', id: 'LIST' }],
    }),

    createVillage: builder.mutation<Village, CreateVillageDTO>({
      query: (body) => ({
        url: 'locations/villages',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Village', id: 'LIST' }, 'Panchayat'],
    }),

    updateVillage: builder.mutation<Village, { id: string; data: Partial<CreateVillageDTO> }>({
      query: ({ id, data }) => ({
        url: `locations/villages/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Village', id },
        { type: 'Village', id: 'LIST' },
      ],
    }),

    deleteVillage: builder.mutation<void, string>({
      query: (id) => ({
        url: `locations/villages/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Village'],
    }),

    // ==================== PINCODES ====================
    getPincodes: builder.query<Pincode[], LocationsQueryParams>({
      query: (params) => ({
        url: 'locations/pincodes',
        params: {
          search: params.search,
          status: params.status,
          districtId: params.districtId,
          page: params.page,
          limit: params.limit,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Pincode' as const, id })),
              { type: 'Pincode', id: 'LIST' },
            ]
          : [{ type: 'Pincode', id: 'LIST' }],
    }),

    createPincode: builder.mutation<Pincode, CreatePincodeDTO>({
      query: (body) => ({
        url: 'locations/pincodes',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Pincode', id: 'LIST' }],
    }),

    updatePincode: builder.mutation<Pincode, { id: string; data: Partial<CreatePincodeDTO> }>({
      query: ({ id, data }) => ({
        url: `locations/pincodes/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Pincode', id },
        { type: 'Pincode', id: 'LIST' },
      ],
    }),

    deletePincode: builder.mutation<void, string>({
      query: (id) => ({
        url: `locations/pincodes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Pincode'],
    }),

    // ==================== LOCATIONS BULK UPLOAD ====================
    bulkUploadLocations: builder.mutation<
      BulkUploadLocationResponse,
      { type: LocationType; formData: FormData }
    >({
      query: ({ type, formData }) => ({
        url: `locations/${type}/bulk-upload`,
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: (result, error, { type }) => {
        switch (type) {
          case 'state':
            return ['State'];
          case 'district':
            return ['District', 'State'];
          case 'block':
            return ['Block', 'District'];
          case 'panchayat':
            return ['Panchayat', 'Block'];
          case 'village':
            return ['Village', 'Panchayat'];
          case 'pincode':
            return ['Pincode', 'District'];
          default:
            return ['State', 'District', 'Block', 'Panchayat', 'Village', 'Pincode'];
        }
      },
    }),

    // ==================== LOCATION HIERARCHY ====================
    getLocationHierarchy: builder.query<
      LocationHierarchy,
      { stateId?: string; districtId?: string; blockId?: string; panchayatId?: string }
    >({
      query: (params) => ({
        url: 'locations/hierarchy',
        params,
      }),
      providesTags: ['State', 'District', 'Block', 'Panchayat', 'Village'],
    }),

    // ==================== SECTORS ====================
    getSectors: builder.query<Sector[], SectorsQueryParams>({
      query: (params) => ({
        url: 'sectors',
        params: {
          search: params.search,
          status: params.status,
          page: params.page,
          limit: params.limit,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Sector' as const, id })),
              { type: 'Sector', id: 'LIST' },
            ]
          : [{ type: 'Sector', id: 'LIST' }],
    }),

    getSectorById: builder.query<Sector, string>({
      query: (id) => `sectors/${id}`,
      providesTags: (result, error, id) => [{ type: 'Sector', id }],
    }),

    createSector: builder.mutation<Sector, CreateSectorDTO>({
      query: (body) => ({
        url: 'sectors',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Sector', id: 'LIST' }],
    }),

    updateSector: builder.mutation<Sector, { id: string; data: UpdateSectorDTO }>({
      query: ({ id, data }) => ({
        url: `sectors/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Sector', id },
        { type: 'Sector', id: 'LIST' },
      ],
    }),

    deleteSector: builder.mutation<void, string>({
      query: (id) => ({
        url: `sectors/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Sector', id: 'LIST' }],
    }),

    bulkUploadSectors: builder.mutation<BulkUploadGenericResponse, FormData>({
      query: (formData) => ({
        url: 'sectors/bulk-upload',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Sector', id: 'LIST' }],
    }),

    // ==================== JOB ROLES ====================
    getJobRoles: builder.query<JobRole[], JobRolesQueryParams>({
      query: (params) => ({
        url: 'job-roles',
        params: {
          search: params.search,
          sectorId: params.sectorId,
          status: params.status,
          page: params.page,
          limit: params.limit,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'JobRole' as const, id })),
              { type: 'JobRole', id: 'LIST' },
            ]
          : [{ type: 'JobRole', id: 'LIST' }],
    }),

    getJobRoleById: builder.query<JobRole, string>({
      query: (id) => `job-roles/${id}`,
      providesTags: (result, error, id) => [{ type: 'JobRole', id }],
    }),

    createJobRole: builder.mutation<JobRole, CreateJobRoleDTO>({
      query: (body) => ({
        url: 'job-roles',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'JobRole', id: 'LIST' }, 'Sector'],
    }),

    updateJobRole: builder.mutation<JobRole, { id: string; data: UpdateJobRoleDTO }>({
      query: ({ id, data }) => ({
        url: `job-roles/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'JobRole', id },
        { type: 'JobRole', id: 'LIST' },
      ],
    }),

    deleteJobRole: builder.mutation<void, string>({
      query: (id) => ({
        url: `job-roles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'JobRole', id: 'LIST' }],
    }),

    bulkUploadJobRoles: builder.mutation<BulkUploadGenericResponse, FormData>({
      query: (formData) => ({
        url: 'job-roles/bulk-upload',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'JobRole', id: 'LIST' }],
    }),

    // ==================== DOCUMENT TYPES ====================
    getDocumentTypes: builder.query<DocumentType[], DocumentTypesQueryParams>({
      query: (params) => ({
        url: 'document-types',
        params: {
          search: params.search,
          category: params.category,
          status: params.status,
          page: params.page,
          limit: params.limit,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'DocumentType' as const, id })),
              { type: 'DocumentType', id: 'LIST' },
            ]
          : [{ type: 'DocumentType', id: 'LIST' }],
    }),

    getDocumentTypeById: builder.query<DocumentType, string>({
      query: (id) => `document-types/${id}`,
      providesTags: (result, error, id) => [{ type: 'DocumentType', id }],
    }),

    createDocumentType: builder.mutation<DocumentType, CreateDocumentTypeDTO>({
      query: (body) => ({
        url: 'document-types',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'DocumentType', id: 'LIST' }],
    }),

    updateDocumentType: builder.mutation<DocumentType, { id: string; data: UpdateDocumentTypeDTO }>({
      query: ({ id, data }) => ({
        url: `document-types/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'DocumentType', id },
        { type: 'DocumentType', id: 'LIST' },
      ],
    }),

    deleteDocumentType: builder.mutation<void, string>({
      query: (id) => ({
        url: `document-types/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'DocumentType', id: 'LIST' }],
    }),

    bulkUploadDocumentTypes: builder.mutation<BulkUploadGenericResponse, FormData>({
      query: (formData) => ({
        url: 'document-types/bulk-upload',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'DocumentType', id: 'LIST' }],
    }),
  }),
});

// Export all hooks
export const {
  // Programs
  useGetProgramsQuery,
  useGetProgramByIdQuery,
  useCreateProgramMutation,
  useUpdateProgramMutation,
  useDeleteProgramMutation,
  useBulkUploadProgramsMutation,
  useGetCentresQuery,
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
  // Locations Bulk & Hierarchy
  useBulkUploadLocationsMutation,
  useGetLocationHierarchyQuery,
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
} = apiSlice;

export default apiSlice;
