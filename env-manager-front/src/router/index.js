import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading

/* layout */
import Layout from '../views/layout/Layout'
import HomeLayout from '../views/layout/home-layout'
import Home from '@/views/home'

import Err404 from '@/views/404.vue'
import Err401 from '@/views/401.vue'

// import Test from '@/views/test';
// 高级设置

// 高级设置模板
import TemplateLayout from '../views/advanced/bas-template'
// 通用设置模板
import GeneralLayout from '../views/general/general-layout'

// 实时监控模板
import MonitoringLayout from '../views/layout/monitoring-layout'
import AlarmLayout from '../views/layout/alarm-layout'

import ValueAddedIndex from '../views/home-value-added/'
import AlarmIndex from '../views/home-alarm/'
import DataAnalysisIndex from '../views/home-data-analysis/'
import MonitoringIndex from '../views/home-monitoring/'

Vue.use(Router)

export const constantRouterMap = [{
  path: '/login',
  component: _import('login/index'),
  hidden: true
},
{
  path: '/',
  hidden: true,
  redirect: '/login'
},
{
  path: '/home',
  component: HomeLayout,
  redirect: '/home',
  hidden: true,
  children: [{
    path: '/home',
    name: '首页',
    component: Home
  }]
},
{
  path: '/404',
  component: Err404,
  hidden: true
},

{
  path: '/monitoring',
  component: MonitoringLayout,
  name: '实时监控',
  redirect: '/monitoring/index',
  hidden: true,
  children: [{
    path: '/monitoring/index',
    component: MonitoringIndex
  }, {
    path: '/monitoring/one',
    component: _import('home-monitoring/one-grid')
  },{
    path: '/monitoring/four',
    component: _import('home-monitoring/four-grid')
  }, {
    path: '/monitoring/nine',
    component: _import('home-monitoring/nine-grid')
  }, {
    path: '/monitoring/sixteen',
    component: _import('home-monitoring/sixteen-grid')
  }]
},
{
  path: '/alarm',
  component: AlarmLayout,
  name: '告警管理',
  hidden: true,
  redirect: '/alarm/index',
  children: [{
    path: '/alarm/index',
    component: AlarmIndex
  }]
},
{
  path: '/value-added',
  component: HomeLayout,
  redirect: '/value-added/index',
  name: '增值服务',
  hidden: true,
  children: [{
    path: '/value-added/index',
    name: '增值服务',
    component: ValueAddedIndex
  }]
},
{
  path: '/data-analysis',
  component: HomeLayout,
  name: '数据分析',
  redirect: '/data-analysis/index',
  hidden: true,
  children: [{
    path: '/data-analysis/index',
    name: '数据分析',
    component: DataAnalysisIndex
  }]
},
{
  path: '/system-setting',
  component: Layout,
  name: '系统配置',
  hidden: true,
  redirect: '/general/site/cfg-site'
},
{
  path: '/401',
  component: Err401,
  hidden: true
},
  // {
  //     path: '/',
  //     component: Layout,
  //     redirect: '/dashboard',
  //     name: 'Dashboard',
  //     hidden: true,
  //     children: [{
  //         path: 'dashboard',
  //         component: _import('dashboard/index')
  //     }]
  // },
{
  path: '/setting',
  component: Layout,
  redirect: 'noredirect',
  name: '高级配置',
  icon: 'gaojipeizhi',
  children: [{
    path: 'bas-sitekind',
    name: '站点类型',
    component: _import('advanced/bas-sitekind')
  },
  {
    path: 'bas-sitelevel',
    name: '站点级别',
    component: _import('advanced/bas-sitelevel')
  },
  {
    path: 'bas-nettype',
    name: '组网类型',
    component: _import('advanced/bas-nettype')
  },
  {
    path: 'bas-devicestatus',
    name: '设备状态',
    component: _import('advanced/bas-devicestatus')
  },
  {
    path: 'bas-devicestatusmap',
    name: '设备状态映射',
    component: _import('advanced/bas-devicestatusmap')
  },
  {
    path: 'bas-manufacturer',
    name: '制造商',
    component: _import('advanced/bas-manufacturer')
  },
  {
    path: 'bas-devicekind',
    name: '设备种类',
    component: _import('advanced/bas-devicekind')
  },
  {
    path: 'bas-devicetype',
    name: '设备类型',
    component: _import('advanced/bas-devicetype')
  },
  {
    path: 'bas-explain',
    name: '遥信量解释',
    component: _import('advanced/bas-explain')
  },
  {
    path: 'bas-explaintype',
    name: '遥信量解释类型',
    component: _import('advanced/bas-explaintype')
  },
  {
    path: 'bas-reportlevel',
    name: '遥信量上报级别',
    component: _import('advanced/bas-reportlevel')
  },
  {
    path: 'bas-reporttype',
    name: '遥信量上报类型',
    component: _import('advanced/bas-reporttype')
  },
  {
    path: 'bas-signalkind',
    name: '遥信量类型',
    component: _import('advanced/bas-signalkind')
  },
  {
    path: 'bas-masktype',
    name: '告警屏蔽类型',
    component: _import('advanced/bas-masktype')
  },
  {
    path: 'bas-reportkind',
    name: '遥测量上报种类',
    component: _import('advanced/bas-reportkind')
  },
  {
    path: 'bas-useroperation',
    name: '用户操作',
    component: _import('advanced/bas-useroperation')
  },
  {
    path: 'bas-runtype',
    name: '在线运行状态',
    component: _import('advanced/bas-runtype')
  },
  {
    path: 'bas-changesubject',
    name: '配置变更主题',
    component: _import('advanced/bas-changesubject')
  },
  {
    path: 'bas-metekind',
    name: '监控量类型',
    component: _import('advanced/bas-metekind')
  },
  {
    path: 'bas-resultcode',
    name: '操作结果',
    component: _import('advanced/bas-resultcode')
  },
  {
    path: 'bas-alarmoperation',
    name: '告警操作',
    component: _import('advanced/bas-alarmoperation')
  },
  {
    path: '/setting/bas-template',
    name: '模板管理',
    redirect: '/setting/bas-template/bas-devicemodel',
    component: TemplateLayout,
    children: [{
      path: 'bas-devicemodel',
      name: '系统设备模板',
      component: _import('advanced/bas-devicemodel')
    }, {
      path: 'bas-telemeter',
      name: '基本遥测量',
      component: _import('advanced/bas-telemeter')
    }, {
      path: 'bas-telesignal',
      name: '基本遥信量',
      component: _import('advanced/bas-telesignal')
    }, {
      path: 'bas-teleadjust',
      name: '基本遥调量',
      component: _import('advanced/bas-teleadjust')
    }, {
      path: 'bas-telecontrol',
      name: '基本遥控量',
      component: _import('advanced/bas-telecontrol')
    }, {
      path: 'bas-teleconfig',
      name: '基本配置量',
      component: _import('advanced/bas-teleconfig')
    },
    {
      path: 'bas-devicetemplate',
      name: '系统监控量模板',
      component: _import('advanced/bas-devicetemplate')
    }
    ]
  },
  {
    path: '/setting/bas-strategy',
    name: '策略',
    component: TemplateLayout,
    children: [
      {
        path: 'bas-alminfoext',
        name: '四级告警方案',
        component: _import('advanced/bas-alminfoext')
      }, {
        path: 'bas-storespan',
        name: '存储周期',
        component: _import('advanced/bas-storespan')
      }, {
        path: 'bas-telestrategy',
        name: '监控量存储策略',
        component: _import('advanced/bas-telestrategy')
      }
    ]
  }
  ]
},
{
  path: '/general',
  component: Layout,
  redirect: 'noredirect',
  name: '常规配置',
  icon: 'tubiaolunkuo-38',
  children: [{
    path: '/general/site',
    name: '站点配置',
    component: GeneralLayout,
    children: [
      {
        path: 'cfg-site',
        name: '站点配置管理',
        component: _import('general/cfg-site')
      },
      {
        path: 'cfg-sitekind',
        name: '站点类型配置',
        component: _import('general/cfg-sitekind')
      }, {
        path: 'cfg-sitelevel',
        name: '站点级别配置',
        component: _import('general/cfg-sitelevel')
      }
      // {
      //     path: 'cfg-precinct',
      //     name: '管辖区配置',
      //     component: _import('general/cfg-precinct')
      // }, {
      //     path: 'cfg-building',
      //     name: '楼栋信息配置',
      //     component: _import('general/cfg-building')
      // }, {
      //     path: 'cfg-floor',
      //     name: '楼层信息配置',
      //     component: _import('general/cfg-floor')
      // },{
      //     path: 'cfg-room',
      //     name: '楼室信息配置',
      //     component: _import('general/cfg-room')
      // }
    ]
  },
  {
    path: '/general/cfg-strategy',
    name: '策略配置',
    component: GeneralLayout,
    children: [
      {
        path: 'cfg-alarm-mask',
        name: '告警时段屏蔽配置',
        component: _import('general/cfg-alarm-mask')
      },
      {
        path: 'cfg-alminfoext',
        name: '四级告警方案配置',
        component: _import('general/cfg-alminfoext')
      }, {
        path: 'cfg-storespan',
        name: '存储周期配置',
        component: _import('general/cfg-storespan')
      }, {
        path: 'cfg-vipmete',
        name: '重要监控量配置',
        component: _import('general/cfg-vipmete')
      }, {
        path: 'cfg-telestrategy',
        name: '监控量存储策略配置',
        component: _import('general/cfg-telestrategy')
      }, {
        path: 'cfg-telemeter',
        name: '基本遥测量配置',
        component: _import('general/cfg-telemeter')
      }, {
        path: 'cfg-telesignal',
        name: '基本遥信量配置',
        component: _import('general/cfg-telesignal')
      }, {
        path: 'cfg-teleadjust',
        name: '基本遥调量配置',
        component: _import('general/cfg-teleadjust')
      }, {
        path: 'cfg-telecontrol',
        name: '基本遥控量配置',
        component: _import('general/cfg-telecontrol')
      }, {
        path: 'cfg-teleconfig',
        name: '基本配置量配置',
        component: _import('general/cfg-teleconfig')
      }
    ]
  },
  {
    path: '/general/cfg-device',
    name: '设备管理',
    component: GeneralLayout,
    children: [
      {
        path: 'cfg-device',
        name: '设备配置管理',
        component: _import('general/cfg-device')
      },
      {
        path: 'cfg-devicestatus',
        name: '设备状态管理',
        component: _import('general/cfg-devicestatus')
      }, {
        path: 'cfg-devicestatusmap',
        name: '设备状态映射管理',
        component: _import('general/cfg-devicestatusmap')
      }, {
        path: 'cfg-device-batch',
        name: '设备批量管理',
        component: _import('general/cfg-device-batch')
      }
    ]
  },
  {
    path: 'cfg-tree-area',
    name: '区域管理',
    component: _import('general/cfg-tree-area')
  },
  {
    path: 'cfg-tree-site',
    name: '站点管理',
    component: _import('general/cfg-tree-site')
  },
  {
    path: 'cfg-tree-device-model',
    name: '设备模板管理',
    component: _import('general/cfg-tree-device-model')
  },
  {
    path: 'cfg-fsu',
    name: '网关配置管理',
    hidden: true,
    component: _import('general/cfg-fsu')
  },
  {
    path: 'cfg-usersetting',
    name: '用户个性配置',
    hidden: true,
    component: _import('general/cfg-usersetting')
  }
  ]
},
{
  path: '/user',
  component: Layout,
  redirect: '/user/sys-user',
  name: '用户权限管理',
  icon: 'yonghuqun',
  children: [{
    path: 'sys-user',
    name: '管理用户',
    component: _import('user/sys-user'),
    meta: {
      role: ['admin']
    }
  }, {
    path: 'role',
    name: '管理角色',
    component: _import('user/sys-role')
  }, {
    path: 'user-role',
    name: '用户角色管理',
    component: _import('user/sys-user-role'),
    hidden: true,
    meta: {
      role: ['admin']
    }
  }, {
    path: 'role-resource',
    name: '角色资源管理',
    component: _import('user/sys-role-resource'),
    hidden: true
  }, {
    path: 'menu',
    name: '功能菜单管理',
    component: _import('user/sys-menu')
  }, {
    path: 'data-api-permission',
    name: 'api数据资源管理',
    component: _import('user/sys-data-api-permission')
  }, {
    path: 'menu-role',
    name: '角色菜单关系管理',
    hidden: true,
    component: _import('user/sys-menu-role')
  }, {
    path: 'tenant',
    name: '租户管理',
    component: _import('user/sys-tenant'),
    hidden: true
  }, {
    path: 'tenant-resource',
    name: '租户功能管理',
    component: _import('user/sys-tenant-resource'),
    hidden: true
  }]
},
{
  path: '/video',
  component: Layout,
  redirect: '/video/index',
  icon: 'shexiangtou11',
  name: '视频录制管理',
  children: [{
    path: 'index',
    name: '摄像头管理',
    component: _import('ipcs/index'),
    meta: {
      role: ['admin']
    }
  }, {
    path: 'task',
    name: '任务管理',
    component: _import('ipcs/task'),
    meta: {
      role: ['admin']
    }
  }

  ]
},

{
  path: '*',
  redirect: '/404',
  hidden: true
}
]

// 后端支持可开
export default new Router({
  // mode: 'history',
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})
