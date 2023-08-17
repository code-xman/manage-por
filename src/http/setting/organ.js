import { post } from '@/http';

// 机构列表
export const ApiListMerchantPage = async (params) => {
  const _params = {
    pageNum: 1,
    pageSize: 20,
    ...params,
  };
  const data = await post('/api/merchantFacade/listMerchantPage', _params);
  return data || { list: [], total: 0 };
};

// 查询所有下级渠道商
export const ApiQueryAllChildMerchant = async (params) => {
  const data = await post('/api/merchantFacade/queryAllChildMerchant', params);
  return data || [];
};

// 查询所有下级渠道商 LabelValue
export const ApiQueryAllChildMerchantMini = async (params) => {
  const data = await post('/api/merchantFacade/queryAllChildMerchant', params);
  if (Array.isArray(data)) {
    return data.map((item) => ({
      label: item.label,
      value: item.value,
    }));
  }
  return [];
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
