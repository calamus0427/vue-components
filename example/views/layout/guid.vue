<template>
  <div class="guid_layout">
    <header>
      <img src="../../../static/logo.jpeg" alt="">
      <p>MeowUI</p>
    </header>
    <div class="guid_container">
      <div class="guid_scroll">
        <aside>
          <div>
            <ul v-for="(item,index) in menuList" :key="index">
              <a class="classification" href="javascript:;">{{item.title}}</a>
              <li v-for="(list,index) in item.list" :key="index">
                <ul>
                  <li>
                    <a href="list.path">{{list.title}}</a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </aside>
        <div class="meow_docs">
          <router-view />
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  components:{
  },
  data () {
    return {
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

ul{
  list-style: none;
}
ul .classification{
  font-size:14px;
  color:#ef858c;
  cursor: text;
  user-select:none;
}
ul li{
  padding:0.2rem 0;
}
ul{
  margin-bottom: 0.5rem;
}
ul li a{
  text-shadow: 5px 5px 5px #80808087;
  color:#ef858c;
  font-size:16px;
  padding:0.4rem 0;
}
ul li a:hover{
        color: #f5d5da;
        font-weight: bold;
        text-decoration: none;
        text-shadow: 5px 5px 5px #f5d5daee;
}
ul li >ul{
  margin-left:2rem;
}
</style>
