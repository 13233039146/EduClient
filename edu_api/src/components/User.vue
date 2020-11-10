<template>
    <div class="login box">
        <img src="../../static/image/1111.jpg" alt="">
        <div class="login">
            <div class="login-title">
                <img src="../../static/image/logo.png" alt="">
                <p>百知教育给你最优质的学习体验!</p>
            </div>
            <div class="login_box">
                <div class="title">
                    <span @click="login_u" id="log1">密码登录</span>
                    <span @click="login_m" id="log2">短信登录</span>
                </div>
                <div class="inp" v-if="login_flag">
                    <input type="text" placeholder="用户名 / 手机号码 / 邮箱" class="user"
                           v-model="username">
                    <input type="password" name="" class="pwd" placeholder="密码"
                           v-model="password" @blur="check_pwd()">
                    <div id="geetest1"></div>
                    <div class="rember">
                        <p>
                            <input type="checkbox" class="no" v-model="flag"/>
                            <span>记住密码</span>
                        </p>
                        <p>忘记密码</p>
                    </div>
                    <button class="login_btn btn btn-primary" @click="get_code()">登录</button>
                    <p class="go_login">没有账号?
                        <router-link to="/regist"><span>立即注册</span></router-link>
                    </p>
                </div>
                <div class="inp" v-else>
                    <input type="text" placeholder="手机号码" class="user" @blur="check_phone" v-model="phone">
                    <input type="text" class="pwd" placeholder="短信验证码" v-model="msg_code">
                    <button id="get_code" class="btn btn-primary" @click="getlogin" :disabled="disabled">{{ msg_text }}</button>
                    <button class="login_btn" @click="commit_message">登录</button>
                    <span class="go_login">没有账号?
                    <router-link to="/regist"><span>立即注册</span></router-link>
                </span>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
