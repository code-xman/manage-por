import { h } from 'vue';
import BTag from '@/components/baseCommon/BTag.vue';
import { ApiQueryAllChildMerchantMini } from '@/http/setting/organ';
import { ApiListUser } from '@/http/setting/user.js';
import { getAuthUser } from '@/utils/auth';
import { WHETHER_ENUM } from '@/data/common';

import { formatAmount, parseToDate, parseToDatetime } from '@/utils/string';

const user = getAuthUser();

/** 任务类型 WAIT-待处理,DONE-已完成 */
const taskStatus = [
  {
    label: '待处理',
    value: 'WAIT',
  },
  {
    label: '已完成',
    value: 'DONE',
  },
];

/** 文件类型 */
export const fileTypes = [
  {
    label: '合同',
    value: 'CONTRACT',
  },
  {
    label: '其他',
    value: 'OTHER',
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
    prop: 'actDefName',
    label: '步骤节点名称',
    width: '160px',
    formatter(row) {
      return row.actDefName || '-';
    },
  },
  {
    prop: 'projectName',
    label: '项目名称',
    width: '160px',
    formatter(row) {
      return row.projectName || '-';
    },
  },
  {
    prop: 'actDefDesc',
    label: '步骤节点描述',
    width: '240px',
    formatter(row) {
      return row.actDefDesc || '-';
    },
  },
  {
    prop: 'taskTime',
    label: '任务到达时间',
    minWidth: '160px',
    formatter(row) {
      return parseToDatetime(row.taskTime) || '-';
    },
  },
  {
    prop: 'completionDeadline',
    label: '完成时限',
    minWidth: '140px',
    formatter(row) {
      return parseToDate(row.completionDeadline) || '-';
    },
  },
  {
    prop: 'completeTime',
    label: '完成时间',
    minWidth: '160px',
    formatter(row) {
      return parseToDatetime(row.completeTime) || '-';
    },
  },
  {
    prop: 'completeDesc',
    label: '完成情况',
    width: '240px',
    formatter(row) {
      return row.completeDesc || '-';
    },
  },
  {
    prop: 'requirement',
    label: '是否达到要求',
    width: '120px',
    fixed: 'right',
    formatter(row) {
      // 	1-是,0-否
      if (row.requirement === '1')
        return h(BTag, { type: 'success' }, () => '是');
      if (row.requirement === '0')
        return h(BTag, { type: 'danger' }, () => '否');
      return '-';
    },
  },
];

/** 搜索字段 */
export const searchFormItems = [
  {
    name: 'taskStatus',
    label: '任务类型',
    type: 'select',
    options: taskStatus,
    attrs: {
      // clearable: true,
    },
  },
  {
    name: 'projectName',
    label: '项目名称',
    style: {
      width: '280px',
    },
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'startTime',
    label: '开始时间',
    type: 'dateTime',
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'endTime',
    label: '结束时间',
    type: 'dateTime',
    attrs: {
      clearable: true,
    },
  },
];

/** 表单各项属性 */
export const formItems = [
  {
    name: 'completeTime',
    label: '完成时间',
    type: 'dateTime',
    attrs: {
      type: 'datetime',
      clearable: true,
    },
  },
  {
    name: 'requirement',
    label: '是否达到要求',
    type: 'select',
    options: [...WHETHER_ENUM],
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'completeDesc',
    label: '完成情况',
    className: 'full-width',
    attrs: {
      type: 'textarea',
      maxlength: 200,
      autosize: { minRows: 3, maxRows: 5 },
    },
  },
];
