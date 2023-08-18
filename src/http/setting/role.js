import { post } from '@/http';

// 分页查询岗位角色列表
export const ApiPageRole = async (params) => {
  const _params = {
    pageNum: 1,
    pageSize: 20,
    ...params,
  };
  const data = await post('/api/roleFacade/pageRole', _params);
  return data || { list: [], total: 0 };
};

// 创建岗位角色
export const ApiCreateRole = async (params) => {
  const data = await post('/api/roleFacade/createRole', params);
  return data;
};

// 修改岗位角色
export const ApiUpdateRole = async (params) => {
  const data = await post('/api/roleFacade/updateRole', params);
  return data;
};

// 	启用岗位角色
export const ApiEnableRole = async (params) => {
  const data = await post('/api/roleFacade/enableRole', params);
  return data;
};

// 	禁用岗位角色
export const ApiDisableRole = async (params) => {
  const data = await post('/api/roleFacade/disableRole', params);
  return data;
};

// 获取有效的岗位角色列表
export const ApiFindEnableRoleList = async (params) => {
  const data = await post('/api/roleFacade/findEnableRoleList', params);
  return data || [];
};
