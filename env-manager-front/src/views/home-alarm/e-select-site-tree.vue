<template>
<div class="e-select-site-tree">
    <div class="e-select-site-tree__wrapper">
    <div class="e-site-info-wrapper">
    <div class="info-tree">
        <el-tree
            ref="eSelectSiteGatewayTree"
            :data="treeData"
            show-checkbox
            :props="defaultProps"
            :expand-on-click-node="true"
            lazy
            :default-expand-all="true"
            :highlight-current="true"
            :load = "loadTreeNode"
            node-key="id"
            :default-checked-keys="chooseSites"
            @check-change="currentChange"
            @node-click="handleNodeClick"
            :render-content="nodeRender"
            class="e-select-site-tree">
        </el-tree>
    </div>
    </div> 
  </div>
</div>

</template>


<script>
import { getInfo, postItem } from "@/api/advanced"
import { mapGetters } from 'vuex'

export default {
  name: "eselectsitetree",
  computed: {
    ...mapGetters(['tenantId', 'tenantName'])
  },
  props: {
    chooseSites: {
      type: Array,
      default() {
        return [1]
      }
    }
  },
  data() {
    // 声明保存当前操作分类node对象
    this.__currentNode = null
    return {
      defaultProps: {
        children: "children",
        label: "name"
      },
      currentChooseNode: null,
      currentSelf: null,
      currentData: null,
      treeData: []

    }
  },

  mounted() {
    const me = this
  },

  methods: {
    /* 加载子分类 */
    loadTreeNode(treeItem, resolve) {
      const me = this
      if (treeItem.level === 0) {
        return resolve([{ name: me.tenantName, id: 0 }])
      }
      if (treeItem.level === 1) {
        // 获取该租户下的所有站点
        getInfo(`/cfgsite/queryby?tenantId=${me.tenantId}`).then(data => {
          const child = data.data.data.map(x => {
            x.name = `${x.siteName}[${x.siteId}]-- ${x.precinctName}`
            x.id = x.siteId
            return x
          })
          resolve(child)
        })
      } else {
        resolve([])
      }
      return resolve([])
    },

    currentChange(data, Node) {
      const me = this
      const currentChooseData = me.$refs.eSelectSiteGatewayTree.getCheckedNodes(true)
      me.$emit('get-choose-nodes', currentChooseData)
    },

    /* 点击响应时间 */
    handleNodeClick(item, node, self) {
      const me = this
      me.currentData = item
      me.currentChooseNode = node
      me.currentSelf = self
      // temp1.node.parent.removeChild(temp1.node)
      me.$emit("node-click", item, node, self)
      const currentChooseData = me.$refs.eSelectSiteGatewayTree.getCheckedNodes(true)
      me.$emit("get-choose-nodes", currentChooseData)
    },
    /* 构建分类title及工具 */
    nodeRender(h, { _self, node, data }) {
      // @todo: 使用jsx插件更好理解
      const type = ["precinct", "building", "floor", "room", "site", "device", "fsu"]
      if (data.fsuId == 0 && data.deviceId) {
        data.type = "fsu"
      } else if (data.deviceId && data.fsuId != 0) {
        data.type = "device"
      } else if (data.siteId) {
        data.type = "site"
      } else {
        data.type = "root"
      }
      const childrenNodes =
        data.id === 0
          ? [h("span", data.name)]
          : [
            h("i", {
              staticClass: 'p-tree-icon',
              class: data.type
            }),
            h("span", data.name),
            h(
              "span",
              {
                class: "e-select-site-tree-bar"
              }
            )
          ]
      return h(
        "div",
        {
          class: "el-tree-node__label",
          prop: {
            children: "-"
          }
        },
        childrenNodes
      )
    }

  }
}
</script>

<style scoped>
.e-select-site-tree__wrapper {
  min-width: 400px;
  text-align: left;
}
.e-select-site-tree__top {
  padding: 10px;
  /* text-align: right; */
  /* border-bottom: 1px solid #ddd; */
}
.el-tree-node {
  position: relative;
}
.el-tree-node__content:hover .e-select-site-tree-bar {
  display: block;
}
.e-select-site-tree-bar {
  display: none;
  position: absolute;
  top: 0;
  right: 10px;
  font-size: 12px;
}
.e-select-site-tree-bar > i {
  margin: 0 5px;
  color: #999;
}
.e-select-site-tree-bar > i:hover {
  color: #20a0ff;
}

.e-site-info-wrapper{
    height: 100%;
    width: 100%;
    overflow: auto;
    display: flex;
}

.e-site-info-wrapper .info-tree{
    width: 400px;
    max-width: 400px;
    /* border:1px solid red; */
    height: 100%;
    
}
.e-site-info-wrapper .info-detail{
    flex: 1;
    /* border:1px solid green; */
    height: 100%;
}

.e-select-site-tree .el-tree{
    color:#fff;
    background: transparent;
}


</style>