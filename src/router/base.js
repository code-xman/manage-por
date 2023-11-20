const routes = [
  {
    path: '/',
    // 默认进入中转页，中转页的详见中转视图定义
    redirect: { name: 'Home' },
    meta: {
      menuHide: true,
    },
  },
  // 登录页
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录',
      menuHide: true,
    },
    component: () => import('@/pages/login'),
  },
  // 登录中
  {
    path: '/logging',
    name: 'Logging',
    meta: {
      title: '登录中',
      menuHide: true,
    },
    component: () => import('@/pages/logging'),
  },

  // home
  {
    path: '/home',
    name: 'Home',
    redirect: { name: 'IndexHome' },
    meta: {
      title: '首页',
      icon: 'icon-menhu',
    },
    component: () => import('@/layout/Main'),
    children: [
      {
        path: '',
        name: 'IndexHome',
        meta: {
          title: '首页',
          menuHide: true,
          icon: 'icon-menhu',
        },
        component: () => import('@/pages/home'),
      },
    ]
  },
  {
    path: '/base',
    name: 'Base',
    meta: {
      title: '基础页面',
      icon: 'icon-caidanguanli',
      showType: 'development',
    },
    component: () => import('@/layout/Main'),
    children: [
      {
        path: '/BaseTable',
        name: 'BaseTable',
        meta: {
          title: '基础列表',
        },
        component: () => import('@/components/BaseTable/Show.vue'),
      },
      {
        path: '/baseFormPage',
        name: 'BaseFormPage',
        meta: {
          title: '基础表单',
        },
        component: () => import('@/components/BaseForm/Show.vue'),
      },
      {
        path: '/basePage',
        name: 'BasePage',
        meta: {
          title: '基础列表页面',
        },
        component: () => import('@/components/BasePage/Show.vue'),
      },
    ],
  },
];

export default routes;
