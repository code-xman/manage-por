import { h } from 'vue';
import BTag from '@/components/baseCommon/BTag.vue';

import { formatAmount, parseToDate, parseToDatetime } from '@/utils/string';

/** 任务-列表字段 */
export const taskCols = [
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

/** 任务-搜索字段 */
export const searchFormItems = [
  {
    name: 'taskTime',
    label: '任务到达时间',
    type: 'dateTime',
    style: {
      width: '400px',
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
