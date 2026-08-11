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
    ],
  },
];

export default { routes };
