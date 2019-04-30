<!--<template>-->
  <!--<div>-->
  <!--<div id="container" style="width:500px; height:300px"></div>-->
  <!--<div id="myPageTop">-->
    <!--<table>-->
      <!--<tr>-->
        <!--<td>-->
          <!--<label>搜索：</label>-->
        <!--</td>-->
      <!--</tr>-->
      <!--<tr>-->
        <!--<td>-->
          <!--<input id="tipinput"/>-->
        <!--</td>-->
      <!--</tr>-->
    <!--</table>-->
  <!--</div>-->
  <!--</div>-->
<!--</template>-->
<!--<script>-->
  <!--export default {-->
    <!--name: "index",-->
    <!--data () {-->
      <!--return {-->

      <!--}-->
    <!--},-->
    <!--mounted () {-->
      <!--this.init()-->
    <!--},-->
    <!--methods: {-->
      <!--init () {-->
        <!--var map = new AMap.Map('container', {-->
          <!--resizeEnable: true, //是否监控地图容器尺寸变化-->
          <!--zoom:11, //初始化地图层级-->
          <!--center: [116.397428, 39.90923], //初始化地图中心点-->
          <!--showIndoorMap: false //关闭室内地图-->
        <!--});-->
        <!--map.on("complete", function(){-->
          <!--console.log("地图加载完成！");-->
        <!--});-->
        <!--// 搜索-->
        <!--//输入提示-->
        <!--var autoOptions = {-->
          <!--input: "tipinput"-->
        <!--};-->
        <!--var auto = new AMap.Autocomplete(autoOptions);-->
        <!--var placeSearch = new AMap.PlaceSearch({-->
          <!--map: map-->
        <!--});-->
        <!--//查询成功时返回查询结果-->
        <!--AMap.event.addListener(auto, "complete", searchCallBack);-->
        <!--function searchCallBack(e) {-->
          <!--console.log(e)-->
          <!--var lng = e.lnglat.getLng();-->
          <!--var lat = e.lnglat.getLat();-->
          <!--map.setCenter([lng, lat]); //设置地图中心点-->
        <!--}-->
        <!--//构造地点查询类-->
        <!--AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发-->
        <!--function select(e) {-->
          <!--placeSearch.setCity(e.poi.adcode);-->
          <!--placeSearch.search(e.poi.name);  //关键字查询查询-->
        <!--}-->
        <!--//为地图注册click事件获取鼠标点击出的经纬度坐标-->
        <!--map.on('click', function(e) {-->
          <!--var lng = e.lnglat.getLng(); //经度范围[121.138398, 121.728226]-->
          <!--var lat = e.lnglat.getLat(); //纬度范围[30.972688, 31.487611]-->
          <!--map.setCenter([lng, lat]); //设置地图中心点-->
          <!--this.$emit('click', {'lat': location[0], 'lng': location[1], 'address': this.currentAddress, 'addressComponent': result.regeocode.addressComponent})-->
          <!--console.log(`当前中心点已设为 ${lng.toFixed(6)},${lat.toFixed(6)}`);-->
        <!--});-->
      <!--}-->
    <!--}-->
  <!--}-->
<!--</script>-->

<!--<style scoped>-->

<!--</style>-->
