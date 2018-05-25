<template>
  <div class="eselectdevicetree">
       <div class="e-device-add-metekind-pane__filter-container p-filter-container">
        <span class="p-table-name">更新模板设备</span>
        <span class="p-add-btn" @click="confirmUpdate">
            确定更新
        </span>
    </div>

    <el-input
    placeholder="输入关键字进行过滤"
    v-model="filterText">
    </el-input>

    <el-tree
    ref="deviceModelTree"
    :props="props"
    :data="treeData"
    default-expand-all
    show-checkbox
    :filter-node-method="filterNode"
    @check-change="handleCheckChange">
    </el-tree>

    <!--  -->


  </div>
</template>

<script>

import { getInfo, putItem } from "@/api/advanced"

export default {
  name: 'eselectdevicetree',
  data() {
    return {
      props: {
        label: 'name',
        children: 'deviceList'
      },
      treeData: [],
      filterText: ''
    }
  },
  props: {
    deviceModel: {
      type: Object,
      required: true
    }
  },
  mounted() {
    const me = this
    if (me.deviceModel.deviceModel) {
      // 获取数据
      me.getTreeData()
    }
    console.log("mounted")
  },

  watch: {
    filterText(val) {
      this.$refs.deviceModelTree.filter(val)
    }
  },
  methods: {
    // 获取使用当前模板的设备树
    getTreeData() {
      const me = this
      getInfo("/devicemodel/queryb4updatecfg?deviceModel=" + me.deviceModel.deviceModel).then(response => {
        const { success, data, msg } = response.data
        if (success) {
          me.raw = data
          if (data == null || data.length == 0) {
            me.$message.error("该设备模板没有对应的设备")
            return
          }
          me.treeData = data.map(x => {
            x.name = x.siteName + '[' + x.siteId + ']'
            x.deviceList = x.deviceList.map(y => {
              y.name = y.deviceName + '[' + y.deviceId + ']'
              return y
            })
            return x
          })
        } else {
          me.$message.error(msg)
        }
      })
        .catch(err => {
          me.$message.error("网络错误")
        })
    },
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate)
    },
    handleNodeClick(data) {
      console.log(data)
    },
    // 过滤
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 确定更新 勾选设备站点 确认添加
    confirmUpdate() {
      const me = this
      const currentChooseRows = me.$refs.deviceModelTree.getCheckedNodes(true)
      if (currentChooseRows.length == 0) {
        me.$message.info("请选择要更新的设备")
        return
      } else {
        const currentChooseDeviceIds = currentChooseRows.map(x => {
          const item = {
            deviceI: x.deviceId,
            deviceModel: me.deviceModel.deviceModel,
            siteId: x.siteId,
            tenantId: x.tenantId
          }
          return item
        })

        putItem("/devicemodel/updatecfg?deviceModel=" + me.deviceModel.deviceModel, currentChooseDeviceIds).then(response => {
          const { success, data, msg } = response.data
          if (success) {
            me.$message.success("更新成功")
          } else {
            me.$message.error(msg)
          }
        })
          .catch(err => {
            me.$message.error("网络错误")
          })
      }
    }

  }
}
</script>
<style lang="scss" scoped>
.eselectdevicetree{
    .el-tree{
        background: transparent;
        color:white;
    }

}
</style>
