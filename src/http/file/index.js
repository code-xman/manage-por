import { post } from '@/http';

// 分页-文件管理
export const ApiSysFilePage = async (params = {}) => {
  const _params = {
    pageNum: 1,
    pageSize: 20,
    ...params,
  };

  const data = await post('/api/merchantFacade/sysFilePage', _params);

  return data || { list: [], total: 0 };
};

// 	新增-文件管理
export const ApiSysFileAdd = async (params = {}) => {
  const data = await post('/api/merchantFacade/sysFileAdd', params);
  return data;
};

// 	删除-文件管理
export const ApiSysFileDel = async (params = {}) => {
  const data = await post('/api/merchantFacade/sysFileDel', params);
  return data;
};