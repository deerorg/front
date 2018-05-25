<template>
    <div class="sys-user">
    <div class="sys-user__filter-container p-filter-container">
        <span class="p-table-name">api列表</span>
        <input placeholder="请输入内容" v-model="searchName"  class="p-input" @keydown.enter="searchKey">
        <span class="p-add-btn" @click="enableCurrentChoose"  v-if="isShow">
            分配
        </span>
        <span class="p-add-btn" @click="disableCurrentChoose" v-if="isShow">
            取消选中
        </span>
        <!-- <span class="p-add-btn" @click="enableCurrentChoose" v-if="false">
            显示全部数据
        </span>
        <span class="p-add-btn" @click="enableCurrentChoose"  v-if="false">
            显示未分配的数据
        </span> -->
    </div>
    <section class="sys-user__table">
        <el-table element-loading-text="拼命加载中"  ref="multipleTable" empty-text="暂无数据" :data="list" stripe border fit highlight-current-row  @selection-change="handleSelectionChange">
        <el-table-column
        type="selection"
        align="center"
        v-if = "isShow"
        width="55">
        </el-table-column>
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
        <el-table-column label="备注" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.remarks }}</span>
            </template>
        </el-table-column>
     
        <el-table-column label="操作" align="center" v-if="false">
            <template slot-scope="scope">
                <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">分配</el-button>
                <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">取消</el-button>
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
        :page-sizes="[20,100,200, 500,1000]"
        layout="total,sizes, prev, pager, next, jumper"
        :total="total">
        </el-pagination>
   </section>
 

    </div>
</template>

<script>
import { getInfo, postItem } from "@/api/advanced"

export default {
  name: "e-api-data-user",
  props: {
    role: {
      type: Object,
      default: () => {
        return {}
      }
    },
    type: {
      type: String,
      // type all role
      default: () => {
        return 'ALL'
      }
    }
  },
  computed: {
    isShow() {
      return this.type == 'ALL'
    }
  },
  data() {
    return {
      rawList: [],
      list: [],
      currentChooseMenus: [],
      // 级别列表
      total: 0,
      pageParmas: {
        pageNum: 1,
        pageSize: 10
      },
      searchName: ""
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
    enableCurrentChoose() {
      const me = this
      const url = '/menu-role/allocate'
      const length = me.currentChooseMenus.filter(x => x.checked == 'N').length
      if (length <= 0) {
        me.$message.info("请至少选择一项")
        return
      }
      // let chooseMenuIds =
      const item = {
        roleId: me.role.id,
        menuIds: me.currentChooseMenus.filter(x => x.checked == 'N').map(x => x.id)
      }
      postItem(url, item).then(response => {
        const { success, data, msg } = response.data
        if (success) {
          me.$message.success("分配成功")
          me.getList()
          // 获取数据
        } else {
          me.$message.error(msg)
        }
      })
    },

    disableCurrentChoose() {
      const me = this
      const url = '/menu-role/cancel'
      const length = me.currentChooseMenus.filter(x => x.checked == 'Y').length
      if (length <= 0) {
        me.$message.info("请至少选择一项")
        return
      }
      const item = {
        roleId: me.role.id,
        menuIds: me.currentChooseMenus.filter(x => x.checked == 'Y').map(x => x.id)
      }
      postItem(url, item).then(response => {
        const { success, data, msg } = response.data
        if (success) {
          me.$message.success("取消成功")
          me.getList()
          // 获取数据
        } else {
          me.$message.error(msg)
        }
      })
    },
    getList() {
      const me = this
      const allUrl = `/menu/role-source?roleId=${me.role.id}&pageNum=${me.pageParmas.pageNum}&pageSize=${me.pageParmas.pageSize}&queryLike=${me.searchName}`
      const roleUrl = `/menu/role-id-source?roleId=${me.role.id}&pageNum=${me.pageParmas.pageNum}&pageSize=${me.pageParmas.pageSize}&queryLike=${me.searchName}`
      const url = me.type == 'ALL' ? allUrl : roleUrl
      getInfo(url).then(response => {
        const { success, data, msg } = response.data
        if (success) {
          me.list = data.list
          me.rawList = data.list
          me.total = data.total
          // setTimeout(function(){
          //     me.checkedRows();
          // }, 1000);
          me.$nextTick(function() {
            me.checkedRows()
          })
          // 获取数据
        } else {
          me.$message.error(msg)
        }
      })
        .catch(err => {
          me.$message.error("网络错误")
        })
    },
    checkedRows() {
      const me = this
      me.list.forEach(row => {
        // debugger;
        if (row.checked == 'Y') {
          me.$refs.multipleTable.toggleRowSelection(row, true)
        } else {
          me.$refs.multipleTable.toggleRowSelection(row, false)
        }
      })
      me.$forceUpdate()
    },

    handleCurrentChange(pageIndex) {
      const me = this
      me.pageParmas.pageNum = pageIndex
      me.getList()
    },
    handleSizeChange(pageSize) {
      const me = this
      me.pageParmas.pageSize = pageSize
      me.getList()
    },
    handleEdit(index, row) {
      const me = this
      const backdata = JSON.parse(JSON.stringify(row))
      me.modifyForm = backdata
      me.isShowEditDialog = true
    },

    handleSelectionChange(values) {
      this.currentChooseMenus = values
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

