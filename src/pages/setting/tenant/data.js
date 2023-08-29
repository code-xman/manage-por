import { h } from 'vue';
import BTag from '@/components/baseCommon/BTag.vue';

export const statusEnums = [
  {
    label: '正常',
    value: '01',
  },
  {
    label: '禁用',
    value: '02',
  },
];

/** 列表字段 */
export const columns = [
  {
    type: 'index',
    label: '#',
    fixed: 'left',
  },
  {
    prop: 'companyName',
    label: '租户名称',
    minWidth: '200px',
    formatter(row) {
      return row.companyName || '-';
    },
  },
  {
    prop: 'companyShortName',
    label: '租户简称',
    minWidth: '120px',
    formatter(row) {
      return row.companyShortName || '-';
    },
  },
  {
    prop: 'creditCode',
    label: '社会统一信用代码',
    width: '180px',
    formatter(row) {
      return row.creditCode || '-';
    },
  },
  {
    prop: 'sysName',
    label: '系统名称',
    minWidth: '200px',
    formatter(row) {
      return row.sysName || '-';
    },
  },
  {
    prop: 'systemNo',
    label: '系统编码',
    width: '120px',
    formatter(row) {
      return row.systemNo || '-';
    },
  },
  // {
  //   prop: 'status',
  //   label: '状态',
  //   width: '140px',
  //   formatter: (row) => {
  //     const inner = () => row.status.label || '-';
  //     if (row.status.value === '01')
  //       return h(BTag, { type: 'success' }, inner);
  //     if (row.status.value === '02') return h(BTag, { type: 'danger' }, inner);
  //     return h(BTag, { type: 'info' }, inner);
  //   },
  // },
];

/** 搜索字段 */
export const searchFormItems = [
  {
    name: 'companyName',
    label: '租户名称',
    style: {
      width: '300px',
    },
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'sysName',
    label: '系统名称',
    attrs: {
      clearable: true,
    },
  },
  // {
  //   name: 'status',
  //   label: '租户状态',
  //   type: 'select',
  //   options: statusEnums,
  //   attrs: {
  //     clearable: true,
  //   },
  // },
];

/** 表单各项属性 */
export const formItems = [
  {
    name: 'companyName',
    label: '租户名称',
    type: 'text',
  },
  {
    name: 'creditCode',
    label: '社会统一信用代码',
    type: 'text',
  },
  {
    name: 'sysName',
    label: '系统名称',
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'systemNo',
    label: '系统编码',
    type: 'text',
  },
  {
    name: 'bgColor',
    label: '主题颜色',
    type: 'radio',
    options: [
      {
        label: 'red',
        value: '#c45656',
        slot: `<span 
                style="
                  height: 20px; 
                  width: 20px; 
                  background: #c45656; 
                "
              ></span>`,
      },
      {
        label: 'purple',
        value: '#526aec',
        slot: `<span 
                style="
                  height: 20px; 
                  width: 20px; 
                  background: #526aec; 
                "
              ></span>`,
      },
      {
        label: 'darkBlue',
        value: '#1964e7',
        slot: `<span 
                style="
                  height: 20px; 
                  width: 20px; 
                  background: #1964e7; 
                "
              ></span>`,
      },
      {
        label: 'blue',
        value: '#409EFF',
        slot: `<span 
                style="
                  height: 20px; 
                  width: 20px; 
                  background: #409EFF; 
                "
              ></span>`,
      },
      {
        label: 'orange',
        value: '#E6A23C',
        slot: `<span 
                style="
                  height: 20px; 
                  width: 20px; 
                  background: #E6A23C; 
                "
              ></span>`,
      },
      {
        label: 'green',
        value: '#529b2e',
        slot: `<span 
                style="
                  height: 20px; 
                  width: 20px; 
                  background: #529b2e; 
                "
              ></span>`,
      },
    ],
  },
];
