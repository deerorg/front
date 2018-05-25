<template>
  <section class="app-main">
    <transition name="fade" mode="out-in">
      <router-view :key="key"></router-view>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    }
  }
}
</script>
<style scoped>
.app-main{
    min-height: 100%;
    padding: 20px;
    width: 100%;
    height: calc(100vh - 112px);
    overflow-y: auto;
    overflow-x: auto;
}

.app-main::-webkit-scrollbar {
    width: 6px;
    height: 6px;
    background-color: #fff;
}
.app-main::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(59, 140, 255, 0.3);
    background-color: #314997;
}
.app-main::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(59, 140, 255, 0.3);
    border-radius: 10px;
    background-color: #fff;
}
 

</style>

