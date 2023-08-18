import { h } from 'vue';
import BTag from '@/components/baseCommon/BTag.vue';
import { ApiQueryAllChildMerchantMini } from '@/http/setting/organ';
import { ROLE_TYPE_ENUM, PlatformOrgId, } from '@/data/common.js';
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
    prop: 'roleId',
    label: '岗位角色ID',
    width: '280px',
    formatter(row) {
      return row.roleId || '-';
    },
  },
  {
    prop: 'roleName',
    label: '岗位角色名称',
    width: '180px',
    formatter(row) {
      return row.roleName || '-';
    },
  },
  {
    prop: 'orgId',
    label: '所属机构',
    minWidth: '220px',
    formatter(row) {
      return row.orgIdLV.label || '-';
    },
  },
  {
    prop: 'roleStatus',
    label: '岗位角色状态',
    width: '140px',
    fixed: 'right',
    formatter(row) {
      const inner = () => row.roleStatus.label || '-';
      if (row.roleStatus.value === '01')
        return h(BTag, { type: 'success' }, inner);
      if (row.roleStatus.value === '02')
        return h(BTag, { type: 'danger' }, inner);
      return h(BTag, { type: 'info' }, inner);
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
    name: 'roleName',
    label: '岗位角色名称',
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
    name: 'roleName',
    label: '岗位角色名称',
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'roleType',
    label: '岗位角色类型',
    type: 'select',
    options: [...ROLE_TYPE_ENUM],
    attrs: {
      clearable: true,
      disabled: user.orgId !== PlatformOrgId,
    },
  },
  {
    name: 'orgId',
    label: '所属机构',
    type: 'select',
    options: () => ApiQueryAllChildMerchantMini({ merchantId: user.orgId }),
    className: 'full-width',
    attrs: {
      clearable: true,
    },
  },
];
