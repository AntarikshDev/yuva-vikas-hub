import { baseApi } from './baseApi';
import type {
  Program,
  CreateProgramDTO,
  UpdateProgramDTO,
  ProgramsQueryParams,
  BulkUploadResponse,
  Centre,
} from '@/types/program';

export const programsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all programs with optional filters
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

    // Get single program by ID
    getProgramById: builder.query<Program, string>({
      query: (id) => `programs/${id}`,
      providesTags: (result, error, id) => [{ type: 'Program', id }],
    }),

    // Create new program
    createProgram: builder.mutation<Program, CreateProgramDTO>({
      query: (body) => ({
        url: 'programs',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Program', id: 'LIST' }],
    }),

    // Update existing program
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

    // Delete/archive program
    deleteProgram: builder.mutation<void, string>({
      query: (id) => ({
        url: `programs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Program', id: 'LIST' }],
    }),

    // Bulk upload programs
    bulkUploadPrograms: builder.mutation<BulkUploadResponse, FormData>({
      query: (formData) => ({
        url: 'programs/bulk-upload',
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: [{ type: 'Program', id: 'LIST' }],
    }),

    // Get all centres for program assignment
    getCentres: builder.query<Centre[], { stateId?: string; search?: string }>({
      query: (params) => ({
        url: 'centres',
        params,
      }),
      providesTags: ['Centre'],
    }),
  }),
});

export const {
  useGetProgramsQuery,
  useGetProgramByIdQuery,
  useCreateProgramMutation,
  useUpdateProgramMutation,
  useDeleteProgramMutation,
  useBulkUploadProgramsMutation,
  useGetCentresQuery,
} = programsApi;
