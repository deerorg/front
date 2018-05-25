<template>
  <div class="edevicetemplate">
    <div class="tool-tip">
        <el-button @click="importDoc" v-show="!isEnabled">导入协议文档</el-button>
        <el-button @click="delDoc" v-show="false">删除协议文档</el-button>
        <el-button @click="updateDoc" v-show="isEnabled">更新协议文档</el-button>
        <el-button @click="addDeviceMeteKind">添加监控量</el-button>
        <!-- <el-button>删除</el-button> -->
        <!-- <el-button>修改</el-button> -->
    </div>
    <e-tabs :device-model="deviceModel"></e-tabs>

<!-- 导入协议文档 -->
    <el-dialog title="导入协议文档" :visible.sync="isShowImportDialog" width="95%">
        <e-import-doc @get-data="getData" @cancel-save="cancelSave" :device-model="deviceModel"></e-import-doc>
    </el-dialog>

<!-- 添加系统监控量 -->
    <el-dialog :title="currentTitle" :visible.sync="isShowAddDialog" width="95%">
        <e-device-add-metekind :device-model="deviceModel" :type="currentKey"  v-if="isShowAddDialog"></e-device-add-metekind>
    </el-dialog>

    <!-- 更新协议 选择设备 -->
    <el-dialog title="选择要更新的设备" :visible.sync="isShowDialog">
        <!--选择设备  -->
        <e-select-device-tree :device-model="deviceModel" v-if="isShowDialog"></e-select-device-tree>
    </el-dialog>


  </div>
</template>

<script>
// 五遥tabs显示
import ETabs from '@/components/e-tabs'
// 导入协议弹窗
import EImportDoc from '@/components/e-import-doc'
// 添加监控量弹窗
import EDeviceAddMetekind from '@/components/e-device-add-metekind'

// 更新协议  根据设备模板 选择对应的设备
import ESelectDeviceTree from '@/components/e-select-device-tree'

import { getInfo } from '@/api/advanced'

export default {
  name: 'edevicetemplate',
  props: {
    deviceModel: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    }
  },
  components: {
    ETabs, EImportDoc, EDeviceAddMetekind, ESelectDeviceTree
  },
  data() {
    return {
      isShowImportDialog: false,
      isShowAddDialog: false,
      isShowDialog: false,

      // 当前tabs选择的
      currentKey: 'AI',
      currentTitle: '添加监控量遥测AI',

      // 当前模板是否已经导入协议
      isEnabled: false
    }
  },
  mounted() {
    // 注册 获取currentKey的事件
    const me = this
    me.$bus.$on('get-current-tabs-key', (currentKey) => {
      console.log('My event has been triggered', currentKey)
      me.currentKey = currentKey
      const map = {
        "AI": '遥测AI',
        "DI": '遥信DI',
        "AO": '遥调AO',
        "DO": '遥控DO',
        "CF": '配置CF'
      }
      me.currentTitle = '添加监控量' + map[me.currentKey]
    })

    // 判断该模板是否已经导协议
    // if()
    // getInfo

    // 注册事件 获取当前模板是否已经导入协议
    me.$bus.$on('get-is-can-use-protocol', (isEnabled) => {
      console.log('get-is-can-use-protocol', isEnabled)
      me.isEnabled = isEnabled
    })
  },
  methods: {
    importDoc() {
      this.isShowImportDialog = !this.isShowImportDialog
    },
    delDoc() {

    },
    updateDoc() {
      this.isShowDialog = true
    },
    getData(data) {
      console.log(data)
    },
    cancelSave() {
      // 取消保存
      this.isShowImportDialog = false
    },
    // 添加系统监控量
    addDeviceMeteKind() {
      this.isShowAddDialog = true
    }
  }
}
</script>
<style lang="scss" scoped>
.edevicetemplate{

}
</style>
