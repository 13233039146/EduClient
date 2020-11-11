import Vue from 'vue'
import Vuex from 'vuex'

// 将vuex注入到vue实例中
Vue.use(Vuex)


// 将定义好的vuex导出
export default new Vuex.Store({
    state:  {
        cart_length : 0,
    },
    mutations: {
        add_to_cart(state, data){
            state.cart_length = data;
        },
        delete_course(state,data){
            state.cart_length = data;
        }
    },
    getters: {},
})
