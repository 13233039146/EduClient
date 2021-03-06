// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 导入element-ui
import ElementUI from "element-ui"
// 导入全局样式
import "element-ui/lib/theme-chalk/index.css"
import store from "./store"
import "../static/css/global.css"
import settings from "./settings";

// 导入极验的验证码
import "../static/js/gt"
// 配置axios（相当于json ajax）
import axios from "axios"

// 配置settings
Vue.prototype.$settings = settings;
Vue.prototype.$axios = axios
// 全局注册
Vue.use(ElementUI)

Vue.config.productionTip = false

require('video.js/dist/video-js.css');
require('vue-video-player/src/custom-theme.css');
import VideoPlayer from 'vue-video-player'

Vue.use(VideoPlayer);


/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: {App},
    template: '<App/>',
    store
})
