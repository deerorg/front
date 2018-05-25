<template>
    <div class="cfgroom">
    <div class="cfgroom__filter-container p-filter-container">
        <span class="p-table-name">楼室信息列表</span>
         <section class="p-input-wrapper">
        <input placeholder="请输入内容" v-model="searchName"  class="p-input">
         </section>
        <span class="p-add-btn" @click="add">
            ✚  添加
        </span>
    </div>


    <section class="cfgroom__table">
        <el-table element-loading-text="拼命加载中" empty-text="暂无数据"
        :data="list" stripe
        border fit highlight-current-row>
        <el-table-column label="楼层编号" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.floorId }}</span>
        </template>
        </el-table-column>
        <el-table-column label="楼室编号" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.roomId }}</span>
        </template>
        </el-table-column>
        <el-table-column label="楼室名称" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.roomName }}</span>
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
        <el-dialog title="修改楼室信息信息" :visible.sync="isShowEditDialog">
            <el-form ref="modifyForm" label-position="left"  label-width="200px"  :model="modifyForm" :rules="modifyFormRules">
                <el-form-item label="楼室信息编号" prop="roomId">
                    <el-input v-model="modifyForm.roomId" readonly disabled></el-input>
                </el-form-item>
                <el-form-item label="楼室信息名称" prop="roomName" >
                    <el-input v-model="modifyForm.roomName"></el-input>
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
        <el-dialog title="添加楼室信息信息" :visible.sync="isShowAddDialog">
            <el-form ref="addForm" label-position="left"  label-width="200px"  :model="addForm" :rules="rules">
                <el-form-item label="楼室信息编号" prop="roomId" >
                     <el-input-number v-model="addForm.roomId" :min="1" :max="255" placeholder="请输入楼室信息编号"></el-input-number>
                </el-form-item>
                <el-form-item label="所属楼层" prop="floorId" >
                    <el-select placeholder="请选择所属楼栋" v-model="addForm.floorId">
                       <el-option  v-for="item in floorList" :label="item.floorName"  :value="item.floorId" :key="item.floorId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="楼室信息名称" prop="roomName" >
                    <el-input v-model="addForm.roomName" placeholder="请输入楼室信息名称"></el-input>
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
import { getAll, addItem, deleteItem, modifyItem } from "@/api/advanced"
export default {
  name: "cfgroom",
  data() {
    return {
      rawList: [],
      list: [],
      // 级别列表
      floorList: [],
      searchName: "",
      isShowAddDialog: false,
      isShowEditDialog: false,
      modifyForm: {},
      addForm: {},
      modifyFormRules: {
        roomName: [{ required: true, message: "楼室信息名称", trigger: "blur" }]
      },
      rules: {
        roomId: [{ required: true, message: "楼室信息编号1-255", trigger: "blur", type: 'number' }],
        roomName: [
          { required: true, message: "楼室信息名称", trigger: "blur" },
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
          x => x.name.indexOf(val) > -1 || x.nameEn.indexOf(val) > -1
        )
      } else {
        this.list = this.rawList
      }
    }
  },

  mounted() {
    const me = this
    me.getList()
    me.getOthersData()
  },
  methods: {
    getList() {
      const me = this
      getAll("/cfgroom/")
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
    getOthersData() {
      const me = this
      getAll("/cfgfloor/").then(response => {
        const { success, data, msg } = response.data
        if (success) {
          me.floorList = data
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
      deleteItem("/cfgroom/" + row.floorId + "/" + row.roomId).then(response => {
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
      const modifyUrl = `/cfgroom/${me.modifyForm.floorId}/${me.modifyForm.roomId}`
      me.$refs.modifyForm.validate(valid => {
        if (valid) {
          modifyItem(modifyUrl, me.modifyForm)
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
          addItem('/cfgroom/', me.addForm)
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
.cfgroom {
  text-align: center;
  &__filter-container {
  }
  &__table {
    text-align: center;
  }
}
</style>

