import { createRouter, createWebHashHistory, } from 'vue-router';
const modules = import.meta.glob('./*.js', { eager: true });

console.groupCollapsed('自动注册的路由');

const routes = [];
Object.keys(modules).forEach((filePath) => {
  const component = modules[filePath];
  console.log(`${filePath} :>> `, component.default);
  routes.push.apply(routes, component.default);
});

console.groupEnd();

// 实例化路由控制器
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 前置守卫
router.beforeEach((to) => {
  return true;
});

// 后置守卫
router.afterEach((to, from) => {});

export default router;
