import { h } from 'vue';
import BTag from '@/components/baseCommon/BTag.vue';
import { ApiQueryAllChildMerchantMini } from '@/http/setting/organ';
import { ROLE_TYPE_ENUM, PlatformOrgId, } from '@/data/common.js';
import { getAuthUser } from '@/utils/auth';
import { formatAmount, parseToDatetime, } from '@/utils/string';

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
      if (row.contractName.value === '01')
        return h(BTag, { type: 'success' }, inner);
      if (row.contractName.value === '02')
        return h(BTag, { type: 'danger' }, inner);
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
    minWidth: '200px',
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
