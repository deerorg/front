<template>
  <el-menu mode="vertical" :default-active="$route.path" :unique-opened="true">
    <sidebar-item :routes="routes" v-if="isAdmin"></sidebar-item>
    <sidebar-item-back :routes="routes" v-if="!isAdmin"></sidebar-item-back>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import SidebarItemBack from './SidebarItemBack'

export default {
  components: { SidebarItem, SidebarItemBack },
  data() {
    return {
      isAdmin: true
    }
  },
  computed: {
    ...mapGetters([
      'sidebar', 'roles'
    ]),
    routes() {
      // 管理员的角色ID为1 显示所有的路由菜单
      const me = this
      let route = me.$router.options.routes
      if (me.roles.indexOf(1) > -1) {
        me.isAdmin = true
        route = this.$router.options.routes
      } else {
        me.isAdmin = false
        route = JSON.parse(localStorage.getItem('currentUserMenuTree'))
      }
      return route
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-menu {
  min-height: 100%;
}
</style>
