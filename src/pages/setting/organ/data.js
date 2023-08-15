/** 列表字段 */
export const columns = [
  {
    type: 'index',
    label: '#',
    fixed: 'left',
  },
  {
    prop: 'orgId',
    label: '机构ID',
    width: '140px',
    formatter(row) {
      return row.orgId || '-';
    },
  },
  {
    prop: 'orgName',
    label: '机构名称',
    width: '220px',
    formatter(row) {
      return row.orgName || '-';
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
    prop: 'address',
    label: '机构地址',
    minWidth: '220px',
    formatter(row) {
      return row.address || '-';
    },
  },
  {
    prop: 'name',
    label: '联系人',
    width: '140px',
    formatter(row) {
      return row.name || '-';
    },
  },
  {
    prop: 'phone',
    label: '联系电话',
    width: '140px',
    formatter(row) {
      return row.phone || '-';
    },
  },
  {
    prop: 'remark',
    label: '备注',
    minWidth: '220px',
    formatter(row) {
      return row.remark || '-';
    },
  },
];

/** 搜索字段 */
export const searchFormItems = [
  {
    name: 'orgName',
    label: '机构名称',
    style: {
      width: '300px',
    },
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'name',
    label: '联系人',
    attrs: {
      clearable: true,
    },
  },
];

/** 表单各项属性 */
export const formItems = [
  {
    name: 'orgName',
    label: '机构名称',
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'address',
    label: '机构地址',
    attrs: {
      clearable: true,
    },
  },
  
  {
    name: 'name',
    label: '联系人',
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'phone',
    label: '联系电话',
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'remark',
    label: '备注',
    className: 'full-width',
    attrs: {
      type: 'textarea',
      autosize: { minRows: 3, maxRows: 5 },
    },
  },
];
