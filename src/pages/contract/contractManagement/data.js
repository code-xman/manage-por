import { h } from 'vue';
import BCell from '@/components/baseCommon/BCell.vue';
import { ApiQueryAllChildMerchantMini } from '@/http/setting/organ';
import { ApiDeptList } from '@/http/setting/department.js';
import { ApiListProject } from '@/http/process/processManagement.js';
import { getAuthUser } from '@/utils/auth';

import { formatAmount, parseToDate, parseToDatetime } from '@/utils/string';

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

/** 合同签订及履约记录 表格字段映射 */
export const contractRecordsObj = {
  contractRecordName: "合同签订履行记录名称",
  content: "内容",
  recordDate: "时间",
  annexesData: "附件",
}
/** 合同支付记录 表格字段映射 */
export const contractPaymentRecordsObj = {
  recordDate: '时间',
  amount: '支付金额',
  remark: '备注',
}

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
    className:'cell-full',
    formatter(row) {
      const inner = () => row.contractName || '-';
      if (row.urgency === 'NORMAL') return h(BCell, { type: 'success' }, inner);
      if (row.urgency === 'HALF') return h(BCell, { type: 'yellow' }, inner);
      if (row.urgency === 'THIRD') return h(BCell, { type: 'warning' }, inner);
      if (row.urgency === 'ONE_FIFTH') return h(BCell, { type: 'danger' }, inner);
      if (row.urgency === 'OVERDUE') return h(BCell, { type: 'purple' }, inner);
      return h(BCell, { type: 'info' }, inner);
    },
  },
  {
    prop: 'merchantName',
    label: '所属机构',
    minWidth: '180px',
    formatter(row) {
      return row.merchantName || '-';
    },
  },
  {
    prop: 'projectName',
    label: '项目名称',
    minWidth: '200px',
    formatter(row) {
      return row.projectName || '-';
    },
  },
  {
    prop: 'contractAmt',
    label: '合同金额（元）',
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
      return parseToDate(row.signDate) || '-';
    },
  },
  {
    prop: 'contractEndDate',
    label: '合同到期期限',
    minWidth: '160px',
    formatter(row) {
      return parseToDate(row.contractEndDate) || '-';
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
  {
    name: 'projectId',
    label: '项目名称',
    type: 'select',
    options: () => ApiListProject(),
    style: {
      width: '320px',
    },
    attrs: {
      clearable: true,
      filterable: true,
    },
  },
  {
    name: 'deptName',
    label: '部门',
    style: {
      width: '220px',
    },
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'contractName',
    label: '合同名称',
    style: {
      width: '250px',
    },
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'signDate',
    label: '签订时间',
    type: 'dateTime',
    style: {
      width: '300px',
    },
    attrs: {
      clearable: true,
      type: 'daterange',
      'range-separator': "至",
      'start-placeholder': "开始日期",
      'end-placeholder': "结束日期",
    },
  },
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
    options: [],
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'partyB',
    label: '对方单位',
    className: 'full-width',
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
      'disabled-date': (date) => {
        return date && date.valueOf() > Date.now();
      }
    },
  },
  {
    name: 'projectId',
    label: '项目名称',
    type: 'select',
    options: [],
    attrs: {
      clearable: true,
      filterable: true,
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
    label: '合同金额（元）',
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
      // 'disabled-date': (date) => {
      //   return date && date.valueOf() < Date.now();
      // }
    },
  },
  {
    name: 'responsibleDeptId',
    label: '合同责任部门',
    type: 'select',
    options: [],
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
