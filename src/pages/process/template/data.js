import { h } from 'vue';
import BTag from '@/components/baseCommon/BTag.vue';
import { ApiQueryAllChildMerchantMini } from '@/http/setting/organ';
import { getAuthUser } from '@/utils/auth';

const user = getAuthUser();

/** 列表字段 */
export const columns = [
  {
    type: 'index',
    label: '#',
    fixed: 'left',
  },
  {
    prop: 'projectName',
    label: '项目名称',
    width: '180px',
    // className: 'cell-full',
    formatter(row) {
      return row.projectName || '-';
    },
  },
  {
    prop: 'contractAdminName',
    label: '合同管理人',
    width: '140px',
    formatter(row) {
      return row.contractAdminName || '-';
    },
  },
  {
    prop: 'responsibleDeptName',
    label: '责任部门',
    width: '140px',
    formatter(row) {
      return row.responsibleDeptName || '-';
    },
  },
  {
    prop: 'projectContent',
    label: '项目内容',
    minWidth: '220px',
    formatter(row) {
      return row.projectContent || '-';
    },
  },
  // {
  //   prop: 'projectStatusName',
  //   label: '项目状态',
  //   width: '140px',
  //   fixed: 'right',
  //   formatter(row) {
  //     // 	00-待启动,01-正常,02-结束,03-无效
  //     const inner = () => row.projectStatusName || '-';
  //     if (row.projectStatus === '01')
  //       return h(BTag, { type: 'success' }, inner);
  //     if (['02', '03'].includes(row.projectStatus))
  //       return h(BTag, { type: 'danger' }, inner);
  //     return h(BTag, { type: 'info' }, inner);
  //   },
  // },

  // {
  //   prop: 'orgId',
  //   label: '所属机构',
  //   minWidth: '220px',
  //   formatter(row) {
  //     return row.orgIdLV.label || '-';
  //   },
  // },
  // {
  //   prop: 'contractEndDate',
  //   label: '流程到期期限',
  //   minWidth: '160px',
  //   formatter(row) {
  //     return parseToDate(row.contractEndDate) || '-';
  //   },
  // },
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
    name: 'projectName',
    label: '项目名称',
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
      'range-separator': '至',
      'start-placeholder': '开始日期',
      'end-placeholder': '结束日期',
    },
  },
];