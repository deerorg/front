<template>
    <div class="sys-user">
    <div class="sys-user__filter-container p-filter-container">
        <span class="p-table-name">用户列表</span>
        <input placeholder="请输入内容" v-model="searchName"  class="p-input" @keydown.enter="searchKey">
        <span class="p-add-btn" @click="add">
            ✚  添加
        </span>
    </div>
    <section class="sys-user__table">
        <el-table element-loading-text="拼命加载中" empty-text="暂无数据"
        :data="list" stripe
        border fit highlight-current-row>

        <el-table-column label="编号" align="center"  width="100">
            <template slot-scope="scope">
                <span>{{ scope.row.id }}</span>
            </template>
        </el-table-column>
        <el-table-column label="名称" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.userName }}</span>
        </template>
        </el-table-column>
           
        <el-table-column label="手机" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.mobile }}</span>
            </template>
        </el-table-column>
        <el-table-column label="邮箱" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.email }}</span>
            </template>
        </el-table-column>
  
        <el-table-column label="上次登录时间" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.pwdLastDate }}</span>
            </template>
        </el-table-column>
     
        <el-table-column label="操作" align="center">
            <template slot-scope="scope">
                <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                 <el-button
                size="mini"
                @click="handleEditPass(scope.$index, scope.row)">修改密码</el-button>
                <el-button v-if="scope.row.loginFlag=='Y'" v-show="userId!=scope.row.id" size="mini" type="danger" @click="handleStop(scope.$index, scope.row, 'N')">停用</el-button>
                <el-button v-if="scope.row.loginFlag=='N'" v-show="userId!=scope.row.id" size="mini" type="danger" @click="handleStop(scope.$index, scope.row, 'Y')">启用</el-button>
                <el-button size="mini"  @click="handleEditRole(scope.$index, scope.row)">分配角色</el-button>
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
                 <el-form-item label="名称">
                    <el-input v-model="modifyForm.userName" readonly disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
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

   <!--  修改密码 -->
    <section class="layer__dialog">
        <el-dialog title="修改密码" :visible.sync="isShowEditPassDialog">
            <el-form ref="modifyForm" label-position="left"  label-width="200px"  :model="modifyForm" :rules="modifyFormRules">
                <el-form-item label="原密码">
                    <el-input v-model="modifyForm.rawPassword" placeholder="请输入原来的密码"></el-input>
                </el-form-item>
                 <el-form-item label="新密码">
                    <el-input v-model="modifyForm.newPassword" placeholder="请设置新密码"></el-input>
                </el-form-item>
                <el-row type="flex" >
                    <el-col class="p-oneline">
                        <el-button @click="isShowEditPassDialog=false" class="p-cancle-btn">取消</el-button>
                        <el-button type="primary" @click="confirmModifyPass" class="p-save-btn">保存</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>
    </section>


       <!--  修改用户角色 -->
    <section class="layer__dialog">
        <el-dialog title="修改用户角色" :visible.sync="isShowEditRoleDialog">
            <el-form ref="modifyForm" label-position="left"  label-width="200px"  :model="modifyRoleForm">
                 <el-form-item label="原角色">
                    <el-checkbox-group v-model="currentChooseRolesLables" >
                        <el-checkbox disabled v-for="item in currentChooseRoles" :label="item.roleName" :key="item.id">{{item.roleName}} - [{{item.id}}]</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>

                <el-form-item label="分配角色">
                    <el-checkbox-group v-model="chooseRoles" >
                        <el-checkbox v-for="item in roleList"  :label="item.roleName"  :key="item.id" @change="changeRole(item)">{{item.roleName}} - [{{item.id}}]</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-row type="flex" >
                    <el-col class="p-oneline">
                        <el-button @click="isShowEditRoleDialog=false" class="p-cancle-btn">取消</el-button>
                        <el-button type="primary" @click="confirmModifyRole" class="p-save-btn">保存</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>
    </section>



      <!--  新增 记录 -->
    <section class="layer__dialog">
        <el-dialog title="添加用户信息" :visible.sync="isShowAddDialog">
            <el-form ref="addForm" label-position="left"  label-width="200px"  :model="addForm" :rules="rules">
                <el-form-item label="用户名称" prop="userName" >
                    <el-input v-model="addForm.userName"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile" >
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
                 <el-form-item label="邮箱">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="密码" >
                    <el-input v-model="addForm.password"></el-input>
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
import { postItem, getInfo, getItem } from "@/api/advanced"
import { mapGetters } from 'vuex'

