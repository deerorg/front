<template>
  <el-breadcrumb class="app-levelbar"  separator-class="el-icon-arrow-right">
    <el-breadcrumb-item v-for="(item,index)  in levelList" :key="item.path">
      <router-link v-if='item.redirect==="noredirect"||index==levelList.length-1' to="" class="no-redirect">{{item.name}}</router-link>
      <router-link v-else :to="item.redirect||item.path">{{item.name}}</router-link>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  created() {
    this.getBreadcrumb()
  },
  data() {
    return {
      levelList: null
    }
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name)
      const first = matched[0]
      if (first && (first.name !== '系统配置' || first.path !== '')) {
        matched = [{ name: '系统配置', path: '/' }].concat(matched)
      }
      this.levelList = matched
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-levelbar.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 40px;
  margin-left: 10px;
  color:#fff;
  .no-redirect {
    cursor: text;
    color:#fff;
  }
}
</style>
