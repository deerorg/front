<template>
  <div class="sidebar">
  <el-menu mode="vertical" :default-active="$route.path" menu-trigger="click" @open="handleOpen" @close="handleClose" :unique-opened="true" :collapse="sidebar.opened">
    <sidebar-item :routes="routes"></sidebar-item>
  </el-menu>
  <div class="bottom-nav"  :isActive="sidebar.opened">
    <a href="javascript:void(0)" class="custom-nav"><i class="iconfont icon-setting el-icon-setting"></i> 自定义导航</a>
    <a class="toggle-nav-collapse collapse-nav"  @click="toggleSideBar" href="javascript:void(0)" tip="展开/收起"><i class="iconfont icon-collapse1 el-icon-tickets"></i></a>
    </div>
  </div>
</template>

<script>
import SidebarItem from './SidebarItem'
import { mapGetters } from 'vuex'
export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      return this.$router.options.routes
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-menu {
  min-height: 100%;

}
.sidebar .bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 180px;
  height: 40px;
  font-size: 13px;
  outline: none;
  line-height: 40px;
  text-align: center;
  border:1px solid red;
  .custom-nav{
    display: inline-block;
    zoom: 1;
    float: left;
    transition-duration: .3s;
    +.collapse-nav{
        width: 40px;
    }
  }
 
}

</style>
