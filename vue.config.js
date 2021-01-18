const path = require("path")
const webpack = require('webpack')
const resolve = function(dir) {
  return path.join(__dirname, dir)
}
const isDev = process.env.NODE_ENV === 'development'
module.exports = {
  publicPath: isDev ? '/' : 'ruban_cds',
  outputDir: "dist",
  // 是否开启eslint保存检测
  lintOnSave: true,
  // 是否在构建生产包时生成sourcdeMap
  productionSourceMap: false,
  configureWebpack: config => {
    config.resolve = { // 配置解析别名
      extensions: ['.js', '.json', '.vue'],
      alias: {
        '@': resolve('src'),
        '@c': resolve('src/components'),
        '@a': resolve('src/api'),
        '@u': resolve('src/utils'),
        '@v': resolve('src/views'),
      }
    }
  },
  // 对内部的 webpack 配置（比如修改、增加Loader选项）(链式操作)。
  chainWebpack: (config) => {
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  },
  devServer: {
    hot: true,
    historyApiFallback: true,
    open: false,
    overlay: {
      warning: false,
      error: true
    },
    proxy: {
      "/api": {
        target: "http://kong.poros-platform.10.74.158.69.nip.io/", 
        changeOrigin: true,
        pathRewrite: {"^/api": "/api"}
      },
    }
  },
  css: { loaderOptions: { less: { javascriptEnabled: true } } },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.resolve(__dirname, 'src/assets/styles/theme.less'),
      ]
    }
  }
}
