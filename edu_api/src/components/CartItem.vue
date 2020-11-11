<template>
    <div class="cart_item">
        <div class="cart_column column_1">
            <el-checkbox class="my_el_checkbox" v-model="course.selected"></el-checkbox>
        </div>
        <div class="cart_column column_2">
            <img :src="course.course_img" alt="">
            <span><router-link tag='span' to="/course/detail/1">{{ course.name }}</router-link></span>
        </div>
        <div class="cart_column column_3">
            <el-select v-model="course.expire_id" size="mini" placeholder="请选择购买有效期" class="my_el_select">
                <el-option :label="item.expire_text" :value="item.id" :key="item.id"
                           v-for="item in course.expire_list"></el-option>
            </el-select>
        </div>
        <div class="cart_column column_4">{{ course.price }}</div>
        <div class="cart_column column_4">
            <button @click="delete_course">删除</button>
        </div>
    </div>
</template>

<script>
export default {
    name: "CarItem",
    data() {
        return {
            expire: 0,
        }
    },
    methods: {
        delete_course() {
            let token = sessionStorage.token;
            this.$axios({
                url: this.$settings.HOST + 'cart/add/',
                method: 'delete',
                data: {
                    course_id: this.course.id
                },
                headers: {
                    "Authorization": "jwt " + token
                }
            }).then(res => {
                console.log(res.data);
                this.$store.commit('delete_course', res.data.cart_length);
                this.$emit("btn");
            }).catch(error => {
                console.log(error.response);
            });

        },
        change_selected() {
            let token = sessionStorage.token;
            this.$axios({
                url: this.$settings.HOST + 'cart/add/',
                method: 'patch',
                data: {
                    course_id: this.course.id,
                    course_selected: this.course.selected
                },
                headers: {
                    "Authorization": "jwt " + token
                }
            }).then(res => {

                console.log(res.data);
            }).catch(error => {
                console.log(error.response);
            })
        },
        change_expire() {
            let token = sessionStorage.token;
            this.$axios({
                url: this.$settings.HOST + 'cart/add/',
                method: 'put',
                data: {
                    expire_id: this.course.expire_id,
                    course_id: this.course.id,
                },
                headers: {
                    "Authorization": "jwt " + token
                }
            }).then(res => {
                this.$emit('re_get');
                console.log(res.data);
            }).catch(error => {
                console.log(error.response);
            })
        }
    },
    props: ['course'],
    watch: {
        "course.selected": function () {
            this.change_selected();
        },
        "course.expire_id": function () {
            this.change_expire();
        },
    },
}
</script>

<style scoped>
.cart_item::after {
    content: "";
    display: block;
    clear: both;
}

.cart_column {
    float: left;
    height: 250px;
}

.cart_item .column_1 {
    width: 88px;
    position: relative;
}

.my_el_checkbox {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    margin: auto;
    width: 16px;
    height: 16px;
}

.cart_item .column_2 {
    padding: 67px 10px;
    width: 520px;
    height: 116px;
}

.cart_item .column_2 img {
    width: 175px;
    height: 115px;
    margin-right: 35px;
    vertical-align: middle;
}

.cart_item .column_3 {
    width: 197px;
    position: relative;
    padding-left: 10px;
}

.my_el_select {
    width: 117px;
    height: 28px;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
}

.cart_item .column_4 {
    padding: 67px 10px;
    height: 116px;
    width: 142px;
    line-height: 116px;
}
</style>
