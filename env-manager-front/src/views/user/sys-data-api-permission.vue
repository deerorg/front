<template>
    <div class="sys-user">
    <div class="sys-user__filter-container p-filter-container">
        <span class="p-table-name">api列表</span>
        <input placeholder="请输入内容" v-model="searchName"  class="p-input" @keydown.enter="searchKey">
        <span class="p-add-btn" @click="add">
            ✚  添加
        </span>
    </div>


    <section class="sys-user__table">
        <el-table element-loading-text="拼命加载中" empty-text="暂无数据"
        :data="list" stripe
        border fit highlight-current-row>
        <el-table-column label="编号" align="center" width="100">
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
        <el-table-column label="备注" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.remarks }}</span>
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

  <section>
       <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="pageParmas.pageNum"
        :page-size="pageParmas.pageSize"
        layout="total, prev, pager, next"
        :total="total">
        </el-pagination>
   </section>




    <!--  修改记录 -->
    <section class="layer__dialog">
        <el-dialog title="修改菜单信息" :visible.sync="isShowEditDialog">
            <el-form ref="modifyForm" label-position="left"  label-width="200px"  :model="modifyForm" :rules="modifyFormRules">
                <el-form-item label="编号">
                    <el-input v-model="modifyForm.id" readonly disabled></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="name" >
                    <el-input v-model="modifyForm.name" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="url"  >
                    <el-input v-model="modifyForm.url" placeholder="请输入地址"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remarks" >
                    <el-input v-model="modifyForm.remarks" placeholder="请输入备注"></el-input>
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
        <el-dialog title="新增数据信息" :visible.sync="isShowAddDialog">
          <el-form ref="addForm" label-position="left"  label-width="200px"  :model="addForm" :rules="rules">
                <el-form-item label="名称" prop="name" >
                    <el-input v-model="addForm.name" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="url"  >
                    <el-input v-model="addForm.url" placeholder="请输入地址"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remarks" >
                    <el-input v-model="addForm.remarks" placeholder="请输入备注"></el-input>
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

    </div>
</template>

<script>
import { getInfo, postItem } from "@/api/advanced"

export default {
  name: "sys-data-api-permission",
  data() {
    return {
      rawList: [],
      list: [],
      // 级别列表
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
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        url: [{ required: true, message: "请输入地址", trigger: "blur" }]
      },
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 1, message: "长度在 1 字符以上", trigger: "blur" },
          { max: 20, message: "长度在 20 字符以内", trigger: "blur" }
        ],
        url: [{ required: true, message: "请输入地址", trigger: "blur" }]
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
      getInfo(`/menu/source?pageNum=${me.pageParmas.pageNum}&pageSize=${me.pageParmas.pageSize}&queryLike=${me.searchName}`)
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
    handleCurrentChange(pageIndex) {
      const me = this
      me.pageParmas.pageNum = pageIndex
      me.getList()
    },
    handleEdit(index, row) {
      const me = this
      const backdata = JSON.parse(JSON.stringify(row))
      me.modifyForm = backdata
      me.isShowEditDialog = true
    },
    handleDelete(index, row) {
      const me = this
      postItem(`/menu/del?id=${row.id}`, { id: row.id }).then(response => {
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
      const item = {
        id: me.modifyForm.id,
        name: me.modifyForm.name,
        url: me.modifyForm.url,
        remarks: me.modifyForm.remarks
      }
      me.$refs.modifyForm.validate(valid => {
        if (valid) {
          postItem('/menu/edit/', item)
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
.sys-user {
  text-align: center;
  &__filter-container {
  }
  &__table {
    text-align: center;
  }
}
</style>

