<template>
    <div class="ipctask">
    <div class="ipctask__filter-container p-filter-container">
        <span class="p-table-name">任务列表</span>
         <section class="p-input-wrapper">
        <input placeholder="请输入内容" v-model="searchName"  class="p-input" @keydown.enter="searchKey">
         </section>
        <span class="p-add-btn" @click="add">
            ✚  添加
        </span>
    </div>

    <section class="ipctask__table">
        <el-table element-loading-text="拼命加载中" empty-text="暂无数据"
        :data="list" stripe
        border fit highlight-current-row>
        <el-table-column label="编号" align="center" width="150px">
            <template slot-scope="scope">
                <span>{{ scope.row.id }}</span>
            </template>
        </el-table-column>
        <el-table-column label="名称" align="center" width="200px">
        <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
        </template>
        </el-table-column>
        <el-table-column label="值" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.task }}</span>
            </template>
        </el-table-column>
        <el-table-column label="操作" align="center"  width="200px">
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

    <!-- 分页 -->
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
        <el-dialog title="修改任务" :visible.sync="isShowEditDialog">
            <el-form ref="modifyForm" label-position="left"  label-width="200px"  :model="modifyForm" :rules="modifyFormRules">
                <el-form-item label="编号" prop="id">
                    <el-input v-model="modifyForm.id" readonly disabled></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="name" >
                    <el-input v-model="modifyForm.name"></el-input>
                </el-form-item>
                <el-form-item label="值" prop="task" >
                    <el-input  type="textarea" v-model="modifyForm.task" :rows="5"></el-input>
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
        <el-dialog title="添加任务" :visible.sync="isShowAddDialog">
            <el-form ref="addForm" label-position="left"   label-width="200px"  :model="addForm" :rules="rules">
                <el-form-item label="名称" prop="name" >
                    <el-input v-model="addForm.name" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="值" prop="task" >
                    <el-input  type="textarea" v-model="addForm.task"  :rows="5" placeholder="请输入值"></el-input>
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
  name: "ipctask",
  data() {
    return {
      rawList: [],
      list: [],
      total: 0,
      pageParmas: {
        "pageNum": 1,
        "pageSize": 10
      },
      // 级别列表
      idList: [],
      searchName: "",
      isShowAddDialog: false,
      isShowEditDialog: false,
      modifyForm: {},
      addForm: {},
      modifyFormRules: {
        name: [{ required: true, message: "名称", trigger: "blur" }],
        task: [{ required: true, message: "英文名称", trigger: "blur" }]
      },
      rules: {
        name: [
          { required: true, message: "名称", trigger: "blur" },
          { min: 1, message: "长度在 1 字符以上", trigger: "blur" },
          { max: 20, message: "长度在 20 字符以内", trigger: "blur" }
        ],
        task: [{ required: true, message: "英文名称", trigger: "blur" }]

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
    handleSizeChange(pageSize) {
      this.pageParmas.pageSize = pageSize
      this.getList()
    },
    handleCurrentChange(pageIndex) {
      this.pageParmas.pageNum = pageIndex
      this.getList()
    },
    getList() {
      const me = this
      const url = `/ipc-task/query?queryLike=${me.searchName}&pageNum=${me.pageParmas.pageNum}&pageSize=${me.pageParmas.pageSize}`
      postItem(url, { name: me.searchName })
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
      getInfo("/ipc-task/del?id=" + row.id, { id: row.id }).then(response => {
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
      this.addForm = {}
      this.isShowAddDialog = true
    },
    confirmModify() {
      const me = this
      me.$refs.modifyForm.validate(valid => {
        if (valid) {
          me.modifyForm.task = window.btoa(me.modifyForm.task)
          postItem('/ipc-task/modify', me.modifyForm)
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
          const add = {
            name: me.addForm.name,
            task: window.btoa(me.addForm.task)
          }
          postItem('/ipc-task/add', add)
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
.ipctask {
  text-align: center;
  &__filter-container {
  }
  &__table {
    text-align: center;
  }
}
</style>

