/*
 * @Author       : Calamus
 * @websit       : calamus.xyz
 * @Description  :
 * @FilePath     : /MeowMeowUI/vue.config.js
 * @Date         : 2020-03-12 16:10:15
 * @LastEditors  : Calamus
 * @LastEditTime : 2020-03-12 16:19:39
 */
const path = require('path');//引入path模块
function resolve(dir){
    return path.join(__dirname,dir)//path.join(__dirname)设置绝对路径
}

module.exports = {
  pages: {
    index: {
      entry: 'examples/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    }
  },
  // 扩展 webpack 配置，使 packages 加入编译
  chainWebpack: config => {
    config.resolve.alias
        .set('@',resolve('./examples'))
        .set('components',resolve('./examples/components'));
    config.module
      .rule('js')
      .include
        .add('/packages')
        .end()
      .use('babel')
        .loader('babel-loader')
  }
}
