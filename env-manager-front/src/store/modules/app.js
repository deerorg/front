import Cookies from 'js-cookie'

const syncStoreToLocal = function(state) {
  localStorage.setItem("INFORE-APP", JSON.stringify(state))
}

const inforeApp = localStorage.getItem("INFORE-APP")

// 获取当前的顶级菜单名称
const getLocalCurrentTopMenuName = function() {
  if (inforeApp) {
    const currentObject = JSON.parse(inforeApp)
    return currentObject.currentTopMenuName
  } else {
    return '首页'
  }
}

const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus')
    },
    // 当前的顶级菜单名称
    currentTopMenuName: getLocalCurrentTopMenuName()
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
    },
    CHANGE_CURRENT_TOP_MENU_NAME: (state, name) => {
      state.currentTopMenuName = name
      syncStoreToLocal(state)
    }
  },
  actions: {
    ToggleSideBar: ({
      commit
    }) => {
      commit('TOGGLE_SIDEBAR')
    },
    // 修改顶级菜单名称
    modifyTopMenuName: ({
      commit
    }, name) => {
      commit('CHANGE_CURRENT_TOP_MENU_NAME', name)
    }
  }
}

export default app
