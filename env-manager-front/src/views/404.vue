<template>
  <div class="page404">
    <img src="../assets/img/ic_404.png" class="img">
    <div class="text-tip">404 未找到对应页面</div>
  </div>
</template>

<script>
 export default {
   data() {
     return {

     }
   },
   methods: {

   },
   computed: {
     message() {
       return '404'
     }
   }
 }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.page404{
  background:#fcfdff;
  height: 100%;
  width: 100%;
  margin: 0 auto;
  padding-top: 144px;
  text-align: center;
  .text-tip{
     font-size: 36px;
    color:#999;
  }
}

</style>
