import { post } from '@/http';

// 分页查询系统用户-分页
export const ApiPageUser = async (params) => {
  const _params = {
    pageNum: 1,
    pageSize: 20,
    ...params,
  };
  const data = await post('/api/userFacade/pageUser', _params);
  return data || { list: [], total: 0 };
};

// 	新增系统用户
export const ApiCreateUser = async (params) => {
  const data = await post('/api/userFacade/createUser', params);
  return data;
};

// 	修改系统用户
export const ApiUpdateUser = async (params) => {
  const data = await post('/api/userFacade/updateUser', params);
  return data;
};

// 	禁用系统用户
export const ApiDisableUser = async (params) => {
  const data = await post('/api/userFacade/disableUser', params);
  return data;
};

// 	启用系统用户
export const ApiEnableUser = async (params) => {
  const data = await post('/api/userFacade/enableUser', params);
  return data;
};

// 	重置系统用户登录密码
export const ApiResetPwd = async (params) => {
  const data = await post('/api/userFacade/resetPwd', params);
  return data;
};
