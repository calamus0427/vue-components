import Vue from 'vue'
import Router from 'vue-router'
const _import_ = file => () => import('@/views/' + file )
import GuidLayout from '@/views/layout/guid.vue'

Vue.use(Router)

export default new Router({
  mode:"history",
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
      redirect:'/docs/guid',
      children:[
        {
          path: 'guid',
          name: 'guid',
          component: _import_('docs/guid.md')
        },
        {
          path: 'start',
          name: 'start',
          component: _import_('docs/start.md')
        },
        {
          path: 'introduce',
          name: 'introduce',
          component: _import_('docs/introduce.md')
        }
      ]
    },
    {path: '*', component: _import_('dashboard/index.vue'), hidden: true},
  ]
})
