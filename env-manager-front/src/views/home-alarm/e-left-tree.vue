<template>
<div class="e-left-tree">
    <div class="e-left-tree__wrapper">
        <div class="e-left-tree__tools">
            <div class="e-left-tree__title">告警</div>
            <div class="e-left-tree__right">
                <i class="el-icon-plus e-size-16" title="添加自定义告警视图" @click="addItem"></i>
                <i class="el-icon-edit e-size-16" title="修改视图" @click="editItem" v-show="currentData != null && currentData.id > 0"></i>
                <i class="el-icon-delete e-size-16" title="删除视图" @click="deleteItem" v-show="currentData != null  && currentData.id > 0"></i>
            </div>
        </div>
      <!-- :render-content="nodeRender" -->
        
    <el-tree
      ref="eLeftTree"
      :data="treeData"
      :props="myOptions.defaultProps"
      node-key="id"
      :highlight-current="true"
      @node-click="handleNodeClick"
      :render-content="nodeRender"
      class="e-left-tree">
    </el-tree>
  </div>
</div>

</template>


<script>
import { getInfo } from "@/api/advanced"
import { mapGetters } from 'vuex'

export default {
  name: "elefttree",
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
    me.$bus.$on('update-e-left-tree-refresh-data', () => {
      me.getList()
    })
    me.getList()
  },
  methods: {
    getList() {
      const me = this
      getInfo("/cfguseralarmfilter/listBy?tenantId=" + me.tenantId)
        .then(response => {
          const { success, data, msg } = response.data
          if (success) {
            const handerData = data.map((item, index) => {
              item.id = index + 1
              return item
            })

            me.treeData = [
              {
                id: -1,
                name: '告警视图',
                type: 'level1',
                children: handerData
              }, {
                id: -2,
                name: '历史告警查询',
                type: 'level1',
                children: [
                  {
                    id: -3,
                    name: '24h小时'
                  }, {
                    id: -4,
                    name: '最近三天'
                  }, {
                    id: -5,
                    name: '最近一周'
                  }, {
                    id: -6,
                    name: '最近三周'
                  }, {
                    id: -7,
                    name: '最近一个月'
                  }, {
                    id: -8,
                    name: '最近三个月'
                  }, {
                    id: -9,
                    name: '自定义'
                  }
                ]
              }

            ]
          } else {
            me.$message.error(msg)
          }
        })
        .catch(err => {
          me.$message.error("网络错误")
        })
    },
    addItem() {
      const me = this
      me.$emit('add-view', me.currentData)
    },
    deleteItem() {
      const me = this
      if (!me.currentData) {
        return
      }
      me.$emit('delete-view', me.currentData)
    },
    editItem() {
      const me = this
      if (!me.currentData) {
        return
      }
      if (me.currentData.id < 0) {
        return
      }
      me.$emit('edit-view', me.currentData)
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
      console.log(h, _self, node, data)

      const childrenNodes = [
        h("icon-svg", {
          props: { iconClass: 'page' }
        }),
        h("span", data.name),
        h(
          "span", {
            class: "e-tree-bar"
          })
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
.e-left-tree{
    color: white;
}

.e-left-tree__tools{
    height: 40px;
    padding-left: 20px;
    line-height: 40px;
}
.e-left-tree__title{
  display: inline;
}

.e-size-16{
    font-size: 18px;
}

.e-left-tree__right{
    float: right;
}

.e-left-tree__wrapper {
  min-width: 240px;
  text-align: left;
}
.e-left-tree__top {
  padding: 10px;
  text-align: right;
  /* border-bottom: 1px solid #ddd;4 */
}
.el-tree-node {
  position: relative;
}
.el-tree-node__content:hover .e-left-tree-bar {
  display: block;
}

.e-left-tree .el-tree{
    background: transparent;
    color: white;
}



</style>