export default [
  {
    path: '/process',
    name: 'Process',
    meta: {
      id: '5809651e8055492dad5c8d59d5f65b76',
      title: '项目流程',
      icon: 'icon-gongzuoliu',
    },
    component: () => import('@/layout/Main'),
    children: [
      {
        path: '/processTemplate',
        name: 'ProcessTemplate',
        meta: {
          id: '54e735bbe4d647868f9b93c749c10d4a',
          title: '项目模板',
        },
        component: () => import('@/pages/process/template/index.vue'),
      },
      {
        path: '/processManagement',
        name: 'ProcessManagement',
        meta: {
          id: 'd0aac48fa8894a899cdadfe49aa8bf69',
          title: '项目管理',
        },
        component: () => import('@/pages/process/processManagement/index.vue'),
      },
      {
        path: '/processTasks',
        name: 'ProcessTasks',
        meta: {
          id: '82bc1ce3537949ceb4ee7a521d152e42',
          title: '项目任务',
        },
        component: () => import('@/pages/process/processTasks/index.vue'),
      },
      {
        path: '/processBackTasks',
        name: 'ProcessBackTasks',
        meta: {
          id: '128bb5186bdd473ca746e47c9fac5eb1',
          title: '项目退回任务',
        },
        component: () => import('@/pages/process/processBackTasks/index.vue'),
      },
    ],
  },
  {
    path: '/processDetailContent',
    name: 'ProcessDetailContent',
    meta: {
      title: '项目详情',
      id: true,
      menuHide: true,
    },
    component: () => import('@/pages/process/processManagement/ModalDetailContent.vue'),
  },
];
