/**
 * @author calamus0427
 * Date: 19/4/30
 */
import Button from './button/index.js'

const components = [
  Button
]

const install = function(Vue) {
  if (install.installed) return
  components.map(component => Vue.component(component.name, component))
  MetaInfo.install(Vue)
  Vue.prototype.$loading = WLoadingBar
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  Button
}
