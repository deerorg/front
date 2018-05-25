<template>
    <div class="sys-menu-role">
    <div class="sys-menu-role__filter-container p-filter-container">
        <el-select v-model="currentRoleId" placeholder="请选择角色" @change="changeRole">
                <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
                </el-option>
            </el-select>
          
    </div>


    <section class="sys-menu-role__table">
        <el-table element-loading-text="拼命加载中" empty-text="暂无数据"
        :data="list" stripe
        border fit highlight-current-row>

        <el-table-column label="编号" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.id }}</span>
            </template>
        </el-table-column>
        <el-table-column label="名称" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.name }}</span>
            </template>
        </el-table-column>
        <el-table-column label="地址" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.url }}</span>
        </template>
        </el-table-column>
        <el-table-column label="父菜单" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.pid }}</span>
            </template>
        </el-table-column>
        <el-table-column label="备注" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.remark }}</span>
            </template>
        </el-table-column>
     
        <el-table-column label="操作" align="center">
            <template slot-scope="scope">
                <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            
                <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>


    
    </section>

    <!--  修改记录 -->
    <section class="layer__dialog">
        <el-dialog title="修改菜单信息" :visible.sync="isShowEditDialog">
            <el-form ref="modifyForm" label-position="left"  label-width="200px"  :model="modifyForm" :rules="modifyFormRules">
                <el-form-item label="菜单编号">
                    <el-input v-model="modifyForm.id" readonly disabled></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="roleId" >
                    <el-input v-model="modifyForm.roleId"></el-input>
                </el-form-item>
                <el-form-item label="租户ID" prop="tenantId" >
                    <el-input v-model="modifyForm.tenantId"></el-input>
                </el-form-item>
                 <el-form-item label="名称">
                    <el-input v-model="modifyForm.username"></el-input>
                </el-form-item>
                <el-form-item label="email" >
                    <el-input v-model="modifyForm.email"></el-input>
                </el-form-item>
                 <el-form-item label="手机号" >
                    <el-input v-model="modifyForm.mobile"></el-input>
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


      <!--  新增菜单记录 -->
    <section class="layer__dialog">
        <el-dialog title="编辑菜单信息" :visible.sync="isShowAddDialog">
          

          
        </el-dialog>
    </section>

    </div>
</template>

<script>
import { getInfo, postItem } from "@/api/advanced"

export default {
  name: "sys-menu-role",
  data() {
    return {
      rawList: [],
      list: [],
      // 级别列表
      roleList: [],
      searchName: "",
      currentRoleId: '',
      currentRole: {},

      isShowAddDialog: false,
      isShowEditDialog: false,
      pageIndex: 1,
      pageSize: 20,
      modifyForm: {},
      addForm: {},
      modifyFormRules: {
        name: [{ required: true, message: "菜单名称", trigger: "blur" }],
        nameEn: [{ required: true, message: "菜单英文名称", trigger: "blur" }]
      },
      rules: {
        name: [
          { required: true, message: "菜单名称", trigger: "blur" },
          { min: 1, message: "长度在 1 字符以上", trigger: "blur" },
          { max: 20, message: "长度在 20 字符以内", trigger: "blur" }
        ],
        nameEn: [{ required: true, message: "菜单英文名称", trigger: "blur" }]
      }
    }
  },
  watch: {
    searchName: function(val, oldVal) {
      if (val) {
        this.list = this.rawList.filter(
          x => x.name.indexOf(val) > -1 || x.nameEn.indexOf(val) > -1
        )
      } else {
        this.list = this.rawList
      }
    }
  },

  mounted() {
    const me = this
    me.getRoleList()
  },
  methods: {
    getList() {
      const me = this
    },
    changeRole(roleId) {
      const me = this
      me.currentRoleId = roleId
      me.currentRole = me.roleList.find(x => x.id == roleId)
      // 获取对应的菜单数据
    },
    getRoleList() {
      const me = this
      getInfo("/role/all")
        .then(response => {
          const { success, data, msg } = response.data
          if (success) {
            me.roleList = data
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
    handleDelete(index, row) {
      const me = this
      deleteItem("/manufacturer/", { manufacturerId: row.manufacturerId }).then(response => {
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
      this.isShowAddDialog = true
    },
    confirmModify() {
      const me = this
      me.$refs.modifyForm.validate(valid => {
        if (valid) {
          modifyItem('/manufacturer/', me.modifyForm)
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
          addItem('/manufacturer/', me.addForm)
            .then(response => {
              const { success, data, msg } = response.data
              me.isShowAddDialog = false
              if (success) {
                me.$message.success("添加成功")
                me.getList()
                me.addForm = JSON.parse(JSON.stringify(ADD_INIT_FROM))
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
.sys-menu-role {
  text-align: center;
  &__filter-container {
  }
  &__table {
    text-align: center;
  }
}
</style>

