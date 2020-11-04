<template>

    <div>

        <Header></Header>
        <Banner></Banner>
        <Footer></Footer>

    </div>

</template>

<script>

import Banner from "./common/Banner";
import Header from "./common/Header";
import Footer from "./common/Footer";

export default {
    name: "index",
    components: {
        Header: Header,
        Banner: Banner,
        Footer: Footer,
    }
}
</script>

<style scoped>

</style>
