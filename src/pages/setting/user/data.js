/** 列表字段 */
export const columns = [
  {
    type: 'index',
    label: '#',
    fixed: 'left',
  },
  {
    prop: 'userId',
    label: '用户ID',
    width: '140px',
    formatter(row) {
      return row.userId || '-';
    },
  },
  {
    prop: 'userName',
    label: '用户姓名',
    width: '120px',
    formatter(row) {
      return row.userName || '-';
    },
  },
  {
    prop: 'orgName',
    label: '所属机构',
    minWidth: '220px',
    formatter(row) {
      return row.orgName || '-';
    },
  },
  {
    prop: 'departmentName',
    label: '所属部门',
    width: '160px',
    formatter(row) {
      return row.departmentName || '-';
    },
  },
  {
    prop: 'mobile',
    label: '联系电话',
    width: '140px',
    formatter(row) {
      return row.mobile || '-';
    },
  },
  {
    prop: 'enableRoles',
    label: '岗位角色',
    width: '140px',
    formatter(row) {
      return row.enableRoles || '-';
    },
  },
  {
    prop: 'status',
    label: '状态',
    width: '140px',
    fixed: 'right',
    formatter(row) {
      return row.status || '-';
    },
  },
];

/** 搜索字段 */
export const searchFormItems = [
  {
    name: 'orgName',
    label: '所属机构',
    style: {
      width: '300px',
    },
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'userName',
    label: '用户姓名',
    attrs: {
      clearable: true,
    },
  },
];

/** 表单各项属性 */
export const formItems = [
  {
    name: 'userName',
    label: '用户姓名',
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'orgName',
    label: '所属机构',
    attrs: {
      clearable: true,
    },
  },
  
  {
    name: 'departmentName',
    label: '所属部门',
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'mobile',
    label: '联系电话',
    attrs: {
      clearable: true,
      maxlength: 11,
    },
  },
  {
    name: 'enableRoles',
    label: '岗位角色',
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
