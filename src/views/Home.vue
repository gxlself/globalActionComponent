<template>
  <div class="about">
    <el-table
      border
      :data="tableData"
      highlight-current-row
    >
      <el-table-column prop="description" label="描述" min-width="300" />
      <el-table-column prop="description" label="描述" min-width="300" />
      <el-table-column prop="description" label="描述" min-width="300" />
      <el-table-column prop="description" label="描述" min-width="300" />
      <el-table-column prop="description" label="描述" min-width="300" />
      <el-table-column align="center" label=""  min-width="30" class="table-more">
        <template slot-scope="{ row }">
          <i class="el-icon-more flex-center flex-align-center" @click.stop="openAction($event, row)"></i>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import EventMixins from '@/mixins/event'
import { tableData } from './test'
export default {
  mixins: [EventMixins],
  data () {
    return {
      tableData
    }
  },
  mounted () {
    this.$fixedAction.init()
  },
  methods: {
    openAction (event, row) {
      const { target } = event
      const { left, top, height, width } = target.getBoundingClientRect()
      // 传入top以及left 支持链式调用 具体看 /conponents/action
      this.$action
        .setDrops({
          setting: [
            {
              name: '提交工作流程',
              icon: 'el-icon-set-up',
              command: 'submit'
            },
            {
              name: '添加至收藏夹',
              icon: 'el-icon-folder-opened',
              command: 'collect'
            },
            { name: '变更所有者', icon: 'el-icon-refresh', command: 'change' }
          ],
          edit: [
            {
              name: '提交工作流程',
              icon: 'el-icon-set-up',
              command: 'submit'
            },
            {
              name: '添加至收藏夹',
              icon: 'el-icon-folder-opened',
              command: 'collect'
            },
            {
              name: '变更所有者',
              icon: 'el-icon-refresh',
              command: 'change'
            },
            {
              name: '提交工作流程',
              icon: 'el-icon-set-up',
              command: 'submit'
            },
            {
              name: '添加至收藏夹',
              icon: 'el-icon-folder-opened',
              command: 'collect'
            },
            { name: '变更所有者', icon: 'el-icon-refresh', command: 'change' }
          ]
        })
        .show({ target, left: left + width, top: top + height }, row)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-icon-more {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  cursor: pointer;
}
</style>
