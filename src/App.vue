<script>
export default {
  watch: {
    '$route.path' (n, o) {
      this.$action.hide()
      this.$fixedAction.hide()
    }
  },
  render (h) {
    return (
      <div id="app">
        <router-view/>
      </div>
    )
  }
}
</script>
