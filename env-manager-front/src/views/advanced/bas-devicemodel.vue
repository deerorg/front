<template>
    <div class="basdevicemodel">
    <div class="basdevicemodel__filter-container p-filter-container">
        <span class="p-table-name">系统设备模板列表</span>
         <section class="p-input-wrapper">
        <input placeholder="请输入内容" v-model="searchName"  class="p-input" @keydown.enter="searchKey">
         </section>
        <span class="p-add-btn" @click="add">
            ✚  添加
        </span>
    </div>

    <section class="basdevicemodel__table">
        <el-table element-loading-text="拼命加载中" empty-text="暂无数据"
        :data="list" stripe
        border fit highlight-current-row>
        <el-table-column label="编号" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.deviceModel }}</span>
            </template>
        </el-table-column>
        <el-table-column label="设备型号名称" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.modelName }}</span>
        </template>
        </el-table-column>
        <el-table-column label="英文名称" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.modelNameEn }}</span>
            </template>
        </el-table-column>
        <el-table-column label="所属设备类型" align="center">
            <template slot-scope="scope">
                <span v-if="false">{{ scope.row.deviceType }}</span>
                <span>{{ scope.row.deviceTypeName }}</span>
            </template>
        </el-table-column>
          <el-table-column label="所属设备种类" align="center">
            <template slot-scope="scope">
                <span v-if="false">{{ scope.row.deviceKind }}</span>
                <span>{{ scope.row.deviceKindName }}</span>
            </template>
        </el-table-column>
          <el-table-column label="设备厂商编号" align="center">
            <template slot-scope="scope">
                <span v-if="false">{{ scope.row.manufacturerId }}</span>
                <span>{{ scope.row.manufacturerName }}</span>
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
        <el-dialog title="修改系统设备模板信息" :visible.sync="isShowEditDialog">
            <el-form ref="modifyForm" label-position="left"  label-width="200px"  :model="modifyForm" :rules="modifyFormRules">
                <el-form-item label="系统设备模板编号" prop="deviceModel">
                    <el-input v-model="modifyForm.deviceModel" readonly disabled></el-input>
                </el-form-item>
                <el-form-item label="系统设备模板名称" prop="modelName" >
                    <el-input v-model="modifyForm.modelName"></el-input>
                </el-form-item>
                <el-form-item label="系统设备模板英文名称" prop="modelNameEn" >
                    <el-input v-model="modifyForm.modelNameEn"></el-input>
                </el-form-item>
                <el-form-item label="所属设备种类" prop="deviceKind" >
                    <el-select placeholder="请输入所属设备种类" v-model="modifyForm.deviceKind">
                        <el-option  v-for="item in deviceKindList" :label="item.kindName" :value="item.deviceKind" :key="item.deviceKind"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属设备类型" prop="deviceType" >
                    <el-select placeholder="请输入所属设备类型" v-model="modifyForm.deviceType">
                        <el-option  v-for="item in deviceTypeList" :label="item.name" :value="item.deviceType" :key="item.deviceType"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="设备厂商编号" prop="manufacturerId" >
                   <el-select placeholder="请选择设备厂商编号" v-model="modifyForm.manufacturerId">
                        <el-option  v-for="item in manufacturerList" :label="item.name" :value="item.manufacturerId" :key="item.manufacturerId"></el-option>
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
        <el-dialog title="添加系统设备模板信息" :visible.sync="isShowAddDialog">
            <el-form ref="addForm" label-position="left"   label-width="200px"  :model="addForm" :rules="rules">
                <el-form-item label="系统设备模板名称" prop="modelName" >
                    <el-input v-model="addForm.modelName" placeholder="请输入系统设备模板名称"></el-input>
                </el-form-item>
                <el-form-item label="系统设备模板英文名称" prop="modelNameEn" >
                    <el-input v-model="addForm.modelNameEn" placeholder="请输入系统设备模板英文名称"></el-input>
                </el-form-item>
                <el-form-item label="所属设备种类" prop="deviceKind" >
                    <el-select placeholder="请输入所属设备种类" v-model="addForm.deviceKind">
                        <el-option  v-for="item in deviceKindList" :label="item.kindName" :value="item.deviceKind" :key="item.deviceKind"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属设备类型" prop="deviceType" >
                     <el-select placeholder="请输入所属设备类型" v-model="addForm.deviceType">
                        <el-option  v-for="item in deviceTypeList" :label="item.name" :value="item.deviceType" :key="item.deviceType"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="设备厂商编号" prop="manufacturerId" >
                   <el-select placeholder="请选择设备厂商编号" v-model="addForm.manufacturerId">
                        <el-option  v-for="item in manufacturerList" :label="item.name" :value="item.manufacturerId" :key="item.manufacturerId"></el-option>
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
import { getAll, addItem, deleteItem, modifyItem, getInfo } from "@/api/advanced"
const ADD_INIT_FROM = {
  modelName: "",
  modelNameEn: "",
  deviceKind: "",
  manufacturerId: "",
  deviceType: ""
}
export default {
  name: "basdevicemodel",
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
      deviceModelList: [],

      // device_type deviceKind device manufacturer
      deviceTypeList: [],
      deviceKindList: [],
      manufacturerList: [],

      searchName: "",
      isShowAddDialog: false,
      isShowEditDialog: false,
      modifyForm: {},
      addForm: ADD_INIT_FROM,
      modifyFormRules: {
        deviceModel: [{ required: true, message: "系统设备模板编号1-255", trigger: "blur", type: 'number' }],
        modelName: [{ required: true, message: "系统设备模板名称", trigger: "blur" }],
        modelNameEn: [{ required: true, message: "系统设备模板英文名称", trigger: "blur" }],
        deviceKind: [{ required: true, message: "请选择系统设备模板种类" }],
        deviceType: [{ required: true, message: "请选择系统设备模板类型" }],
        manufacturerId: [{ required: true, message: "" }]
      },
      rules: {
        modelName: [
          { required: true, message: "系统设备模板名称", trigger: "blur" },
          { min: 1, message: "长度在 1 字符以上", trigger: "blur" },
          { max: 20, message: "长度在 20 字符以内", trigger: "blur" }
        ],
        modelNameEn: [{ required: true, message: "系统设备模板英文名称", trigger: "blur" }],
        deviceKind: [{ required: true, message: "请选择系统设备所属种类" }],
        deviceType: [{ required: true, message: "请选择系统设备所属类型" }],
        manufacturerId: [{ required: true, message: "请选择系统设备设备制造商" }]
      }
    }
  },
  mounted() {
    const me = this
    me.getList()
    me.getOthersData()
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
      const url = `/devicemodel/pagequery?queryLike=${me.searchName}&pageNum=${me.pageParmas.pageNum}&pageSize=${me.pageParmas.pageSize}`
      getInfo(url)
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
    getOthersData() {
      const me = this
      getAll("/devicetype/")
        .then(response => {
          const { success, data, msg } = response.data
          if (success) {
            me.deviceTypeList = data
          } else {
            me.$message.error(msg)
          }
        })
        .catch(err => {
          me.$message.error("网络错误")
        })

      getAll("/devicekind/")
        .then(response => {
          const { success, data, msg } = response.data
          if (success) {
            me.deviceKindList = data
          } else {
            me.$message.error(msg)
          }
        })
        .catch(err => {
          me.$message.error("网络错误")
        })

      getAll("/manufacturer/")
        .then(response => {
          const { success, data, msg } = response.data
          if (success) {
            me.manufacturerList = data
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
      deleteItem("/devicemodel/", { deviceModel: row.deviceModel }).then(response => {
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
          modifyItem('/devicemodel/', me.modifyForm)
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
          addItem('/devicemodel/', me.addForm)
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
.basdevicemodel {
  text-align: center;
  &__filter-container {
  }
  &__table {
    text-align: center;
  }
}
</style>

