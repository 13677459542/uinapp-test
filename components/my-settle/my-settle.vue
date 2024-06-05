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
		<view class="btn-settle">结算({{ checkedCount }})</view>
	</view>
</template>

<script>
	import { useCart } from '@/store/store'
	import { mapState, mapActions} from 'pinia'
	
	export default {
		name:"my-settle",
		data() {
			return {
				
			};
		},
		computed:{
			...mapState(useCart, ['checkedCount','total','checkedGoodsAmount']),
			isFullCheck(){
				return this.checkedCount === this.total
			}
		},
		methods:{
			...mapActions(useCart, ['updateAllGoodsState']),
			changeAllState(){
				// 修改购物车中所有商品的选中状态
				// !this.isFullCheck 表示：当前全选按钮的状态取反之后，就是最新的勾选状态
				this.updateAllGoodsState(!this.isFullCheck)
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