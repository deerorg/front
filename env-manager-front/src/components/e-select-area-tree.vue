<template>
<div class="e-select-area-tree">
    <div class="e-select-area-tree__wrapper">
        <div class="e-select-area-tree__tools">
            <el-button @click="confirmCopy" >确认拷贝</el-button>
        </div>
    <div class="e-select-area-tree__top" v-show="false">
        <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText">
        </el-input>

    </div>
    <el-tree
      ref="eSelectAreaTree"
       show-checkbox
      :data="treeData"
      :props="myOptions.defaultProps"
      :expand-on-click-node="false"
      lazy
      :accordion="true"
      :auto-expand-parent="false"
      :indent="8"
      node-key="id"
      :check-strictly="true"
      :default-expand-all="true"
      :highlight-current="true"
      :load="loadTreeNode"
      @node-click="handleNodeClick"
      :render-content="nodeRender"
      class="e-select-area-tree">
    </el-tree>
  </div>
</div>

</template>


<script>
import { getInfo, addItem, deleteItem, modifyGetItem, postItem } from "@/api/advanced"
import { mapGetters } from 'vuex'

export default {
  name: "e-select-area-tree",
  props: {
    myOptions: {
      type: Object,
      default() {
        return {
          // 默认tree-node的字段名
          defaultProps: {
            children: "children",
            label: "name",
            isLeaf: "leaf"
          }
        }
      }
    },
    // 当前需要拷贝的站点星星
    site: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters(['tenantId', 'tenantName'])
  },
  data() {
    // 声明保存当前操作分类node对象
    this.__currentNode = null
    return {
      currentChooseNode: null,
      currentSelf: null,
      currentData: null,
      treeData: [],
      isShowModifyDialog: false,
      isShowAddDialog: false,
      filterText: '',
      // 默认是false
      isExpandAll: true
    }
  },
  mounted() {
    const me = this
  },
  methods: {
    /* 加载子分类 */
    loadTreeNode(treeItem, resolve) {
      // const url = this.data.url.R
      const me = this
      if (treeItem.level === 0) {
        return resolve([{ name: me.tenantName, id: 0, disabled: true }])
      }
      if (treeItem.level === 1) {
        // 获取该租户下的所有顶级区域
        getInfo(
          `/precinct/current/query?tenantId=${me.tenantId}&precinctId=0`
        ).then(data => {
          const child = data.data.data.map(x => {
            x.name = x.precinctName
            return x
          })
          console.log(child)
          resolve(child)
        })
      } else {
        if (treeItem.data.roomId) {
          // getInfo(
          //     `/room/current?tenantId=${me.tenantId}&floorId=${treeItem.data
          //       .roomId}`
          //   ).then(data => {
          //
          //     let child = data.data.data.map(x => {
          //       x.name = x.roomName;
          //       // x.name = x.buildingName;
          //       return x;
          //     });
          //     console.log(child);
          //     resolve(child);
          //   });
          resolve([])
        } else if (treeItem.data.floorId) {
          getInfo(
            `/floor/current?tenantId=${me.tenantId}&floorId=${treeItem.data
              .floorId}`
          ).then(data => {
            const child = data.data.data.map(x => {
              x.name = x.roomName

              return x
            })
            console.log(child)
            resolve(child)
          })
        } else if (treeItem.data.buildingId) {
          getInfo(
            `/building/current?tenantId=${me.tenantId}&buildingId=${treeItem
              .data.buildingId}`
          ).then(data => {
            const child = data.data.data.map(x => {
              x.name = x.buildingName || x.floorName
              // 禁用选楼栋
              x.disabled = true
              // x.name = x.buildingName;
              return x
            })
            console.log(child)
            resolve(child)
          })
        } else if (treeItem.data.precinctId) {
          getInfo(
            `/precinct/current/query?tenantId=${me.tenantId}&precinctId=${treeItem
              .data.precinctId}`
          ).then(data => {
            const child = data.data.data.map(x => {
              if (x.buildingId) {
                x.disabled = true
              }
              x.name = x.precinctName || x.buildingName
              return x
            })
            console.log(child)
            resolve(child)
          })
        } else {
          return resolve([])
        }
        me.$forceUpdate()
      }
      return resolve([])
    },

    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },

    /* 点击响应时间 */
    handleNodeClick(item, node, self) {
      const me = this
      //
      me.currentData = item
      me.currentChooseNode = node
      me.currentSelf = self

      // 删除
      // temp1.node.parent.removeChild(temp1.node)
      me.$emit("node-click", item, node, self)
    },
    /* 构建分类title及工具 */
    nodeRender(h, { _self, node, data }) {
      // @todo: 使用jsx插件更好理解

      const type = ["precinct", "building", "floor", "room"]
      if (data.roomId) {
        data.type = "room"
      } else if (data.floorId) {
        data.type = "floor"
      } else if (data.buildingId) {
        data.type = "building"
      } else if (data.precinctId) {
        data.type = "precinct"
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
                class: "e-select-area-tree-bar"
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
    },

    // 确认拷贝站点
    confirmCopy() {
      const me = this
      const chooseNodes = me.$refs.eSelectAreaTree.getCheckedNodes(false)
      if (chooseNodes.length <= 0) {
        me.$message.info("请选择至少一个区域或楼室")
        return
      }
      const currentCopySite = me.site
      const siteInfo = {
        areaInfos: chooseNodes.map(x => {
          let item = {}
          if (x.type == "precinct") {
            item = {
              precinctId: x.precinctId,
              roomId: 0,
              buildingId: 0,
              floorId: 0
            }
          } else {
            item = {
              roomId: x.roomId,
              precinctId: -1,
              buildingId: 0,
              floorId: 0
            }
          }

          return item
        }),
        siteId: me.site.siteId
      }
      postItem('/cfgsite/copysite', siteInfo).then(response => {
        const { success, data, msg } = response.data
        if (success) {
          me.$message.success("复制成功")
          //  刷新数据
        } else {
          me.$message.error(msg)
        }
      })
      areaInfos
    }
  }
}
</script>

<style scoped>
.e-select-area-tree__wrapper {
  min-width: 300px;
  text-align: left;
}
.e-select-area-tree__top {
  padding: 10px;
  text-align: right;
  /* border-bottom: 1px solid #ddd;4 */
}
.el-tree-node {
  position: relative;
}
.el-tree-node__content:hover .e-select-area-tree-bar {
  display: block;
}
.e-select-area-tree-bar {
  display: none;
  position: absolute;
  top: 0;
  right: 10px;
  font-size: 12px;
}
.e-select-area-tree-bar > i {
  margin: 0 5px;
  color: #999;
}
.e-select-area-tree-bar > i:hover {
  color: #20a0ff;
}



</style>