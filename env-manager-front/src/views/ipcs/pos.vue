<template>
    <div class="ipcpos">
    <div class="ipcpos__filter-container p-filter-container">
        <span class="p-table-name">预置位置列表</span>
          <section class="p-input-wrapper">
        <input placeholder="请输入内容" v-model="searchName"  class="p-input">
          </section>
        <span class="p-add-btn" @click="add">
            ✚  添加
        </span>
    </div>


    <section class="ipcpos__table">
        <el-table element-loading-text="拼命加载中" empty-text="暂无数据"
        :data="list" stripe
        border fit highlight-current-row>
        <el-table-column
        label="编号" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
        </template>
        </el-table-column>
        <el-table-column
        label="摄像头" align="center">
        <template slot-scope="scope">
            <span>{{scope.row.ipcName}}[{{ scope.row.ipcId }}]</span>
        </template>
        </el-table-column>
        <el-table-column
        label="位置" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.position }}</span>
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
        <el-dialog title="修改预置位置信息" :visible.sync="isShowEditDialog">
            <el-form ref="modifyForm" label-position="left"  label-width="200px"  :model="modifyForm" :rules="modifyFormRules">
                <el-form-item label="编号" prop="id">
                    <el-input v-model="modifyForm.id" readonly disabled></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="position" >
                    <el-input v-model="modifyForm.position"></el-input>
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
        <el-dialog title="添加预置位置信息" :visible.sync="isShowAddDialog">
            <el-form ref="addForm" label-width="200px" label-position="left"   :model="addForm" :rules="rules">
                <el-form-item label="预置位置名称" prop="position" >
                    <el-input v-model="addForm.position" placeholder="请输入预置位置名称"></el-input>
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
  name: "ipcpos",
  props: {
    ipcId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      rawList: [],
      list: [],
      // 级别列表
      idList: [],
      searchName: "",
      isShowAddDialog: false,
      isShowEditDialog: false,
      isShowDayDialog: false,
      modifyForm: {},
      dayForm: {},
      addForm: {},
      modifyFormRules: {
        position: [{ required: true, message: "预置位置名称", trigger: "blur" }]
      },
      rules: {
        position: [
          { required: true, message: "预置位置名称", trigger: "blur" },
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
          x => x.position.indexOf(val) > -1
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
      getInfo("/ipc/position-list?ipcId=" + me.ipcId, { ipcId: me.ipcId })
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
    handleDelete(index, row) {
      const me = this
      getInfo("/ipc/position-del?id=" + row.id, { id: row.id }).then(response => {
        const { success, data, msg } = response.data
        if (success) {
          me.$message.success("删除成功")
          me.getList()
        } else {
          me.$message.error(msg)
        }
      })
    },

    // 添加记录
    add() {
      const me = this
      me.addForm = {
        ipcId: me.ipcId
      }
      me.isShowAddDialog = true
    },
    confirmModify() {
      const me = this
      me.$refs.modifyForm.validate(valid => {
        if (valid) {
          postItem('/ipc/position-edit', me.modifyForm)
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
          getInfo(`/ipc/position?ipcId=${me.ipcId}&position=${me.addForm.position}`, me.addForm)
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
.ipcpos {
  text-align: center;
  &__filter-container {
  }
  &__table {
    text-align: center;
  }
}
</style>

