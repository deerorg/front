<template>
  <div class="echoosedialog">
      <el-input placeholder="请输入视图名称" v-model="control.name" v-show="control.type=='add'"></el-input>
      <el-input placeholder="请输入视图名称" v-model="control.name" v-show="control.type=='edit'" readonly ></el-input>
      <section class="echoosedialog__flex">
          <section  class="echoosedialog__left">
              <!-- 添加站点 -->
            <e-select-site-gateway-tree  :control="treeControl" @get-choose-nodes="getChooseNodes"  v-if="control.type=='add'"></e-select-site-gateway-tree>
            <!-- 勾选的站点 -->
            <e-select-site-tree @get-choose-nodes="getChooseNodes" v-if="control.type=='edit'" :choose-sites="control.chooseData.siteIds"></e-select-site-tree>

          </section>
          <section  class="echoosedialog__right">
            <e-choose-metekind @get-choose-tree-nodes="getChooseTreeNodes"  @get-choose-levels="getChooseLevels"  v-if="control.type=='add'"></e-choose-metekind >
            <e-choose-metekind   :control="control"  @get-choose-tree-nodes="getChooseTreeNodes"  @get-choose-levels="getChooseLevels"  v-if="control.type=='edit'"></e-choose-metekind >
          </section>
      </section>

      <section class="echoosedialog__bottom">
          <el-button @click="save2View">保存</el-button>
          <el-button @click="hideDiaglog">取消</el-button>
      </section>



  </div>
</template>

<script>
import ESelectSiteGatewayTree from '@/components/e-select-site-gateway-tree'
import ESelectSiteTree from './e-select-site-tree'
import EChooseMetekind from './e-choose-metekind'
import { mapGetters } from 'vuex'

import { postItem, putItem } from '@/api/advanced'
export default {
  name: 'echoosedialog',
  components: {
    ESelectSiteGatewayTree, EChooseMetekind, ESelectSiteTree
  },
  computed: {
    ...mapGetters(['tenantId', 'tenantName'])
  },
  props: {
    control: {
      type: Object,
      default() {
        return {
          type: 'add',
          viewName: ''
        }
      }
    }
  },
  data() {
    return {
      treeControl: {
        isShowGateway: false,
        isShowOpt: false
      },
      // 当前选择的站点IDs
      currentChooseSiteIds: [],
      // 当前选择的meteKind
      currentChooseMetekinds: []

    }
  },
  mounted() {
    const me = this
    if (me.control.type == 'edit') {
      me.currentChooseSiteIds = me.control.chooseData.siteIds
      me.currentChooseLevels = me.control.chooseData.reportLevels
    }
  },
  methods: {
    getChooseNodes(siteList) {
      const me = this
      console.log(siteList)
      me.currentChooseSiteIds = siteList.map(x => x.siteId)
      // 当前 siteList
    },

    getChooseTreeNodes(chooseMeteKind) {
      const me = this
      console.log(chooseMeteKind)
      me.currentChooseMetekinds = chooseMeteKind
    },

    getChooseLevels(levels) {
      const me = this
      me.currentChooseLevels = levels
    },
    handerMetekinds() {
      const me = this
      const arr = []
      if (me.currentChooseMetekinds == null || me.currentChooseMetekinds.length <= 0) {
        if (me.control.type == 'add') {
          return []
        } else {
          return me.control.chooseData.deviceMeteTypes
        }
      }
      const list = me.currentChooseMetekinds.map(x => {
        const item = {
          deviceType: x.deviceType,
          meteTypes: me.currentChooseMetekinds.filter(y => y.deviceType == x.deviceType).map(x => x.meteType)
        }
        return item
      })

      const deviceTypeArr = []

      for (let i = 0, len = list.length; i < len; i++) {
        const item = list[i]
        if (!deviceTypeArr.includes(item.deviceType)) {
          deviceTypeArr.push(item.deviceType)
          arr.push(item)
        }
      }
      return arr
    },

    // 保存视图
    save2View() {
      const me = this
      let item = {}
      if (me.control.type == 'add') {
        if (!me.control.name) {
          me.$message.info("请输入视图名称")
          return
        }
        if (me.currentChooseSiteIds.length <= 0) {
          me.$message.info("请选择站点")
          return
        }
        if (me.currentChooseLevels.length <= 0) {
          me.$message.info("请选择告警级别")
          return
        }

        if (me.currentChooseMetekinds.length <= 0 || me.handerMetekinds().length <= 0) {
          me.$message.info("请选择监控量")
          return
        }

        // 添加的条目
        item = {
          "deviceMeteTypes": me.handerMetekinds(),
          "name": me.control.name,
          "reportLevels": me.currentChooseLevels,
          "roleId": "0",
          "siteIds": me.currentChooseSiteIds,
          "tenantId": me.tenantId
        }
      } else {
        item = {
          "deviceMeteTypes": me.handerMetekinds(),
          "name": me.control.name,
          "reportLevels": me.currentChooseLevels,
          "roleId": "0",
          "siteIds": me.currentChooseSiteIds,
          "tenantId": me.tenantId
        }
      }

      const url = me.control.type == 'add' ? `/cfguseralarmfilter/add` : `/cfguseralarmfilter/update`
      const type = me.control.type == 'add' ? postItem : putItem
      type(url, item).then(resp => {
        const { success, msg, data } = resp.data
        if (success) {
          const message = me.control.type == 'add' ? '添加成功' : '修改成功'
          me.$message.success(message)
          // 刷新左边tree数据
          me.$bus.$emit('update-e-left-tree-refresh-data')
          // 关闭弹出窗
          if (me.control.type == 'add') {
            me.$bus.$emit('update-show-add-view', false)
          } else {
            me.$bus.$emit('update-show-edit-view', false)
          }
        } else {
          me.$message.error(msg)
        }
        console.log(data)
      })
    },
    // 取消
    hideDiaglog() {
      const me = this
      // 关闭弹出窗
      if (me.control.type == 'add') {
        me.$bus.$emit('update-show-add-view', false)
      } else {
        me.$bus.$emit('update-show-edit-view', false)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.echoosedialog{
    &__flex{
        display: flex;
        max-height: 500px;
    }
    &__left{
        width: 300px;

    }
    &__right{
         width: 210px;
    }
    &__bottom{
        width: 100%;
        padding: 20px ;
        text-align: center;
    }

}
</style>
