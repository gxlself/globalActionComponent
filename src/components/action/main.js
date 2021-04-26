import Vue from 'vue'
import Main from './index.vue'

const ActionConstructor = Vue.extend(Main)

const globalAction = new ActionConstructor({})
globalAction.$mount()
document.body.appendChild(globalAction.$el)

const Action = function (options = {}) {
  for (const key in options) {
    globalAction[key] = options[key]
  }
  return globalAction
}

Action.show = function ({ target, left, top }, data = null) {
  globalAction.$el.style.top = `${top}px`
  globalAction.$el.style.left = `${left}px`
  globalAction.show(data)
  document.addEventListener('click', checkIsSelef, false)
  function checkIsSelef (el) {
    if (el.target === target || el.target === globalAction.$el || globalAction.$el.contains(el.target)) {
      !globalAction.visible && globalAction.show()
    } else if (globalAction.visible) {
      globalAction.hide()
      document.removeEventListener('click', checkIsSelef, false)
    }
  }
  return this
}

Action.init = function ({ list, drops }) {
  list && (globalAction.actions = list || [])
  drops && (globalAction.drops = drops || [])
  return this
}

Action.hide = function (event) {
  globalAction.hide()
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

Action.setAllDisable = function () {
  globalAction.isAllDisabled = true
  return this
}

Action.setAllEnable = function () {
  globalAction.isAllDisabled = false
  return this
}

Vue.prototype.$action = Action

export default Action
