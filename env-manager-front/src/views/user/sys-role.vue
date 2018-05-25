<template>
    <div class="sysrole">
    <div class="sysrole__filter-container p-filter-container">
        <span class="p-table-name">角色列表</span>
        <input placeholder="请输入内容" v-model="searchName"  class="p-input">
        <span class="p-add-btn" @click="add">
            ✚  添加
        </span>
    </div>


    <section class="sysrole__table">
        <el-table element-loading-text="拼命加载中" empty-text="暂无数据"
        :data="list" stripe
        border fit highlight-current-row>
        <el-table-column
        label="角色编号" align="center" width="100">
        <template slot-scope="scope" >
            <span>{{ scope.row.id }}</span>
        </template>
        </el-table-column>
        <el-table-column
        label="角色名称" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.roleName }}</span>
        </template>
        </el-table-column>
        <el-table-column
        label="备注" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.remarks }}</span>
        </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
        <template slot-scope="scope">
            <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" @click="handleMenuEdit(scope.$index, scope.row)">分配菜单</el-button> 
            <!-- <el-button size="mini" @click="handleLookEdit(scope.$index, scope.row)">分配菜单</el-button>  -->
            <el-button size="mini" @click="handleDataMenuEdit(scope.$index, scope.row)">分配数据</el-button>                     
            <el-button size="mini" @click="handleLookMenuEdit(scope.$index, scope.row)">查看数据</el-button> 
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
        </el-table-column>
    </el-table>
    </section>

    <section class="">
        <el-dialog title="管理角色功能菜单" :visible.sync="isShowTree" width="70%">
            <el-form label-position="left"  label-width="200px"  :inline="true">
                <el-form-item label="当前角色">
                    <el-input v-model="currentRole.roleName" readonly disabled></el-input>
                </el-form-item>
                 <el-form-item v-show="false">
                    <el-button>确认分配</el-button>
                </el-form-item>
            </el-form>
            <e-menu-tree :control="myControl" v-if="isShowTree" :role-id="currentRole.id"></e-menu-tree>
        </el-dialog>
    </section>


    <section class="">
         <el-dialog title="查看角色数据" :visible.sync="isShowDataTree" width="70%">
                   <el-form label-position="left"  label-width="200px"  >
                    <el-form-item label="当前角色">
                        <el-input v-model="currentRole.roleName" readonly disabled></el-input>
                    </el-form-item>
                </el-form>
                <e-api-data-table type="ROLE" :role="currentRole" v-if="isShowDataTree"></e-api-data-table>
         </el-dialog>
    </section>


   <section class="">
         <el-dialog title="管理角色数据" :visible.sync="isShowDataManagerTable" width="85%" :lock-scroll="false">
            <el-form label-position="left"  label-width="200px" :inline="true">
                <el-form-item label="当前角色">
                    <el-input v-model="currentRole.roleName" readonly disabled></el-input>
                </el-form-item>
            </el-form>
            <e-api-data-table type="ALL" :role="currentRole" v-if="isShowDataManagerTable"></e-api-data-table>
         </el-dialog>
    </section>



    <!--  修改记录 -->
    <section class="layer__dialog">
        <el-dialog title="修改角色信息" :visible.sync="isShowEditDialog">
            <el-form ref="modifyForm" label-position="left"  label-width="200px"  :model="modifyForm" :rules="modifyFormRules">
                <el-form-item label="编号" prop="id">
                    <el-input v-model="modifyForm.id" readonly disabled></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="roleName" >
                    <el-input v-model="modifyForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remarks" >
                    <el-input v-model="modifyForm.remarks"></el-input>
                </el-form-item>
                <el-row type="flex" >
                    <el-col class="p-oneline">
                        <el-button @click="isShowEditDialog=false" class="p-cancle-btn">取消</el-button>
                        <el-button type="primary" @click="confirmModify" class="p-save-btn">保存</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>

    </section>


      <!--  新增 记录 -->
    <section class="layer__dialog">
        <el-dialog title="添加角色信息" :visible.sync="isShowAddDialog">
            <el-form ref="addForm" label-width="200px" label-position="left"   :model="addForm" :rules="rules">
                <el-form-item label="名称" prop="roleName" >
                    <el-input v-model="addForm.roleName" placeholder="请输入角色名称"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remarks" >
                    <el-input v-model="addForm.remarks" placeholder="说点什么"></el-input>
                </el-form-item>
                <el-row type="flex" >
                    <el-col class="p-oneline">
                        <el-button @click="isShowAddDialog=false" class="p-cancle-btn">取消</el-button>
                        <el-button type="primary" @click="confirmAdd" class="p-save-btn">保存</el-button>
                    </el-col>
                </el-row>

            </el-form>
        </el-dialog>
    </section>

    </div>
