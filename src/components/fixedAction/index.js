import Vue from 'vue'
import Main from '../action/index.vue'

const ActionConstructor = Vue.extend(Main)

const globalAction = new ActionConstructor({})
globalAction.$mount()
document.body.appendChild(globalAction.$el)

const Action = function (options = { fixed: true }) {
  for (const key in options) {
    globalAction[key] = options[key]
  }
  return globalAction
}

Action.init = function ({ list, drops } = {}) {
  list && (globalAction.actions = list)
  drops && (globalAction.drops = drops)
  globalAction.isFixed = true
  globalAction.show()

  return this
}

Action.setDrops = function (drops = {}) {
  globalAction.drops = drops
  return this
}

Action.setDisable = function (disables = []) {
  globalAction.disables = disables
  return this
}

Vue.prototype.$fixedAction = Action

export default Action
