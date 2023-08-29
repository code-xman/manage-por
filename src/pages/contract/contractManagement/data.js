import { h } from 'vue';
import BTag from '@/components/baseCommon/BTag.vue';
import { ApiQueryAllChildMerchantMini } from '@/http/setting/organ';
import { ApiDeptList } from '@/http/setting/department.js';
import { getAuthUser } from '@/utils/auth';
import { formatAmount, parseToDatetime } from '@/utils/string';

const user = getAuthUser();

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
      if (row.contractName === '01') return h(BTag, { type: 'success' }, inner);
      if (row.contractName === '02') return h(BTag, { type: 'danger' }, inner);
      return h(BTag, { type: 'info' }, inner);
    },
  },
  {
    prop: 'contracAmount',
    label: '合同金额',
    width: '180px',
    formatter(row) {
      return formatAmount(row.contracAmount) || '-';
    },
  },
  {
    prop: 'benchmarkingCompany',
    label: '合同对标公司',
    minWidth: '220px',
    formatter(row) {
      return row.benchmarkingCompany || '-';
    },
  },
  {
    prop: 'signingTime',
    label: '合同签订时间',
    minWidth: '160px',
    formatter(row) {
      return parseToDatetime(row.signingTime) || '-';
    },
  },
  {
    prop: 'endTime',
    label: '合同到期期限',
    minWidth: '160px',
    formatter(row) {
      return parseToDatetime(row.endTime) || '-';
    },
  },
  {
    prop: 'describe',
    label: '基本描述',
    minWidth: '220px',
    formatter(row) {
      return row.describe || '-';
    },
  },
];

/** 搜索字段 */
export const searchFormItems = [
  {
    name: 'orgId',
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
    name: 'benchmarkingCompany',
    label: '合同对标公司',
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
    name: 'contractName',
    label: '合同名称',
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'department',
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
    name: 'signingTime',
    label: '签订时间',
    type: 'dateTime',
    attrs: {
      clearable: true,
    },
  },

  {
    name: 'oppositeUnit',
    label: '对方单位',
    attrs: {
      clearable: true,
    },
  },

  {
    name: 'mainTerms',
    label: '合同主要条款',
    attrs: {
      clearable: true,
    },
  },

  {
    name: 'contractAmount',
    label: '合同金额',
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'contractPeriod',
    label: '合同期限',
    type: 'dateTime',
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'responsibleDepartment',
    label: '合同责任部门',
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'personResponsible',
    label: '责任人',
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
