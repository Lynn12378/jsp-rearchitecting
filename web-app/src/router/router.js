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
      {
        path: "ATA08110",
        name: "ATA08110",
        component: () => import("@/views/A0/ATA08110.vue"),
      },
    ],
  },
  {
    path: "/Y1",
    name: "Y1",
    component: BaseLayout,
    children: [
      {
        path: "AFY10300",
        name: "AFY10300",
        component: () => import("@/views/Y1/AFY10300.vue"),
      },
      {
        path: "AFY10400",
        name: "AFY10400",
        component: () => import("@/views/Y1/AFY10400.vue"),
      },
    ],
  },
];

export default { routes };