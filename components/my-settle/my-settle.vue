<template>
	<view class="my-settle-container">
		<!-- 全选区域 -->
		<label class="radio" @click="changeAllState">
			<radio color="#C00000" :checked="isFullCheck" /><text>全选</text>
		</label>
		
		<!-- 合计区域 -->
		<view class="amount-box">
			合计:<text class="amount">￥{{ checkedGoodsAmount }}</text>
		</view>
		
		<!-- 结算按钮 -->
		<view class="btn-settle" @click="settlement">结算({{ checkedCount }})</view>
	</view>
</template>

<script>
	import { useCart, useUser } from '@/store/store'
	import { mapState, mapActions} from 'pinia'
	
	export default {
		name:"my-settle",
		data() {
			return {
				// 倒计时的秒数
				seconds: 3,
				// 定时器的 Id
				timer: null
			};
		},
		computed:{
			...mapState(useCart, ['checkedCount','total','checkedGoodsAmount','cart']),
			...mapState(useUser, ['addstr','token']),
			isFullCheck(){
				return this.checkedCount === this.total
			}
		},
		methods:{
			...mapActions(useCart, ['updateAllGoodsState']),
			...mapActions(useUser, ['updateRedirectInfo']),
			changeAllState(){
				// 修改购物车中所有商品的选中状态
				// !this.isFullCheck 表示：当前全选按钮的状态取反之后，就是最新的勾选状态
				this.updateAllGoodsState(!this.isFullCheck)
			},
			settlement(){
				// 1. 先判断是否勾选了要结算的商品
				if (!this.checkedCount) return uni.$showMsg('请选择要结算的商品！')
				
				// 2. 再判断用户是否选择了收货地址
				if (!this.addstr) return uni.$showMsg('请选择收货地址！')
				
				// 3. 最后判断用户是否登录了，如果没有登录，则调用 delayNavigate() 进行倒计时的导航跳转
				// if (!this.token) return uni.$showMsg('请先登录！')
				if (!this.token) return this.delayNavigate()
				
				// 4. 实现微信支付功能，无权限调用支付跳过
				// this.payOrder()
			},
			// 微信支付
			async payOrder() {
				// 1. 创建订单
				// 1.1 组织订单的信息对象
				const orderInfo = {
					// 开发期间，注释掉真实的订单价格，
					// order_price: this.checkedGoodsAmount,
					// 写死订单总价为 1 分钱
					order_price: 0.01,
					consignee_addr: this.addstr,
					goods: this.cart.filter(x => x.goods_state).map(x => ({ goods_id: x.goods_id, goods_number: x.goods_count, goods_price: x.goods_price }))
				}
				// 1.2 发起请求创建订单
				const { data: res } = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo)
				if (res.meta.status !== 200) return uni.$showMsg('创建订单失败！')
				// 1.3 得到服务器响应的“订单编号”
				const orderNumber = res.message.order_number
				console.log(res)
				
				// 2. 订单预支付
				// 2.1 发起请求获取订单的支付信息
				const { data: res2 } = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', { order_number: orderNumber })
				// 2.2 预付订单生成失败
				if (res2.meta.status !== 200) return uni.$showError('预付订单生成失败！')
				// 2.3 得到订单支付相关的必要参数
				const payInfo = res2.message.pay
				console.log(payInfo)
				
				// 3. 发起微信支付
				// 3.1 调用 uni.requestPayment() 发起微信支付
				const [err, succ] = await uni.requestPayment(payInfo)
				// 3.2 未完成支付
				if (err) return uni.$showMsg('订单未支付！')
				// 3.3 完成了支付，进一步查询支付的结果
				const { data: res3 } = await uni.$http.post('/api/public/v1/my/orders/chkOrder', { order_number: orderNumber })
				// 3.4 检测到订单未支付
				if (res3.meta.status !== 200) return uni.$showMsg('订单未支付！')
				// 3.5 检测到订单支付完成
				uni.showToast({
					title: '支付完成！',
					icon: 'success'
				})
			},
			// 延迟导航到 my 页面
			delayNavigate() {
				let sds = this.seconds
				this.showTips(sds)
				// 1. 将定时器的 Id 存储到 timer 中
				this.timer = setInterval(() => {
					sds--
					// 2. 判断秒数是否 <= 0
					if (sds <= 0) {
						// 2.1 清除定时器
						clearInterval(this.timer)
						// 2.2 跳转到 my 页面
						uni.switchTab({
							url: '/pages/my/my',
							// 页面跳转成功之后的回调函数
							success: () => {
								// 调用 vuex 的 updateRedirectInfo 方法，把跳转信息存储到 Store 中
								this.updateRedirectInfo({
									// 跳转的方式
									openType: 'switchTab',
									// 从哪个页面跳转过去的
									from: '/pages/cart/cart'
								})
							}
						})
						// 2.3 终止后续代码的运行（当秒数为 0 时，不再展示 toast 提示消息）
						return
					}
					this.showTips(sds)
				}, 1000)
			},
			// 展示倒计时的提示消息
			showTips(n) {
				// 调用 uni.showToast() 方法，展示提示消息
				uni.showToast({
					// 不展示任何图标
					icon: 'none',
					// 提示的消息
					title: '请登录后再结算！' + n + ' 秒后自动跳转到登录页',
					// 为页面添加透明遮罩，防止点击穿透
					mask: true,
					// 1.5 秒后自动消失
					duration: 1500
				})
			}
		}
	}
</script>

<style lang="scss">
.my-settle-container{
	position: fixed; //底部固定定位
	bottom: 0;
	left: 0;
	width: 100%;
	height: 50px;
	background-color: white;
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 14px;
	padding-left: 5px;
	
	.radio{
		display: flex;
		align-items: center;
	}
	
	.amount-box{
		.amount{
			color: #c00000;
			font-weight: bold;
		}
	}
	
	.btn-settle{
		background-color: #c00000;
		height: 50px;
		color: white;
		line-height: 50px;
		padding: 0 10px;
		min-width: 100px;
		text-align: center;
	}
}
</style>