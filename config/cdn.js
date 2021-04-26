module.exports = {
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    ElementUI: 'element-ui'
  },
  build: {
    css: [
      'https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.1/theme-chalk/index.min.css'
    ],
    js: [
      'https://cdn.bootcdn.net/ajax/libs/vue/2.6.12/vue.min.js',
      'https://cdn.bootcdn.net/ajax/libs/vue-router/3.4.6/vue-router.min.js',
      'https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.1/index.min.js'
    ]
  }
}
