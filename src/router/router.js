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
      },
    ],
  },
  {
    path: "/AFY",
    component: BaseLayout,
    children: [
      {
        path: "AFY10100",
        name: "AFY10100",
        component: () => import("@/views/AFY/AFY10100.vue"),
      },
    ],
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/",
  },
];

export default { routes };
