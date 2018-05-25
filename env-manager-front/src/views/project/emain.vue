<template>
    <section class="main">
        <transition name="fade" mode="out-in">
            <keep-alive>
              <router-view></router-view>
            </keep-alive>
        </transition>
    </section>
</template>

<script>
    export default {
      name: 'EMain'
    }
</script>
<style scoped>
    .main{
        padding-left:20px;
    }
</style>

