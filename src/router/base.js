const routes = [
  {
    path: "/",
    // 默认进入中转页，中转页的详见中转视图定义
    redirect: { name: "Login" }
  },
   // 登录页
   {
    path: "/login",
    name: "Login",
    meta: {
      title: "登录"
    },
    component: () => import("@/pages/login")
  },
  {
    path: "/base",
    name: "Base",
    meta: {
      title: "base"
    },
    component: () => import("@/layout/Main"),
    children: [
      // home
      {
        path: "/home",
        name: "Home",
        meta: {
          title: "home"
        },
        component: () => import("@/pages/home")
      },
    ],
  },
];

export default routes;
