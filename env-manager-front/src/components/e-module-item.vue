<template>
  <div class="module-item">
    <img src="../assets/img/ic_module" class="module_item__img">
    <span title="module.title">{{module.name}}</span>
  </div>
</template>

<script>
export default {
  name: 'module-item',
  props: {
    module: {
      type: Object,
      default: () => {
        return {
          name: '模块名称',
          title: '模块地址'
        }
      }
    }
  },
  data() {
    return {

    }
  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>
.module-item{
    background:rgba(59,140,255,0.3);
    width:304px;
    height:180px;
    flex: 1;
    text-align: center;
    color: #fff;
}
</style>
