<template>
<div class="e-menu-tree">
    <div class="e-info-tree">
        <el-tree
            ref="eMenuTree"
            :data="treeData"
            :props="defaultProps"
            :expand-on-click-node="true"
            :indent = "8"
            node-key = "id"
            :default-checked-keys="defaultCheckedIds"
            :show-checkbox="control.showCheckbox"
            :check-strictly="control.showCheckbox"
            :default-expand-all="true"
            :highlight-current="true"
            @check-change = "onCheckChange"	
            @node-click="handleNodeClick"
            class="e-info-tree__left">
        </el-tree>

        <section class="e-info-tree__right" v-show="control.showRight">
               <el-form ref="addForm" label-position="left"  label-width="200px"  :model="addForm" v-show="isShow">
                   <el-form-item label="类型" prop="type" >
                        <el-radio-group v-model="addForm.type">
                            <el-radio :label="1">编辑菜单</el-radio>
                            <el-radio :label="2">添加子菜单</el-radio>
                        </el-radio-group>
                   </el-form-item>
                <el-form-item label="菜单名称" prop="name" v-show="addForm.type==1" >
                    <el-input v-model="addForm.menuName"></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="nameEn"  v-show="addForm.type==1" >
                    <el-input v-model="addForm.menuPath"></el-input>
                </el-form-item>
                 <el-form-item label="子菜单名称" v-show="addForm.type==2">
                    <el-input v-model="addForm.subMenuName"></el-input>
                </el-form-item>
                <el-form-item label="地址" v-show="addForm.type==2" >
                    <el-input v-model="addForm.subMenuPath"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="addForm.remarks"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="confirmAdd">保存</el-button>
                    <el-button  @click="confirmDeleteMenu">删除菜单</el-button>
                </el-form-item>
            </el-form> 
        </section>
    </div>
</div>

</template>


<script>
import {
  getInfo,
  postItem
} from "@/api/advanced"
import { mapGetters } from "vuex"