export default {
  name: "sys-user",
  computed: {
    ...mapGetters(['userId']),
    currentChooseRolesLables() {
      const me = this
      return me.currentChooseRoles.map(x => {
        return x.roleName
      })
    }
  },
  data() {
    return {
      rawList: [],
      list: [],
      total: 0,
      pageParmas: {
        pageNum: 1,
        pageSize: 10
      },

      roleList: [],
      currentChooseRoles: [],
      isShowEditRoleDialog: false,
      // 新选择的角色
      chooseRoles: [],
      modifyRoleForm: {},

      searchName: "",
      isShowAddDialog: false,
      isShowEditDialog: false,
      isShowEditPassDialog: false,
      modifyForm: {},
      addForm: {},
      modifyFormRules: {
        name: [{ required: true, message: "用户名称", trigger: "blur" }],
        nameEn: [{ required: true, message: "用户英文名称", trigger: "blur" }]
      },
      rules: {
        userName: [
          { required: true, message: "用户名称", trigger: "blur" },
          { min: 1, message: "长度在 1 字符以上", trigger: "blur" },
          { max: 20, message: "长度在 20 字符以内", trigger: "blur" }
        ],
        mobile: [{ required: true, message: '手机号', trigger: "blur" }]
      }
    }
  },
  mounted() {
    const me = this
    me.getRoles()
    me.getList()
  },
  methods: {
    searchKey() {
      this.getList()
    },
    getRoles() {
      const me = this
      getInfo("/role/all")
        .then(response => {
          const { success, data, msg } = response.data
          if (success) {
            me.roleList = data.map(x => {
              x.isChoose = false
              return x
            })
          } else {
            me.$message.error(msg)
          }
        })
        .catch(err => {
          me.$message.error("网络错误")
        })
    },
    getList() {
      const me = this
      const user = {}
      const url = `/user/list?pageNum=${me.pageParmas.pageNum}&pageSize=${me.pageParmas.pageSize}`
      postItem(url, { pageNum: me.pageParmas.pageNum, pageSize: me.pageParmas.pageSize, user: user })
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

    changeRole(value, ss) {
      console.log(value, ss)
    },
    handleEdit(index, row) {
      const me = this
      const backdata = JSON.parse(JSON.stringify(row))
      me.modifyForm = backdata
      me.isShowEditDialog = true
    },

    handleEditPass(index, row) {
      const me = this
      me.modifyForm = {
        rawPassword: '',
        newPassword: '',
        uid: row.id
      }
      me.isShowEditPassDialog = true
    },
    handleEditRole(index, row) {
      const me = this
      // todo 获取用户角色
      me.modifyRoleForm = {
        userId: row.id,
        roleIds: []
      }
      getInfo(`/role/single?userId=${row.id}`)
        .then(response => {
          const { success, data, msg } = response.data
          // me.isShowEditRoleDialog = false;
          if (success) {
            me.currentChooseRoles = data || []
            me.chooseRoles = me.currentChooseRolesLables
            me.isShowEditRoleDialog = true
          } else {
            me.$message.error(msg)
          }
        })
        .catch(err => {
          me.$message.error("网络错误")
        })
    },
    // 启用/停用用户
    handleStop(index, row, flag) {
      const me = this
      let stopUser = {}
      if (flag == 'N') {
        stopUser = {
          id: row.id,
          loginFlag: 'N',
          forceLogin: 'Y'
        }
      } else {
        stopUser = {
          id: row.id,
          loginFlag: 'Y'
        }
      }

      postItem('/user/modify', stopUser)
        .then(response => {
          const { success, data, msg } = response.data
          me.isShowEditDialog = false
          if (success) {
            me.$message.success("修改成功")
          } else {
            me.$message.error(msg)
          }
        })
        .catch(err => {
          me.$message.error("网络错误")
        })
    },
    // 添加记录
    add() {
      this.isShowAddDialog = true
    },
    confirmModify() {
      const me = this
      me.$refs.modifyForm.validate(valid => {
        if (valid) {
          postItem('/user/modify', me.modifyForm)
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
    // 确认修改密码
    confirmModifyPass() {
      const me = this
      const currentLoginUserId = me.userId

      const info = {
        oldPwd: me.modifyForm.rawPassword,
        newPwd: me.modifyForm.newPassword,
        uid: me.modifyForm.uid
      }

      getItem('/user/upd-pwd', info)
        .then(response => {
          const { success, data, msg } = response.data
          me.isShowEditPassDialog = false
          if (success) {
            me.$message.success("修改成功")
            if (currentLoginUserId == me.modifyForm.uid) {
              me.$message.info("请重新登录")
              me.$router.push('login')
            }
            // me.getList();
          } else {
            me.$message.error(msg)
          }
        })
        .catch(err => {
          me.$message.error("网络错误")
        })
    },
    // 确认分配的角色
    confirmModifyRole() {
      const me = this
      const userId = me.modifyRoleForm.userId
      const currents = me.roleList.filter(x => {
        return me.chooseRoles.includes(x.roleName)
      })
      const ids = currents.map(x => x.id) || []
      const queryIds = ids.map(x => '&roleIds=' + x).join('')
      const url = `/user-role/relation?userId=${userId}${queryIds}`

      getInfo(url).then(response => {
        const { success, data, msg } = response.data
        me.isShowEditRoleDialog = false
        if (success) {
          me.$message.success("修改成功")
        } else {
          me.$message.error(msg)
        }
      }).catch(err => {
        me.$message.error("网络错误")
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
          postItem('/user/add', me.addForm)
            .then(response => {
              const { success, data, msg } = response.data
              me.isShowAddDialog = false
              if (success) {
                me.$message.success("添加成功")
                me.getList()
                me.addForm = {}
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
.sys-user {
  text-align: center;
  &__filter-container {
  }
  &__table {
    text-align: center;
  }
}
</style>

