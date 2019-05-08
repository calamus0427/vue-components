<template>
  <div class="guid_layout">
    <header>
      <img src="../../../static/logo.jpeg" alt="">
      <p>
        <router-link :to="{path: '/'}">MeowUI</router-link>
      </p>
      <div class="links">
        <div class="link_items">
          <router-link :to="{name: 'index'}">首页</router-link>
          <a href="https://github.com/calamus0427" target="_blank">github</a>
          <a href="https://www.calamus.xyz" target="_blank">calamus</a>
        </div>
      </div>
    </header>
    <div class="guid_container">
      <div class="guid_scroll">
        <aside>
          <aside-layout />
        </aside>
        <div class="meow_docs">
          <keep-alive>
            <router-view />
          </keep-alive>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AsideLayout from './components/leftAside'
import {list } from '../../utils/list.js'
export default {
  name: 'GuidLayout',
  components:{
    AsideLayout
  },
  data () {
    return {
      treeData:list
    }
  }
}
</script>

<style scoped>
@keyframes headShake {
    0% {
        transform: translateX(0);
    }

    6.5% {
        transform: translateX(-6px) rotateY(-9deg);
    }

    18.5% {
        transform: translateX(5px) rotateY(7deg);
    }

    31.5% {
        transform: translateX(-3px) rotateY(-5deg);
    }

    43.5% {
        transform: translateX(2px) rotateY(3deg);
    }

    50% {
        transform: translateX(0);
    }
}

.guid_layout{
  min-height:100vh;
  overflow-y: hidden;
  background-color: #fff;
  /* background-image:
  linear-gradient(90deg, transparent 231px, #f5d5da 231px, #f5d5da 233px, transparent 233px),
  linear-gradient(#eee .1em, transparent .1em);
  background-size: 100% 1.2em; */
}
header{
  position: fixed;
  height:60px;
  width:100%;
  background: white;
  border-bottom:2px solid #f5d5da;
  box-shadow: 0px 0px 1px #f5d5da, 0px 0px 3px #f5d5da, 0px 0px 4px #f5d5da, 0 0 0.5px #f5d5da; /* 文字の影 */
  display: flex;
  align-items: center;
}
header>img{
  width:50px;
  border-radius:50%;
  margin-left:1rem;
}
header>p a{
  margin-left:1rem;
  font-size:18px;
  font-weight: bold;
  color: #ef858c; /* 文字色 */
	text-shadow: 0px 0px 1px yello, 0px 0px 3px yello, 0px 0px 4px yello, 0 0 0.5px yello; /* 文字の影 */
}
header>img:hover{
  animation: headShake 1000ms both;
}
header .links{
  width:100%
}
header .links .link_items{
  float:right
}
header .links .link_items a{
  color:#ef858c;
  padding:0 1.5rem;
}

.guid_container{
  min-height:calc(100vh - 60px);
  height: 100%;
  width:100%;
  background-color: transparent;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  background-position: right top;
  background-image: url(https://cdn.calamus.xyz/blog_ali/calamus_02.png);
}
.guid_container .guid_scroll{
    width:80%;
    margin:0 auto;
    max-width:1440px;
    height: calc(100% - 60px);
    margin-top: 60px;
}

  .guid_scroll aside{
    position: fixed;
    top: 1rem;
    bottom: 0;
    margin-top: 60px;
    transition: padding-top .3s;

    background-color: #fff;
    border: 1px #f2f2f2 solid;
    font-size: 12px;
    background: rgba(255, 255, 255, 0.7);
    box-shadow: 0 3px 20px 3px rgba(0, 64, 128, .2);
  }
  .guid_scroll aside>div{
    overflow: scroll;
    height: 100%;
    width:233px;
  }
 .guid_scroll .meow_docs{
    margin-left: 240px;
    margin-top: 75px;
    padding-bottom: 100px;
    box-sizing: border-box;
  /* position: absolute;
  left:233px;
  top:60px; */
  background-color: #fff;
    border: 1px #f2f2f2 solid;
    font-size: 12px;
    background: rgba(255, 255, 255, 0.7);
    box-shadow: 0 3px 20px 3px rgba(0, 64, 128, .2);
}



</style>
