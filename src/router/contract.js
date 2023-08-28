export default [
  {
    path: '/contract',
    name: 'Contract',
    meta: {
      id: '6665bdcd6af94dc1a23167322afd4714',
      title: '合同',
      icon: 'icon-xiangmuguidang',
    },
    component: () => import('@/layout/Main'),
    children: [
      {
        path: '/contractManagement',
        name: 'ContractManagement',
        meta: {
          id: '220f9fa80ec34495ad5fbc751d198f59',
          title: '机构管理',
        },
        component: () => import('@/pages/contract/contractManagement/index.vue'),
      },
    ],
  },
];
