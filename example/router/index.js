import Vue from 'vue'
import Router from 'vue-router'
const _import_ = file => () => import('@/views/' + file )
import GuidLayout from '@/views/layout/guid.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      name: "index",
      path: "/",
      component: _import_('dashboard/index.vue')
    },
    {
      path: '/docs',
      name: 'Docs',
      component: GuidLayout,
      redirect:'/',
      children:[
        {
          path: 'guid',
          name: 'guid',
          component: _import_('docs/guid.md')
        }
      ]
    },
    {path: '*', component: _import_('dashboard/index.vue'), hidden: true},
  ]
})
