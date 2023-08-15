import { h } from 'vue';
import BTag from '@/components/baseCommon/BTag.vue';

/** 列表字段 */
export const columns = [
  {
    type: 'index',
    label: '#',
    fixed: 'left',
  },
  {
    prop: 'tenant',
    label: '租户名称',
    minWidth: '200px',
    formatter(row) {
      return row.tenant || '-';
    },
  },
  {
    prop: 'creditCode',
    label: '统一社会信用代码',
    width: '180px',
    formatter(row) {
      return row.creditCode || '-';
    },
  },
  {
    prop: 'orgName',
    label: '系统名称',
    minWidth: '200px',
    formatter(row) {
      return row.orgName || '-';
    },
  },
  {
    prop: 'address',
    label: '系统编码',
    width: '120px',
    formatter(row) {
      return row.address || '-';
    },
  },
  {
    prop: 'status',
    label: '状态',
    width: '140px',
    formatter: (row) => {
      const inner = () => row.statusLabel || '-';
      if (row.status === '03')
        return h(BTag, { type: 'success' }, inner);
      if (row.status === '04') return h(BTag, { type: 'danger' }, inner);
      if (row.status === '01') return h(BTag, { type: 'danger' }, inner);
      return h(BTag, { type: 'info' }, inner);
    },
  },
];

/** 搜索字段 */
export const searchFormItems = [
  {
    name: 'orgName',
    label: '租户名称',
    style: {
      width: '300px',
    },
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'name',
    label: '系统名称',
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'name1',
    label: '租户状态',
    type: 'select',
    options: [],
    attrs: {
      clearable: true,
    },
  },
];

/** 表单各项属性 */
export const formItems = [
  {
    name: 'address',
    label: '租户名称',
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'phone',
    label: '统一社会信用代码',
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'name',
    label: '系统名称',
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'phone',
    label: '系统编码',
    attrs: {
      clearable: true,
    },
  },
];
