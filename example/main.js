// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import meowUi from '../packages/index'
import demoBlock from './components/demo-block.vue'

Vue.component('demo-block', demoBlock)
Vue.use(meowUi)
Vue.config.productionTip = false
import 'highlight.js/styles/color-brewer.css';
import './assets/common.css';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
