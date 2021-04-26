<!-- 基于action是全局一个实例 -->
<script>
export default {
  name: 'Action',
  data () {
    return {
      actions: ['create', 'open', 'view', 'edit', 'cut', 'copy', 'ding', 'setting', 'share'],
      disables: [],
      drops: {},
      visible: false,
      data: null,
      pinActive: false,
      isFixed: false // 拓展底部固定
    }
  },
  methods: {
    handleClick (first, disabled) {
      if (disabled) return
      this.Bus.$emit('action', {
        first,
        data: this.data
      })
      if (!this.isFixed) {
        const timer = setTimeout(() => { this.hide(); clearTimeout(timer) }, 150)
      }
    },
    handleDropClick (firstType, secondType) {
      this.Bus.$emit('secondAction', {
        first: firstType,
        second: secondType,
        data: this.data
      })
      if (!this.isFixed) this.hide()
    },
    show (data, options = {}) {
      this.data = data
      if (!this.visible) this.visible = true
    },
    hide () {
      this.data = null
      if (this.visible) this.visible = false
    },
    // 提示文本
    getTooltipTitle (key) {
      switch (key) {
        case 'create': return '新建'
        case 'open': return '打开'
        case 'view': return '查看'
        case 'edit': return '编辑'
        case 'cut': return '剪切'
        case 'copy': return '复制'
        case 'ding': return 'PIN'
        case 'share': return '分享'
        default: return null
      }
    }
  },
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
      const tip = this.getTooltipTitle(key) // 取key对应配置名
      const imgNode = <img class={`action-svg ${key === 'ding' && this.pinActive ? 'active' : ''} ${isDisabled ? 'is-disabled' : ''}`} src={svg} onClick={() => { this.handleClick(key, isDisabled) }} />
      const tooltip = <el-tooltip effect="dark" content={tip} placement="bottom">{imgNode}</el-tooltip>
      const firstNode = tip ? tooltip : imgNode
      const hasDrop = dropKeys.includes(key) && this.drops[key].length > 0
      const dropNode = <el-dropdown onCommand={(ev) => {
        this.handleDropClick(key, ev)
      }}>
        {firstNode}
        <el-dropdown-menu slot="dropdown">
          {
            (this.drops[key] || []).map((d, idx) => {
              return <el-dropdown-item
                icon={d.icon}
                disabled={d.disabled}
                command={d.command}
                key={idx}
              >
                {d.name}
              </el-dropdown-item>
            })
          }
        </el-dropdown-menu>
      </el-dropdown>
      const secondNode = hasDrop && !isDisabled ? dropNode : firstNode
      template.children.push(secondNode)
    })
    return template
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/var.scss';

.action {
  position: absolute;
  border: 1px solid $primary;
  padding: 4px 16px;
  border-radius: 4px;
  background: #ffffff;
  transform: translateX(-100%);
  transition: left 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s, top 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s;
  z-index: 1;
  line-height: 0;

  &.show{
    display: flex;
  }
  &.hide{
    display: none;
  }
  .action-svg{
    cursor: pointer;
    text-align: center;
    border-radius: 6px;
    width: 20px;
    height: 20px;
    padding: 5px;

    &.active, &:hover{
      background: $b6c;
    }
  }
  .action-svg+.action-svg, .el-dropdown+.action-svg, .action-svg+.el-dropdown{
    margin-left: 4px;
  }

  &.fixed-action{
    position: fixed;
    left: 50%;
    bottom: 60px;
    transform: translateX(0);
    box-shadow: $shadow6;
    border: 1px solid $bd5;
  }

  .is-disabled{
    opacity: 0.3;
    cursor: not-allowed;
  }
}

</style>
