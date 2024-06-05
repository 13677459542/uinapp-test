// 导入网络请求的包（由于平台的限制，小程序项目中不支持 axios，而且原生的 wx.request() API 功能较为简单，不支持拦截器等全局定制的功能。
// 因此，建议在 uni-app 项目中使用 @escook/request-miniprogram 第三方包发起网络数据请求。地址：https://www.npmjs.com/package/@escook/request-miniprogram）
// 注意：导入模块别放在 【ifndef VUE3    endif】 中 ，会导致解析失败
import { $http } from '@escook/request-miniprogram'
uni.$http = $http
// 请求根路径
$http.baseUrl = 'https://api-hmugo-web.itheima.net'
// 配置请求拦截器
$http.beforeRequest = function(options) {
	uni.showLoading({
		title:'数据加载中...'
	})
}
// 配置响应拦截器
$http.afterRequest = function() {
	uni.hideLoading()
}

// 封装弹框的方法，需要弹框提示的地方不需要再多次写重复的代码
uni.$showMsg = function(title = '数据请求失败！', duration = 1500){
	uni.showToast({
		title,
		duration,
		icon: 'none'
	})
}

// #ifndef VUE3
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'

//导入pinia  
import * as Pinia from  'pinia'


export function createApp() {
	const app = createSSRApp(App)
  
	// 创建Pinia实例  // 将pinia实例挂载到vue实例上 
    app.use(Pinia.createPinia());

	return {
		app,
		Pinia // 此处必须将 Pinia 返回
	}
}
// #endif