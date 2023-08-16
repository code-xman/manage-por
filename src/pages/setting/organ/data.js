/** 列表字段 */
export const columns = [
  {
    type: 'index',
    label: '#',
    fixed: 'left',
  },
  {
    prop: 'merchantId',
    label: '机构ID',
    width: '180px',
    formatter(row) {
      return row.merchantId || '-';
    },
  },
  {
    prop: 'merchantName',
    label: '机构名称',
    minWidth: '220px',
    formatter(row) {
      return row.merchantName || '-';
    },
  },
  {
    prop: 'merchantShortName',
    label: '机构简称',
    width: '120px',
    formatter(row) {
      return row.merchantName || '-';
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
  // {
  //   prop: 'contactsAddr',
  //   label: '机构地址',
  //   minWidth: '220px',
  //   formatter(row) {
  //     return row.contactsAddr || '-';
  //   },
  // },
  {
    prop: 'operationUserName',
    label: '联系人姓名',
    width: '140px',
    formatter(row) {
      return row.operationUserName || '-';
    },
  },
  {
    prop: 'operationUserMobile',
    label: '联系人手机号码',
    width: '140px',
    formatter(row) {
      return row.operationUserMobile || '-';
    },
  },
  // {
  //   prop: 'merchantStatus',
  //   label: '状态',
  //   width: '140px',
  //   formatter: (row) => {
  //     const inner = () => row.merchantStatus || '-';
  //     if (row.merchantStatus === '03')
  //       return h(BTag, { type: 'success' }, inner);
  //     if (row.merchantStatus === '04') return h(BTag, { type: 'danger' }, inner);
  //     if (row.merchantStatus === '01') return h(BTag, { type: 'danger' }, inner);
  //     return h(BTag, { type: 'info' }, inner);
  //   },
  // },
];

/** 搜索字段 */
export const searchFormItems = [
  {
    name: 'merchantName',
    label: '机构名称',
    style: {
      width: '300px',
    },
    attrs: {
      clearable: true,
    },
  },
  // {
  //   name: 'operationUserName',
  //   label: '联系人',
  //   attrs: {
  //     clearable: true,
  //   },
  // },
];

/** 表单各项属性 */
export const formItems = [
  {
    name: 'merchantName',
    label: '机构名称',
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'merchantShortName',
    label: '机构简称',
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'creditCode',
    label: '社会统一信用代码',
    attrs: {
      clearable: true,
      maxlength: 50,
    },
  },
  // {
  //   name: 'contactsAddr',
  //   label: '机构地址',
  //   attrs: {
  //     clearable: true,
  //   },
  // },
  
  {
    name: 'operationUserName',
    label: '联系人',
    attrs: {
      clearable: true,
      maxlength: 50,
    },
  },
  {
    name: 'operationUserMobile',
    label: '联系电话',
    attrs: {
      clearable: true,
      maxlength: 11,
    },
  },
  // {
  //   name: 'remark',
  //   label: '备注',
  //   className: 'full-width',
  //   attrs: {
  //     type: 'textarea',
  //     autosize: { minRows: 3, maxRows: 5 },
  //   },
  // },
];
