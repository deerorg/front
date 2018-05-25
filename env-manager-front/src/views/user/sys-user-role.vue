<template>
    <div class="sys-user-role">
    <div class="sys-user-role__filter-container p-filter-container">
        <span class="p-table-name">用户列表</span>
        <input placeholder="请输入内容" v-model="searchName"  class="p-input" @keydown.enter="searchKey">
        <span class="p-add-btn" @click="add">
            ✚  添加
        </span>
    </div>
    <section class="sys-user-role__table">
        <el-table element-loading-text="拼命加载中" empty-text="暂无数据"
        :data="list" stripe
        border fit highlight-current-row>

        <el-table-column label="用户编号" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.userId }}</span>
            </template>
        </el-table-column>
        <el-table-column label="用户名称" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.userName }}</span>
            </template>
        </el-table-column>
        <el-table-column label="角色编号" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.roleId }}</span>
        </template>
        </el-table-column>
        <el-table-column label="角色名称" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.roleName }}</span>
            </template>
        </el-table-column>
        <el-table-column label="操作" align="center" v-show="false">
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

    <section>
       <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageParmas.pageNum"
        :page-size="pageParmas.pageSize"
        layout="total, prev, pager, next"
        :total="total">
        </el-pagination>
   </section>

    <!--  修改记录 -->
    <section class="layer__dialog">
        <el-dialog title="修改用户信息" :visible.sync="isShowEditDialog">
            <el-form ref="modifyForm" label-position="left"  label-width="200px"  :model="modifyForm" :rules="modifyFormRules">
                <el-form-item label="用户编号">
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


      <!--  新增 记录 -->
    <section class="layer__dialog">
        <el-dialog title="添加用户信息" :visible.sync="isShowAddDialog">
            <el-form ref="addForm" label-position="left"  label-width="200px"  :model="addForm" :rules="rules">
                <el-form-item label="用户名称" prop="name" >
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <el-form-item label="用户英文名称" prop="nameEn" >
                    <el-input v-model="addForm.nameEn"></el-input>
                </el-form-item>
                 <el-form-item label="用户地址">
                    <el-input v-model="addForm.address"></el-input>
                </el-form-item>
                <el-form-item label="用户英文地址" >
                    <el-input v-model="addForm.addressEn"></el-input>
                </el-form-item>
                 <el-form-item label="联系人" >
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="固定电话" >
                    <el-input v-model="addForm.telephone"></el-input>
                </el-form-item>
                <el-form-item label="手机号码" >
                    <el-input v-model="addForm.mobile"></el-input>
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
import { getInfo, postItem } from "@/api/advanced"

export default {
  name: "sys-user-role",
  data() {
    return {
      rawList: [],
      list: [],
      total: 0,
      pageParmas: {
        pageNum: 1,
        pageSize: 10
      },
      searchName: "",
      isShowAddDialog: false,
      isShowEditDialog: false,
      modifyForm: {},
      addForm: {},
      modifyFormRules: {
        name: [{ required: true, message: "用户名称", trigger: "blur" }],
        nameEn: [{ required: true, message: "用户英文名称", trigger: "blur" }]
      },
      rules: {
        name: [
          { required: true, message: "用户名称", trigger: "blur" },
          { min: 1, message: "长度在 1 字符以上", trigger: "blur" },
          { max: 20, message: "长度在 20 字符以内", trigger: "blur" }
        ],
        nameEn: [{ required: true, message: "用户英文名称", trigger: "blur" }]
      }
    }
  },
  mounted() {
    const me = this
    me.getList()
  },
  methods: {
    searchKey() {
      this.getList()
    },
    getList() {
      const me = this
      getInfo("/user-role/all", { page: me.pageParmas.pageNum, size: me.pageParmas.pageSize, queryLike: me.searchName })
        .then(response => {
          const { success, data, msg } = response.data
          if (success) {
            me.list = data.list
            me.rawList = data.list
            me.total = data.total
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
    handleSizeChange(pageSize) {
      this.pageParmas.pageSize = pageSize
      this.getList()
    },
    handleCurrentChange(pageIndex) {
      this.pageParmas.pageNum = pageIndex
      this.getList()
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
.sys-user-role {
  text-align: center;
  &__filter-container {
  }
  &__table {
    text-align: center;
  }
}
</style>

