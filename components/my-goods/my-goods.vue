<template>
	<view class="goods-item">
		<view class="goods-item-left">
			<image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
		</view>
		<view class="goods-item-right">
			<view class="goods-name">{{ goods.goods_name}}</view>
			<view class="goods-info-box">
				<text class="goods-price">￥{{ Number(goods.goods_price).toFixed(2)}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"my-goods",
		data() {
			return {
				// 默认的空图片
				// defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png
				defaultPic: '/static/images/celebrity-default-medium.png'
			};
		},
		// 定义 props 属性，用来接收外界传递到当前组件的数据
		props:{
			// 商品的信息对象
			goods:{
				type: Object,
				default: {}
			}
		}
	}
</script>

<style lang="scss">
.goods-item{
		display: flex;
		padding: 10px 5px;
		border-bottom: 1px solid #f0f0f0;
		
		.goods-item-left{
			
			.goods-pic{
				width: 100px;
				height: 100px;
				display: block;
			}
		}
		.goods-item-right{
			margin-left: 5px;
			display: flex;
			flex-direction: column; // 纵向布局
			justify-content: space-between; // 两端排列
			
			.goods-name{
				font-size: 13px;
			}
			.goods-info-box{
				.goods-price{
					color: #c00000;
					font-size: 16px;
				}
			}
		}
	}
</style>