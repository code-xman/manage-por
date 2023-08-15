/** 列表字段 */
export const columns = [
  {
    type: 'index',
    label: '#',
    fixed: 'left',
  },
  {
    prop: 'roleId',
    label: '岗位角色ID',
    width: '160px',
    formatter(row) {
      return row.roleId || '-';
    },
  },
  {
    prop: 'roleName',
    label: '岗位角色名称',
    width: '160px',
    formatter(row) {
      return row.roleName || '-';
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
    prop: 'status',
    label: '岗位角色状态',
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
    name: 'roleName',
    label: '岗位角色名称',
    style: {
      width: '250px',
    },
    attrs: {
      clearable: true,
    },
  },
];

/** 表单各项属性 */
export const formItems = [
  {
    name: 'roleName',
    label: '岗位角色名称',
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
    name: 'remark',
    label: '备注',
    className: 'full-width',
    attrs: {
      type: 'textarea',
      autosize: { minRows: 3, maxRows: 5 },
    },
  },
];
