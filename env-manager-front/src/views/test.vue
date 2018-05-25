<template>
  <div class="test">
      模板
      <!-- <e-tree :data="tree" @node-click="hanldeNodeClick"></e-tree> -->
    <!-- <el-dialog title="导入协议文档" :visible.sync="isShowImportDialog" width="100%">
        <e-import-doc :device-model="deviceModel"></e-import-doc>
    </el-dialog> -->



    

  </div>
</template>

<script>
// import ETree from '@/components/e-tree';
// import EImportDoc from '@/components/e-import-doc';
// import { mapGetters } from 'vuex';

const t = {
  deviceKind: 1,
  deviceKindName: "动力设备",
  deviceModel: 9,
  deviceType: 6,
  deviceTypeName: "动力设备A",
  manufacturerId: 1,
  manufacturerName: "量子弱磁场共振分析仪",
  modelName: "11",
  modelNameEn: "111",
  name: "11",
  type: "devicemodel"
}
export default {
  name: 'test',
  components: {
    ETree, EImportDoc
  },
  data() {
    return {
      content: 'AAAA',
      tree: {},
      isShowImportDialog: true,
      deviceModel: t

    }
  },
  methods: {
    hanldeNodeClick(data) {
      this.content = data.name
    }
  }
}
</script>
<style lang="scss" scoped>
.test{

}
</style>
