<template>
  <div class="cfgarea">
      租户:{{tenantName}}
      <e-tree :data="tree" @node-click="hanldeNodeClick"></e-tree>
  </div>
</template>

<script>
import ETree from '@/components/e-tree'
import { mapGetters } from 'vuex'

export default {
  name: 'cfgarea',
  components: {
    ETree
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
.cfgarea{

}
</style>