export default {
    name: "User",

    data() {
        return {
            msg_code : '', //短信验证码
            phone:'', // 手机号
            is_valide : false, //检验手机号是否符
            login_flag: true, // 密码登录还是手机短信登录
            username: '',
            password: '',
            flag: false,    //记住密码的标识
            totalCount: 0,
            disabled: false,  //验证码可点击
            interval: undefined,  // 计时器
        }
    },

    // 计算属性,倒计时
    computed: {
        msg_text() {
            return this.totalCount !== 0 ? `${this.totalCount}秒再次获取` : "获取验证码"
        }

    },
    methods: {

        // 手机短信登录方式
        commit_message(){
            console.log(this.msg_code)
            // 如果验证码没输入
            if(!this.msg_code){
                this.$message({
                    type:'error',
                    message: '请输入验证码!',
                    duration:1000
                })
                return
            }
            this.$axios({
                url: this.$settings.HOST + 'user/commit_msg/',
                method : 'post',
                data:{
                    phone: this.phone,
                    code: this.msg_code,
                }
            }).then(res=>{
                sessionStorage.token = res.data.token;
                this.$message({
                    message: '恭喜您,登录成功!',
                    type: 'success',
                    duration: 1500,
                })
                this.$router.push('/')
            }).catch(error=>{
                this.$message.error(error.response.data);
            })
        },
        //计时器
        getlogin() {
            // 按钮60秒倒计时
            if (!this.is_valide) {
                this.$message({
                    type: 'warning',
                    message: '请先输入正确的手机号!',
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

        //给手机发送验证码
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
                    message: '验证码已发送,10分钟内有效哦!'
                })
            }).catch(error => {
                this.$message({
                    type: 'error',
                    message: '获取验证码失败'
                })
            })
        },

        check_phone(){
            this.$axios({
                url: this.$settings.HOST + "user/login_check_phone/",
                method: "get",
                params: {
                    phone: this.phone,
                }
            }).catch(error => {
                this.$message.error(error.response.data)
                this.is_valide = false;
            })
            this.is_valide = true
        },
        login_u(){
            this.login_flag = true;
            document.getElementById('log2').style.color='#9b9b9b';
            document.getElementById('log2').style.borderBottom='0px';
            document.getElementById('log1').style.color='#4a4a4a';
            document.getElementById('log1').style.borderBottom='2px solid #84cc39';

        },
        login_m(){
            this.login_flag = false;
            document.getElementById('log1').style.color='#9b9b9b';
            document.getElementById('log1').style.borderBottom='0px';
            document.getElementById('log2').style.color='#4a4a4a';
            document.getElementById('log2').style.borderBottom='2px solid #84cc39';
        },
        check_pwd() {
            // console.log(this.password.length)
            if (this.password.length < 6 || this.password.length > 16) {
                this.$message({
                        message: '密码长度不正确,注意哦!',
                        type: 'warning',
                        duration: 1000,
                    }
                )
            }
        },
        // 验证开始需要向网站主后台获取id，challenge，success（是否启用failback）
        get_code() {
            document.getElementById('geetest1').innerHTML = '';
            // 验证开始需要向网站主后台获取id，challenge，success（是否启用failback）
            if (this.password.length >= 6 && this.password.length <= 16) {
                this.$axios({
                    url: this.$settings.HOST + "user/get_captcha/", // 加随机数防止缓存
                    method: "get",
                    params: {
                        username: this.username,
                    },
                }).then(res => {
                    let data = JSON.parse(res.data);
                    console.log(data)
                    // 使用initGeetest接口
                    // 参数1：配置参数
                    // 参数2：回调，回调的第一个参数验证码对象，之后可以使用它做appendTo之类的事件
                    initGeetest({
                        gt: data.gt,
                        challenge: data.challenge,
                        product: "popup", // 产品形式，包括：float，embed，popup。注意只对PC版验证码有效
                        offline: !data.success, // 表示用户后台检测极验服务器是否宕机，一般不需要关注
                        new_captcha: data.new_captcha
                    }, this.handlerPopup);
                }).catch(error => {
                    // console.log(error);
                    // this.$message.error(error.message)
                });
            }
        },

        // 请求验证码的回调函数  完成验证码的验证
        handlerPopup(captchaObj) {
            // 回调函数中  this的指向会被改变
            let self = this;
            // 在验证码被用户成功滑动后开始执行
            captchaObj.onSuccess(function () {
                let validate = captchaObj.getValidate();
                self.$axios({
                    url: self.$settings.HOST + "user/get_captcha/",
                    method: "post",
                    data: {
                        geetest_challenge: validate.geetest_challenge,
                        geetest_validate: validate.geetest_validate,
                        geetest_seccode: validate.geetest_seccode
                    },
                }).then(res => {
                    console.log(res);
                    // this.$router.push('/')
                    // r如果滑块验证码验证合格则完成登录
                    self.commit();
                }).catch(error => {
                    this.$message({
                        message: '您的验证码有误哦!',
                        type: 'warning',
                        duration: 1500,
                    })
                });
            });

            // // 将验证码加到id为captcha的元素里
            captchaObj.appendTo("#geetest1");
        },
        commit() {
            // 发送请求
            // 如果记住了密码
            if (localStorage.token) {
                if (!this.flag) {
                    localStorage.clear();
                }
                sessionStorage.token = localStorage.token;
                this.$message({
                    message: '恭喜您,登录成功!',
                    type: 'success',
                    duration: 1500,
                })
                this.$router.push('/');
                return
            }
            this.$axios({
                url: this.$settings.HOST + 'user/login/',
                method: 'POST',
                data: {
                    username: this.username,
                    password: this.password,
                }
            }).then(response => {
                // 如果要记住密码
                if (this.flag) {
                    localStorage.token = response.data.token;
                    localStorage.username = response.data.username;
                    console.log("用户名: ", response.data.username)
                } else {
                    localStorage.clear();
                }


                // 登录成功拿到了token
                if (response.data) {
                    sessionStorage.token = response.data.token;
                    this.$message({
                        message: '恭喜您,登录成功!',
                        type: 'success',
                        duration: 1500,
                    });
                    // 跳到首页
                }
                this.$router.push('/');

            }).catch(error => {
                this.$message({
                    message: '您输入的账号或密码有误!',
                    type: 'error',
                    duration: 1500,
                });
            })
        }
    },

    // 创建实例之前判断是否记住密码
    created() {
        // 已经记住密码
        if (localStorage.token) {
            this.username = localStorage.username;
            this.password = '123456';
            this.flag = true;

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

.box .login {
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

.login .login-title {
    width: 100%;
    text-align: center;
}

.login-title img {
    width: 190px;
    height: auto;
}

.login-title p {
    font-family: PingFangSC-Regular;
    font-size: 18px;
    color: #fff;
    letter-spacing: .29px;
    padding-top: 10px;
    padding-bottom: 50px;
}

.login_box {
    width: 400px;
    height: auto;
    background: #fff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .5);
    border-radius: 4px;
    margin: 0 auto;
    padding-bottom: 40px;
}

.login_box .title {
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

.login_box .title span:nth-of-type(1) {
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

.login_btn {
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
</style>
