const path = require("path")
const webpack = require('webpack')
const resolve = function(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  publicPath: '',
  outputDir: "dist",
  assetsDir: "static",
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
  chainWebpack: () => {},
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
        target: "http://kong.poros-platform.10.74.158.71.nip.io", //sit
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