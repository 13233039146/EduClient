<template>
    <div class="footer">
        <ul>
            <li v-for="(nav,index) in foot_list" :key="index">
                <span v-if="nav.position === 2">
                    <span v-if="nav.is_site">
                                    <a :href="nav.link">{{ nav.title }}</a>
                    </span>
                    <span v-else>
                        <router-link :to="nav.link">{{ nav.title }}</router-link>
                    </span>
                </span>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "Footer",
    data() {
        return {
            foot_list: []
        }
    },
    methods: {
        get_headers() {
            this.$axios.get(this.$settings.HOST + 'index/nav/').then(response => {
                console.log(response.data);
                this.foot_list = response.data;
            })
        },
    },
    created() {
        this.get_headers();
    }
}
</script>

<style scoped>
.footer {
    width: 100%;
    height: 128px;
    background: #25292e;
    color: #fff;
}

.footer ul {
    margin: 0 auto 16px;
    padding-top: 38px;
    width: 810px;
}

.footer ul li {
    float: left;
    width: 112px;
    margin: 0 10px;
    text-align: center;
    font-size: 14px;
}

.footer ul::after {
    content: "";
    display: block;
    clear: both;
}

.footer p {
    text-align: center;
    font-size: 12px;
}
</style>
