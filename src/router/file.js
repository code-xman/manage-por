export default [
  {
    path: '/file',
    name: 'File',
    meta: {
      id: '663cad9899ba4e9fad1e69413a9a22db',
      title: '文件管理',
      icon: 'icon-rizhi',
    },
    component: () => import('@/layout/Main'),
    children: [
      {
        path: '/policy',
        name: 'Policy',
        meta: {
          id: 'c25fd60805b34f03810edb92dcaf1aa1',
          title: '政策文件管理',
        },
        component: () => import('@/pages/file/PolicyFile/index.vue'),
      },
      {
        path: '/table',
        name: 'Table',
        meta: {
          id: 'f02c947dfee84ef6a95f2d8869dbfdff',
          title: '表格文件管理',
        },
        component: () => import('@/pages/file/TableFile/index.vue'),
      },
    ],
  },
];
