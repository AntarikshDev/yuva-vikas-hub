import { baseApi } from './baseApi';
import type {
  Sector,
  CreateSectorDTO,
  UpdateSectorDTO,
  SectorsQueryParams,
} from '@/types/sector';

export const sectorsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all sectors with optional filters
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

    // Get single sector by ID
    getSectorById: builder.query<Sector, string>({
      query: (id) => `sectors/${id}`,
      providesTags: (result, error, id) => [{ type: 'Sector', id }],
    }),

    // Create new sector
    createSector: builder.mutation<Sector, CreateSectorDTO>({
      query: (body) => ({
        url: 'sectors',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Sector', id: 'LIST' }],
    }),

    // Update existing sector
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

    // Delete/archive sector
    deleteSector: builder.mutation<void, string>({
      query: (id) => ({
        url: `sectors/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Sector', id: 'LIST' }],
    }),

    // Bulk upload sectors
    bulkUploadSectors: builder.mutation<{ success: boolean; created: number; updated: number; errors: { row: number; message: string }[] }, FormData>({
      query: (formData) => ({
        url: 'sectors/bulk-upload',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Sector', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetSectorsQuery,
  useGetSectorByIdQuery,
  useCreateSectorMutation,
  useUpdateSectorMutation,
  useDeleteSectorMutation,
  useBulkUploadSectorsMutation,
} = sectorsApi;
