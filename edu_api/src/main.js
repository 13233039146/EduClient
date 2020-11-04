// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 导入element-ui
import ElementUI from "element-ui"
// 导入全局样式
import "element-ui/lib/theme-chalk/index.css"

import "../static/css/global.css"
import settings from "./settings";


// 配置axios（相当于json ajax）
import axios from "axios"

// 配置settings
Vue.prototype.$settings = settings;
Vue.prototype.$axios = axios
// 全局注册
Vue.use(ElementUI)

Vue.config.productionTip = false


/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: {App},
    template: '<App/>'
})
