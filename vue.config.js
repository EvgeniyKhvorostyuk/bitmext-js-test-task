module.exports = {
  devServer: {
    proxy: {
      '^/api/v1': {
        target: process.env.VUE_APP_BITMEX_REST_ENDPOINT
      }
    }
  }
}