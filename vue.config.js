module.exports = {
  devServer: {
    host: "localhost"
  },

  assetsDir: "static",
  publicPath: process.env.BASE_URL,
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: "all",
        maxInitialRequests: Infinity,
        automaticNameDelimiter: "_",
        minSize: 0
      }
    }
  },

  chainWebpack: config => {
    config.plugins.delete("prefetch")
    config.plugins.delete("preload")
  },

  filenameHashing: true,
  runtimeCompiler: true,
  productionSourceMap: false
}
