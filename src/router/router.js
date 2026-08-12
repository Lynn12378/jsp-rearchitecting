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
];

export default { routes };