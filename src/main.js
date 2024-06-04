import "./assets/main.scss";

import { createApp } from "vue";

// element-ui
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

// el-icons
import elementIcons from "@/components/ElementIcons/";

// ramda
import * as $R from "ramda";

import App from "./App.vue";

const app = createApp(App);

// 全局方法挂载
app.config.globalProperties.$R = $R;

app.use(ElementPlus);
app.use(elementIcons);
app.mount("#app");
