import { post } from '@/http';

// 部门-树列表
export const ApiDepartmentTree = async (params) => {
  const data = await post('/api/departmentFacade/tree', params);
  return data || [];
};

// 部门-列表
export const ApiDeptList = async (params) => {
  const data = await post('/api/departmentFacade/deptList', params);
  return data || [];
};

// 	部门-启用/禁用
export const ApiChangeStatus = async (params) => {
  const data = await post('/api/departmentFacade/changeStatus', params);
  return data;
};

// 部门-新增下级部门
export const ApiCreateChild = async (params) => {
  const data = await post('/api/departmentFacade/createChild', params);
  return data;
};

// 	部门-新增根部门
export const ApiCreateRoot = async (params) => {
  const data = await post('/api/departmentFacade/createRoot', params);
  return data;
};

// 部门-编辑
export const ApiEdit = async (params) => {
  const data = await post('/api/departmentFacade/edit', params);
  return data;
};

// 	查询部门信息
export const ApiSelectDepartmentOne = async (params) => {
  const data = await post('/api/departmentFacade/selectDepartmentOne', params);
  return data;
};
