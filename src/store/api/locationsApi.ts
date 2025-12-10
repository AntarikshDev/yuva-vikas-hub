import { baseApi } from './baseApi';
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

export const locationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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

    // ==================== BULK UPLOAD ====================
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
        // Invalidate all related tags based on location type
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

    // ==================== HIERARCHY ====================
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
  }),
});

export const {
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
  // Bulk Upload
  useBulkUploadLocationsMutation,
  // Hierarchy
  useGetLocationHierarchyQuery,
} = locationsApi;
