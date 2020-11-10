<template>
    <div class="box">
        <img src="../../static/image/1111.jpg" alt="">
        <div class="register">
            <div class="register_box">
                <div class="register-title">百知教育在线平台注册</div>
                <div class="inp">
                    <input v-model="phone" type="text" placeholder="手机号码" class="user" @blur="check_phone">
                    <input v-model="password" type="password" placeholder="登录密码" class="user">
                    <div id="geetest"></div>
                    <div class="sms-box">
                        <input v-model="code" type="text" maxlength="6" placeholder="输入验证码" class="user">
                        <div>
                            <button @click="getlogin" class="sms-btn" :disabled="disabled">{{ msg_text }}</button>
                        </div>
                    </div>
                    <button class="register_btn" @click="user_register">注册</button>
                    <p class="go_login">已有账号
                        <router-link to="/user"><span>直接登录</span></router-link>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Regist",

    data() {
        return {
            is_valide: false,   //判断用户是否合法(后端) 不存在+长度正确
            code: '',
            phone: "",
            password: "",
            totalCount: 0,
            disabled: false,
            interval: undefined,
        }
    },
    computed: {
        msg_text() {
            return this.totalCount !== 0 ? `${this.totalCount}秒再次获取` : "获取验证码"
        }

    },
    methods: {
        ch_pwd(pwd) {
            return !(pwd.length < 8 || pwd.length > 16);
        },

        getlogin() {
            // 按钮60秒倒计时
            if (!this.is_valide || !this.ch_pwd(this.password)) {
                this.$message({
                    type: 'warning',
                    message: '请先输入正确的用户名或密码!',
                    duration: 1000,
                })
                return
            }
            this.disabled = true
            this.totalCount = 60
            this.send_code();   //60秒过倒计时过后才能调用的事件
            this.interval = setInterval(() => {
                this.totalCount--;
                if (this.totalCount === 0) {
                    clearInterval(this.interval)
                    this.disabled = false
                }
            }, 1000);
        },

        send_code() {
            this.$axios({
                url: this.$settings.HOST + 'user/send_code/',
                method: 'get',
                params: {
                    phone: this.phone
                }
            }).then(res => {
                this.$message({
                    type: 'success',
                    message: '验证码已发送,请注意查收!'
                })
            }).catch(error => {
                this.$message({
                    type: 'error',
                    message: '获取验证码失败'
                })
            })
        },


        user_register() {
            if (this.code && this.is_valide && this.ch_pwd(this.password)) {
                this.$axios({
                    url: this.$settings.HOST + "user/regist/",
                    method: "post",
                    data: {
                        phone: this.phone,
                        password: this.password,
                        code : this.code,
                    },
                    // 注册成功
                }).then(response => {
                    if (response.data.token) {
                        this.$message.success('注册成功');
                        sessionStorage.token = response.data.token;
                        this.$router.push('/');
                    }
                }).catch(error => {
                    // 失败
                    console.log(error);
                    this.$message.error('用户名密码或验证码不合格');
                })
            } else {
                this.$message.error('请填写正确的字段')
            }
        },

        check_phone() {
            this.$axios({
                url: this.$settings.HOST + "user/check/",
                method: "get",
                params: {
                    phone: this.phone,
                }
            }).catch(error => {
                this.$message.error(error.response.data)
                this.is_valide = false;
            })
            this.is_valide = true
        }

    }
}

</script>

<style scoped>
.box {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
}

.box img {
    width: 100%;
    min-height: 100%;
}

.box .register {
    position: absolute;
    width: 500px;
    height: 400px;
    top: 0;
    left: 0;
    margin: auto;
    right: 0;
    bottom: 0;
    top: -338px;
}

.register .register-title {
    width: 100%;
    font-size: 24px;
    text-align: center;
    padding-top: 30px;
    padding-bottom: 30px;
    color: #4a4a4a;
    letter-spacing: .39px;
}

.register-title img {
    width: 190px;
    height: auto;
}

.register-title p {
    font-family: PingFangSC-Regular;
    font-size: 18px;
    color: #fff;
    letter-spacing: .29px;
    padding-top: 10px;
    padding-bottom: 50px;
}

.register_box {
    width: 400px;
    height: auto;
    background: #fff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .5);
    border-radius: 4px;
    margin: 0 auto;
    padding-bottom: 40px;
}

.register_box .title {
    font-size: 20px;
    color: #9b9b9b;
    letter-spacing: .32px;
    border-bottom: 1px solid #e6e6e6;
    display: flex;
    justify-content: space-around;
    padding: 50px 60px 0 60px;
    margin-bottom: 20px;
    cursor: pointer;
}

.register_box .title span:nth-of-type(1) {
    color: #4a4a4a;
    border-bottom: 2px solid #84cc39;
}

.inp {
    width: 350px;
    margin: 0 auto;
}

.inp input {
    border: 0;
    outline: 0;
    width: 100%;
    height: 45px;
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    text-indent: 20px;
    font-size: 14px;
    background: #fff !important;
}

.inp input.user {
    margin-bottom: 16px;
}

.inp .rember {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    margin-top: 10px;
}

.inp .rember p:first-of-type {
    font-size: 12px;
    color: #4a4a4a;
    letter-spacing: .19px;
    margin-left: 22px;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    /*position: relative;*/
}

.inp .rember p:nth-of-type(2) {
    font-size: 14px;
    color: #9b9b9b;
    letter-spacing: .19px;
    cursor: pointer;
}

.inp .rember input {
    outline: 0;
    width: 30px;
    height: 45px;
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    text-indent: 20px;
    font-size: 14px;
    background: #fff !important;
}

.inp .rember p span {
    display: inline-block;
    font-size: 12px;
    width: 100px;
    /*position: absolute;*/
    /*left: 20px;*/

}

#geetest {
    margin-top: 20px;
}

.register_btn {
    width: 100%;
    height: 45px;
    background: #84cc39;
    border-radius: 5px;
    font-size: 16px;
    color: #fff;
    letter-spacing: .26px;
    margin-top: 30px;
}

.inp .go_login {
    text-align: center;
    font-size: 14px;
    color: #9b9b9b;
    letter-spacing: .26px;
    padding-top: 20px;
}

.inp .go_login span {
    color: #84cc39;
    cursor: pointer;
}

.sms-box {
    position: relative;
}

.sms-btn {
    font-size: 16px;
    color: goldenrod;
    letter-spacing: .26px;
    position: absolute;
    right: 16px;
    top: 10px;
    cursor: pointer;
    overflow: hidden;
    background: #fff;
    border: 1px solid #484848;
    padding-left: 16px;
    padding-bottom: 4px;
}
</style>
