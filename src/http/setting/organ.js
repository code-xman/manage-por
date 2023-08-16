import { post } from '@/http';

// 机构列表
export const ApiListMerchantPage = async (params) => {
  const _params = {
    pageNum: 1,
    pageSize: 20,
    ...params,
  }
  const data = await post('/api/merchantFacade/listMerchantPage', _params);
  return data || { list: [], total: 0 };;
};

// 新增机构
export const ApiCreateMerchant = async (params) => {
  const data = await post('/api/merchantFacade/createMerchant', params);
  return data && data.merchantId ? data.merchantId : null;
};

// 编辑机构
export const ApiEditMerchant = async (params) => {
  const data = await post('/api/merchantFacade/editMerchant', params);
  return data && data.merchantId ? data.merchantId : null;
};
