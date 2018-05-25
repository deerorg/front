<template>
    <div>
        <template v-for="item in routes">
            <router-link v-if="item.isShow && !item.hidden&&item.noDropdown&&item.children.length>0" :to="item.path+'/'+item.children[0].path" :key="item.key">
                <el-menu-item :index="item.path+'/'+item.children[0].path" :collapse="false">
                   <i class="el-icon-menu" v-if="item.icon" :class="item.icon"></i> {{item.children[0].name}}
                </el-menu-item>
            </router-link>
            <el-submenu :index="item.name" v-if="item.isShow && !item.noDropdown&&!item.hidden" :collapse="false" :key="item.key">
                <template slot="title" v-if="item.isShow">
                   <i class="el-icon-menu" v-if="item.icon" :class="item.icon"></i> {{item.name}}
                </template>
                <template v-for="child in item.children" v-if='child.isShow && !child.hidden'>
                    <e-sidebar-item class='menu-indent' v-if='child.isShow && child.children&&child.children.length>0' :routes='[child]' :key="child.key"> </e-sidebar-item>
                    <router-link v-else class="menu-indent" :to="item.path+'/'+child.path" :key="child.key">
                        <el-menu-item :index="item.path+'/'+child.path">
                            {{child.name}}
                        </el-menu-item>
                    </router-link>
                </template>
            </el-submenu>
        </template>
    </div>
</template>

<script>
    export default {
      name: 'ESidebarItem',
      props: {
        routes: {
          type: Array
        }
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .svg-icon {
        margin-right: 10px;
    }
    .hideSidebar .menu-indent{
        display: block;
        text-indent: 10px;
    }
</style>

