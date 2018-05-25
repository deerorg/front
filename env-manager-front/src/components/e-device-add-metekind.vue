<template>
  <div class="e-device-add-metekind-pane">
    <div class="e-device-add-metekind-pane__filter-container p-filter-container">
        <span class="p-table-name">监控量添加</span>
        <input placeholder="请输入内容" v-model="searchName"  class="p-input" v-if="false">
        <span class="p-add-btn" @click="addBatch">
            批量添加
        </span>
    </div>
         <!-- <el-table-column type="selection" width="55"></el-table-column> -->
    <!-- AI -->
    <section class="table-ai" v-if="type=='AI'">
        <el-table element-loading-text="拼命加载中" empty-text="暂无数据"
        :data="list" stripe
        @selection-change="handleSelectionChange"
        border fit highlight-current-row>
        <el-table-column fixed type="selection" width="55"></el-table-column>
        <el-table-column   label="编号" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.basMeteId }}</span>
        </template>
        </el-table-column>
        <el-table-column label="名称" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.basMeteName }}</span>
        </template>
        </el-table-column>
        <el-table-column label="英文名称" align="center" v-if="false" >
        <template slot-scope="scope">
            <span>{{ scope.row.basMeteNameEn }}</span>
        </template>
        </el-table-column>

        <el-table-column label="设备类型" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.deviceTypeName }}</span>
            </template>
        </el-table-column>

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

        <el-table-column label="上限" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.upEffect }}</span>
            </template>
        </el-table-column>

        <el-table-column label="下限" align="center">
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

        <el-table-column label="操作" align="center" fixed="right" v-if="false">
        <template slot-scope="scope">
            <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"></el-button>
            <el-button v-if="false"
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
        </el-table-column>
    </el-table>
    </section>

<!-- DI -->
    <section class="table-di"  v-if="type=='DI'">
        <el-table element-loading-text="拼命加载中" empty-text="暂无数据"
        :data="list" stripe
        @selection-change="handleSelectionChange"
        border fit highlight-current-row>
        <el-table-column  fixed type="selection" width="55"></el-table-column>
        <el-table-column   label="编号" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.basMeteId }}</span>
        </template>
        </el-table-column>
        <el-table-column label="名称" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.basMeteName }}</span>
        </template>
        </el-table-column>
        <el-table-column label="英文名称" align="center" v-if="false" >
        <template slot-scope="scope">
            <span>{{ scope.row.basMeteNameEn }}</span>
        </template>
        </el-table-column>

        <el-table-column label="设备类型" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.deviceTypeName }}</span>
            </template>
        </el-table-column>

        <el-table-column label="遥信量类型" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.meteType }}-{{ scope.row.metetypeName }}</span>
            </template>
        </el-table-column>

        <!-- <el-table-column label="遥信量类型" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.metetypeName }}</span>
            </template>
        </el-table-column> -->

        <el-table-column label="同类遥信量类型子序号" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.sameMetetypeIndex }}</span>
            </template>
        </el-table-column>
      
        <el-table-column label="监控量类型" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.meteKindName }}</span>
            </template>
        </el-table-column>

        <el-table-column label="遥信量类型英文名称" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.metetypeNameEn }}</span>
            </template>
        </el-table-column>

        <el-table-column label="有效上限" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.upEffect }}</span>
            </template>
        </el-table-column>

        <el-table-column label="遥信量种类" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.signalKind }}</span>
            </template>
        </el-table-column>

        <el-table-column label="上报模式" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.reportType }}</span>
            </template>
        </el-table-column>
        <el-table-column label="上报级别" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.reportLevel }}</span>
            </template>
        </el-table-column>

        <el-table-column label="FSU通道号" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.basChannelNo }}</span>
            </template>
        </el-table-column>

        <el-table-column label="操作" align="center" fixed="right" v-if="false">
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

    <!-- 遥调DI -->
    <section class="table-ao" v-if="type=='AO'">
        <el-table element-loading-text="拼命加载中" empty-text="暂无数据"
        :data="list" stripe
        @selection-change="handleSelectionChange"
        border fit highlight-current-row>
        <el-table-column  fixed type="selection" width="55"></el-table-column>
        <el-table-column   label="编号" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.basMeteId }}</span>
        </template>
        </el-table-column>
        <el-table-column label="名称" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.basMeteName }}</span>
        </template>
        </el-table-column>
        <el-table-column label="英文名称" align="center" v-if="false" >
        <template slot-scope="scope">
            <span>{{ scope.row.basMeteNameEn }}</span>
        </template>
        </el-table-column>

        <el-table-column label="设备类型" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.deviceType }}</span>
            </template>
        </el-table-column>

        <el-table-column label="遥调量类型" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.meteType }}</span>
            </template>
        </el-table-column>

        <el-table-column label="遥调量类型名称" align="center">
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
                <span>{{ scope.row.meteKind }}</span>
            </template>
        </el-table-column>

        <el-table-column label="英文名称" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.metetypeNameEn }}</span>
            </template>
        </el-table-column>

        <el-table-column label="上限" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.upEffect }}</span>
            </template>
        </el-table-column>

        <el-table-column label="下限" align="center">
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

        <el-table-column label="操作" align="center" fixed="right" v-if="false">
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

