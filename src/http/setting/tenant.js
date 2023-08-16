import { post } from '@/http';
// import { statusEnums } from '@/pages/setting/tenant/data';

// 租户列表
export const ApiListTenantPage = async (params) => {
  const _params = {
    pageNum: 1,
    pageSize: 20,
    ...params,
  };
  const data = await post('/api/merchantFacade/listTenantPage', _params);
  // const list = data?.list?.map((item) => {
  //   const statusLabel = statusEnums?.find(
  //     (se) => se.value === item.status
  //   )?.label;
  //   return {
  //     ...item,
  //     statusLabel,
  //   };
  // });
  return data || { list: [], total: 0 };
};

// 新增机构
export const ApiOpenTenant = async (params) => {
  const data = await post('/api/merchantFacade/openTenant', params);
  return data && data.merchantId ? data.merchantId : null;
};

// 编辑机构
export const ApiEditTenant = async (params) => {
  const data = await post('/api/merchantFacade/editTenant', params);
  return data && data.merchantId ? data.merchantId : null;
};

// 机构详情
export const ApiTenantInfo = async (params) => {
  const data = await post('/api/merchantFacade/tenantInfo', params);
  return data;
};
