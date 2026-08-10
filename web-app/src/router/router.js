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
        name: "Ata08110",
        component: () => import("@/views/A0/Ata08110.vue"),
      },
      {
        path: "ATA08120",
        name: "Ata08120",
        component: () => import("@/views/A0/Ata08120.vue"),
      },
    ]
  },
  {
    path: "/Y1",
    name: "Y1",
    component: BaseLayout,
    children: [
      {
        path: "AFY10100",
        name: "Afy10100",
        component: () => import("@/views/Y1/Afy10100.vue"),
      },
      {
        path: "AFY10100Detail",
        name: "AFY10100Detail",
        component: () => import("@/views/Y1/AFY10100Detail.vue"),
      },
      {
        path: "AFY10300",
        name: "Afy10300",
        component: () => import("@/views/Y1/Afy10300.vue"),
      },
      {
        path: "AFY10400",
        name: "Afy10400",
        component: () => import("@/views/Y1/Afy10400.vue"),
      },
    ]
  },
];

export default { routes };