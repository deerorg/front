<template>
<el-container>
    <el-header class="layout-header" height="72px">
        <e-header @on-choose-nav="onChooseNav"></e-header>
    </el-header>  
    <el-container>
        <el-aside width="240px">
            <e-left-tree @edit-view="editView" @delete-view="deleteView" @add-view="addView"></e-left-tree>
        </el-aside>
        <el-main>
            <home-main></home-main>
        </el-main>
    </el-container>
</el-container>
</template>


<script>
import EHeader from '@/components/e-header'
import HomeMain from '@/views/layout/home-main'
import ELeftTree from '@/views/home-alarm/e-left-tree'

import { mapGetters } from 'vuex'

import { getInfo, deleteItem, postItem } from '@/api/advanced'

export default {
  name: 'home-layout',
  components: {
    EHeader, HomeMain, ELeftTree
  },
  computed: {
    ...mapGetters(['tenantId'])
  },
  methods: {
    onChooseNav(item) {
      const me = this
      me.currentChooseName = item.menuName
      me.$store.dispatch('modifyTopMenuName', me.currentChooseName)
      router.push(item.linkUrl)
    },
    editView(item) {
      const me = this
      // 请求编辑查询的数据
      getInfo(`/cfguseralarmfilter/queryby?tenantId=${me.tenantId}&name=${item.name}&roleId=0`).then(resp => {
        const { success, msg, data } = resp.data
        if (success) {
          //  打开编辑弹窗
          me.$bus.$emit('on-show-e-choose-dialog-edit', data, item, true)
        } else {
          me.$message.error(msg)
        }
      })
    },
    deleteView(item) {
      const me = this
      if (item.id < 0) {
        return
      }
      const one = {
        tenantId: me.tenantId,
        name: item.name,
        roleId: 0
      }
      deleteItem('/cfguseralarmfilter/', one).then(resp => {
        const { success, msg, data } = resp.data
        if (success) {
          me.$message.success("删除视图成功")
          // 通知左侧tree 删除对应的节点
          me.$bus.$emit('update-e-left-tree-refresh-data')
        } else {
          me.$message.error(msg)
        }
      })
    },
    addView(item) {
      const me = this
      me.$bus.$emit('update-show-add-view', true)
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
