<template>
  <div class="page401">
      <img src="../assets/img/ic_401.png" class="img">
      <div class="text-tip">抱歉, 您无权限访问</div>
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
.page401{
  background:#fcfdff;
  height: 100%;
  width: 100%;
  margin: 0 auto;
  padding-top: 144px;
  text-align: center;
  .text-tip{
    font-size: 36px;
    color:#338BF1;
  }
}

</style>
