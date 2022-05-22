module.exports = {
	devServer: {
		port: 8080,
		disableHostCheck: true,
		// proxy: "http://127.0.0.1:8000"
		proxy: {
			"/api": {
				target: 'http://127.0.0.1:8000/',
				changeOrigin: true, // 是否改变域名
				ws: false,
				pathRewrite: {
					'^/api': '/api'
				}
			}
		}
	}
}
