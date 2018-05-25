<template>
  <div class="alarm">
    <el-button type="add" @click="isShowChooseMeteKindDialog = !isShowChooseMeteKindDialog"> 添加告警视图</el-button>
    <el-dialog title="添加告警视图" :visible.sync="isShowChooseMeteKindDialog" width="80%">
        <e-choose-dialog></e-choose-dialog>
    </el-dialog>

    <el-dialog title="编辑告警视图" :visible.sync="isShowEditMeteKind" width="80%">
        <e-choose-dialog v-if="isShowEditMeteKind" :control="editControl"></e-choose-dialog>
    </el-dialog>


  </div>
</template>

<script>
import { getInfo } from '@/api/advanced'
// import ESelectSiteGatewayTree from '@/components/e-select-site-gateway-tree'
import EChooseDialog from './e-choose-dialog'
export default {
  name: 'alarm',
  components: {
    EChooseDialog
  },
  data() {
    return {
      treeControl: {
        isShowGateway: false,
        isShowOpt: false
      },
      defaultProps: {
        label: 'name',
        children: 'meteTypeList'
      },
      rawData: [],
      deviceTypeTree: [],

      // 添加
      isShowChooseMeteKindDialog: false,
      //
      isShowEditMeteKind: false,

      editControl: {}
    }
  },
  mounted() {
    const me = this
    me.getData()
    // 添加视图 显示和关闭
    me.$bus.$on('update-show-add-view', (isShowAddDialog) => {
      me.isShowChooseMeteKindDialog = isShowAddDialog
    })
    me.$bus.$on('update-show-edit-view', (isShowEditDialog) => {
      me.isShowEditMeteKind = isShowEditDialog
    })
    // 编辑视图
    me.$bus.$on('on-show-e-choose-dialog-edit', (chooseData, chooseTreeItem, isShow) => {
      //   console.log(chooseData, chooseTreeItem, isShow);
      me.isShowEditMeteKind = true
      me.editControl = {
        type: 'edit',
        name: chooseTreeItem.name,
        chooseData,
        chooseTreeItem
      }
    })
  },
  methods: {
    getData() {
      const me = this
      getInfo("/cfguseralarmfilter/querytree4alarm")
        .then(response => {
          const { success, data, msg } = response.data
          if (success) {
            me.rawData = data
            me.deviceTypeTree = me.handlerData()
          } else {
            me.$message.error(msg)
          }
        })
    },
    handlerData() {
      const me = this
      return me.rawData.map(x => {
        x.id = Math.random().toString(10).substring(2)
        x.name = x.deviceTypeName
        const childNodes = x.meteTypeList
        childNodes.map(y => {
          y.id = Math.random().toString(10).substring(2)
          y.name = y.meteTypeName
          return y
        })
        return x
      })
    }

  }
}
</script>
<style lang="scss" scoped>
.bastpl{

}
</style>
