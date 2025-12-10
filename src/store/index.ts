import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import dashboardSlice from './slices/dashboardSlice';
import mobilisationSlice from './slices/mobilisationSlice';
import directorSlice from './slices/directorSlice';
import nationalHeadSlice from './slices/nationalHeadSlice';
import targetManagementSlice from './slices/targetManagementSlice';
import { apiSlice } from './api/apiSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice,
    dashboard: dashboardSlice,
    mobilisation: mobilisationSlice,
    director: directorSlice,
    nationalHead: nationalHeadSlice,
    targetManagement: targetManagementSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