</template>

<script>
import { getAll, postItem, deleteItem, modifyItem, getInfo } from "@/api/advanced"

import EMenuTree from '@/components/e-menu-tree'
import EApiDataTable from '@/components/e-api-data-table'

const ADD_INIT_FROM = {
  roleName: "",
  remarks: ""
}
export default {
  name: "sysrole",
  components: {
    EMenuTree, EApiDataTable
  },
  data() {
    return {
      rawList: [],
      list: [],
      searchName: "",
      isShowAddDialog: false,
      isShowEditDialog: false,
      isShowTree: false,

      isShowDataTree: false,
      isShowDataManagerTable: false,
      myControl: {
        showCheckbox: true,
        showRight: false
      },
      currentRole: {},
      modifyForm: {},
      addForm: ADD_INIT_FROM,
      modifyFormRules: {
        roleName: [{ required: true, message: "角色名称", trigger: "blur" }]
      },
      rules: {
        roleName: [
          { required: true, message: "角色名称", trigger: "blur" },
          { min: 1, message: "长度在 1 字符以上", trigger: "blur" },
          { max: 20, message: "长度在 20 字符以内", trigger: "blur" }
        ]
      }
    }
  },
  watch: {
    searchName: function(val, oldVal) {
      if (val) {
        this.list = this.rawList.filter(
          x => x.roleName.indexOf(val) > -1 || x.roleName.indexOf(val) > -1
        )
      } else {
        this.list = this.rawList
      }
    }
  },

  mounted() {
    const me = this
    me.getList()
  },
  methods: {
    getList() {
      const me = this
      getInfo("/role/all")
        .then(response => {
          const { success, data, msg } = response.data
          if (success) {
            me.list = data
            me.rawList = data
            // 获取数据
          } else {
            me.$message.error(msg)
          }
        })
        .catch(err => {
          me.$message.error("网络错误")
        })
    },

    handleEdit(index, row) {
      const me = this
      const backdata = JSON.parse(JSON.stringify(row))
      me.modifyForm = backdata
      me.isShowEditDialog = true
    },
    handleMenuEdit(index, row) {
      const me = this
      me.isShowTree = true
      me.currentRole = row
    },
    handleDataMenuEdit(index, row) {
      const me = this
      me.currentRole = row
      me.isShowDataManagerTable = true
    },

    handleLookMenuEdit(index, row) {
      const me = this
      me.currentRole = row
      me.isShowDataTree = true
    },
    handleDelete(index, row) {
      const me = this
      getInfo("/role/del?id=" + row.id, { id: row.id }).then(response => {
        const { success, data, msg } = response.data
        if (success) {
          me.$message.success("删除成功")
          me.getList()
        } else {
          me.$message.error(msg)
        }
      })
      console.log(index, row)
    },
    // 添加记录
    add() {
      this.addForm = JSON.parse(JSON.stringify(ADD_INIT_FROM))
      this.isShowAddDialog = true
    },
    confirmModify() {
      const me = this
      me.$refs.modifyForm.validate(valid => {
        if (valid) {
          postItem('/role/edit', me.modifyForm)
            .then(response => {
              const { success, data, msg } = response.data
              me.isShowEditDialog = false
              if (success) {
                me.$message.success("修改成功")
                me.getList()
              } else {
                me.$message.error(msg)
              }
            })
            .catch(err => {
              me.$message.error("网络错误")
            })
        } else {
          me.$message.error("请提交正确的数据")
        }
      })
    },

    confirmAdd() {
      const me = this
      me.$refs.addForm.validate(valid => {
        if (valid) {
          postItem('/role/add', me.addForm)
            .then(response => {
              const { success, data, msg } = response.data
              me.isShowAddDialog = false
              if (success) {
                me.$message.success("添加成功")
                me.getList()
              } else {
                me.$message.error(msg)
              }
            })
            .catch(err => {
              me.$message.error("网络错误")
            })
        } else {
          me.$message.error("请提交正确的数据")
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.sysrole {
  text-align: center;
  &__filter-container {
  }
  &__table {
    text-align: center;
  }
 
}
</style>

