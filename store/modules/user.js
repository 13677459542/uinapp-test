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
	
	return {
		address,
		updateAddress,
		addstr
	}
})