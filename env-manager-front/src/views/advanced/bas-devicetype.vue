<template>
    <div class="basdevicetype">
    <div class="basdevicetype__filter-container p-filter-container">
        <span class="p-table-name">设备类型列表</span>
        <section class="p-input-wrapper">
            <input placeholder="请输入内容" v-model="searchName"  class="p-input">
        </section>
        <span class="p-add-btn" @click="add">
            ✚  添加
        </span>
    </div>


    <section class="basdevicetype__table">
        <el-table element-loading-text="拼命加载中" empty-text="暂无数据"
        :data="list" stripe
        border fit highlight-current-row>
        <el-table-column
        label="设备类型编号" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.deviceType }}</span>
            </template>
        </el-table-column>
        <el-table-column
        label="所属设备种类" align="center">
            <template slot-scope="scope">
                <span>{{scope.row.kindName}}[{{ scope.row.deviceKind }}]</span>
            </template>
        </el-table-column>
        <el-table-column
        label="设备类型名称" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
        </template>
        </el-table-column>
        <el-table-column
        label="设备类型英文名称" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.nameEn }}</span>
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
        <el-dialog title="修改设备类型信息" :visible.sync="isShowEditDialog">
            <el-form ref="modifyForm" label-position="left"   label-width="200px"  :model="modifyForm" :rules="modifyFormRules">
                <el-form-item label="设备类型编号" prop="deviceType">
                    <el-input v-model="modifyForm.deviceType" readonly disabled></el-input>
                </el-form-item>
                <el-form-item label="设备类型名称" prop="name" >
                    <el-input v-model="modifyForm.name"></el-input>
                </el-form-item>
                <el-form-item label="设备类型英文名称" prop="nameEn" >
                    <el-input v-model="modifyForm.nameEn"></el-input>
                </el-form-item>
                <el-form-item label="设备种类" prop="deviceKind">
                    <el-select placeholder="请选择设备种类" v-model="modifyForm.deviceKind">
                        <el-option  v-for="item in devicekindList" :label="item.kindName" :value="item.deviceKind" :key="item.deviceKind"></el-option>
                    </el-select>
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
        <el-dialog title="添加设备类型信息" :visible.sync="isShowAddDialog">
            <el-form ref="addForm" label-width="200px" label-position="left"   :model="addForm" :rules="rules">
                <el-form-item label="设备类型编号" prop="deviceType" v-if="false" >
                     <el-input-number v-model="addForm.deviceType" :min="1" :max="255" placeholder="请输入设备类型编号"></el-input-number>
                </el-form-item>
                <el-form-item label="设备类型名称" prop="name" >
                    <el-input v-model="addForm.name" placeholder="请输入设备类型名称"></el-input>
                </el-form-item>
                <el-form-item label="设备类型英文名称" prop="nameEn" >
                    <el-input v-model="addForm.nameEn" placeholder="请输入设备类型英文名称"></el-input>
                </el-form-item>
                <el-form-item label="设备种类" prop="deviceKind">
                    <el-select placeholder="请选择设备种类" v-model="addForm.deviceKind">
                        <el-option  v-for="item in devicekindList" :label="item.kindName" :value="item.deviceKind" :key="item.deviceKind"></el-option>
                    </el-select>
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
const ADD_INIT_FROM = {
  deviceType: "",
  deviceKind: "",
  name: "",
  nameEn: ""
}
export default {
  name: "basdevicetype",
  data() {
    return {
      rawList: [],
      list: [],
      // 级别列表
      devicekindList: [],
      searchName: "",
      isShowAddDialog: false,
      isShowEditDialog: false,
      modifyForm: {},
      addForm: ADD_INIT_FROM,
      modifyFormRules: {
        // deviceType: [{ required: true, message: "设备类型编号1-255", trigger: "blur" ,type: 'number'}],
        name: [{ required: true, message: "设备类型名称", trigger: "blur" }],
        nameEn: [{ required: true, message: "设备类型英文名称", trigger: "blur" }]
      },
      rules: {
        // deviceType: [{ required: true,  message: "设备类型编号1-255", trigger: "blur",type: 'number' }],
        name: [
          { required: true, message: "设备类型名称", trigger: "blur" },
          { min: 1, message: "长度在 1 字符以上", trigger: "blur" },
          { max: 20, message: "长度在 20 字符以内", trigger: "blur" }
        ],
        nameEn: [{ required: true, message: "设备类型英文名称", trigger: "blur" }]
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
    me.getDeviceKindList()
  },
  methods: {
    getList() {
      const me = this
      getAll("/devicetype/")
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
    getDeviceKindList() {
      const me = this
      getAll("/devicekind/")
        .then(response => {
          const { success, data, msg } = response.data
          if (success) {
            me.devicekindList = data
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
      deleteItem("/devicetype/", { "deviceType": row.deviceType }).then(response => {
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
          modifyItem('/devicetype/', me.modifyForm)
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
          addItem('/devicetype/', me.addForm)
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
.basdevicetype {
  text-align: center;
  &__filter-container {
  }
  &__table {
    text-align: center;
  }
}
</style>
