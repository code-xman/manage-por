import { post } from '@/http';
import { projectStatusObj } from '@/pages/process/processManagement/data.js';

// 	项目-分页
export const ApiListProjectPage = async (params={}) => {
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
export const ApiCreateProject = async (params={}) => {
  const data = await post('/api/projectFacade/createProject', params);
  return data;
};

// 项目-编辑
export const ApiEditProject = async (params={}) => {
  const data = await post('/api/projectFacade/editProject', params);
  return data;
};

// 项目-详情
export const ApiDetailProject = async (params={}) => {
  const data = await post('/api/projectFacade/projectDetail', params);
  return data;
};

// 项目步骤节点配置(单条)-新增
export const ApiAddProjectActConfig = async (params={}) => {
  const data = await post('/api/projectFacade/addProjectActConfig', params);
  return data;
};

// 项目步骤节点配置(单条)-编辑
export const ApiEditProjectActConfig = async (params={}) => {
  const data = await post('/api/projectFacade/editProjectActConfig', params);
  return data;
};

// 项目步骤节点配置(单条)-删除
export const ApiDeleteProjectActConfig = async (params={}) => {
  const data = await post('/api/projectFacade/deleteProjectActConfig', params);
  return data;
};

// 	项目任务-分页
export const ApiListTodo = async (params={}) => {
  const _params = {
    pageNum: 1,
    pageSize: 20,
    ...params,
  };

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
export const ApiComplete = async (params={}) => {
  const data = await post('/ap/api/projectFacade/complete', params);
  return data;
};

// 	查询文件列表-列表
export const ApiListActFile = async (params={}) => {
  const data = await post('/api/projectFacade/listActFile', params);
  return data;
};
