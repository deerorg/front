<template>
  <div class="cfgarea">
      
      <p>租户:{{tenantName}}[{{tenantId}}]</p>

      <e-site-tree :data="tree" @node-click="hanldeNodeClick"></e-site-tree>
  </div>
</template>

<script>
import ESiteTree from '@/components/e-site-tree'
import { mapGetters } from 'vuex'

export default {
  name: 'cfgarea',
  components: {
    ESiteTree
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
