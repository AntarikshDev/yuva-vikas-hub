export interface JobRole {
  id: string;
  code: string;
  title: string;
  sectorId: string;
  sectorName?: string;
  nsqfLevel: number;
  trainingHours: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobRoleDTO {
  code: string;
  title: string;
  sectorId: string;
  nsqfLevel: number;
  trainingHours: number;
  isActive?: boolean;
}

export interface UpdateJobRoleDTO {
  code?: string;
  title?: string;
  sectorId?: string;
  nsqfLevel?: number;
  trainingHours?: number;
  isActive?: boolean;
}

export interface JobRolesQueryParams {
  search?: string;
  sectorId?: string;
  status?: 'active' | 'inactive' | 'all';
  page?: number;
  limit?: number;
}
