import { h } from 'vue';
import BTag from '@/components/baseCommon/BTag.vue';
import { WHETHER_ENUM } from '@/data/common';
import { ApiQueryAllChildMerchantMini } from '@/http/setting/organ';
import { ApiListUser } from '@/http/setting/user.js';
import { getAuthUser } from '@/utils/auth';

import { formatAmount, parseToDate, parseToDatetime } from '@/utils/string';

const user = getAuthUser();

/** 项目状态	00-待启动,01-正常,02-结束,03-无效 */
export const projectStatusObj = [
  {
    label: '待启动',
    value: '00',
  },
  {
    label: '正常',
    value: '01',
  },
  {
    label: '结束',
    value: '02',
  },
  {
    label: '无效',
    value: '03',
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
    minWidth: '240px',
    formatter(row) {
      return row.projectContent || '-';
    },
  },
  {
    prop: 'projectStatusName',
    label: '项目状态',
    width: '140px',
    fixed: 'right',
    formatter(row) {
      // 	00-待启动,01-正常,02-结束,03-无效
      const inner = () => row.projectStatusName || '-';
      if (row.projectStatus === '01')
        return h(BTag, { type: 'success' }, inner);
      if (['02', '03'].includes(row.projectStatus))
        return h(BTag, { type: 'danger' }, inner);
      return h(BTag, { type: 'info' }, inner);
    },
  },

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
  // {
  //   name: 'signDate',
  //   label: '签订时间',
  //   type: 'dateTime',
  //   style: {
  //     width: '300px',
  //   },
  //   attrs: {
  //     clearable: true,
  //     type: 'daterange',
  //     'range-separator': '至',
  //     'start-placeholder': '开始日期',
  //     'end-placeholder': '结束日期',
  //   },
  // },
];

/** 表单各项属性 */
export const formItems = [
  {
    name: 'projectName',
    label: '项目名称',
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'responsibleDeptIds',
    label: '项目责任部门',
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
  // {
  //   name: 'responsibleAdminId',
  //   label: '项目管理人',
  //   type: 'select',
  //   options: [],
  //   attrs: {
  //     clearable: true,
  //     multiple: true,
  //     'collapse-tags': true,
  //     'collapse-tags-tooltip': true,
  //     'max-collapse-tags': 4,
  //   },
  // },
  {
    name: 'contractAdminIds',
    label: '项目管理人',
    type: 'select',
    options: [],
    useSelfTmp: true,
    attrs: {
      clearable: true,
      multiple: true,
      'collapse-tags': true,
      'collapse-tags-tooltip': true,
      'max-collapse-tags': 4,
    },
  },
  {
    name: 'finish',
    label: '是否完结',
    type: 'select',
    options: [...WHETHER_ENUM],
  },
  // {},
  {
    name: 'projectContent',
    label: '项目内容',
    className: 'full-width',
    attrs: {
      type: 'textarea',
      autosize: { minRows: 3, maxRows: 5 },
    },
  },
];

export const formRowItems = [
  {
    name: 'actDefName',
    label: '步骤节点名称',
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'assignee',
    label: '步骤负责人',
    type: 'select',
    options: () =>
      ApiListUser({
        orgId: user.orgId,
      }),
    attrs: {
      clearable: true,
      'collapse-tags': true,
      'collapse-tags-tooltip': true,
      'max-collapse-tags': 4,
    },
  },
  {
    name: 'fundSource',
    label: '资金来源',
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'fundName',
    label: '资金名称',
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'startDate',
    label: '开始日期',
    type: 'dateTime',
    attrs: {
      clearable: true,
      disabled: false,
      // 'disabled-date': (date) => {
      //   return date && date.valueOf() > Date.now();
      // }
    },
  },
  {
    name: 'workDays',
    label: '工期天数',
    type: 'number',
    attrs: {
      clearable: true,
      min: 1,
      max: 365,
      precision: 0,
      step: 1,
      controls: false,
    },
  },
  {
    name: 'completionDeadline',
    label: '完成时限',
    type: 'dateTime',
    attrs: {
      clearable: true,
      disabled: true,
      // 'disabled-date': (date) => {
      //   return date && date.valueOf() > Date.now();
      // }
    },
  },
  {
    name: 'attachmentName',
    label: '附件名称',
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'actDefDesc',
    label: '步骤节点描述',
    className: 'full-width',
    attrs: {
      type: 'textarea',
      autosize: { minRows: 3, maxRows: 5 },
    },
  },
];
