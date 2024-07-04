import { post } from '@/http';
import { HTTP_CONFIG } from '@/config/base';
import { projectStatusObj } from '@/pages/process/processManagement/data.js';
import { parseToDate, parseToDatetime } from '@/utils/string';

// 	项目-分页
export const ApiListProjectPage = async (params = {}) => {
  const _params = {
    pageNum: 1,
    pageSize: 20,
    ...params,
  };

  const data = await post('/api/projectFacade/listProjectPage', _params);

  if (data?.list) {
    data.list = data.list?.map((row) => {
      return {
        ...row,
        projectStatusName:
          projectStatusObj.find((se) => se.value === row.projectStatus)
            ?.label || '-',
      };
    });
  }

  return data || { list: [], total: 0 };
};

// 项目-新增
export const ApiCreateProject = async (params = {}) => {
  const data = await post('/api/projectFacade/createProject', params);
  return data;
};

// 项目-编辑
export const ApiEditProject = async (params = {}) => {
  const data = await post('/api/projectFacade/editProject', params);
  return data;
};

// 项目-详情
export const ApiDetailProject = async (params = {}) => {
  const data = await post('/api/projectFacade/projectDetail', params);
  return data;
};

// 工作日计算
export const ApiWorkDay = async (params = {}) => {
  const data = await post('/api/projectFacade/workDay', params);
  return data;
};

// 项目步骤节点配置(单条)-新增
export const ApiAddProjectActConfig = async (params = {}) => {
  const data = await post('/api/projectFacade/addProjectActConfig', params);
  return data;
};

// 项目步骤节点配置(单条)-编辑
export const ApiEditProjectActConfig = async (params = {}) => {
  const data = await post('/api/projectFacade/editProjectActConfig', params);
  return data;
};

// 项目步骤节点配置(单条)-删除
export const ApiDeleteProjectActConfig = async (params = {}) => {
  const data = await post('/api/projectFacade/deleteProjectActConfig', params);
  return data;
};

// 项目步骤节点配置-顺序保存
export const ApiActConfigOrder = async (params = {}) => {
  const data = await post('/api/projectFacade/actConfigOrder', params);
  return data;
};

// 	项目任务分组-分页
export const ApiListGroup = async (params = {}) => {
  const _params = {
    pageNum: 1,
    pageSize: 20,
    ...params,
  };

  // if (!_params.taskStatus) {
  //   _params.taskStatus = undefined;
  // }
  // if (_params.endTime) {
  //   _params.endTime = new Date(
  //     new Date(_params.endTime).getTime() + 24 * 60 * 60 * 1000 - 1
  //   );
  // }

  const data = await post('/api/projectFacade/listGroup', _params);

  if (data?.list) {
    data.list = data.list?.map((row) => {
      return {
        ...row,
      };
    });
  }

  return data || { list: [], total: 0 };
};

// 	项目任务-分页
export const ApiListTodo = async (params = {}) => {
  const _params = {
    pageNum: 1,
    pageSize: 20,
    ...params,
  };

  if (!_params.taskStatus) {
    _params.taskStatus = undefined;
  }

  if (_params.taskTime?.length) {
    _params.startTime = parseToDatetime(_params.taskTime[0]);
    _params.endTime = parseToDate(_params.taskTime[1]) + ' 23:59:59';
  }

  const data = await post('/api/projectFacade/listTodo', _params);

  if (data?.list) {
    data.list = data.list?.map((row) => {
      return {
        ...row,
      };
    });
  }

  return data || { list: [], total: 0 };
};

// 项目任务-处理提交
export const ApiComplete = async (params = {}) => {
  const data = await post('/api/projectFacade/complete', params);
  return data;
};

// 	项目任务-退回申请
export const ApiGoBack = async (params = {}) => {
  const data = await post('/api/projectFacade/goBack', params);
  return data;
};

// 	项目任务-退回申请通过
export const ApiGoBackPass = async (params = {}) => {
  const data = await post('/api/projectFacade/goBackPass', params);
  return data;
};

// 	项目任务-退回申请拒绝
export const ApiGoBackReject = async (params = {}) => {
  const data = await post('/api/projectFacade/goBackReject', params);
  return data;
};

// 	查询文件列表-列表
export const ApiListActFile = async (params = {}) => {
  const data = await post('/api/projectFacade/listActFile', params);
  return data;
};

// 	项目-下拉
export const ApiListProject = async (params = {}) => {
  const data = await post('/api/projectFacade/listProject', params);
  if (!data) return [];
  const res = data.map((row) => {
    return {
      label: row.projectName,
      value: row.projectId,
    };
  });
  return res;
};

// 项目节点文件打包下载 actDefId-项目节点id
export const ApiDownloadActDefId = (actDefId) => {
  return `${HTTP_CONFIG.baseUrl}/fileDownLoad/project/actDefId/${actDefId}`;
};

// 项目所有文件打包下载 projectId-项目id
export const ApiDownloadProjectId = (projectId) => {
  return `${HTTP_CONFIG.baseUrl}/fileDownLoad/project/${projectId}`;
};
