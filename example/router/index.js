import Vue from 'vue'
import Router from 'vue-router'
const _import_ = file => () => import('@/views/' + file )
import GuidLayout from '@/views/layout/guid.vue'

Vue.use(Router)

export default new Router({
  mode:"hash",
  routes: [
    {
      name: "index",
      path: "/",
      hidden: true,
      component: _import_('dashboard/index.vue')
    },
    {
      path: '/docs',
      name: 'Docs',
      hidden: true,
      component: GuidLayout,
      redirect:'/docs/introduce',
      children:[
        {
          path: 'introduce',
          name: 'introduce',
          component: _import_('docs/introduce.md')
        },
        {
          path: 'start',
          name: 'start',
          component: _import_('docs/start.md')
        },
        {
          name:'权限按钮',
          path:'authBtn',
          component: _import_('docs/authBtn.md')
        },
        {
          name:'分割tabs',
          path:'divideTabs',
          component: _import_('docs/divideTabs.md')
        },
        {
          name:'分割线',
          path:'transfer',
          component: _import_('docs/transfer.md')
        },
        {
          name:'时间轴',
          path:'timeline',
          component: _import_('docs/timeline.md')
        },
        {
          name:'树形UI',
          path:'svgTree',
          component: _import_('docs/svgTree.md')
        },
        {
          name:'高德地图',
          path:'gMap',
          component: _import_('docs/gMap.md')
        },
        {
          name:'eventBus',
          path:'eventBus',
          component: _import_('docs/eventBus.md')
        },{
          name:'防抖',
          path:'debounce',
          component: _import_('docs/debounce.md')
        },{
          name:'节流',
          path:'throttl',
          component: _import_('docs/throttl.md')
        }
      ]
    },
    {path: '*', component: _import_('dashboard/index.vue'), hidden: true},
  ]
})
