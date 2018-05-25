<template>
    <div class="cfgfloor">
    <div class="cfgfloor__filter-container p-filter-container">
        <span class="p-table-name">楼层信息列表</span>
  <section class="p-input-wrapper">
        <input placeholder="请输入内容" v-model="searchName"  class="p-input">
  </section>
        <span class="p-add-btn" @click="add">
            ✚  添加
        </span>
    </div>


    <section class="cfgfloor__table">
        <el-table element-loading-text="拼命加载中" empty-text="暂无数据"
        :data="list" stripe
        border fit highlight-current-row>
        <el-table-column label="楼栋编号" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.buildingId }}</span>
        </template>
        </el-table-column>
        <el-table-column label="楼层编号" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.floorId }}</span>
        </template>
        </el-table-column>
        <el-table-column label="楼层名称" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.floorName }}</span>
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
        <el-dialog title="修改楼层信息信息" :visible.sync="isShowEditDialog">
            <el-form ref="modifyForm" label-position="left"  label-width="200px"  :model="modifyForm" :rules="modifyFormRules">
                <el-form-item label="楼层编号" prop="floorId">
                    <el-input v-model="modifyForm.floorId" readonly disabled></el-input>
                </el-form-item>
                <el-form-item label="楼层名称" prop="floorName" >
                    <el-input v-model="modifyForm.floorName"></el-input>
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
        <el-dialog title="添加楼层信息信息" :visible.sync="isShowAddDialog">
            <el-form ref="addForm" label-position="left"   label-width="200px"  :model="addForm" :rules="rules">
                <el-form-item label="所属楼栋" prop="floorId" >
                    <el-select placeholder="请选择所属楼栋" v-model="addForm.buildingId">
                       <el-option  v-for="item in buildingList" :label="item.buildingName"  :value="item.buildingId" :key="item.buildingId"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="楼层编号" prop="floorId" >
                     <el-input-number v-model="addForm.floorId" :min="1" :max="255" placeholder="请输入楼层信息编号"></el-input-number>
                </el-form-item>
                <el-form-item label="楼层名称" prop="floorName" >
                    <el-input v-model="addForm.floorName" placeholder="请输入楼层信息名称"></el-input>
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
  name: "cfgfloor",
  data() {
    return {
      rawList: [],
      list: [],
      buildingList: [],
      searchName: "",
      isShowAddDialog: false,
      isShowEditDialog: false,
      modifyForm: {},
      addForm: {},
      modifyFormRules: {
        floorId: [{ required: true, message: "楼层信息编号1-255", trigger: "blur", type: 'number' }],
        floorName: [{ required: true, message: "楼层信息名称", trigger: "blur" }]
      },
      rules: {
        floorId: [{ required: true, message: "楼层信息编号1-255", trigger: "blur", type: 'number' }],
        floorName: [
          { required: true, message: "楼层信息名称", trigger: "blur" },
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
      getAll("/cfgfloor/")
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
      getAll("/cfgbuilding/").then(response => {
        const { success, data, msg } = response.data
        if (success) {
          me.buildingList = data
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
      deleteItem("/cfgfloor/" + row.buildingId + "/" + row.floorId).then(response => {
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
      const modifyUrl = `/cfgroom/${me.modifyForm.buildingId}/${me.modifyForm.floorId}`
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
          addItem('/cfgfloor/', me.addForm)
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
.cfgfloor {
  text-align: center;
  &__filter-container {
  }
  &__table {
    text-align: center;
  }
}
</style>

