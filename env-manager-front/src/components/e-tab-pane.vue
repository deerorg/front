<template>
  <div class="e-tab-pane">
   
    <div class="e-tab-pane__filter-container p-filter-container">
        <span class="p-table-name">{{cTitle}}</span>
        <input placeholder="请输入内容"  class="p-input" v-model="searchName"  @keyup.enter="handleSearch">
    </div>

  <el-table :data="list" border fit highlight-current-row>
    <el-table-column align="center" label="设备型号"  v-if="false">
      <template slot-scope="scope">
        <span>{{scope.row.deviceModel}}</span>
      </template>
    </el-table-column>

    <el-table-column  align="center" label="类型">
      <template slot-scope="scope">
        <span>{{scope.row.meteKind}}</span>
      </template>
    </el-table-column>

     <el-table-column  align="center" label="名称">
      <template slot-scope="scope">
        <span>{{scope.row.basMeteName}}</span>
      </template>
    </el-table-column>

    <el-table-column label="编号">
      <template slot-scope="scope">
        <span>{{scope.row.basMeteId}}</span>
      </template>
    </el-table-column>

    <el-table-column  align="center" label="FSU通道号">
      <template slot-scope="scope">
        <span>{{scope.row.basChannelNo}}</span>
      </template>
    </el-table-column>

    <el-table-column label="上限">
      <template slot-scope="scope">
            <span>{{scope.row.upEffect}}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="下限">
      <template slot-scope="scope">
        <span>{{scope.row.lowEffect}}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="精度">
      <template slot-scope="scope">
        <span>{{scope.row.accuracy}}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="单位">
      <template slot-scope="scope">
        <span>{{scope.row.unit}}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="操作">
      <template slot-scope="scope">
        <el-button  size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)" v-if="false">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
   
        <!--  修改记录 -->
    <section class="layer__dialog">
        <el-dialog title="修改信息" :visible.sync="isShowEditDialog">
            <el-form ref="modifyForm" label-position="left"  label-width="200px"  :model="modifyForm" :rules="modifyFormRules">
                <el-form-item label="设备型号" prop="deviceModel" >
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
</div>
  
</template>

<script>
import { getInfo, modifyItem } from "@/api/advanced"

const MAP_ARR = [{ label: '遥测AI', key: 'AI' },
  { label: '遥信DI', key: 'DI' },
  { label: '遥调AO', key: 'AO' },
  { label: '遥控DO', key: 'DO' },
  { label: '配置CF', key: 'CF' }]

// 获取对应信息
const CURRENT_METEKIND_MAP = {
  AI: '1',
  DI: '2',
  AO: '3',
  DO: '4',
  CF: '5'
}

export default {
  name: 'etabpane',
  props: {
    type: {
      type: String,
      default: 'AI'
    },
    deviceModel: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      pageParmas: {
        "pageNum": 1,
        "pageSize": 20
      },
      isShowEditDialog: false,
      searchName: '',
      modifyForm: {},
      modifyFormRules: {

      }
    }
  },
  filters: {

  },
  computed: {
    cTitle: function() {
      const item = MAP_ARR.find(x => x.key == this.type)
      return item.label
    }
  },
  created() {
    const me = this
    if (this.deviceModel.deviceModel) {
      this.getList()
    }
    // 注册事件 在 e-device-model-tree中调用
    this.$bus.$on('defalut-request-ai', (currentData) => {
      const url = `/devicetemplate/queryBy?deviceModel=${currentData.deviceModel}&meteKind=1&pageNum=${me.pageParmas.pageNum}&pageSize=${me.pageParmas.pageSize}`
      getInfo(url).then(response => {
        const { data, msg, success } = response.data
        if (success) {
          me.list = data.list
          me.total = data.total
        }
      })
    })
  },

  methods: {
    getList() {
      const me = this
      const currentMeteKind = CURRENT_METEKIND_MAP[me.type]
      const url = `/devicetemplate/queryBy?deviceModel=${me.deviceModel.deviceModel}&meteKind=${currentMeteKind}&pageNum=${me.pageParmas.pageNum}&pageSize=${me.pageParmas.pageSize}`
      getInfo(url).then(response => {
        const { data, msg, success } = response.data
        if (success) {
          me.list = data.list
          me.total = data.total
        } else {
          me.$message.error(msg)
        }
      })
    },
    handleSizeChange(pageSize) {
      this.pageParmas.pageSize = pageSize
      this.getList()
    },
    handleCurrentChange(pageIndex) {
      this.pageParmas.pageNum = pageIndex
      this.getList()
    },
    handleEdit(index, row) {
      const me = this
      const backdata = JSON.parse(JSON.stringify(row))
      me.modifyForm = backdata
      me.isShowEditDialog = true
    },
    confirmModify() {
      const me = this
      const currentItem = me.modifyForm
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
    handleDelete(index, row) {

    },

    // 关键字查询
    handleSearch() {
      const me = this
      const key = me.searchName
      const currentMeteKind = CURRENT_METEKIND_MAP[me.type]
      if (key) {
        const url = `/devicetemplate/queryBy?deviceModel=${me.deviceModel.deviceModel}&meteKind=${currentMeteKind}&pageNum=${me.pageParmas.pageNum}&pageSize=${me.pageParmas.pageSize}&queryLike=${key}`
        getInfo(url).then(response => {
          const { data, msg, success } = response.data
          if (success) {
            me.list = data.list
            me.total = data.total
          } else {
            me.$message.error(msg)
          }
        })
      }
    }
  }
}
</script>

