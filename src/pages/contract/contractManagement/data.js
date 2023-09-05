import { h } from 'vue';
import BTag from '@/components/baseCommon/BTag.vue';
import { ApiQueryAllChildMerchantMini } from '@/http/setting/organ';
import { ApiDeptList } from '@/http/setting/department.js';
import { getAuthUser } from '@/utils/auth';
import { formatAmount, parseToDatetime } from '@/utils/string';

const user = getAuthUser();

/** 合同签订履行记录名称类型 */
export const signNames = [
  {
    label: '合同原件',
    value: '1',
  },
  {
    label: '添加支付进度款',
    value: '2',
  },
  {
    label: '添加补充条款',
    value: '3',
  },
  {
    label: '收到保证金',
    value: '4',
  },
  {
    label: '打出去保证金',
    value: '5',
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
    prop: 'contractName',
    label: '合同名称',
    width: '180px',
    formatter(row) {
      const inner = () => row.contractName || '-';
      if (row.Urgency === 'NORMAL') return h(BTag, { type: 'success' }, inner);
      if (row.Urgency === 'HALF') return h(BTag, { type: 'success' }, inner);
      if (row.Urgency === 'THIRD') return h(BTag, { type: 'warning' }, inner);
      if (row.Urgency === 'ONE_FIFTH') return h(BTag, { type: 'danger' }, inner);
      return h(BTag, { type: 'info' }, inner);
    },
  },
  {
    prop: 'contractAmt',
    label: '合同金额',
    width: '180px',
    formatter(row) {
      return formatAmount(row.contractAmt) || '-';
    },
  },
  {
    prop: 'partyB',
    label: '合同对标公司',
    minWidth: '220px',
    formatter(row) {
      return row.partyB || '-';
    },
  },
  {
    prop: 'signDate',
    label: '合同签订时间',
    minWidth: '160px',
    formatter(row) {
      return parseToDatetime(row.signDate) || '-';
    },
  },
  {
    prop: 'contractEndDate',
    label: '合同到期期限',
    minWidth: '160px',
    formatter(row) {
      return parseToDatetime(row.contractEndDate) || '-';
    },
  },
  {
    prop: 'remark',
    label: '基本描述',
    minWidth: '220px',
    formatter(row) {
      return row.remark || '-';
    },
  },
];

/** 搜索字段 */
export const searchFormItems = [
  {
    name: 'merchantId',
    label: '所属机构',
    type: 'select',
    options: () => ApiQueryAllChildMerchantMini({ merchantId: user.orgId }),
    style: {
      width: '300px',
    },
    attrs: {
      clearable: true,
    },
  },
  // {
  //   name: 'contractName',
  //   label: '合同名称',
  //   style: {
  //     width: '250px',
  //   },
  //   attrs: {
  //     clearable: true,
  //   },
  // },
  // {
  //   name: 'partyB',
  //   label: '合同对标公司',
  //   style: {
  //     width: '250px',
  //   },
  //   attrs: {
  //     clearable: true,
  //   },
  // },
];

/** 表单各项属性 */
export const formItems = [
  {
    name: 'contractName',
    label: '合同名称',
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'deptIds',
    label: '合同所属部门',
    type: 'select',
    options: () =>
      ApiDeptList({
        orgId: user.orgId,
      }),
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'signDate',
    label: '签订时间',
    type: 'dateTime',
    attrs: {
      clearable: true,
    },
  },

  {
    name: 'partyB',
    label: '对方单位',
    attrs: {
      clearable: true,
    },
  },

  {
    name: 'contractTerms',
    label: '合同主要条款',
    className: 'full-width',
    attrs: {
      type: 'textarea',
      autosize: { minRows: 3, maxRows: 5 },
    },
  },

  {
    name: 'contractAmt',
    label: '合同金额',
    type: 'number',
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'contractEndDate',
    label: '合同期限',
    type: 'dateTime',
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'responsibleDeptId',
    label: '合同责任部门',
    type: 'select',
    options: () =>
      ApiDeptList({
        orgId: user.orgId,
      }),
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'personIds',
    label: '责任人',
    type: 'select',
    options: [],
    attrs: {
      clearable: true,
      multiple: true,
      'collapse-tags': true,
      'collapse-tags-tooltip': true,
      'max-collapse-tags': 4,
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
