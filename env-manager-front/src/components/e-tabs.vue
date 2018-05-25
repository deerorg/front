<template>
  <div class="tab-container">
    <el-tabs style='margin-top:15px;' v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane v-for="item in tabMapOptions" :label="item.label" :key='item.key' :name="item.key">
        <!-- <keep-alive> -->
          <e-tab-pane v-if='activeName==item.key' :type='item.key' :device-model="deviceModel"></e-tab-pane>
        <!-- </keep-alive> -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import ETabPane from '@/components/e-tab-pane'
// 获取对应信息
const CURRENT_METEKIND_MAP = {
    AI: '1',
    DI: '2',
    AO: '3',
    DO: '4',
    CF: '5'
}
  export default {
    name: 'e-tabs',
    components: { ETabPane },
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
      // 注册事件 在e-device-add-metekind中调用
      me.$bus.$on('update-e-tab-pane-request', (currentData) => {
        const currentMeteKind = CURRENT_METEKIND_MAP[currentData.type]
        const url = `/devicetemplate/queryBy?deviceModel=${currentData.deviceModel.deviceModel}&meteKind=${currentMeteKind}&pageNum=${me.pageParmas.pageNum}&pageSize=${me.pageParmas.pageSize}`
        getInfo(url).then(response => {
          const { data, msg, success } = response.data
          if (success) {
            me.list = data.list
            me.total = data.total
          }
        })
      })
    },
    props: {
      deviceModel: {
        type: Object,
        required: true
      }
    },
    methods: {
      handleClick(tab, event) {
        const me = this
        const currentKey = tab.name || 'AI'
        me.$bus.$emit("get-current-tabs-key", currentKey)
      }
    }
  }
</script>

<style scoped>
  .tab-container{

  }


  
</style>
