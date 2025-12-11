import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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
    baseUrl: 'https://app-e2hhu.ondigitalocean.app',
    prepareHeaders: (headers) => {
      // Client-side: Use localStorage for token
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
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
    'User',
    'Candidates',
    'WorkOrders',
    'Mobilizers',
    'Centers',
    'States',
    'Districts',
    'TravelMode',
  ],
  endpoints: (builder) => ({
    // ==================== AUTH ====================
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/role/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),

    // ==================== PROGRAMS ====================
    getPrograms: builder.query<Program[], ProgramsQueryParams>({
      query: (params) => ({
        url: '/work-orders/getPrograms',
        method: 'GET',
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
      query: (id) => `/programs/${id}`,
      providesTags: (result, error, id) => [{ type: 'Program', id }],
    }),

    createProgram: builder.mutation<Program, CreateProgramDTO>({
      query: (body) => ({
        url: '/programs',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Program', id: 'LIST' }],
    }),

    updateProgram: builder.mutation<Program, { id: string; data: UpdateProgramDTO }>({
      query: ({ id, data }) => ({
        url: `/programs/${id}`,
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
        url: `/programs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Program', id: 'LIST' }],
    }),

    bulkUploadPrograms: builder.mutation<BulkUploadResponse, FormData>({
      query: (formData) => ({
        url: '/programs/bulk-upload',
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: [{ type: 'Program', id: 'LIST' }],
    }),

    getCentres: builder.query<Centre[], { stateId?: string; search?: string }>({
      query: (params) => ({
        url: '/admin/centre/list',
        method: 'GET',
        params,
      }),
      providesTags: ['Centre'],
    }),

    // ==================== STATES ====================
    getStates: builder.query<State[], LocationsQueryParams>({
      query: (params) => ({
        url: '/admin/state/list',
        method: 'GET',
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
      query: (id) => `/admin/state/detail/${id}`,
      providesTags: (result, error, id) => [{ type: 'State', id }],
    }),

    createState: builder.mutation<State, CreateStateDTO>({
      query: (body) => ({
        url: '/admin/state/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'State', id: 'LIST' }],
    }),

    updateState: builder.mutation<State, { id: string; data: UpdateStateDTO }>({
      query: ({ id, data }) => ({
        url: '/admin/state/update',
        method: 'PUT',
        body: { id, ...data },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'State', id },
        { type: 'State', id: 'LIST' },
      ],
    }),

    updateStateStatus: builder.mutation<void, { id: string; isActive: boolean }>({
      query: (payload) => ({
        url: '/admin/state/status/update',
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['State'],
    }),

    deleteState: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/state/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['State', 'District', 'Block', 'Panchayat', 'Village'],
    }),

    // ==================== DISTRICTS ====================
    getDistricts: builder.query<District[], LocationsQueryParams>({
      query: (params) => ({
        url: '/locations/districts',
        method: 'GET',
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

    getDistrictsByState: builder.query<string[], string>({
      query: (state) => `/work-orders/users/district?state=${encodeURIComponent(state)}`,
      providesTags: ['District'],
      transformResponse: (response: any) => response.data || [],
    }),

    getDistrictById: builder.query<District, string>({
      query: (id) => `/locations/districts/${id}`,
      providesTags: (result, error, id) => [{ type: 'District', id }],
    }),

    createDistrict: builder.mutation<District, CreateDistrictDTO>({
      query: (body) => ({
        url: '/admin/state/district/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'District', id: 'LIST' }, 'State'],
    }),

    updateDistrict: builder.mutation<District, { id: string; data: Partial<CreateDistrictDTO> }>({
      query: ({ id, data }) => ({
        url: '/admin/state/district/update',
        method: 'PUT',
        body: { id, ...data },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'District', id },
        { type: 'District', id: 'LIST' },
      ],
    }),

    deleteDistrict: builder.mutation<void, string>({
      query: (id) => ({
        url: `/locations/districts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['District', 'Block', 'Panchayat', 'Village'],
    }),

    // ==================== BLOCKS ====================
    getBlocks: builder.query<Block[], LocationsQueryParams>({
      query: (params) => ({
        url: '/locations/blocks',
        method: 'GET',
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
        url: '/locations/blocks',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Block', id: 'LIST' }, 'District'],
    }),

    updateBlock: builder.mutation<Block, { id: string; data: Partial<CreateBlockDTO> }>({
      query: ({ id, data }) => ({
        url: `/locations/blocks/${id}`,
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
        url: `/locations/blocks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Block', 'Panchayat', 'Village'],
    }),

    // ==================== PANCHAYATS ====================
    getPanchayats: builder.query<Panchayat[], LocationsQueryParams>({
      query: (params) => ({
        url: '/locations/panchayats',
        method: 'GET',
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
        url: '/locations/panchayats',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Panchayat', id: 'LIST' }, 'Block'],
    }),

    updatePanchayat: builder.mutation<Panchayat, { id: string; data: Partial<CreatePanchayatDTO> }>({
      query: ({ id, data }) => ({
        url: `/locations/panchayats/${id}`,
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
        url: `/locations/panchayats/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Panchayat', 'Village'],
    }),

    // ==================== VILLAGES ====================
    getVillages: builder.query<Village[], LocationsQueryParams>({
      query: (params) => ({
        url: '/locations/villages',
        method: 'GET',
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
        url: '/locations/villages',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Village', id: 'LIST' }, 'Panchayat'],
    }),

    updateVillage: builder.mutation<Village, { id: string; data: Partial<CreateVillageDTO> }>({
      query: ({ id, data }) => ({
        url: `/locations/villages/${id}`,
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
        url: `/locations/villages/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Village'],
    }),

    // ==================== PINCODES ====================
    getPincodes: builder.query<Pincode[], LocationsQueryParams>({
      query: (params) => ({
        url: '/locations/pincodes',
        method: 'GET',
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
        url: '/locations/pincodes',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Pincode', id: 'LIST' }],
    }),

    updatePincode: builder.mutation<Pincode, { id: string; data: Partial<CreatePincodeDTO> }>({
      query: ({ id, data }) => ({
        url: `/locations/pincodes/${id}`,
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
        url: `/locations/pincodes/${id}`,
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
        url: `/locations/${type}/bulk-upload`,
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
        url: '/locations/hierarchy',
        params,
      }),
      providesTags: ['State', 'District', 'Block', 'Panchayat', 'Village'],
    }),

    // ==================== SECTORS ====================
    getSectors: builder.query<Sector[], SectorsQueryParams>({
      query: (params) => ({
        url: '/sectors',
        method: 'GET',
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
      query: (id) => `/sectors/${id}`,
      providesTags: (result, error, id) => [{ type: 'Sector', id }],
    }),

    createSector: builder.mutation<Sector, CreateSectorDTO>({
      query: (body) => ({
        url: '/sectors',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Sector', id: 'LIST' }],
    }),

    updateSector: builder.mutation<Sector, { id: string; data: UpdateSectorDTO }>({
      query: ({ id, data }) => ({
        url: `/sectors/${id}`,
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
        url: `/sectors/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Sector', id: 'LIST' }],
    }),

    bulkUploadSectors: builder.mutation<BulkUploadGenericResponse, FormData>({
      query: (formData) => ({
        url: '/sectors/bulk-upload',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Sector', id: 'LIST' }],
    }),

    // ==================== JOB ROLES ====================
    getJobRoles: builder.query<JobRole[], JobRolesQueryParams>({
      query: (params) => ({
        url: '/job-roles',
        method: 'GET',
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
      query: (id) => `/job-roles/${id}`,
      providesTags: (result, error, id) => [{ type: 'JobRole', id }],
    }),

    createJobRole: builder.mutation<JobRole, CreateJobRoleDTO>({
      query: (body) => ({
        url: '/job-roles',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'JobRole', id: 'LIST' }, 'Sector'],
    }),

    updateJobRole: builder.mutation<JobRole, { id: string; data: UpdateJobRoleDTO }>({
      query: ({ id, data }) => ({
        url: `/job-roles/${id}`,
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
        url: `/job-roles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'JobRole', id: 'LIST' }],
    }),

    bulkUploadJobRoles: builder.mutation<BulkUploadGenericResponse, FormData>({
      query: (formData) => ({
        url: '/job-roles/bulk-upload',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'JobRole', id: 'LIST' }],
    }),

    // ==================== DOCUMENT TYPES ====================
    getDocumentTypes: builder.query<DocumentType[], DocumentTypesQueryParams>({
      query: (params) => ({
        url: '/document-types',
        method: 'GET',
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
      query: (id) => `/document-types/${id}`,
      providesTags: (result, error, id) => [{ type: 'DocumentType', id }],
    }),

    createDocumentType: builder.mutation<DocumentType, CreateDocumentTypeDTO>({
      query: (body) => ({
        url: '/document-types',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'DocumentType', id: 'LIST' }],
    }),

    updateDocumentType: builder.mutation<DocumentType, { id: string; data: UpdateDocumentTypeDTO }>({
      query: ({ id, data }) => ({
        url: `/document-types/${id}`,
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
        url: `/document-types/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'DocumentType', id: 'LIST' }],
    }),

    bulkUploadDocumentTypes: builder.mutation<BulkUploadGenericResponse, FormData>({
      query: (formData) => ({
        url: '/document-types/bulk-upload',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'DocumentType', id: 'LIST' }],
    }),

    // ==================== USERS ====================
    getUsersList: builder.query({
      query: () => ({
        url: '/admin/user/list',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    getUserDetail: builder.query({
      query: (id) => ({
        url: `/admin/user/detail/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    addUser: builder.mutation({
      query: (user) => ({
        url: '/admin/user/add',
        method: 'POST',
        body: user,
      }),
      invalidatesTags: ['User'],
    }),

    updateUser: builder.mutation({
      query: (data) => ({
        url: '/admin/user/update',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    updateUserStatus: builder.mutation({
      query: (data) => ({
        url: '/admin/user/status/change',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/admin/user/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    getUsersByFilters: builder.query({
      query: (params?: { role?: string; state?: string }) => {
        const baseUrl = '/work-orders/users';
        if (!params) return baseUrl;
        const { role, state } = params;
        const searchParams = new URLSearchParams();
        if (role) searchParams.append('role', role);
        if (state) searchParams.append('state', state);
        const queryString = searchParams.toString();
        return `${baseUrl}${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['User'],
    }),

    getAvailableRoles: builder.query({
      query: () => '/work-orders/users/roles',
      providesTags: ['User'],
    }),

    getAvailableStates: builder.query({
      query: () => '/work-orders/users/states',
      providesTags: ['User'],
    }),

    // ==================== CANDIDATES ====================
    getCandidatesList: builder.query({
      query: () => ({
        url: '/candidates/candidate/list',
        method: 'GET',
      }),
      providesTags: ['Candidates'],
    }),

    getCandidateDetails: builder.query({
      query: (id) => `/candidates/detail/${id}`,
      providesTags: ['Candidates'],
    }),

    updateCandidateStatus: builder.mutation({
      query: (data) => ({
        url: '/counsellor/candidate/status/change',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Candidates'],
    }),

    updateCandidateDetails: builder.mutation({
      query: (payload) => ({
        url: '/candidates/update_candidate',
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['Candidates'],
    }),

    notInterestedCandidates: builder.query({
      query: () => '/counsellor/notintrestedcandidate',
      providesTags: ['Candidates'],
    }),

    notInterestedUpdateCandidate: builder.mutation({
      query: (data) => ({
        url: '/counsellor/notInterestedCandidate/status/change',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Candidates'],
    }),

    getMobiliserCandidateList: builder.query({
      query: (id) => `/counsellor/candidate/list/${id}`,
      providesTags: ['Candidates'],
    }),

    searchMobilizers: builder.mutation({
      query: (searchTerm: string) => ({
        url: '/counsellor/manager/list',
        method: 'POST',
        body: { search: searchTerm },
      }),
    }),

    // ==================== WORK ORDERS ====================
    getWorkOrders: builder.query({
      query: () => '/workorders',
      providesTags: ['WorkOrders'],
    }),

    createWorkOrder: builder.mutation({
      query: (payload) => ({
        url: '/work-orders',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['WorkOrders'],
    }),

    workOrdersByProgramId: builder.mutation({
      query: (programId) => ({
        url: '/work-orders/wbi',
        method: 'POST',
        body: { programId },
      }),
    }),

    getDetailWorkOrdersByProgramIdAndStatus: builder.mutation({
      query: (body) => ({
        url: '/work-orders/programidAndState',
        method: 'POST',
        body,
      }),
    }),

    // ==================== STATISTICS ====================
    getPage: builder.query({
      query: () => ({
        url: '/business/gethome',
        method: 'GET',
      }),
      providesTags: ['WorkOrders'],
    }),

    getFinalStats: builder.query({
      query: () => ({
        url: '/work-orders/getfinalStats',
        method: 'GET',
      }),
      providesTags: ['WorkOrders'],
    }),

    getTopStats: builder.query({
      query: () => ({
        url: '/work-orders/mobilisation-stats',
        method: 'GET',
      }),
      providesTags: ['WorkOrders'],
    }),

    getDetailKPI: builder.mutation({
      query: (body) => ({
        url: '/business/getdata',
        method: 'POST',
        body,
      }),
    }),

    getActivityData: builder.query({
      query: () => '/activity/list',
      providesTags: ['Candidates'],
    }),

    // ==================== CENTERS ====================
    getCentersList: builder.query({
      query: () => ({
        url: '/admin/centre/list',
        method: 'GET',
      }),
      providesTags: ['Centre'],
    }),

    getCenterDetail: builder.query({
      query: (id) => ({
        url: `/admin/centre/detail/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Centre', id }],
    }),

    addCenter: builder.mutation({
      query: (center) => ({
        url: '/admin/centre/add',
        method: 'POST',
        body: center,
      }),
      invalidatesTags: ['Centre'],
    }),

    updateCenter: builder.mutation({
      query: (center) => ({
        url: '/admin/centre/update',
        method: 'PUT',
        body: center,
      }),
      invalidatesTags: ['Centre'],
    }),

    updateCenterStatus: builder.mutation({
      query: (payload) => ({
        url: '/admin/centre/status/update',
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['Centre'],
    }),

    deleteCenter: builder.mutation({
      query: (id) => ({
        url: `/admin/centre/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Centre'],
    }),

    // ==================== ACTIVE STATES LIST ====================
    getActiveStatesList: builder.query({
      query: () => ({
        url: '/admin/get/active/state/list',
        method: 'GET',
      }),
      providesTags: ['State'],
    }),

    getStatesListForAdd: builder.query({
      query: () => ({
        url: '/auth/get/state/list',
        method: 'GET',
      }),
      providesTags: ['State'],
    }),

    getDistrictListForAdd: builder.query({
      query: (stateCode) => ({
        url: `/auth/get/state/district/list/${stateCode}`,
        method: 'GET',
      }),
      providesTags: (result, error, stateCode) => [
        { type: 'District', id: `${stateCode}-LIST` },
      ],
    }),

    // ==================== TRAVEL MODES ====================
    getTravelModes: builder.query<any[], { search?: string }>({
      query: (params) => ({
        url: '/work-orders/travel-modes',
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((item: any) => ({ type: 'TravelMode' as const, id: item.id })),
              { type: 'TravelMode', id: 'LIST' },
            ]
          : [{ type: 'TravelMode', id: 'LIST' }],
    }),

    getTravelMode: builder.query<any, string>({
      query: (id) => `/work-orders/travel-modes/${id}`,
      providesTags: (result, error, id) => [{ type: 'TravelMode', id }],
    }),

    createTravelMode: builder.mutation<any, { name: string }>({
      query: (body) => ({
        url: '/work-orders/travel-modes',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'TravelMode', id: 'LIST' }],
    }),

    updateTravelMode: builder.mutation<any, { id: string; name: string }>({
      query: ({ id, ...body }) => ({
        url: `/work-orders/travel-modes/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'TravelMode', id },
        { type: 'TravelMode', id: 'LIST' },
      ],
    }),

    deleteTravelMode: builder.mutation<void, string>({
      query: (id) => ({
        url: `/work-orders/travel-modes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'TravelMode', id: 'LIST' }],
    }),

    // ==================== LOCATION DATA ====================
    getLocationData: builder.query<any, { state?: string; district?: string; block?: string }>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.state) searchParams.append('state', params.state);
        if (params.district) searchParams.append('district', params.district);
        if (params.block) searchParams.append('block', params.block);
        return `/work-orders/getlocationdata?${searchParams.toString()}`;
      },
      providesTags: ['State', 'District', 'Block'],
    }),

    // ==================== WORK ORDER DETAILS ====================
    getWorkOrderById: builder.query<any, string>({
      query: (id) => `/work-orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'WorkOrders', id }],
    }),

    updateWorkOrder: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/work-orders/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'WorkOrders', id },
        { type: 'WorkOrders', id: 'LIST' },
      ],
    }),

    deleteWorkOrder: builder.mutation<void, string>({
      query: (id) => ({
        url: `/work-orders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'WorkOrders', id: 'LIST' }],
    }),

    // ==================== NATIONAL HEADS ====================
    getNationalHeads: builder.query<any[], { stateId?: string }>({
      query: (params) => ({
        url: '/work-orders/national-heads',
        method: 'GET',
        params,
      }),
      providesTags: ['User'],
    }),

    // ==================== DASHBOARD ENDPOINTS ====================
    // Admin Dashboard
    getAdminDashboard: builder.query<any, void>({
      query: () => '/dashboard/admin',
      providesTags: ['WorkOrders', 'Candidates', 'Centre'],
    }),

    // Director Dashboard
    getDirectorDashboard: builder.query<any, void>({
      query: () => '/dashboard/director',
      providesTags: ['WorkOrders', 'Candidates', 'Centre'],
    }),

    // National Head Dashboard
    getNationalHeadDashboard: builder.query<any, { dateRange?: string[] }>({
      query: (params) => ({
        url: '/dashboard/national-head',
        params,
      }),
      providesTags: ['WorkOrders', 'Candidates', 'Centre', 'State'],
    }),

    // Counsellor Dashboard
    getCounsellorDashboard: builder.query<any, { centreId?: string; batchId?: string }>({
      query: (params) => ({
        url: '/dashboard/counsellor',
        params,
      }),
      providesTags: ['Candidates', 'Centre'],
    }),

    // Center Manager Dashboard
    getCenterManagerDashboard: builder.query<any, { centerId?: string; batchId?: string }>({
      query: (params) => ({
        url: '/dashboard/center-manager',
        params,
      }),
      providesTags: ['Candidates', 'Centre'],
    }),

    // Trainer Dashboard
    getTrainerDashboard: builder.query<any, { batchId?: string }>({
      query: (params) => ({
        url: '/dashboard/trainer',
        params,
      }),
      providesTags: ['Candidates'],
    }),

    // State Head Dashboard
    getStateHeadDashboard: builder.query<any, { stateId?: string }>({
      query: (params) => ({
        url: '/dashboard/state-head',
        params,
      }),
      providesTags: ['WorkOrders', 'Candidates', 'Centre', 'State'],
    }),

    // MIS Dashboard
    getMISDashboard: builder.query<any, void>({
      query: () => '/dashboard/mis',
      providesTags: ['Candidates', 'WorkOrders'],
    }),

    // POC Dashboard
    getPOCDashboard: builder.query<any, void>({
      query: () => '/dashboard/poc',
      providesTags: ['Candidates'],
    }),

    // Company HR Dashboard
    getCompanyHRDashboard: builder.query<any, void>({
      query: () => '/dashboard/company-hr',
      providesTags: ['Candidates'],
    }),

    // PPC Admin Dashboard
    getPPCAdminDashboard: builder.query<any, void>({
      query: () => '/dashboard/ppc-admin',
      providesTags: ['Candidates'],
    }),

    // ==================== BATCHES ====================
    getBatches: builder.query<any[], { centreId?: string; status?: string }>({
      query: (params) => ({
        url: '/batches',
        params,
      }),
      providesTags: ['Centre'],
    }),

    getBatchById: builder.query<any, string>({
      query: (id) => `/batches/${id}`,
      providesTags: (result, error, id) => [{ type: 'Centre', id }],
    }),

    createBatch: builder.mutation<any, any>({
      query: (body) => ({
        url: '/batches',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Centre'],
    }),

    updateBatch: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/batches/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Centre'],
    }),

    // ==================== ALERTS ====================
    getAlerts: builder.query<any[], { role?: string; status?: string }>({
      query: (params) => ({
        url: '/alerts',
        params,
      }),
      providesTags: ['User'],
    }),

    markAlertRead: builder.mutation<void, string>({
      query: (id) => ({
        url: `/alerts/${id}/read`,
        method: 'PUT',
      }),
      invalidatesTags: ['User'],
    }),

    // ==================== COUNSELLING ====================
    getCounsellingSessions: builder.query<any[], { candidateId?: string; status?: string }>({
      query: (params) => ({
        url: '/counselling/sessions',
        params,
      }),
      providesTags: ['Candidates'],
    }),

    createCounsellingSession: builder.mutation<any, any>({
      query: (body) => ({
        url: '/counselling/sessions',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Candidates'],
    }),

    // ==================== OFR ====================
    getOFRs: builder.query<any[], { status?: string; centreId?: string }>({
      query: (params) => ({
        url: '/ofr',
        params,
      }),
      providesTags: ['Candidates'],
    }),

    createOFR: builder.mutation<any, any>({
      query: (body) => ({
        url: '/ofr',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Candidates'],
    }),

    verifyOFR: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/ofr/${id}/verify`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Candidates'],
    }),

    // ==================== ATTENDANCE ====================
    getAttendance: builder.query<any[], { batchId?: string; date?: string }>({
      query: (params) => ({
        url: '/attendance',
        params,
      }),
      providesTags: ['Candidates'],
    }),

    markAttendance: builder.mutation<any, any>({
      query: (body) => ({
        url: '/attendance',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Candidates'],
    }),

    // ==================== PLACEMENTS ====================
    getPlacements: builder.query<any[], { status?: string; centreId?: string }>({
      query: (params) => ({
        url: '/placements',
        params,
      }),
      providesTags: ['Candidates'],
    }),

    createPlacement: builder.mutation<any, any>({
      query: (body) => ({
        url: '/placements',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Candidates'],
    }),

    // ==================== VIDEO LOGS ====================
    getVideoLogs: builder.query<any[], { batchId?: string; status?: string }>({
      query: (params) => ({
        url: '/video-logs',
        params,
      }),
      providesTags: ['Candidates'],
    }),

    uploadVideoLog: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: '/video-logs',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Candidates'],
    }),

    // ==================== ASSESSMENTS ====================
    getAssessments: builder.query<any[], { batchId?: string; status?: string }>({
      query: (params) => ({
        url: '/assessments',
        params,
      }),
      providesTags: ['Candidates'],
    }),

    submitAssessment: builder.mutation<any, any>({
      query: (body) => ({
        url: '/assessments',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Candidates'],
    }),

    // ==================== DOCUMENTS ====================
    getCandidateDocuments: builder.query<any[], { candidateId: string }>({
      query: ({ candidateId }) => `/candidates/${candidateId}/documents`,
      providesTags: ['Candidates', 'DocumentType'],
    }),

    uploadCandidateDocument: builder.mutation<any, { candidateId: string; formData: FormData }>({
      query: ({ candidateId, formData }) => ({
        url: `/candidates/${candidateId}/documents`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Candidates', 'DocumentType'],
    }),

    verifyDocument: builder.mutation<any, { documentId: string; status: string }>({
      query: ({ documentId, status }) => ({
        url: `/documents/${documentId}/verify`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Candidates', 'DocumentType'],
    }),

    // ==================== REPORTS ====================
    getReports: builder.query<any[], { type?: string; dateRange?: string[] }>({
      query: (params) => ({
        url: '/reports',
        params,
      }),
      providesTags: ['WorkOrders', 'Candidates'],
    }),

    generateReport: builder.mutation<any, { type: string; filters: any }>({
      query: (body) => ({
        url: '/reports/generate',
        method: 'POST',
        body,
      }),
    }),

    // ==================== COMPANIES ====================
    getCompanies: builder.query<any[], { status?: string }>({
      query: (params) => ({
        url: '/companies',
        params,
      }),
      providesTags: ['User'],
    }),

    createCompany: builder.mutation<any, any>({
      query: (body) => ({
        url: '/companies',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    // ==================== SOS/WELFARE ====================
    getSOSCases: builder.query<any[], { status?: string }>({
      query: (params) => ({
        url: '/sos',
        params,
      }),
      providesTags: ['Candidates'],
    }),

    createSOSCase: builder.mutation<any, any>({
      query: (body) => ({
        url: '/sos',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Candidates'],
    }),

    updateSOSCase: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/sos/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Candidates'],
    }),

    // ==================== WORK ORDER DETAILS ====================
    getWorkOrderDetails: builder.query<any, string>({
      query: (id) => `/work-orders/${id}/details`,
      providesTags: (result, error, id) => [{ type: 'WorkOrders', id }],
    }),

    startWorkOrder: builder.mutation<any, string>({
      query: (id) => ({
        url: `/work-orders/${id}/start`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'WorkOrders', id }],
    }),

    // ==================== CENTRE STATUS ====================
    getCentreStatus: builder.query<any, { workOrderId: string }>({
      query: ({ workOrderId }) => `/work-orders/${workOrderId}/centre-status`,
      providesTags: ['Centers', 'WorkOrders'],
    }),

    getCentresForWorkOrder: builder.query<any[], string>({
      query: (workOrderId) => `/work-orders/${workOrderId}/centres`,
      providesTags: ['Centers'],
    }),

    updateCentreStatus: builder.mutation<any, { workOrderId: string; centreId: string; data: any }>({
      query: ({ workOrderId, centreId, data }) => ({
        url: `/work-orders/${workOrderId}/centres/${centreId}/status`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Centers', 'WorkOrders'],
    }),

    saveCentreChecklist: builder.mutation<any, { workOrderId: string; centreId: string; checklist: any }>({
      query: ({ workOrderId, centreId, checklist }) => ({
        url: `/work-orders/${workOrderId}/centres/${centreId}/checklist`,
        method: 'POST',
        body: checklist,
      }),
      invalidatesTags: ['Centers'],
    }),

    uploadAuditReport: builder.mutation<any, { workOrderId: string; centreId: string; formData: FormData }>({
      query: ({ workOrderId, centreId, formData }) => ({
        url: `/work-orders/${workOrderId}/centres/${centreId}/audit-report`,
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: ['Centers'],
    }),

    // ==================== TARGET PLANNING ====================
    getTargetPlanning: builder.query<any, { workOrderId: string }>({
      query: ({ workOrderId }) => `/work-orders/${workOrderId}/target-planning`,
      providesTags: ['WorkOrders'],
    }),

    getMobilisationTargets: builder.query<any[], { workOrderId: string; centreId?: string }>({
      query: ({ workOrderId, centreId }) => ({
        url: `/work-orders/${workOrderId}/mobilisation-targets`,
        params: { centreId },
      }),
      providesTags: ['WorkOrders'],
    }),

    getEnrolmentTargets: builder.query<any[], { workOrderId: string; centreId?: string }>({
      query: ({ workOrderId, centreId }) => ({
        url: `/work-orders/${workOrderId}/enrolment-targets`,
        params: { centreId },
      }),
      providesTags: ['WorkOrders'],
    }),

    saveTargets: builder.mutation<any, { workOrderId: string; centreId: string; mobilisation: any[]; enrolment: any[] }>({
      query: ({ workOrderId, centreId, mobilisation, enrolment }) => ({
        url: `/work-orders/${workOrderId}/targets`,
        method: 'POST',
        body: { centreId, mobilisation, enrolment },
      }),
      invalidatesTags: ['WorkOrders'],
    }),

    // ==================== DISTRICT ADOPTION ====================
    getDistrictAdoption: builder.query<any, { workOrderId: string }>({
      query: ({ workOrderId }) => `/work-orders/${workOrderId}/district-adoption`,
      providesTags: ['Districts', 'WorkOrders'],
    }),

    getAdoptedDistricts: builder.query<any[], string>({
      query: (workOrderId) => `/work-orders/${workOrderId}/adopted-districts`,
      providesTags: ['Districts'],
    }),

    adoptDistrict: builder.mutation<any, { workOrderId: string; districtId: string }>({
      query: ({ workOrderId, districtId }) => ({
        url: `/work-orders/${workOrderId}/adopt-district`,
        method: 'POST',
        body: { districtId },
      }),
      invalidatesTags: ['Districts', 'WorkOrders'],
    }),

    removeAdoptedDistrict: builder.mutation<any, { workOrderId: string; districtId: string }>({
      query: ({ workOrderId, districtId }) => ({
        url: `/work-orders/${workOrderId}/districts/${districtId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Districts'],
    }),

    getDistrictOverview: builder.query<any, { workOrderId: string }>({
      query: ({ workOrderId }) => `/work-orders/${workOrderId}/district-overview`,
      providesTags: ['Districts'],
    }),

    getDistrictAnalysis: builder.query<any, { workOrderId: string }>({
      query: ({ workOrderId }) => `/work-orders/${workOrderId}/district-analysis`,
      providesTags: ['Districts'],
    }),

    // ==================== TEAM ASSIGNMENT ====================
    getTeamAssignment: builder.query<any, { workOrderId: string }>({
      query: ({ workOrderId }) => `/work-orders/${workOrderId}/team-assignment`,
      providesTags: ['User', 'WorkOrders'],
    }),

    getTeamMembers: builder.query<any[], string>({
      query: (workOrderId) => `/work-orders/${workOrderId}/team-members`,
      providesTags: ['User'],
    }),

    addTeamMember: builder.mutation<any, { workOrderId: string; member: any }>({
      query: ({ workOrderId, member }) => ({
        url: `/work-orders/${workOrderId}/team-members`,
        method: 'POST',
        body: member,
      }),
      invalidatesTags: ['User', 'WorkOrders'],
    }),

    updateTeamMember: builder.mutation<any, { workOrderId: string; memberId: string; data: any }>({
      query: ({ workOrderId, memberId, data }) => ({
        url: `/work-orders/${workOrderId}/team-members/${memberId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    removeTeamMember: builder.mutation<any, { workOrderId: string; memberId: string }>({
      query: ({ workOrderId, memberId }) => ({
        url: `/work-orders/${workOrderId}/team-members/${memberId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    replaceTeamMember: builder.mutation<any, { workOrderId: string; memberId: string; newMember: any; reason: string }>({
      query: ({ workOrderId, memberId, newMember, reason }) => ({
        url: `/work-orders/${workOrderId}/team-members/${memberId}/replace`,
        method: 'POST',
        body: { newMember, reason },
      }),
      invalidatesTags: ['User'],
    }),

    approveTeamMember: builder.mutation<any, { workOrderId: string; memberId: string }>({
      query: ({ workOrderId, memberId }) => ({
        url: `/work-orders/${workOrderId}/team-members/${memberId}/approve`,
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),

    rejectTeamMember: builder.mutation<any, { workOrderId: string; memberId: string }>({
      query: ({ workOrderId, memberId }) => ({
        url: `/work-orders/${workOrderId}/team-members/${memberId}/reject`,
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),

    getAssignmentHistory: builder.query<any[], string>({
      query: (workOrderId) => `/work-orders/${workOrderId}/assignment-history`,
      providesTags: ['User'],
    }),

    getAvailableEmployees: builder.query<any[], { role?: string }>({
      query: (params) => ({
        url: '/employees/available',
        params,
      }),
      providesTags: ['User'],
    }),

    // ==================== BUDGET ====================
    getWorkOrderBudget: builder.query<any, string>({
      query: (workOrderId) => `/work-orders/${workOrderId}/budget`,
      providesTags: ['WorkOrders'],
    }),

    getTeamSalaryData: builder.query<any, string>({
      query: (workOrderId) => `/work-orders/${workOrderId}/team-salary`,
      providesTags: ['User', 'WorkOrders'],
    }),

    createWorkOrderBudget: builder.mutation<any, { workOrderId: string; budget: any }>({
      query: ({ workOrderId, budget }) => ({
        url: `/work-orders/${workOrderId}/budget`,
        method: 'POST',
        body: budget,
      }),
      invalidatesTags: ['WorkOrders'],
    }),

    updateWorkOrderBudget: builder.mutation<any, { workOrderId: string; budgetId: string; data: any }>({
      query: ({ workOrderId, budgetId, data }) => ({
        url: `/work-orders/${workOrderId}/budget/${budgetId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['WorkOrders'],
    }),

    bulkUploadExpenses: builder.mutation<any, { workOrderId: string; expenses: any[] }>({
      query: ({ workOrderId, expenses }) => ({
        url: `/work-orders/${workOrderId}/expenses/bulk`,
        method: 'POST',
        body: { expenses },
      }),
      invalidatesTags: ['WorkOrders'],
    }),

    approveExpenses: builder.mutation<any, { workOrderId: string; expenseIds: string[]; remarks: string }>({
      query: ({ workOrderId, expenseIds, remarks }) => ({
        url: `/work-orders/${workOrderId}/expenses/approve`,
        method: 'POST',
        body: { expenseIds, remarks },
      }),
      invalidatesTags: ['WorkOrders'],
    }),

    rejectExpenses: builder.mutation<any, { workOrderId: string; expenseIds: string[]; reason: string }>({
      query: ({ workOrderId, expenseIds, reason }) => ({
        url: `/work-orders/${workOrderId}/expenses/reject`,
        method: 'POST',
        body: { expenseIds, reason },
      }),
      invalidatesTags: ['WorkOrders'],
    }),

    getHigherAuthorityOptions: builder.query<any[], void>({
      query: () => '/budget/higher-authority-options',
      providesTags: ['User'],
    }),

    // ==================== WORK ORDER STATUS ====================
    getWorkOrderStatus: builder.query<any, string>({
      query: (workOrderId) => `/work-orders/${workOrderId}/status`,
      providesTags: ['WorkOrders'],
    }),

    getCentreStatusSummary: builder.query<any[], string>({
      query: (workOrderId) => `/work-orders/${workOrderId}/centres/status-summary`,
      providesTags: ['Centers'],
    }),

    getTickets: builder.query<any[], { workOrderId: string; status?: string }>({
      query: ({ workOrderId, status }) => ({
        url: `/work-orders/${workOrderId}/tickets`,
        params: { status },
      }),
      providesTags: ['WorkOrders'],
    }),

    createTicket: builder.mutation<any, { workOrderId: string; ticket: any }>({
      query: ({ workOrderId, ticket }) => ({
        url: `/work-orders/${workOrderId}/tickets`,
        method: 'POST',
        body: ticket,
      }),
      invalidatesTags: ['WorkOrders'],
    }),

    updateTicket: builder.mutation<any, { workOrderId: string; ticketId: string; data: any }>({
      query: ({ workOrderId, ticketId, data }) => ({
        url: `/work-orders/${workOrderId}/tickets/${ticketId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['WorkOrders'],
    }),

    getMonthlyTargetAchievement: builder.query<any[], string>({
      query: (workOrderId) => `/work-orders/${workOrderId}/monthly-achievement`,
      providesTags: ['WorkOrders'],
    }),

    getDistrictOFRStatus: builder.query<any[], string>({
      query: (workOrderId) => `/work-orders/${workOrderId}/district-ofr-status`,
      providesTags: ['Districts', 'WorkOrders'],
    }),

    getVacantPositions: builder.query<any[], string>({
      query: (workOrderId) => `/work-orders/${workOrderId}/vacant-positions`,
      providesTags: ['User', 'WorkOrders'],
    }),

    getBudgetVariance: builder.query<any, string>({
      query: (workOrderId) => `/work-orders/${workOrderId}/budget-variance`,
      providesTags: ['WorkOrders'],
    }),

    // ==================== ROZGAR EVENTS ====================
    getRozgarEvents: builder.query<any[], { workOrderId: string; type?: string }>({
      query: ({ workOrderId, type }) => ({
        url: `/work-orders/${workOrderId}/rozgar-events`,
        params: { type },
      }),
      providesTags: ['WorkOrders'],
    }),

    createRozgarEvent: builder.mutation<any, { workOrderId: string; event: any }>({
      query: ({ workOrderId, event }) => ({
        url: `/work-orders/${workOrderId}/rozgar-events`,
        method: 'POST',
        body: event,
      }),
      invalidatesTags: ['WorkOrders'],
    }),

    // ==================== CRP NETWORK ====================
    getCRPNetwork: builder.query<any[], string>({
      query: (workOrderId) => `/work-orders/${workOrderId}/crp-network`,
      providesTags: ['User', 'WorkOrders'],
    }),

    addCRP: builder.mutation<any, { workOrderId: string; crp: any }>({
      query: ({ workOrderId, crp }) => ({
        url: `/work-orders/${workOrderId}/crp-network`,
        method: 'POST',
        body: crp,
      }),
      invalidatesTags: ['User', 'WorkOrders'],
    }),

    // ==================== ACTIVITY CALENDAR ====================
    getActivityCalendar: builder.query<any[], { workOrderId: string; month?: string }>({
      query: ({ workOrderId, month }) => ({
        url: `/work-orders/${workOrderId}/activity-calendar`,
        params: { month },
      }),
      providesTags: ['WorkOrders'],
    }),

    createActivity: builder.mutation<any, { workOrderId: string; activity: any }>({
      query: ({ workOrderId, activity }) => ({
        url: `/work-orders/${workOrderId}/activities`,
        method: 'POST',
        body: activity,
      }),
      invalidatesTags: ['WorkOrders'],
    }),

    // ==================== DISTRICT ADOPTION PLAN ====================
    getDistrictAdoptionPlan: builder.query<any, string>({
      query: (workOrderId) => `/work-orders/${workOrderId}/district-adoption-plan`,
      providesTags: ['WorkOrders', 'Districts'],
    }),

    createDistrictAdoptionPlan: builder.mutation<any, { workOrderId: string; plan: any }>({
      query: ({ workOrderId, plan }) => ({
        url: `/work-orders/${workOrderId}/district-adoption-plan`,
        method: 'POST',
        body: plan,
      }),
      invalidatesTags: ['WorkOrders', 'Districts'],
    }),

    updateDistrictAdoptionPlan: builder.mutation<any, { workOrderId: string; planId: string; data: any }>({
      query: ({ workOrderId, planId, data }) => ({
        url: `/work-orders/${workOrderId}/district-adoption-plan/${planId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['WorkOrders', 'Districts'],
    }),

    uploadDistrictAnalysisData: builder.mutation<any, { workOrderId: string; fileType: string; data: any }>({
      query: ({ workOrderId, fileType, data }) => ({
        url: `/work-orders/${workOrderId}/district-analysis/${fileType}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['WorkOrders', 'Districts'],
    }),

    getDistrictAnalysisData: builder.query<any, { workOrderId: string; analysisType: string }>({
      query: ({ workOrderId, analysisType }) => 
        `/work-orders/${workOrderId}/district-analysis/${analysisType}`,
      providesTags: ['WorkOrders', 'Districts'],
    }),
  }),
});

// Export all hooks
export const {
  // Auth
  useLoginMutation,
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
  useUpdateStateStatusMutation,
  useDeleteStateMutation,
  // Districts
  useGetDistrictsQuery,
  useGetDistrictsByStateQuery,
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
  // Users
  useGetUsersListQuery,
  useGetUserDetailQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useUpdateUserStatusMutation,
  useDeleteUserMutation,
  useGetUsersByFiltersQuery,
  useGetAvailableRolesQuery,
  useGetAvailableStatesQuery,
  // Candidates
  useGetCandidatesListQuery,
  useGetCandidateDetailsQuery,
  useUpdateCandidateStatusMutation,
  useUpdateCandidateDetailsMutation,
  useNotInterestedCandidatesQuery,
  useNotInterestedUpdateCandidateMutation,
  useGetMobiliserCandidateListQuery,
  useSearchMobilizersMutation,
  // Work Orders
  useGetWorkOrdersQuery,
  useLazyGetWorkOrdersQuery,
  useCreateWorkOrderMutation,
  useWorkOrdersByProgramIdMutation,
  useGetDetailWorkOrdersByProgramIdAndStatusMutation,
  useGetWorkOrderByIdQuery,
  useUpdateWorkOrderMutation,
  useDeleteWorkOrderMutation,
  // Statistics
  useGetPageQuery,
  useGetFinalStatsQuery,
  useGetTopStatsQuery,
  useGetDetailKPIMutation,
  useGetActivityDataQuery,
  // Centers
  useGetCentersListQuery,
  useGetCenterDetailQuery,
  useAddCenterMutation,
  useUpdateCenterMutation,
  useUpdateCenterStatusMutation,
  useDeleteCenterMutation,
  // Active States
  useGetActiveStatesListQuery,
  useGetStatesListForAddQuery,
  useGetDistrictListForAddQuery,
  // Travel Modes
  useGetTravelModesQuery,
  useGetTravelModeQuery,
  useCreateTravelModeMutation,
  useUpdateTravelModeMutation,
  useDeleteTravelModeMutation,
  // Location Data
  useGetLocationDataQuery,
  // National Heads
  useGetNationalHeadsQuery,
  // Dashboard endpoints
  useGetAdminDashboardQuery,
  useGetDirectorDashboardQuery,
  useGetNationalHeadDashboardQuery,
  useGetCounsellorDashboardQuery,
  useGetCenterManagerDashboardQuery,
  useGetTrainerDashboardQuery,
  useGetStateHeadDashboardQuery,
  useGetMISDashboardQuery,
  useGetPOCDashboardQuery,
  useGetCompanyHRDashboardQuery,
  useGetPPCAdminDashboardQuery,
  // Batches
  useGetBatchesQuery,
  useGetBatchByIdQuery,
  useCreateBatchMutation,
  useUpdateBatchMutation,
  // Alerts
  useGetAlertsQuery,
  useMarkAlertReadMutation,
  // Counselling
  useGetCounsellingSessionsQuery,
  useCreateCounsellingSessionMutation,
  // OFR
  useGetOFRsQuery,
  useCreateOFRMutation,
  useVerifyOFRMutation,
  // Attendance
  useGetAttendanceQuery,
  useMarkAttendanceMutation,
  // Placements
  useGetPlacementsQuery,
  useCreatePlacementMutation,
  // Video Logs
  useGetVideoLogsQuery,
  useUploadVideoLogMutation,
  // Assessments
  useGetAssessmentsQuery,
  useSubmitAssessmentMutation,
  // Documents
  useGetCandidateDocumentsQuery,
  useUploadCandidateDocumentMutation,
  useVerifyDocumentMutation,
  // Reports
  useGetReportsQuery,
  useGenerateReportMutation,
  // Companies
  useGetCompaniesQuery,
  useCreateCompanyMutation,
  // SOS/Welfare
  useGetSOSCasesQuery,
  useCreateSOSCaseMutation,
  useUpdateSOSCaseMutation,
  // CRP Network
  useGetCRPNetworkQuery,
  useAddCRPMutation,
  // Activity Calendar
  useGetActivityCalendarQuery,
  useCreateActivityMutation,
  // Work Order Details - Centre Status
  useGetCentresForWorkOrderQuery,
  useGetCentreStatusQuery,
  useSaveCentreChecklistMutation,
  useUploadAuditReportMutation,
  // Work Order Details - District Adoption
  useGetAdoptedDistrictsQuery,
  useAdoptDistrictMutation,
  useGetDistrictOverviewQuery,
  // Work Order Details - Target Planning
  useGetMobilisationTargetsQuery,
  useGetEnrolmentTargetsQuery,
  useSaveTargetsMutation,
  // Work Order Details - Team Assignment
  useGetTeamMembersQuery,
  useAddTeamMemberMutation,
  useRemoveTeamMemberMutation,
  useReplaceTeamMemberMutation,
  useApproveTeamMemberMutation,
  useRejectTeamMemberMutation,
  useGetAssignmentHistoryQuery,
  useGetAvailableEmployeesQuery,
  // Work Order Details - Budget
  useGetWorkOrderBudgetQuery,
  useGetTeamSalaryDataQuery,
  useCreateWorkOrderBudgetMutation,
  useUpdateWorkOrderBudgetMutation,
  useBulkUploadExpensesMutation,
  useApproveExpensesMutation,
  useRejectExpensesMutation,
  // Work Order Details - Status
  useGetWorkOrderStatusQuery,
  useGetCentreStatusSummaryQuery,
  useGetTicketsQuery,
  useGetMonthlyTargetAchievementQuery,
  useGetDistrictOFRStatusQuery,
  useGetVacantPositionsQuery,
  useGetBudgetVarianceQuery,
  // Work Order Start
  useStartWorkOrderMutation,
  // District Adoption Plan
  useGetDistrictAdoptionPlanQuery,
  useCreateDistrictAdoptionPlanMutation,
  useUpdateDistrictAdoptionPlanMutation,
  useUploadDistrictAnalysisDataMutation,
  useGetDistrictAnalysisDataQuery,
} = apiSlice;

export default apiSlice;
