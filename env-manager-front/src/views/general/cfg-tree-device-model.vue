<template>
  <div class="cfgdevicemodeltree">
      <h3>设备模板管理</h3>
      租户:{{tenantName}}
      <e-device-model-tree :data="tree" @node-click="hanldeNodeClick" ></e-device-model-tree>
  </div>
</template>

<script>
import EDeviceModelTree from '@/components/e-device-model-tree'
import { mapGetters } from 'vuex'

export default {
  name: 'cfgdevicemodeltree',
  components: {
    EDeviceModelTree
  },

  data() {
    return {
      tree: {}

    }
  },
  computed: {
    ...mapGetters(['tenantId', 'tenantName'])
  },
  methods: {
    hanldeNodeClick(data) {
      this.content = data.name
    },
    nodeClick(item, data, self) {
      const me = this
      console.log("nodeClick")
    }

  }
}
</script>
<style lang="scss" scoped>
.cfgdevicemodeltree{

}
</style>
