<template>
    <div class="basdevicetemplate">
    <div class="basdevicetemplate__filter-container p-filter-container">
        <span class="p-table-name">系统监控量模板</span>
         <section class="p-input-wrapper">
            <input placeholder="请输入内容" v-model="searchName"  class="p-input" @keydown.enter="searchKey">
         </section>
        <span class="p-add-btn" @click="importFile" v-show="false">
            ✚  查询
        </span>
        <span class="p-add-btn" @click="searchKey" >
            ✚  查询
        </span>
    </div>

    <section class="basdevicetemplate__table">
        <el-table element-loading-text="拼命加载中" empty-text="暂无数据"
        :data="list" stripe
        border fit highlight-current-row>
        <el-table-column   label="设备型号" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.deviceModel }}</span>
        </template>
        </el-table-column>
        <el-table-column   label="监控量类型" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.meteKind }}</span>
        </template>
        </el-table-column>
        <el-table-column label="基本监控量编号" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.basMeteId }}</span>
        </template>
        </el-table-column>
        <el-table-column label="FSU通道号" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.basChannelNo }}</span>
        </template>
        </el-table-column>
        <el-table-column label="监控量名称" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.basMeteName }}</span>
            </template>
        </el-table-column>

        <el-table-column label="遥测量上限" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.upEffect }}</span>
            </template>
        </el-table-column>
        <el-table-column label="遥测量下限" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.lowEffect }}</span>
            </template>
        </el-table-column>
        <el-table-column label="监控量精度" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.accuracy }}</span>
            </template>
        </el-table-column>
        <el-table-column label="单位" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.unit }}</span>
            </template>
        </el-table-column>

        <el-table-column label="操作" align="center" >
        <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
        <el-dialog title="修改信息" :visible.sync="isShowEditDialog">
            <el-form ref="modifyForm" label-position="left"  label-width="200px"  :model="modifyForm" :rules="modifyFormRules">
                <el-form-item label="设备型号" prop="basMeteName" >
                    <el-input v-model="modifyForm.deviceModel" readonly ></el-input>
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
                <el-form-item label="FSU通道号" prop="basChannelNo" v-if="false">
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



    </div>
</template>

<script>
import { getAll, modifyItem, getInfo } from "@/api/advanced"

export default {
  name: "basdevicetemplate",
  data() {
    return {
      rawList: [],
      list: [],
      total: 0,
      pageParmas: {
        "pageNum": 1,
        "pageSize": 5
      },
      // 级别列表
      searchName: "",
      isShowAddDialog: false,
      isShowEditDialog: false,
      modifyForm: {},
      modifyFormRules: {
        upEffect: [{ required: true, message: "遥调量有效上限", trigger: "blur" }],
        lowEffect: [{ required: true, message: "遥调量有效下限", trigger: "blur" }],
        accuracy: [{ required: true, message: "遥调量精度" }],
        defaultValue: [{ required: true, message: "遥调量缺省值", trigger: "blur" }],
        unit: [{ required: true, message: "遥调量单位", trigger: "blur" }]
        // basChannelNo:[{ required: true, message: "遥调量FSU通道号", trigger: "blur" }]
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
      const url = `/devicetemplate/queryBy?queryLike=${me.searchName}&pageNum=${me.pageParmas.pageNum}&pageSize=${me.pageParmas.pageSize}`
      getInfo(url).then(response => {
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
    handleSizeChange(pageSize) {
      this.pageParmas.pageSize = pageSize
      this.getList()
    },
    handleCurrentChange(pageIndex) {
      this.pageParmas.pageNum = pageIndex
      this.getList()
    },
    // 添加记录
    importFile() {
    //    this.$message.info("TODO导入....");
    },
    confirmModify() {
      const me = this
      const currentItem = me.modifyForm
      // let pathUrl =  `/devicetemplate/${currentItem.deviceModel}/${currentItem.basMeteId}`;
      me.$refs.modifyForm.validate(valid => {
        if (valid) {
          modifyItem('/devicetemplate/', me.modifyForm).then(response => {
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
          addItem('/devicetemplate/', me.addForm)
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
.basdevicetemplate {
  text-align: center;
  &__filter-container {
  }
  &__table {
    text-align: center;
  }
}
</style>

