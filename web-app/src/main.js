import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import quasar from "@/assets/libs/QuasarPlugin.js";
import "@/assets/libs/YupZhTw.js";
import "@/assets/libs/ValidateRules.js";

const app = createApp(App);
app.use(quasar);

const pinia = createPinia();
app.use(pinia);
app.use(router);
app.mount("#app");