export default {
  name: "EMenuTree",
  computed: {
    ...mapGetters(["userId", "tenantId", "tenantName"])
  },
  props: {
    control: {
      type: Object,
      default: function() {
        return {
          showCheckbox: false,
          showRight: true
        }
      }
    },
    roleId: {
      type: Number | String
    }

  },
  data() {
    // 声明保存当前操作分类node对象
    this.__currentNode = null
    return {
      currentChooseNode: null,
      currentSelf: null,
      currentData: null,
      treeData: [],
      // 当前的选择的菜单
      defaultCheckedIds: [],

      isShow: false,
      // 是否可以发送请求 1s之内不能发送请求
      isSendCheckedRequest: false,
      addForm: {
        type: 1,
        remarks: ''
      },
      // 默认tree-node的字段名
      defaultProps: {
        children: "children",
        label: "name"
      }
    }
  },

  mounted() {
    const me = this
    if (me.control.showCheckbox) {
      getInfo('/menu/role-id-menu?roleId=' + me.roleId).then(response => {
        const { success, data, msg } = response.data
        if (success) {
          me.defaultCheckedIds = data.map(x => x.id)
        } else {
          me.$message.error(msg)
        }
      })
    }

    me.getTree()
  },
  methods: {
    getTree() {
      const me = this
      getInfo('/menu/tree').then(response => {
        const { success, data, msg } = response.data
        if (success) {
          if (typeof data === 'string') {
            me.treeData = JSON.parse(data)
            if (me.control.showCheckbox) {
              me.isSendCheckedRequest = false
              setTimeout(function() {
                // debugger;
                me.$refs.eMenuTree.setCheckedKeys(me.defaultCheckedIds)
                me.isSendCheckedRequest = true
              }, 1000)
            }

            // me.$nextTick(function(){
            //     me.$refs.eMenuTree.setCheckedKeys(me.defaultCheckedIds);
            // })
          }
        } else {
          me.$message.error(msg)
        }
      })
    },
    confirmDeleteMenu() {
      const me = this
      postItem('/menu/del?id=' + me.currentData.id, { id: me.currentData.id }).then(response => {
        const { success, data, msg } = response.data
        if (success) {
          me.getTree()
          me.$message.success("编辑菜单成功")
        } else {
          me.$message.error(msg)
        }
      })
    },
    onCheckChange(data, nodeselfCheck, subNodeCheck) {
      const me = this
      // console.log(data, nodeselfCheck, subNodeCheck);
      // 当前ID 选中或没有选中
      const url = nodeselfCheck ? '/menu-role/allocate' : '/menu-role/cancel'

      // // 屏蔽掉首次勾选的请求

      if (!me.isSendCheckedRequest) {
        return
      }
      const item = {
        roleId: me.roleId,
        menuIds: [data.id]
      }
      postItem(url, item).then(response => {
        const { success, data, msg } = response.data
        if (success) {
          if (nodeselfCheck) {
            me.$message.success("分配菜单成功")
          } else {
            me.$message.success("取消分配成功")
          }
        } else {
          me.$message.error(msg)
        }
      })
    },
    confirmAdd() {
      const me = this
      // 编辑
      if (me.addForm.type == 1) {
        const editItem = {
          name: me.addForm.menuName,
          url: me.addForm.menuPath,
          remarks: me.addForm.remarks,
          type: 1,
          id: me.addForm.id,
          pid: me.addForm.pid
        }
        postItem('/menu/edit', editItem).then(response => {
          const { success, data, msg } = response.data
          if (success) {
            me.getTree()
            me.$message.success("编辑菜单成功")
          } else {
            me.$message.error(msg)
          }
        })
      } else {
        const addItem = {
          name: me.addForm.subMenuName,
          url: me.addForm.subMenuPath,
          remarks: me.addForm.remarks,
          type: 1,
          pid: me.addForm.id
        }
        postItem('/menu/add', addItem).then(response => {
          const { success, data, msg } = response.data
          if (success) {
            me.getTree()
            me.$message.success("添加子菜单成功")
          } else {
            me.$message.error(msg)
          }
        })
      }
      me.isShow = false
      // todo
    },
    /* 点击响应时间 */
    handleNodeClick(item, node, self) {
      const me = this
      //
      me.currentData = item
      me.currentChooseNode = node
      me.currentSelf = self
      me.isShow = true

      me.addForm = {
        type: 1,
        id: item.id,
        menuName: item.name,
        menuPath: item.url,
        subMenuName: '',
        subMenuPath: '',
        remarks: '',
        pid: item.pid
      }

      me.$emit("node-click", item, node, self)
    }

  }
}
</script>

<style scoped>
.e-info-tree{
    display: flex;
    overflow: hidden;
}

.e-info-tree__left{
    width:400px;
    max-width: 400px; 
}

.e-info-tree__right{
    flex: 1;

}

.e-menu-tree__wrapper {
  min-width: 180px;
  max-width: 240px;
  text-align: left;
}
.e-menu-tree__top {
  padding: 10px;
  text-align: right;
}
.el-tree-node {
  position: relative;
}
.el-tree-node__content:hover .e-menu-tree-bar {
  display: block;
}
.e-menu-tree-bar {
  display: none;
  position: absolute;
  top: 0;
  right: 10px;
  font-size: 12px;
}
.e-menu-tree-bar > i {
  margin: 0 5px;
  color: #999;
}
.e-menu-tree-bar > i:hover {
  color: #20a0ff;
}

.e-site-info-wrapper {
  height: 100%;
  width: 100%;
  overflow: auto;
  display: flex;
}

.e-site-info-wrapper .info-tree {
  width: 300px;
  max-width: 400px;
  /* border:1px solid red; */
  height: 100%;
}
.e-site-info-wrapper .detail {
  flex: 1;
  border: 1px solid green;
  height: 100%;
}

.e-menu-tree .el-tree {
  color: #fff;
  background: transparent;
}
</style>