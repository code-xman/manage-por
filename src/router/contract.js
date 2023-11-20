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
          title: '合同管理',
        },
        component: () => import('@/pages/contract/contractManagement/index.vue'),
      },
      {
        path: '/contractDetailContent',
        name: 'ContractDetailContent',
        meta: {
          title: '合同详情',
          id: true,
          menuHide: true,
        },
        component: () => import('@/pages/contract/contractManagement/ModalDetailContent.vue'),
      },
    ],
  },
];
