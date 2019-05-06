<template>
  <div class="guid_layout">
    <header>
      <img src="../../../static/logo.jpeg" alt="">
      <p>MeowUI</p>
      <div class="links">
        <div class="link_items">
          <router-link :to="{name: 'index'}">首页</router-link>
          <a href="#calamus" >111</a>
          <a href="https://github.com/calamus0427" target="_blank">github</a>
          <a href="https://www.calamus.xyz" target="_blank">calamus</a>
        </div>
      </div>
    </header>
    <div class="guid_container">
      <div class="guid_scroll">
        <aside>
          <div>
            <p v-for="(item,index) in titleList" :key="index" class="introduce_title">
              <router-link :to="{'name': item.path}">{{item.title}}</router-link>
            </p>
            <p class="components_title">组件</p>
            <ul class="components_container" v-for="(item,index) in menuList" :key="index">
              <span class="classification" href="javascript:;">{{item.title}}</span>
              <li v-for="(list,index) in item.list" :key="index">
                <ul>
                  <li>
                    <router-link :to="{'name': list.path}">{{list.title}}</router-link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
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
export default {
  name: 'GuidLayout',
  components:{
  },
  data () {
    return {
      titleList:[
        {
          title:'关于',
          path:'introduce'
        },
        {
          title:'快速开始',
          path:'start'
        }
      ],
      menuList:[{
        title:'工具',
        list:[{
          title:'防抖',
          path:''
        },{
          title:'节流',
          path:''
        }]
      }]
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
  background-image:
  linear-gradient(90deg, transparent 231px, #f5d5da 231px, #f5d5da 233px, transparent 233px),
  linear-gradient(#eee .1em, transparent .1em);
  background-size: 100% 1.2em;
}
header{
  position: fixed;
  height:60px;
  width:100%;
  background: white;
  border-bottom:2px solid #eee;

  display: flex;
  align-items: center;
}
header>img{
  width:50px;
  border-radius:50%;
  margin-left:1rem;
}
header>p{
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
  height: 100%;
  min-height: auto;
}
.guid_container .guid_scroll{
    height: calc(100% - 60px);
    margin-top: 60px;
}

  .guid_scroll aside{
    /* position: absolute;
    top:60px;
    width:233px; */
    position: fixed;
    top: 1rem;
    bottom: 0;
    margin-top: 60px;
    transition: padding-top .3s;
  }
  .guid_scroll aside>div{
    overflow: scroll;
    height: 100%;
    width:233px;
  }
 .guid_scroll .meow_docs{
       padding-left: 233px;
    padding-bottom: 100px;
    box-sizing: border-box;
  /* position: absolute;
  left:233px;
  top:60px; */
}

.introduce_title{
  font-size:16px;
  padding:0.2rem 0;
}
.introduce_title a{
  color:#ef858c;
}
.components_title{
  padding:0.5rem 0 0.2rem 0;
  color: #ef858c;
  font-weight: bold;
}
ul{
  list-style: none;
}
.components_container{
  margin-left:2rem;
  margin-top:0.5rem;
}
.components_container .classification{
  font-size:14px;
  color:#ef858c;
  cursor: text;
  user-select:none;
}
.components_container li{
  padding:0.2rem 0;
}
.components_container{
  margin-bottom: 0.5rem;
}
.components_container li a{
  text-shadow: 5px 5px 5px #80808087;
  color:#ef858c;
  font-size:16px;
  padding:0.4rem 0;
}
.components_container li a:hover{
        color: #f5d5da;
        font-weight: bold;
        text-decoration: none;
        text-shadow: 5px 5px 5px #f5d5daee;
}
.components_container li >ul{
  margin-left:2rem;
}
</style>
