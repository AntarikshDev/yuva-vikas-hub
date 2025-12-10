export interface Sector {
  id: string;
  code: string;
  name: string;
  ssc: string; // Sector Skill Council
  jobRolesCount?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSectorDTO {
  code: string;
  name: string;
  ssc: string;
  isActive?: boolean;
}

export interface UpdateSectorDTO {
  code?: string;
  name?: string;
  ssc?: string;
  isActive?: boolean;
}

export interface SectorsQueryParams {
  search?: string;
  status?: 'active' | 'inactive' | 'all';
  page?: number;
  limit?: number;
}
