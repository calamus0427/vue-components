<template>
  <div class="transfer">
    <div class="left"></div>
    <div class="button">
      <button>←</button>
      <button>→</button>
    </div>
    <div class="right"></div>

  </div>
</template>

<script>
export default {
  name: 'transfer',
  data () {
    return {
      data:{},
      left:{},
      right:{}
    }
  }
}
</script>

<style scoped>
.transfer{
display:block;
}
.left,.right{
    display: inline-block;
    width: 180px;
    height: 210px;
    font-size: 12px;
    vertical-align: middle;
    position: relative;
    padding-top: 35px;
    border:1px solid #ccc;
}
.button{
    display: inline-block;
    overflow: hidden;
    margin: 0 16px;
    vertical-align: middle;
}
.button button{
  display:block;
      margin-bottom: 12px;
}
</style>
