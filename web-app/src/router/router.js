const BaseLayout = () => import("@/components/BaseLayout.vue");

const routes = [
  {
    path: "/",
    component: BaseLayout,
    children: [
      {
        path: "/",
        name: "Home",
        component: () => import("@/views/Home/Home.vue"),
      }
    ]
  },
  {
    path: "/A0",
    component: BaseLayout,
    children: [
      // TODO
    ]
  },
  {
    path: "/Y1",
    component: BaseLayout,
    children: [
      // TODO
    ]
  },
];

export default { routes };