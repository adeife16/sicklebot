import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";


import "./styles/index.css";
import "./styles/main.css";
import "vue3-toastify/dist/index.css";

const pinia = createPinia();

createApp(App).use(pinia).use(router).mount("#app");
