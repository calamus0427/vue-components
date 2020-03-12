<!--
 * @Author       : Calamus
 * @websit       : calamus.xyz
 * @Description  :
 * @FilePath     : /MeowMeowUI/examples/components/HelloWorld.vue
 * @Date         : 2020-03-12 16:18:13
 * @LastEditors  : Calamus
 * @LastEditTime : 2020-03-12 17:29:12
 -->
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <x-button type="primary">button</x-button>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
