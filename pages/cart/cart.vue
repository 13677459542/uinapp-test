<template>
	<view class="cart-container" v-if="cart.length !== 0">
		<my-address></my-address>
		
		<!-- 购物车商品列表的标题区域 -->
		<view class="cart-title">
		  <!-- 左侧的图标 -->
		  <uni-icons type="shop" size="18"></uni-icons>
		  <!-- 描述文本 -->
		  <text class="cart-title-text">购物车</text>
		</view>
		
		<uni-swipe-action>
			<!-- 商品列表区域 -->
			<block v-for="(goods, i) in cart" :key="i">
				<uni-swipe-action-item :right-options="options" @click="swipeActionClickHandler(goods)">
					 <my-goods :goods="goods" :showRadio="true" :showNum="true" @radioChange="radioChangeHandler" @numChange="numberChangeHandler"></my-goods>
				</uni-swipe-action-item>
			</block>
		</uni-swipe-action>
		
		<my-settle></my-settle>
	</view>
	
	<!-- 空白购物车区域 -->
	<view class="empty-cart" v-else>
		<image src="/static/cart_empty@2x.png" class="empty-img"></image>
		<text class="tip-text">空空如也~</text>
	</view>
</template>

<script>
	import badgeMix from '@/mixins/tabbar-badge.js'
	import { useCart } from '@/store/store' // 解构名称必须与仓库导出的变量名一致
	import { mapState, mapActions } from 'pinia'
	
	export default {
		mixins: [badgeMix],
		watch:{
			total(newValue){
				let routes = getCurrentPages()
				let currentPage = routes[routes.length - 1].route;
				if(currentPage === 'pages/cart/cart'){
					this.setBadge()
				}
			}
		},
		computed:{
			...mapState(useCart, ['cart'])
		},
		onShow() {
			// let routes =getCurrentPages()
			// let currentPage= routes[routes.length - 1].route;
			// console.log(currentPage)
		},
		data() {
			return {
				options: [{
				    text: '删除', // 显示的文本内容
				    style: {
				      backgroundColor: '#C00000' // 按钮的背景颜色
				    }
				 }]
			};
		},
		methods:{
			...mapActions(useCart, ['updateGoodsState', 'updateGoodsCount', 'removeGoodsById']),
			// 注册自定义点击事件
			radioChangeHandler(e){
				 // console.log(e) // 输出得到的数据 -> 商品id
				 
				 // 触发pinia中定义好的更新购物车选择状态方法，并传入参数
				 this.updateGoodsState(e)
			},
			numberChangeHandler(e){
				 // console.log(e) // 输出得到的数据 -> {goods_id: 395, goods_count: 2}
				 this.updateGoodsCount(e)
			},
			swipeActionClickHandler(goods){
				// console.log(goods.goods_id)
				this.removeGoodsById(goods.goods_id)
			}
		}
	}
</script>

<style lang="scss">
	.cart-container{
		// 给结算组件预留空间
		padding-bottom: 50px;
	}
	.cart-title{
		height: 40px;
		display: flex;
		align-items: center;
		padding-left: 5px;
		border-bottom: 1px solid #efefef;
		
		.cart-title-text{
			font-size: 14px;
			margin-left: 10px;
		}
	}
	
	.empty-cart{
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 150px;
		
		.empty-img{
			width: 90px;
			height: 90px;
		}
		.tip-text{
			font-size: 12px;
			color: gray;
			margin-top: 15px;
		}
	}
</style>
