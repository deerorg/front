<template>
    <div id="frame">
        <div class="frame-header">
            <e-header1 v-if="isShowHeader" :current-choose-name="currentTopMenuName" @on-choose-nav="gotoNav"></e-header1>
        </div>
        <div class="e-app-wrapper">
            <div class="e-sidebar-wrapper" v-if="isShowSidebar">
                <e-sidebar class="sidebar-container" :routes="current_routers"></e-sidebar>
            </div>
            <div class="e-main-container">
                <e-main></e-main>
            </div>
        </div>
    </div>
</template>

<script>
import Home from '@/views/home'
import EHeader1 from '@/components/e-header'
import { ESidebar, EMain } from '@/views/project'
import { mapGetters } from 'vuex'

export default {
  name: 'Frame',
  components: {
    EHeader1,
    Home,
    ESidebar,
    EMain
  },
  computed: mapGetters({
    isShowSidebar: 'isShowSidebar',
    isShowHomeNav: 'isShowHomeNav',
    isShowHeader: 'isShowHeader',
    isShowTabs: 'isShowTabs',
    currentTopMenuName: 'currentTopMenuName',
    menus: 'menus'
  }),

  data() {
    return {
      current_routers: [],
      routers: []
    }
  },
  methods: {
    gotoNav(item) {
      const me = this
      me.currentChooseName = item.menuName
      me.$store.dispatch('modifyTopMenuName', me.currentChooseName)
      if (me.currentChooseName == '首页') {
        router.push("/home")
      } else {
        const parentRoute = me.menus.find(x => x.menuId == item.menuId)
        if (parentRoute && parentRoute.childrens) {
          me.current_routers = parentRoute.childrens
          if (item.linkType == 1) {
            me.$router.push(item.linkUrl)
          } else {
            window.location = item.linkUrl
          }
        } else {
          if (item.linkType == 1) {
            me.$router.push(item.linkUrl)
          } else {
            window.location = item.linkUrl
          }
        }
      }
    }
  }

}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
#frame {
    .frame-header {
        position: fixed;
        z-index: 999;
        width: 100%;
    }
    .e-app-wrapper {
        position: relative;
        padding-top: 72px;
        height: 100%;
        width: 100%;
        &.hideSidebar {
            .e-sidebar-wrapper {
                transform: translate(-140px, 0);
                .e-sidebar-container {
                    transform: translate(132px, 0);
                }
                &:hover {
                    transform: translate(0, 0);
                    .e-sidebar-container {
                        transform: translate(0, 0);
                    }
                }
            }
            .e-main-container {
                margin-left: 40px;
            }
        }
        .e-sidebar-wrapper {
            width: 240px;
            position: fixed;
            top: 72px;
            bottom: 0;
            left: 0;
            z-index: 1001;
            background-color: #fff;
            overflow: hidden;
            transition: all .28s ease-out;
        }
        .e-sidebar-container {
            transition: all .28s ease-out;
            position: absolute;
            top: 72px;
            bottom: 0;
            left: 0;
            right: -17px;
            overflow-y: scroll;
        }
        .e-main-container {
            min-height: 100%;
            transition: all .28s ease-out;
            margin-left: 240px;
        }
    }
}
</style>
