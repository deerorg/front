<template>
  <div class="cfgdevicebatch">
    <div class="cfgdevicebatch__row">
        <div class="cfgdevicebatch__left">
            <e-device-model-tree :data="treeData" :control="control" @node-click="handlerNodeClick"></e-device-model-tree>
        </div>  
        <!-- 站点树 or 站点网关树 -->
        <div class="cfgdevicebatch__right">
            <e-select-site-gateway-tree :device-model="deviceModel" v-if="isShowChooseTree" :control="treeControl"></e-select-site-gateway-tree>
        </div>
    </div>
  </div>
</template>

<script>
// 设备模板树
import EDeviceModelTree from '@/components/e-device-model-tree'
// 选择站点或站点网关树
import ESelectSiteGatewayTree from '@/components/e-select-site-gateway-tree'

export default {
  name: 'cfgdevicebatch',
  components: {
    EDeviceModelTree, ESelectSiteGatewayTree
  },
  data() {
    return {
      control: {
        isShowOpt: false,
        isShowRight: false,
        isExpandAll: true
      },
      treeData: {},
      isShowChooseTree: false,
      deviceModel: '',
      treeControl: {}
    }
  },
  methods: {
    handlerNodeClick(data, node, tree) {
      const me = this
      if (data.deviceModel) {
        me.deviceModel = data.deviceModel
        // 看是否是网关类型
        if (data.deviceKind == 3) {
          me.treeControl = {
            isShowGateway: false
          }
        } else {
          me.treeControl = {
            isShowGateway: true
          }
        }
        me.isShowChooseTree = true
      } else {
        me.isShowChooseTree = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.cfgdevicebatch{
    &__row{
        display: flex;
    }
    &__left{
        width:400px;
        max-width: 400px;
    }
    &__right{
        flex:1;
    }
}
</style>
