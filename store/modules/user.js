import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// 定义store
// defineStore(仓库的唯一标识, () => { ... })
export const useUser = defineStore('User', () => {
	// 收货地址
	const address = ref(JSON.parse(uni.getStorageSync('address') || '{}'))
	
	// 更新收货地址
	const updateAddress = (obj) =>{
		address.value = obj
		saveAddressToStorage()
	}
	
	// 将购物车中的数据持久化存储到本地
	const saveAddressToStorage = () =>{
		uni.setStorageSync('address', JSON.stringify(address.value))
	}
	
	// 收货详细地址的计算属性
	const addstr = computed(()=>{
		if(!address.value.provinceName) return ''
		// 拼接 省，市，区，详细地址 的字符串并返回给用户
		return address.value.provinceName + address.value.cityName + address.value.countyName + address.value.detailInfo
	})
	
	// 登录成功之后的 token 字符串
	// Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo
	const token = ref(uni.getStorageSync('token') || '')
	
	// 用户的基本信息
	const userinfo = ref(JSON.parse(uni.getStorageSync('userinfo') || '{}'))
	
	// 更新用户的基本信息
	const updateUserInfo = (obj) =>{
		userinfo.value = obj
		saveUserInfoToStorage()
	}
	
	// 将 userinfo 持久化存储到本地
	const saveUserInfoToStorage = () =>{
		uni.setStorageSync('userinfo', JSON.stringify(userinfo.value))
	}
	
	// 更新 token 字符串
	const updateToken = (val) =>{
		token.value = val
		saveTokenToStorage()
	}
	
	// 将 token 字符串持久化存储到本地
	const saveTokenToStorage = () => {
	    uni.setStorageSync('token', token.value)
	}
	
	// 重定向的 object 对象 { openType, from }
	const redirectInfo = ref()
	// 更新重定向的信息对象
	const updateRedirectInfo = (obj) =>{
		redirectInfo.value = obj
		console.log(redirectInfo.value)
	}
	
	return {
		address,
		updateAddress,
		addstr,
		token,
		userinfo,
		updateUserInfo,
		updateToken,
		redirectInfo,
		updateRedirectInfo
	}
})