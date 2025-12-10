export interface Centre {
  id: string;
  name: string;
  code: string;
  stateId: string;
  stateName?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Program {
  id: string;
  code: string;
  name: string;
  fullName: string;
  isActive: boolean;
  centres: Centre[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProgramDTO {
  code: string;
  name: string;
  fullName: string;
  centreIds: string[];
  isActive?: boolean;
}

export interface UpdateProgramDTO {
  code?: string;
  name?: string;
  fullName?: string;
  centreIds?: string[];
  isActive?: boolean;
}

export interface ProgramsQueryParams {
  search?: string;
  status?: 'active' | 'inactive' | 'all';
  page?: number;
  limit?: number;
}

export interface BulkUploadResponse {
  success: boolean;
  created: number;
  updated: number;
  errors: { row: number; message: string }[];
}
