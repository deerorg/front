<template>
    <el-menu mode="vertical" :default-active="$route.path" class="esidebar">
        <e-sidebar-item :routes='routes1'></e-sidebar-item>
    </el-menu>
</template>

<script>
import ESidebarItem from "./esidebaritem"
const testData = [
  {
    menuKey: "f-layer-index",
    linkUrl: "/map/parameters-manager",
    menuId: "11E7A1B93A724B57AE3A3D530211",
    linkType: "1",
    menuName: "地图参数管理",
    parentId: ""
  },
  {
    childrens: [
      {
        menuKey: "f-project_upload",
        linkUrl: "/map/style-point",
        menuId: "11E7A1BA2AF8D94DAE3A3D5302377ED7",
        linkType: "1",
        menuName: "点样式",
        parentId: "11E7A1B8FF6F5485AE3A3D5302377ED7"
      },
      {
        menuKey: "f-project_alert",
        linkUrl: "/map/style-line",
        menuId: "11E7A1BA4315558FAE3A3D5302377ED7",
        linkType: "1",
        menuName: "线样式",
        parentId: "11E7A1B8FF6F5485AE3A3D5302377ED7"
      },
      {
        menuKey: "f-project_index",
        linkUrl: "/map/style-area",
        menuId: "11E7A1BA36CF3E8EAE3A3D5302377ED7",
        linkType: "1",
        menuName: "面样式",
        parentId: "11E7A1B8FF6F5485AE3A3D5302377ED7"
      }
    ],
    menuKey: "f-project",
    linkUrl: "/map",
    menuId: "11E7A1B8FF6F5485AE3A3D5302377ED7",
    linkType: "1",
    menuName: "地图样式管理",
    parentId: ""
  },

  {
    childrens: [
      {
        menuKey: "f-pollution_index",
        linkUrl: "/map/datasource-manager",
        menuId: "11E7A1BA513D4BF0AE3A3D5302377ED7",
        linkType: "1",
        menuName: "数据源管理",
        parentId: "11E7A1B90885AF66AE3A3D5302377ED7"
      },
      {
        menuKey: "f-pollution_index",
        linkUrl: "/map/dataset-manager",
        menuId: "11E7A1BA513D4BF0AE3A02377ED7",
        linkType: "1",
        menuName: "数据集管理",
        parentId: "11E7A1B90885AF66AE3A3D5302377ED7"
      }
    ],
    menuKey: "f-pollution",
    linkUrl: "/map/data-manager",
    menuId: "11E7A1B90885AF66AE3A3D5302377ED7",
    linkType: "1",
    menuName: "数据资源管理",
    parentId: ""
  },
  {
    menuKey: "f-solid-waste-management",
    linkUrl: "/map",
    menuId: "11E7A1B95E976069AE3A3D5302377ED7",
    linkType: "1",
    menuName: "图层配置",
    parentId: "",
    childrens: [
      {
        menuKey: "f-pollution_index",
        linkUrl: "/map/layer-vector",
        menuId: "11E7A1BA513D4BF0AE3A3D5302377ED7",
        linkType: "1",
        menuName: "矢量图层配置",
        parentId: "11E7A1B95E976069AE3A3D5302377ED7"
      },
      {
        menuKey: "f-pollution_index",
        linkUrl: "/map/layer-grid",
        menuId: "11E7A1BA513D4BF0AE3A02377ED7",
        linkType: "1",
        menuName: "栅格图层配置",
        parentId: "11E7A1B95E976069AE3A3D5302377ED7"
      }
    ]
  },
  {
    menuKey: "f-environmental-emergency",
    linkUrl: "/test",
    menuId: "11E7A1B966722E0AAE3A3D5302377ED7",
    linkType: "1",
    menuName: "测试界面",
    parentId: ""
  }
]
export default {
  components: { ESidebarItem },
  props: {
    routes: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      routes1: testData
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.esidebar.el-menu {
  min-height: 100%;
  background-color:transparent;
  color: #fff;
  .el-submenu .el-menu {
    background-color: transparent !important;
  }
}
</style>
