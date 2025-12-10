import { baseApi } from './baseApi';
import type {
  JobRole,
  CreateJobRoleDTO,
  UpdateJobRoleDTO,
  JobRolesQueryParams,
} from '@/types/jobRole';

export const jobRolesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all job roles with optional filters
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

    // Get single job role by ID
    getJobRoleById: builder.query<JobRole, string>({
      query: (id) => `job-roles/${id}`,
      providesTags: (result, error, id) => [{ type: 'JobRole', id }],
    }),

    // Create new job role
    createJobRole: builder.mutation<JobRole, CreateJobRoleDTO>({
      query: (body) => ({
        url: 'job-roles',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'JobRole', id: 'LIST' }, 'Sector'],
    }),

    // Update existing job role
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

    // Delete/archive job role
    deleteJobRole: builder.mutation<void, string>({
      query: (id) => ({
        url: `job-roles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'JobRole', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetJobRolesQuery,
  useGetJobRoleByIdQuery,
  useCreateJobRoleMutation,
  useUpdateJobRoleMutation,
  useDeleteJobRoleMutation,
} = jobRolesApi;
