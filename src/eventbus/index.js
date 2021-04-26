import Vue from 'vue'
const Bus = new Vue()

const install = (Vue) => {
  Vue.prototype.Bus = Bus
}

export default { install }
