<template>
    <div class="bastelemeter">
    <div class="bastelemeter__filter-container p-filter-container">
        <span class="p-table-name">遥测量基本列表</span>
         <section class="p-input-wrapper">
        <input placeholder="请输入内容" v-model="searchName"  class="p-input">
         </section>
        <span class="p-add-btn" @click="add">
            ✚  查看
        </span>
    </div>


    <section class="bastelemeter__table">
        <el-table element-loading-text="拼命加载中" empty-text="暂无数据"
        :data="list" stripe
        border fit highlight-current-row>
        <el-table-column fixed  label="编号" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.basMeteId }}</span>
        </template>
        </el-table-column>
        <el-table-column label="名称" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.basMeteName }}</span>
        </template>
        </el-table-column>
        <el-table-column label="英文名称" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.basMeteNameEn }}</span>
        </template>
        </el-table-column>

        <el-table-column label="设备类型" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.deviceTypeName }}</span>
            </template>
        </el-table-column>

        <!-- <el-table-column label="遥测量类型" align="center" v-show="false">
            <template slot-scope="scope">
                <span>{{ scope.row.meteType }}</span>
            </template>
        </el-table-column> -->

        <el-table-column label="遥测量类型名称" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.metetypeName }}</span>
            </template>
        </el-table-column>

        <el-table-column label="子序号" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.sameMetetypeIndex }}</span>
            </template>
        </el-table-column>
      
        <el-table-column label="监控量类型" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.meteKindName }}</span>
            </template>
        </el-table-column>

        <el-table-column label="英文名称" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.metetypeNameEn }}</span>
            </template>
        </el-table-column>

        <el-table-column label="有效上限" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.upEffect }}</span>
            </template>
        </el-table-column>

        <el-table-column label="有效下限" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.lowEffect }}</span>
            </template>
        </el-table-column>

        <el-table-column label="精度" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.accuracy }}</span>
            </template>
        </el-table-column>

        <el-table-column label="单位" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.unit }}</span>
            </template>
        </el-table-column>

        <el-table-column label="FSU通道号" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.basChannelNo }}</span>
            </template>
        </el-table-column>

        <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="scope">
            <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button v-if="false"
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
        </el-table-column>
    </el-table>
    </section>

    <!--  修改记录 -->
    <section class="layer__dialog">
        <el-dialog title="修改遥测量基本信息" :visible.sync="isShowEditDialog">
            <el-form ref="modifyForm" label-position="left"   label-width="200px"  :model="modifyForm" :rules="modifyFormRules">
                <el-form-item label="遥测量基本名称" prop="basMeteName" >
                    <el-input v-model="modifyForm.basMeteName" readonly ></el-input>
                </el-form-item>
                  <el-form-item label="有效上限" prop="upEffect" >
                    <el-input v-model="modifyForm.upEffect" placeholder="请输入有效上限"></el-input>
                </el-form-item>
                <el-form-item label="有效下限" prop="lowEffect" >
                    <el-input v-model="modifyForm.lowEffect" placeholder="请输入有效下限"></el-input>
                </el-form-item>

                 <el-form-item label="精度" prop="accuracy" >
                    <el-input-number v-model="modifyForm.accuracy" placeholder="精度" :min="1" :max="3"></el-input-number>
                </el-form-item>
                <el-form-item label="单位" prop="unit" >
                    <el-input v-model="modifyForm.unit" placeholder="请输入单位" :maxlength="8"></el-input>
                </el-form-item>
              

                <el-form-item label="FSU通道号" prop="basChannelNo" >
                    <el-input v-model="modifyForm.basChannelNo" placeholder="请输入FSU通道号"></el-input>
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
        <el-dialog title="添加遥测量基本信息" :visible.sync="isShowAddDialog">
            <el-form ref="addForm" label-position="left"   label-width="200px"  :model="addForm" :rules="rules">
                <el-form-item label="遥测量基本名称" prop="basMeteName" >
                    <el-input v-model="addForm.basMeteName" placeholder="请输入遥测量基本名称"></el-input>
                </el-form-item>
                <el-form-item label="遥测量基本英文名称" prop="basMeteNameEn" >
                    <el-input v-model="addForm.basMeteNameEn" placeholder="请输入遥测量基本英文名称"></el-input>
                </el-form-item>
                 <el-form-item label="设备类型" prop="deviceType" >
                   <el-select placeholder="请输入所属设备类型" v-model="addForm.deviceType">
                        <el-option  v-for="item in deviceTypeList" :label="item.name" :value="item.deviceType" :key="item.deviceType"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="遥测量类型" prop="meteType" >
                    <el-input-number :min="1" :max="1000" v-model="addForm.meteType" placeholder="请输入遥测量基本类型"></el-input-number>
                </el-form-item>
                 <el-form-item label="同类遥测量类型子序号" prop="sameMetetypeIndex" >
                    <el-input v-model="addForm.sameMetetypeIndex" placeholder="请输入遥测量基本名称"></el-input>
                </el-form-item>
                <el-form-item label="遥测量类型名称" prop="metetypeName" >
                    <el-input v-model="addForm.metetypeName" placeholder="请输入遥测量类型名称"></el-input>
                </el-form-item>
                 <el-form-item label="英文名称" prop="metetypeNameEn" >
                    <el-input v-model="addForm.metetypeNameEn" placeholder="请输入遥测量类型英文名称"></el-input>
                </el-form-item>
                <el-form-item label="监控量类型" prop="meteKind" >
                    <el-select placeholder="请选择监控量类型" v-model="addForm.meteKind">
                        <el-option  v-for="item in meteKindList" :label="item.kindName" :value="item.meteKind" :key="item.meteKind"></el-option>
                    </el-select>
                </el-form-item>
                 <el-form-item label="上限" prop="upEffect" >
                    <el-input v-model="addForm.upEffect" placeholder="请输入有效上限"></el-input>
                </el-form-item>
                <el-form-item label="下限" prop="lowEffect" >
                    <el-input v-model="addForm.lowEffect" placeholder="请输入有效下限"></el-input>
                </el-form-item>

                 <el-form-item label="精度" prop="accuracy" >
                    <el-input-number v-model="addForm.accuracy" placeholder="精度" :min="1" :max="3"></el-input-number>
                </el-form-item>
                <el-form-item label="单位" prop="unit" >
                    <el-input v-model="addForm.unit" placeholder="请输入单位"></el-input>
                </el-form-item>

                <el-form-item label="FSU通道号" prop="basChannelNo" v-if="false">
                    <el-input v-model="addForm.basChannelNo" placeholder="请输入FSU通道号"></el-input>
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
  basMeteName: "",
  basMeteNameEn: "",
  deviceType: "",
  meteType: 1,
  sameMetetypeIndex: 0,
  metetypeName: "",
  metetypeNameEn: "",
  meteKind: "",
  upEffect: "",
  lowEffect: "",
  precision: 1,
  unit: "",
  basChannelNo: 0
}
export default {
  name: "bastelemeter",
  data() {
    return {
      rawList: [],
      list: [],
      // 级别列表
      siteLevelList: [],

      deviceTypeList: [],
      meteKindList: [],

      searchName: "",
      isShowAddDialog: false,
      isShowEditDialog: false,
      modifyForm: {},
      addForm: ADD_INIT_FROM,
      modifyFormRules: {
        siteLevel: [{ required: true, message: "遥测量基本编号1-255", trigger: "blur", type: 'number' }],
        name: [{ required: true, message: "遥测量基本名称", trigger: "blur" }],
        nameEn: [{ required: true, message: "遥测量基本英文名称", trigger: "blur" }]
      },
      rules: {
        siteLevel: [{ required: true, message: "遥测量基本编号1-255", trigger: "blur", type: 'number' }],
        name: [
          { required: true, message: "遥测量基本名称", trigger: "blur" },
          { min: 1, message: "长度在 1 字符以上", trigger: "blur" },
          { max: 20, message: "长度在 20 字符以内", trigger: "blur" }
        ],
        nameEn: [{ required: true, message: "遥测量基本英文名称", trigger: "blur" }]
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
      getAll("/telemeter/")
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

      getAll("/metekind/")
        .then(response => {
          const { success, data, msg } = response.data
          if (success) {
            me.meteKindList = data
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
      deleteItem("/telemeter/", { siteLevel: row.siteLevel }).then(response => {
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
      this.$message.info("添加数据通过高级设置->模板管理->监控量模板管理->导入 批量导入添加")
      // this.isShowAddDialog = true;
    },
    confirmModify() {
      const me = this
      // PUT /telemeter/{basMeteId}/{deviceType}/{meteType}
      const currentItem = me.modifyForm
      // let pathUrl =  `/telemeter/${currentItem.basMeteId}/${currentItem.deviceType}/${currentItem.meteType}`;

      me.$refs.modifyForm.validate(valid => {
        if (valid) {
          modifyItem('/telemeter/', me.modifyForm).then(response => {
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
          addItem('/telemeter/', me.addForm)
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
.bastelemeter {
  text-align: center;
  &__filter-container {
  }
  &__table {
    text-align: center;
  }
}
</style>

