const EventMixins = {
  // 创建组件的时候监听事件
  created () {
    this.Bus.$on('action', this.onAction)
    this.Bus.$on('secondAction', this.onSecondAction)
  },
  // 组件销毁的时候 删除监听的事件
  beforeDestroy () {
    this.Bus.$off('action', this.onAction)
    this.Bus.$off('secondAction', this.onSecondAction)
  },
  methods: {
    // 对action组件监听
    onAction ({ first, data }) {
      this.$message.success(`${first} is click...`)
      console.log(first, data)
    },
    // 对action 二级菜单进行监听
    onSecondAction ({ first, second, data }) {
      this.$message.success(`${first} menu ${second} is click`)
      console.log('first: ', first, 'second: ', second, 'data: ', data)
    }
  }
}

export default EventMixins
