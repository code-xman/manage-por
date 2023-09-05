import { post } from '@/http';

// 合同列表-分页
export const ApiListContractPage = async (params) => {
  const _params = {
    pageNum: 1,
    pageSize: 20,
    ...params,
  };

  const data = await post('/api/contractFacade/listContractPage', _params);
  return data || { list: [], total: 0 };
};

// 新增-合同
export const ApiCreateContract = async (params) => {
  const data = await post('/api/contractFacade/createContract', params);
  return data;
};

// 编辑-合同
export const ApiEditContract = async (params) => {
  const data = await post('/api/contractFacade/editContract', params);
  return data;
};

// 详情-合同
export const ApiContractDetail = async (params) => {
  const data = await post('/api/contractFacade/contractDetail', params);
  return data;
};
