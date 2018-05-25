<template>
<el-container>
    <el-header class="layout-header" height="72px">
        <e-header @on-choose-nav="onChooseNav"></e-header>
    </el-header>  
    <el-container>
        <el-main>
            <home-main></home-main>
        </el-main>
    </el-container>
</el-container>
</template>


<script>
import EHeader from '@/components/e-header'
import HomeMain from '@/views/layout/home-main'

export default {
  name: 'home-layout',
  components: {
    EHeader, HomeMain
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
   
</style>
