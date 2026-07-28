const BaseLayout = () => import("@/components/BaseLayout.vue");

const routes = [
  // TODO: 依需求新增路由規則
  {
    path: "/",
    component: BaseLayout,
  }
];

export default { routes };