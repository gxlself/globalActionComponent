import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import Bus from '@/eventbus'
import '@/components/index'
import '@/assets/css/base.scss'

Vue.use(Bus)
// 全局组件注册
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
