const cdn = require('./config/cdn')
const HappyPack = require('happypack')
const os = require('os')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })
var HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')

process.env.VUE_APP_TITLE = 'template'

module.exports = {
  // 开发环境每次保存时是否输出为eslint编译警告
  lintOnSave: true,
  runtimeCompiler: true,
  productionSourceMap: false,
  // 开发环境端口号
  devServer: {
    port: 8088,
    disableHostCheck: true,
    overlay: {
      warnings: true,
      errors: true
    }
  },
  chainWebpack: config => {
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
    config.resolve.symlinks(true)
    // 解决ie11兼容ES6
    config.entry('main').add('babel-polyfill').add('es6-promise/auto')

    if (process.env.VUE_TYPE !== 'CM') {
      config.plugin('html').tap(args => {
        args[0].cdn = cdn.build
        return args
      })
    }
    // 分包优化
    config.when(process.env.NODE_ENV !== 'development', (config) => {
      config.performance.set('hints', false)
      config.devtool('none')
      config.optimization.splitChunks({
        chunks: 'all', // 表示将选择哪些块进行优化。提供字符串时，有效值为all、async和initial,默认是仅对异步加载的块进行分割。
        minSize: 30000, // 模块大于minSize时才会被分割出来。
        maxSize: 0, // 生成的块的最大大小，如果超过了这个限制，大块会被拆分成多个小块。
        minChunks: 1, // 拆分前必须共享模块的最小块数。
        maxAsyncRequests: 5, // 按需加载时并行请求的最大数目。
        maxInitialRequests: 3, // 入口点的最大并行请求数
        automaticNameDelimiter: '~', // 默认情况下，webpack将使用块的来源和名称（例如vendors~main.js）生成名称。此选项允许您指定要用于生成的名称的分隔符。
        automaticNameMaxLength: 30, // 允许为SplitChunksPlugin生成的块名称的最大长度
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial'
          }
        }
      })
    })

    config.plugin('html')
      .tap(args => {
        return [{
          inlineSource: '.(js|css)$' // embed all javascript and css inline
        }]
      })
  },
  // 打包组件时打开
  css: { extract: false },
  configureWebpack () {
    return {
      externals: cdn.externals,
      plugins: [
        new HappyPack({
          id: 'babel',
          loaders: ['babel-loader?cacheDirectory=true'],
          threadPool: happyThreadPool
        }),
        new HtmlWebpackInlineSourcePlugin()
      ]
    }
  }
}
