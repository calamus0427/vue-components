<template>
  <div  class="pg">
    <div class="view_container">
      <img src="../../assets/img/dash.jpeg">
      <p>超级可爱的UI库</p>
      <div class="btn">
        <router-link :to="{name: 'guid'}">开始使用</router-link>
        <a target="_blank" class="btn-github" href="https://github.com/calamus0427">GitHub</a>
      </div>
    </div>
    <!-- <div class="line" v-for="(item,index) in 5" :key="index" :style="{'top':30 + 5 * index + 'vh'}"></div> -->
  </div>
</template>

<script>
  export default{
    data () {
      return {
        height: document.documentElement.clientHeight
      }
    }
  }
</script>
<style>
.pg{
  height:100vh;
  overflow: hidden;
	color: #ef858c; /* 文字色 */
	position: relative;
	text-shadow: 0px 0px 1px #fff, 0px 0px 3px #fff, 0px 0px 4px #fff, 0 0 0.5px #fff; /* 文字の影 */
  background:
        radial-gradient(
            #f0e68cb5 40px,
            transparent 0,
            transparent 100%
        ),
        radial-gradient(
            #a4d2e4a1 40px,
            transparent 0,
            transparent 100%
        ),
        radial-gradient(
            #ffc0cbb8 40px,
            transparent 0,
            transparent 100%
        ), snow;
  background-blend-mode: multiply;
  background-size: 100px 100px;
  background-position: 0 0, 33px 33px, -33px -33px;
  background-color: #f5d5da; /* 背景色 */
}
.pg:before{
	content: '＊*'; /*花に見せかけるためのアスタリスク*/
	color: #fff; /* アスタリスクの色 */
	display: inline-block;
	font-size: 60px; /* アスタリスクの大きさ */
	font-weight: bold;
	margin-right: 10px;
	position: absolute;
	top: 0px;
	left: 0px;
	transform: rotate(20deg);
	-moz-transform: rotate(20deg);
	-webkit-transform: rotate(20deg);
	-o-transform: rotate(20deg);
	text-shadow: 0px 0px 3px #fff, 0px 0px 2px #fff, 0 0 0.5px #fff; /* アスタリスク周りの影 */
}
.pg:after{
	border-bottom: 2px dotted #fff; /* 下線 */
	content: '';
	position: absolute;
	bottom: 3px;
	left: 3px;
	right: 3px;
}
.line {
  position: absolute;
  width:100%;
  height: 5vh;
	background: white;
  clip-path: polygon(0 90%, 100% 0, 100% 10%, 0% 100%);
  z-index:1;

}
    .view_container {
      position: absolute;
      top:50%;
      left:50%;
      transform: translate(-50%,-50%);
      width: 960px;
      text-align: center;
      z-index:2;
    }
    .view_container p{
        font-size: 32px;
        padding:1rem 0;
    }
    .view_container img{
        border-radius:50%;
        width:50%;
        max-width:360px;
        margin:0 auto;
    }
    .btn{
      width: 100%;
      top: 20px;
      z-index: 9;
      background: transparent;
      text-align: center;
    }
    .btn a {
          color: #fff;
          background-image: linear-gradient(90deg, #ffaaed 0%, #e733c9 100%);
          box-shadow: 0 2px 6px 0 #ea7993;
          display: inline-block;
          width: 190px;
          height: 56px;
          margin: 0 35px;
          font-size: 18px;
          line-height: 56px;
          border-radius: 28px;
          transition: all .3s;
          cursor: pointer;
        }
    /* .btn-github{
          color: #316DE9;
          border: 1px solid #2F6EE9;
          background: #fff;
          box-shadow: none;
    } */
</style>
