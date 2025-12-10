import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';

// Base API configuration for RTK Query
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      // Get token from auth state if available
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
  endpoints: () => ({}),
});

export default baseApi;
