import { h } from 'vue';
import BTag from '@/components/baseCommon/BTag.vue';
import { ApiQueryAllChildMerchantMini } from '@/http/setting/organ';
import { getAuthUser } from '@/utils/auth';
import { WHETHER_ENUM } from '@/data/common';

const user = getAuthUser();

/** 工作状态 */
export const WORK_STATUS = [
  {
    label: '在职',
    value: '01',
  },
  {
    label: '离职',
    value: '02',
  },
  {
    label: '休假',
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
    prop: 'userId',
    label: '用户ID',
    width: '240px',
    formatter(row) {
      return row.userId || '-';
    },
  },
  {
    prop: 'userName',
    label: '用户姓名',
    width: '140px',
    formatter(row) {
      return row.userName || '-';
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
    prop: 'departmentName',
    label: '所属部门',
    width: '160px',
    formatter(row) {
      return row.departmentName || '-';
    },
  },
  {
    prop: 'mobile',
    label: '联系电话',
    width: '140px',
    formatter(row) {
      return row.mobile || '-';
    },
  },
  {
    prop: 'enableRoles',
    label: '岗位角色',
    width: '140px',
    formatter(row) {
      return row.enableRoles || '-';
    },
  },
  {
    prop: 'workStatus',
    label: '用户状态',
    width: '120px',
    fixed: 'right',
    formatter(row) {
      const inner = () => row.workStatus.label || '-';
      // 	01-在职,02-离职,03-休假
      if (row.workStatus.value === '01')
        return h(BTag, { type: 'success' }, inner);
      if (row.workStatus.value === '02')
        return h(BTag, { type: 'danger' }, inner);
      return h(BTag, { type: 'info' }, inner);
    },
  },
  {
    prop: 'userStatus',
    label: '用户状态',
    width: '120px',
    fixed: 'right',
    formatter(row) {
      const inner = () => row.userStatus.label || '-';
      if (row.userStatus.value === '01')
        return h(BTag, { type: 'success' }, inner);
      if (row.userStatus.value === '02')
        return h(BTag, { type: 'danger' }, inner);
      return h(BTag, { type: 'info' }, inner);
    },
  },
];

/** 搜索字段 */
export const searchFormItems = [
  {
    name: 'orgId',
    label: '所属商户',
    type: 'select',
    options: () => ApiQueryAllChildMerchantMini({ merchantId: user.orgId }),
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'userName',
    label: '用户姓名',
    attrs: {
      clearable: true,
    },
  },
];

/** 表单各项属性 */
export const formItems = [
  {
    name: 'orgId',
    label: '所属商户',
    type: 'select',
    options: () => ApiQueryAllChildMerchantMini({ merchantId: user.orgId }),
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'departmentId',
    label: '职能部门',
    type: 'select',
    options: [],
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'loginId',
    label: '登录ID',
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'userName',
    label: '用户姓名',
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'workStatus',
    label: '工作状态',
    type: 'select',
    options: [...WORK_STATUS],
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'isLeader',
    label: '是否领导',
    type: 'select',
    options: [...WHETHER_ENUM],
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'isSalesMan',
    label: '是否业务员',
    type: 'select',
    options: [...WHETHER_ENUM],
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'mobile',
    label: '联系电话',
    attrs: {
      clearable: true,
      maxlength: 11,
    },
  },
  {
    name: 'enableRoles',
    label: '岗位角色',
    type: 'select',
    options: [...WORK_STATUS],
    attrs: {
      clearable: true,
    },
  },
];
