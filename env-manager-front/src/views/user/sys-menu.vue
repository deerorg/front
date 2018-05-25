<template>
    <div class="sys-user">
    <e-menu-tree></e-menu-tree>

    </div>
</template>

<script>
import { getURL, postItem } from "@/api/advanced"
import EMenuTree from '@/components/e-menu-tree'

export default {
  name: "sys-menu",
  components: {
    EMenuTree
  },
  data() {
    return {

    }
  },
  watch: {

  },

  mounted() {
    const me = this
  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>
.sys-user {
  text-align: center;
  &__filter-container {
  }
  &__table {
    text-align: center;
  }
}
</style>

