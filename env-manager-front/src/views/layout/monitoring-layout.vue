<template>
<el-container>
    <el-header class="layout-header" :height="control.topHeight" v-show="control.topHeight == '72px'">
        <e-header @on-choose-nav="onChooseNav"></e-header>
    </el-header>  
    <el-container>
        <transition enter-active-class="slideInLeft" leave-active-class="slideOutLeft">
          <el-aside :width="control.leftWidth" class="e-asise animated"  v-show="control.leftWidth == '240px'">
            <e-site-search-tree></e-site-search-tree>
          </el-aside>
         </transition>
        <el-main>
            <home-main></home-main>
        </el-main>
    </el-container>
</el-container>
</template>


<script>
import EHeader from '@/components/e-header'
import ESiteSearchTree from '@/components/e-site-search-tree'
import HomeMain from '@/views/layout/home-main'

export default {
  name: 'monitoring-layout',
  components: {
    EHeader, ESiteSearchTree, HomeMain
  },
  mounted() {
    const me = this
    // 控制大小
    me.$bus.$on('change-monitoring-layout', (ctrl) => {
      me.control = ctrl
    })
  },
  data() {
    return {
      control: {
        leftWidth: '240px',
        topHeight: '72px'
      }
    }
  },
  methods: {
    onChooseNav(item) {
      const me = this
      me.currentChooseName = item.menuName
      me.$store.dispatch('modifyTopMenuName', me.currentChooseName)
      router.push(item.linkUrl)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "src/styles/mixin.scss";
    .layout-header{
        height: 72px;
        padding: 0;
    }
    .e-asise{
        background:rgba(59, 140, 255, 0.3);
        min-height: 100vh;
    }
   
</style>
