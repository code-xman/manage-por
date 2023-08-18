import { post } from '@/http';

// 查询菜单树
export const ApiFindMenuTree = async (params) => {
  const data = await post('/api/menuFacade/findMenuTree', params);
  return [data] || [];
};

// 获取可配置岗位权限配置的菜单树
export const ApiFindConfigMenuTree = async (params) => {
  const data = await post('/api/roleFacade/findConfigMenuTree', params);
  return data || [];
};

// 查询菜单列表
export const ApiListMenu = async (params) => {
  const data = await post('/api/menuFacade/listMenu', params);
  return data || [];
};

// 	创建菜单
export const ApiCreateMenu = async (params) => {
  const data = await post('/api/menuFacade/createMenu', params);
  return data;
};

// 	修改菜单
export const ApiUpdateMenu = async (params) => {
  const data = await post('/api/menuFacade/updateMenu', params);
  return data;
};

// 	删除菜单
export const ApiDeleteMenu = async (params) => {
  const data = await post('/api/menuFacade/deleteMenu', params);
  return data;
};

// 禁用菜单
export const ApiDisableMenu = async (params) => {
  const data = await post('/api/menuFacade/disableMenu', params);
  return data;
};

// 启用菜单
export const ApiEnableMenu = async (params) => {
  const data = await post('/api/menuFacade/enableMenu', params);
  return data;
};

// 查询当前可分配菜单树
export const ApiFindCanConfigMenuTree = async (params) => {
  const data = await post('/api/menuFacade/findCanConfigMenuTree', params);
  return data;
};
