/*
 * @Author       : Calamus
 * @websit       : calamus.xyz
 * @Description  :
 * @FilePath     : /MeowMeowUI/examples/main.js
 * @Date         : 2020-03-12 16:18:13
 * @LastEditors  : Calamus
 * @LastEditTime : 2020-03-12 17:42:57
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入组件库
import meowmeowui from '../packages'
// 注册组件库
Vue.use(meowmeowui)

Vue.config.productionTip = false



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
