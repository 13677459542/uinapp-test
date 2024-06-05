import { useCart } from '@/store/store' // 解构名称必须与仓库导出的变量名一致
import { mapState } from 'pinia'

// 导出一个 mixin 对象
export default {
	computed:{
		...mapState(useCart,['total'])
	},
	onShow() {
		// 在页面刚展示的时候，设置数字徽标
		this.setBadge()
	},
	methods: {
		setBadge() {
			if(this.total > 0){
				// 调用 uni.setTabBarBadge() 方法，为购物车设置右上角的徽标
				uni.setTabBarBadge({
					index: 2,
					text: this.total + '', // 注意：text 的值必须是字符串，不能是数字
				})
			}
			else{
				// 购物车数量为空时移除徽标
				uni.removeTabBarBadge({index: 2})
			}
		},
	},
}