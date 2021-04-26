# 全局组件构思到开发,涉及多种开发思想


> 具体实现
[demo](https://gxlself.com/global/#/home)
[github](https://github.com/gxlself/globalActionComponent)

实际业务开发中有这样一个场景,如标题图需求说明所示,多个页面需要,而且是动态的,不仅如此,点击每页对应列表某个按钮,就需要对应在下方展示.

## 构思

1. 该组件是否可以全局处理,哪里需要跑到哪里 -- 单例模式
2. 该组件因为是全局挂载,每次事件触发需要接收与发送 -- 发布订阅模式
3. 该组件动态可配置 
4. 该组件渲染以及可复用度高度兼容
5. 优雅的设计与呈现

## 开始锤炼 基于Vue2 Jsx 开发

当然实际中还会有更多的需求,那就是可能会在某个页面进行固定底部展示,此时就需要再实例一个全局组件

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/988a48e6b6d64269863eb663af0ceb46~tplv-k3u1fbpfcp-watermark.image)

### 第一步 组件所需参数进行设置

1. 一级 actions: string[] // action name list

2. 一级 disables: string[] // action name list

3. 是否固定吸底 fixed: boolean // 是否固定吸底 用于页面所需固底

4. 一级可能需要配置的二级下拉菜单 drops: DropsMap

```js
interface DropsMap{
    [key: string]: Drop;
}

// 使用内部 UI, 下拉菜单组件所需属性进行定义
interface Drop{
    name: string;
    command: string;
    icon?: string;
    disabled?: boolean;
}
```
---

> actions 为什么和 drops处理方式不一样?
  考虑到实际使用过程中的易用性,以及在配置的时候代码量,可维护性考虑,使用name list...
  ```js
  actions = [
      {name: 'xxx', svg: 'xxx'},
      {name: 'yyy', svg: 'yyy'},
      {name: 'zzz', svg: 'zzz'}
  ]
  &&
  actions = ['xxx', 'yyy', 'zzz']
  ```
  相比较,每次页面配置哪个更省代码以及更直观
  
  再就是disables,其实也是各个页面或者部分权限不足的需要禁掉,这样每个action又需要一个disable字段进行处理,而使用disables这个list去维护,在代码上以及开发易用性有更好的开发使用体验
  
  二级下拉配置较少,而且为了对应相应的二级下拉组件的属性,即使用map进行操作,也便于后续取值.

---

### 第二步 组件显隐,组件需要接受转发数据

内置属性, visible: boolean // 控制组件显示隐藏
内置属性, data: any // 数据进行接受转发

对应的方法

```js
show (data, options = {}) {
  this.data = data
  if (!this.visible) this.visible = true
},
hide () {
  this.data = null
  if (this.visible) this.visible = false
},
```

### 第三步 一级action事件与一级下拉菜单点击事件触发与监听

这里采用 Vue eventbus进行处理 

它的工作原理是发布/订阅方法，通常称为 Pub/Sub

这里不对eventbus注册使用进行详细说明

[需要的可以踩这进行查看, 随手挑掘金一篇文章](https://juejin.cn/post/6844903542315040776)

由于该组件使用jsx开发,点击事件代码如下,在render函数中

```js
render (h) {
    const fixedClass = this.isFixed ? 'fixed-action' : '' // 固定action样式
    const className = this.visible ? 'show' : 'hide' // 显示隐藏样式
    
    const actions = this.actions || [] // 一级list
    const dropKeys = Object.keys(this.drops) // 二级list
    const disables = this.disables || [] // 一级禁用list
    
    const template = <div class={`action flex-nowrap flex-align-center ${className} ${fixedClass}`}></div>
    template.children = template.children || []
    
    actions.forEach(key => {
      const isDisabled = disables.includes(key)
      const svg = require(`@/assets/svg/${key}.svg`) // 动态一级svg
      const imgNode = <img class={`action-svg ${isDisabled ? 'is-disabled' : ''}`} src={svg} onClick={() => { this.handleClick(key, isDisabled) }} />
      const hasDrop = dropKeys.includes(key) && this.drops[key].length > 0
      const dropNode = <li-dropdown onCommand={(ev) => {
        this.handleDropClick(key, ev)
      }}>
        {imgNode}
        <li-dropdown-menu slot="dropdown">
          {
            (this.drops[key] || []).map((d, idx) => {
              return <li-dropdown-item
                icon={d.icon}
                disabled={d.disabled}
                command={d.command}
                key={idx}
              >
                {d.name}
              </li-dropdown-item>
            })
          }
        </li-dropdown-menu>
      </li-dropdown>
      const secondNode = hasDrop && !isDisabled ? dropNode : imgNode
      template.children.push(secondNode)
    })
    return template
}
```

> 这里应该没啥疑问吧~

上述代码中用到了两个事件

```js
handleClick(first, disabled) {
   if (disabled) return
   // 通过eventbus 进行事件分发
   this.Bus.$emit('action', { 
      first,
      data: this.data
   })
   if (!this.isFixed) this.hide(); // 不是固底的点击后需要隐藏
},
handleDropClick(firstType, secondType) {
    // 分发二级事件
    this.Bus.$emit('secondAction', {
        first: firstType,
        second: secondType,
        data: this.data
    })
    if (!this.isFixed) this.hide() // 不是固底的点击后需要隐藏
}
```
到这里一个简单的全局组件就已经封装完成了. 现在只需要实例两个组件出来,就可以开箱使用

---

### 第三步 实例全局组件
在组件同级目录下进行添加 *index.js*

```index.js
import Vue from 'vue'
import Main from './index.vue'

const ActionConstructor = Vue.extend(Main)
// 单例模式 直接new该对象并直接挂载到全局
const globalAction = new ActionConstructor({})
globalAction.$mount()
document.body.appendChild(globalAction.$el)

// 构造方法
const Action = function (options = {}) {
  for (const key in options) {
    globalAction[key] = options[key]
  }
  return globalAction
}

// 添加show方法 各个方法进行return this的操作,链式调用,方便调用开发
Action.show = function ({ target, left, top }, data = null) {
  // 传入对应的点击dom对象,对action组件位置进行修改
  globalAction.$el.style.top = `${top}px`
  globalAction.$el.style.left = `${left}px`
  globalAction.show(data)
  document.addEventListener('click', checkIsSelef, false)
  
  // 对列表用到部分进行处理,点击对应的按钮以及这个action组件的时间回调
  // 点击外部进行隐藏 事件卸载
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

// 初始化方法
Action.init = function (list, drops) {
  globalAction.actions = list || []
  globalAction.drops = drops || []
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

Vue.prototype.$action = Action
export default Action
```

```main.js
import Action from '@components/action/main.js'
Vue.use(Action)
```
此时页面列表用到的每个位置,只需要传入对应的taget以及top,left等位置就可以在固定地方显示

> 当然,也会有页面跳转不隐藏怎么办?

在app.vue中监听路由,进行hide方法调用




