<template>
  <div class="tab-container">
    <el-tabs style='margin-top:15px;' v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane v-for="item in tabMapOptions" :label="item.label" :key='item.key' :name="item.key">
        <!-- <keep-alive> -->
          <e-tele-tab-pane v-if='activeName==item.key' :type='item.key' :device="device" :tenant-id="tenantId"></e-tele-tab-pane>
        <!-- </keep-alive> -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import ETeleTabPane from '@/components/e-tele-tab-pane'
// 获取对应信息
const CURRENT_METEKIND_MAP = {
    AI: '1',
    DI: '2',
    AO: '3',
    DO: '4',
    CF: '5'
}
  export default {
    name: 'e-tele-tabs',
    components: { ETeleTabPane },
    data() {
      return {
        tabMapOptions: [
          { label: '遥测', key: 'AI' },
          { label: '遥信', key: 'DI' },
          { label: '遥调', key: 'AO' },
          { label: '遥控', key: 'DO' },
          { label: '配置', key: 'CF' }
        ],
        activeName: 'AI'
      }
    },
    created() {
      const me = this
    },
    props: {
      device: {
        type: Object,
        required: true
      },
      tenantId: String | Number
    },
    methods: {
      handleClick(tab, event) {
        const me = this
        const currentKey = tab.name || 'AI'
      }
    }
  }
</script>

<style scoped>
  .tab-container{

  }


  
</style>
