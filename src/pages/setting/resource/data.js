import { AUTHORITY_TYPE_ENUM } from '@/data/common';

/** 搜索字段 */
export const searchFormItems = [
  {
    name: 'menuName',
    label: '权限名称',
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'authorityType',
    label: '权限类型',
    type: 'select',
    options: [...AUTHORITY_TYPE_ENUM],
    attrs: {
      clearable: true,
    },
  },
];