export interface Departments {
  insertDate: string;
  insertUser: string;
  updateDate?: string;
  updateUser?: string;
  status: string;
  deptId: number;
  departmentName: string;
  teamsDtos?: any;
}

export interface UserRoles {
  insertDate: string;
  insertUser: string;
  updateDate?: string;
  updateUser?: string;
  status: string;
  roleId: number;
  roleName: string;
}

export interface Teams {
  insertDate: string;
  insertUser?: string;
  updateDate: string;
  updateUser?: string;
  status?: string;
  teamId: number;
  teamName: string;
  deptId: number;
  dosageId?: number;
}
