import { h } from 'vue';
import BTag from '@/components/baseCommon/BTag.vue';

/** 列表字段 */
export const columns = [
  {
    type: 'index',
    label: '#',
    fixed: 'left',
  },
  {
    prop: 'fileName',
    label: '附件名称',
    minWidth: '200px',
    formatter(row) {
      return row.fileName || '-';
    },
  },
  {
    prop: 'fileType',
    label: '文件类型',
    minWidth: '140px',
    formatter(row) {
      if (row.fileType === '1')
        return h(BTag, { type: 'success' }, () => '政策文件');
      if (row.fileType === '2')
        return h(BTag, { type: 'warning' }, () => '表格文件');
      return '-';
    },
  },
];

/** 搜索字段 */
export const searchFormItems = [
  {
    name: 'merchantId',
    label: '文件名称',
    style: {
      width: '300px',
    },
    attrs: {
      clearable: true,
    },
  },
];