<!-- 遥控 -->
<section class="table-do"  v-if="type=='DO'">
    <el-table element-loading-text="拼命加载中" empty-text="暂无数据"
        :data="list" stripe
        @selection-change="handleSelectionChange"
        border fit highlight-current-row>
        <el-table-column  fixed type="selection" width="55"></el-table-column>
        <el-table-column   label="编号" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.basMeteId }}</span>
        </template>
        </el-table-column>
        <el-table-column label="名称" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.basMeteName }}</span>
        </template>
        </el-table-column>
        <el-table-column label="英文名称" align="center" v-if="false" >
        <template slot-scope="scope">
            <span>{{ scope.row.basMeteNameEn }}</span>
        </template>
        </el-table-column>

        <el-table-column label="设备类型" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.deviceType }}</span>
            </template>
        </el-table-column>

        <el-table-column label="遥控量类型" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.meteType }}</span>
            </template>
        </el-table-column>

        <el-table-column label="遥控量类型名称" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.metetypeName }}</span>
            </template>
        </el-table-column>

        <el-table-column label="同类遥控量类型子序号" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.sameMetetypeIndex }}</span>
            </template>
        </el-table-column>
      
        <el-table-column label="监控量类型" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.meteKind }}</span>
            </template>
        </el-table-column>

        <el-table-column label="监控量类型的英文名称" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.metetypeNameEn }}</span>
            </template>
        </el-table-column>

        <el-table-column label="FSU通道号" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.basChannelNo }}</span>
            </template>
        </el-table-column>

        <el-table-column label="操作" align="center" fixed="right" v-if="false">
        <template slot-scope="scope">
            <el-button size="mini"  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
        </el-table-column>
    </el-table>

</section>


<!-- CF -->
<section  class="table-cf" v-if="type=='CF'">
        <el-table element-loading-text="拼命加载中" empty-text="暂无数据"
        :data="list" stripe
        @selection-change="handleSelectionChange"
        border fit highlight-current-row>
        <el-table-column  fixed type="selection" width="55"></el-table-column>
        <el-table-column  label="站点" align="center">   
            <template slot-scope="scope">
                <span>{{ scope.row.siteName }}[{{scope.row.siteId}}]</span>
            </template>
        </el-table-column>
        <el-table-column label="设备" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.deviceName }}[{{scope.row.deviceId}}]</span>
        </template>
        </el-table-column>
        <el-table-column label="配置量" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.meteName }}[{{scope.row.meteId}}]</span>
        </template>
        </el-table-column>

        <el-table-column label="基本配置量" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.basMeteId }}</span>
            </template>
        </el-table-column>

        <el-table-column label="配置量类型" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.meteKind }}</span>
            </template>
        </el-table-column>
       
        <el-table-column label="可控状态" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.controlStatus }}</span>
            </template>
        </el-table-column>

        <el-table-column label="控制使能条件" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.enableString }}</span>
            </template>
        </el-table-column>

        <el-table-column label="控制成功条件" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.succeedString }}</span>
            </template>
        </el-table-column>
        <el-table-column label="触发条件" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.triggerString }}</span>
            </template>
        </el-table-column>

        <el-table-column label="单位" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.unit }}</span>
            </template>
        </el-table-column>

         <el-table-column label="控制参数" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.controlValue }}</span>
            </template>
        </el-table-column>

        <el-table-column label="配置值" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.configValue }}</span>
            </template>
        </el-table-column>

        <el-table-column label="FSU" align="center">
            <template slot-scope="scope">
                <span>{{scope.row.fsuId}} 通道号:{{ scope.row.basChannelNo }}</span>
            </template>
        </el-table-column>

        <el-table-column label="操作" align="center" fixed="right" v-if="false">
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


   <section v-if="false">
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
import { getInfo, postItem } from "@/api/advanced"

export default {
  name: 'e-device-add-metekind',
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
      // 多选的行
      multipleSelection: [],
      total: 0,
      pageParmas: {
        "pageNum": 1,
        "pageSize": 20
      },
      searchName: ''
    }
  },
  filters: {

  },
  watch: {
    'type': function(val, oldVal) {
      const me = this
      if (val != oldVal) {
        me.getList()
      }
    }
  },
  created() {
    console.log("---created")
  },
  mounted() {
    const me = this
    me.getList()
    console.log("---created")
  },
  destroyed() {
    console.log("---destroyed")
  },
  methods: {
    getList() {
      const me = this
      // 获取对应信息
      const TypeMap = {
        AI: 'telemeter',
        DI: 'telesignal',
        AO: 'teleadjust',
        DO: 'telecontrol',
        CF: 'teleconfig'
      }
      const tableType = TypeMap[me.type]
      // let  currentMeteKind = map[me.type];
      const url = `/${tableType}/query4devicetemplate?deviceModel=${me.deviceModel.deviceModel}`
      getInfo(url).then(response => {
        const { data, msg, success } = response.data
        if (success) {
          me.list = data
          // me.total = data.total;
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
    // 处理多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleEdit(index, row) {

    },
    handleDelete(index, row) {

    },
    // 批量添加
    addBatch() {
      const me = this

      if (me.multipleSelection.length == 0) {
        me.$message.info("请先选择要添加的")
        return
      }
      const addList = me.multipleSelection.map(x => {
        x.deviceModel = me.deviceModel.deviceModel
        return x
      })

      postItem('/devicetemplate/batchadd', addList).then(response => {
        const { data, msg, success } = response.data
        // // 关闭弹出框  todo
        // me.$bus.$emit();
        if (success) {
          me.$message.success("添加成功")

          // 更新监控量tabs的页面请求  e-tab-pane
          me.$bus.$emit('update-e-tab-pane-request', {
            type: me.type,
            deviceModel: me.deviceModel
          })
        } else {
          me.$message.error(msg)
        }
      })
    }
  }
}
</script>

