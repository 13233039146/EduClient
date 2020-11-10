import Vue from 'vue'
import Router from 'vue-router'
import Index from "../components/Index";
import User from "../components/User";
import Regist from "../components/Regist";
import Course from "../components/Course";
import CourseDetail from "../components/CourseDetail";
import Cart from "../components/Cart";


Vue.use(Router)

export default new Router({
    routes: [
        {path: '/index' , component: Index},
        {path: '/user', component: User},
        {path: '/regist', component: Regist},
        {path: '/course', component: Course},
        {path: '/detail/:id', component: CourseDetail},
        {path: '/cart', component: Cart},
        {path: '/', redirect:'index/'},
    ]
})
