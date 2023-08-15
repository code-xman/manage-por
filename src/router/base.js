const routes = [
  {
    path: '/',
    // 默认进入中转页，中转页的详见中转视图定义
    redirect: { name: 'Login' },
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
  {
    path: '/base',
    name: 'Base',
    meta: {
      title: '基础页面',
      icon: 'icon-caidanguanli',
    },
    component: () => import('@/layout/Main'),
    children: [
      // home
      {
        path: '/home',
        name: 'Home',
        meta: {
          title: 'home',
        },
        component: () => import('@/pages/home'),
      },
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
