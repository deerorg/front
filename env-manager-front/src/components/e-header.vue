<template>
    <header class="e-header">
        <el-row type="flex"  justify="space-between">
            <el-col class="e-header__header--left">
                <img class="e-header__logo" :src="headerInfo.logoSrc">
                <span class="e-header__title" :title="headerInfo.title">{{headerInfo.title}}</span>
            </el-col>
            <el-col :span="16" class="e-header__nav">
                <div v-for="(item, index)  in homeNav" :key="index" :class="{'active':  currentTopMenuName == item.menuName}" class="e-header__nav--item" @click="onChooseNav(item)">
                    {{item.menuName}}
                </div>
            </el-col>
            <el-col :span="8" class="e-header__header-right">
                <input class="e-header__search" type="search" v-if="headerInfo.isShowSearch">
                <img src="../assets/img/ic_alarm.png" class="e-header__alarm">
                <img src="../assets/img/ic_alarm.png" class="e-header__alarm" v-if="false">
                <screenfull class='e-header__screenfull'></screenfull>
                <span class="e-header__loginuser" @click="onTapUsername" v-if="false">{{name}}</span>
            <el-dropdown class="e-header__container" trigger="click">
			<div class="avatar-wrapper">
				<!-- <img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'"> -->
                {{ name }}
                <icon-svg icon-class="tubiaolunkuo-20"></icon-svg>
				<i class="el-icon-caret-bottom"></i>
			</div>
			<el-dropdown-menu class="user-dropdown" slot="dropdown">
				<router-link class='inlineBlock' to="/">
					<el-dropdown-item>
						首页
					</el-dropdown-item>
				</router-link>
				<el-dropdown-item divided><span @click="loginOut" style="display:block;">退出登录</span></el-dropdown-item>
			</el-dropdown-menu>
		    </el-dropdown>
             <span class="e-header__btn-loginout" @click="loginOut" v-if="false">{{headerInfo.loginoutText}}</span>
            </el-col>
        </el-row>
    </header>
</template>

<script>
import Config from '../config'
import { mapGetters, mapActions } from 'vuex'
import Screenfull from '@/components/Screenfull'

export default {
  name: 'EHeader',
  components: {
    Screenfull
  },
  props: {
    header: {
      type: Object,
      default() {
        return {
          title: '盈峰环境物联网综合平台',
          loginoutText: '退出',
          logoSrc: require('../assets/img/ic_logo.png'),
          isShowSearch: false
        }
      }
    }
  },
  data() {
    return {
      homeNav: null,
      headerInfo: {},
      testMenus: [{
        menuName: '首页',
        type: 1,
        linkUrl: '/home'
      }, {
        menuName: '实时监控',
        type: 1,
        linkUrl: '/monitoring'
      },
      {
        menuName: '告警管理',
        type: 1,
        linkUrl: '/alarm'
      },
      {
        menuName: '增值服务',
        type: 1,
        linkUrl: '/value-added'
      },
      {
        menuName: '数据分析',
        type: 1,
        linkUrl: '/data-analysis'
      }, {
        menuName: '系统配置',
        type: 1,
        linkUrl: '/system-setting'
      }
      ]
    }
  },
  mounted() {
    const me = this
    // let homeObject= [{
    //     menuName:'首页',
    //     type: 1,
    //     linkUrl:'/'
    // }];
    // if(me.homeNav.findIndex(x=>x.menuName=='首页') <= -1){
    // me.homeNav = homeObject.concat(me.menus.filter(function(value, index, array){
    //     return value.parentId =='';
    // }
    // ));
    // }
    // 更换名称
    // 添加外链
    me.homeNav = me.testMenus
    me.headerInfo = me.header
  },
  updated() {
    const me = this
    me.headerInfo = me.header
  },
  computed: {
    ...mapGetters([
      'name', 'currentTopMenuName'
    ])
  },
  methods: {
    onChooseNav(item) {
      const me = this
      me.currentChooseName = item.menuName
      me.$store.dispatch('modifyTopMenuName', me.currentChooseName)
      router.push(item.linkUrl)
      // if(item.menuName=='首页'){
      //    router.push('/home');
      // }else{
      // }
      // me.$emit("on-choose-nav", item);
    },
    onTapUsername() {
      this.$emit('on-tap-username')
    },
    loginOut() {
      this.$store.dispatch('LogOut').then(() => {
        this.$router.push({ path: '/login' })
      }).catch(() => {
        console.error("错误")
      })
    }
  }

}
</script>
<style  lang="scss" scoped>
.e-header {
    width: 100%;
    height: 72px;
    position: fixed;
    z-index: 999;
    background-color:rgba(59,140, 255,.3);
    color: #fff;
    line-height: 72px;
    padding-left: 20px;
    padding-right: 20px;
    overflow: hidden;
    .e-header__header--left {
        text-align: left;
        overflow: hidden;
        width: auto;
        max-width: 260px;
        width: 260px;
    }
    &__logo {
        height: 32px;
        width: 32px;
        border-radius: 4px;
        vertical-align: middle;
    }
    &__title {
        font-size: 14px;
        color: #fff;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
    &__nav {
        // text-align: center;
        text-align: left;
        white-space: nowrap;
        overflow: hidden;
    }
    &__nav--item {
        position: relative;
        display: inline-block;
        text-align: center;
        opacity: 0.7;
        text-decoration: none;
        width: 72px;
        margin-right: 50px;
        &:first-child {
            width: 36px;
        }
        &.active {
            opacity: 1;
            font-weight: 700;
            &::before {
                content: "";
                display: block;
                position: absolute;
                bottom: 10px;
                left: 0;
                width: 100%;
                height: 4px;
                border-radius: 2px;
                background: #fff;
            }
        }
        &:hover {
            opacity: 1;
            cursor: pointer;
            transform: scale(1.05, 1.05);
        }
    }
    &__header-right {
        text-align: right;
        vertical-align: middle;
    }

    &__alarm {
        width: 14px;
        height: 15px;
        vertical-align: middle;
    }
    &__loginuser {
        margin-right: 24px;
    }
    &__alarm {
        width: 22px;
        height: 22px;
        vertical-align: middle;
        margin-right: 20px;
    }
    &__skin {
        width: 22px;
        height: 22px;
        vertical-align: middle;
        margin-right: 20px;
    }
    &__btn-loginout {
        display: inline-block;
        width: 60px;
        height: 30px;
        border: 1px solid #fff;
        border-radius: 4px;
        font-size: 16px;
        line-height: 30px;
        text-align: center;
    }
    &__search{
        display: inline-block;
        width: auto;
        height: 30px;
        max-width: 400px;
        line-height:30px;
        border-radius:20px;
        border:none;
        background: #fff;
    }
    &__screenfull{
        margin-right:20px; 
    }
    &__container{
        color:#fff;
        font-size: 16px;

    }
}
</style>
