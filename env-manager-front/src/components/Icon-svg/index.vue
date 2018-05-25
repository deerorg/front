<template>
  <svg class="svg-icon" :style="{'fontSize':size}" aria-hidden="true">
        <use :xlink:href="iconName"></use>
  </svg>
</template>

<script>
  export default {
    name: 'icon-svg',
    props: {
      iconClass: {
        type: String,
        required: true
      },
      size: {
        type: Number | String,
        default: () => {
          return '16px'
        }
      }
    },
    computed: {
      iconName() {
        return `#el-icon-iot-${this.iconClass}`
      }
    }
  }
</script>

<style>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
