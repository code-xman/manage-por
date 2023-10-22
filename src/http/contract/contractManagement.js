import { post } from '@/http';
import { HTTP_CONFIG } from '@/config/base';

// 合同列表-分页
export const ApiListContractPage = async (params) => {
  const _params = {
    pageNum: 1,
    pageSize: 20,
    ...params,
  };

  const data = await post('/api/contractFacade/listContractPage', _params);

  if (data?.list) {
    data.list = data.list?.map(row => {
      if (!row.signDate || !row.contractEndDate) return row;
      const signDateVal = new Date(row.signDate)?.valueOf() || 0;
      const contractEndDateVal = new Date(row.contractEndDate)?.valueOf() || 0;
      const allTime = contractEndDateVal - signDateVal;
      const restTime = contractEndDateVal - Date.now();
    
      let urgency = 'NORMAL';
      if (restTime < 0) {
        urgency = 'OVERDUE';
      } else if (restTime / allTime < 1 / 5) {
        urgency = 'ONE_FIFTH';
      } else if (restTime / allTime < 1 / 3) {
        urgency = 'THIRD';
      } else if (restTime / allTime < 1 / 2) {
        urgency = 'HALF';
      }
      return {
        ...row,
        urgency,
      }
    })
  }
  

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

// 合同所有文件打包下载 contractId-合同编号
export const ApiDownloadContractNo = (contractNo) => {
  return `${HTTP_CONFIG.baseUrl}/fileDownLoad/contract/${contractNo}`;
};
