import { baseApi } from './baseApi';
import type {
  DocumentType,
  CreateDocumentTypeDTO,
  UpdateDocumentTypeDTO,
  DocumentTypesQueryParams,
} from '@/types/documentType';

export const documentTypesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all document types with optional filters
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

    // Get single document type by ID
    getDocumentTypeById: builder.query<DocumentType, string>({
      query: (id) => `document-types/${id}`,
      providesTags: (result, error, id) => [{ type: 'DocumentType', id }],
    }),

    // Create new document type
    createDocumentType: builder.mutation<DocumentType, CreateDocumentTypeDTO>({
      query: (body) => ({
        url: 'document-types',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'DocumentType', id: 'LIST' }],
    }),

    // Update existing document type
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

    // Delete/archive document type
    deleteDocumentType: builder.mutation<void, string>({
      query: (id) => ({
        url: `document-types/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'DocumentType', id: 'LIST' }],
    }),

    // Bulk upload document types
    bulkUploadDocumentTypes: builder.mutation<{ success: boolean; created: number; updated: number; errors: { row: number; message: string }[] }, FormData>({
      query: (formData) => ({
        url: 'document-types/bulk-upload',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'DocumentType', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetDocumentTypesQuery,
  useGetDocumentTypeByIdQuery,
  useCreateDocumentTypeMutation,
  useUpdateDocumentTypeMutation,
  useDeleteDocumentTypeMutation,
  useBulkUploadDocumentTypesMutation,
} = documentTypesApi;
