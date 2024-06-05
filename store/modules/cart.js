import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// 定义store
// defineStore(仓库的唯一标识, () => { ... })
export const useCart = defineStore('Cart', () => {
	// // 声明基于数据派生的计算属性 getters (computed)
	// const double = computed(() => count.value * 2)
	
	// 购物车的数组，用来存储购物车中每个商品的信息对象
	// 每个商品的信息对象，都包含如下 6 个属性：
	// { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
	const cart = ref(JSON.parse(uni.getStorageSync('cart') || '[]'))
	
	// 加入购物车操作
	const addToCart = (goods) => {
		// 根据提交的商品的Id，查询购物车中是否存在这件商品 如果不存在，则 findResult 为 undefined；否则，为查找到的商品信息对象
		const findResult = cart.value.find((x) => x.goods_id === goods.goods_id)
	
		if (!findResult) {
			// 如果购物车中没有这件商品，则直接 push
			cart.value.push(goods)
		} else {
			// 如果购物车中有这件商品，则只更新数量即可
			findResult.goods_count++
		}
		
		saveToStorage()
	}
	
	// 计算属性，统计商品总数量
	const total = computed(() => {
		// let c = 0
		// // 循环统计商品的数量，累加到变量 c 中
		// cart.value.forEach(goods => c += goods.goods_count)
		// return c
		return cart.value.reduce((total,item) => total += item.goods_count, 0)
	})
	
	// 将购物车中的数据持久化存储到本地
	const saveToStorage = () =>{
		uni.setStorageSync('cart', JSON.stringify(cart.value))
	}
	
	// 更新购物车中商品的勾选状态
	const updateGoodsState = (goods_id) =>{
		const findResult = cart.value.find(x => x.goods_id === goods_id)
		if(findResult){
			findResult.goods_state = !findResult.goods_state
			saveToStorage()
		}
	}
	
	// 更新购物车中商品的数量
	const updateGoodsCount = (obj) =>{
		const findResult = cart.value.find(x => x.goods_id === obj.goods_id)
		if(findResult){
			findResult.goods_count = obj.goods_count
			saveToStorage()
		}
	}
	
	// 根据 Id 从购物车中删除对应的商品信息
	const removeGoodsById = (goods_id) =>{
		// 调用数组的 filter 方法进行过滤
		cart.value = cart.value.filter(x => x.goods_id !== goods_id)
		saveToStorage()
	}
	
	// 勾选的商品的总数量
	const checkedCount = computed(()=>{
		// 先使用 filter 方法，从购物车中过滤器已勾选的商品
		// 再使用 reduce 方法，将已勾选的商品总数量进行累加
		// reduce() 的返回值就是已勾选的商品的总数量
		return cart.value.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count, 0)
	});
	
	// 更新所有商品的勾选状态
	const updateAllGoodsState = (newState) =>{
		// 循环更新购物车中每件商品的勾选状态
		cart.value.forEach(x => x.goods_state = newState)
		saveToStorage()
	}
	
	// 已勾选的商品的总价
	const checkedGoodsAmount = computed(()=>{
		// 先使用 filter 方法，从购物车中过滤器已勾选的商品
		// 再使用 reduce 方法，将已勾选的商品数量 * 单价之后，进行累加
		// reduce() 的返回值就是已勾选的商品的总价
		// 最后调用 toFixed(2) 方法，保留两位小数
		return cart.value.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count * item.goods_price, 0).toFixed(2)
	})
	
	return {
		cart,
		addToCart,
		total,
		updateGoodsState,
		updateGoodsCount,
		removeGoodsById,
		checkedCount,
		updateAllGoodsState,
		checkedGoodsAmount
	}
}
// , {
//   // persist: true // 开启当前模块的持久化
//   persist: {
//     key: 'hm-counter', // 修改本地存储的唯一标识
//     paths: ['count'] // 存储的是哪些数据
//   }
// },
)