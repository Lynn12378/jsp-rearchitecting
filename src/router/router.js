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
    path: "/Y1",
    component: BaseLayout,
    children: [
      {
        path: "AFY10100",
        name: "AFY10100",
        component: () => import("@/views/Y1/AFY10100.vue"),
      },
      {
        path: "AFY10100/detail",
        name: "AFY10100Detail",
        component: () => import("@/views/Y1/AFY10100Detail.vue"),
      },
      {
        path: "AFY10300",
        name: "AFY10300",
        component: () => import("@/views/Y1/AFY10300.vue"),
      },
    ],
  },
];

export default { routes };
