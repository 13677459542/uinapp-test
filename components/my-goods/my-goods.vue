<template>
	<view class="goods-item">
		<view class="goods-item-left">
			<radio :checked="goods.goods_state" color="#C00000" v-if="showRadio" @click="radioClickHandler"></radio>
			<image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
		</view>
		<view class="goods-item-right">
			<view class="goods-name">{{ goods.goods_name}}</view>
			<view class="goods-info-box">
				<text class="goods-price">￥{{ Number(goods.goods_price).toFixed(2)}}</text>
				
				<!-- 商品数量 -->
				<uni-number-box :min="1" :value="goods.goods_count" v-if="showNum" @change="numChangeHandler"></uni-number-box>
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
			},
			// 是否展示图片左侧的 radio
			showRadio: {
				type: Boolean,
				// 如果外界没有指定 show-radio 属性的值，则默认不展示 radio 组件
				default: false,
			},
			// 是否展示价格右侧的 NumberBox 组件
			showNum: {
				type: Boolean,
				default: false,
			},
		},
		methods:{
			radioClickHandler(){
				// 通过 this.$emit() 触发外界通过 @ 绑定的 radioChange 自定义事件
				this.$emit('radioChange',this.goods.goods_id)
			},
			// NumberBox 组件的 change 事件处理函数，val是最新的变化值
			numChangeHandler(val){
				this.$emit('numChange',{
					goods_id: this.goods.goods_id,
					goods_count: +val
				})
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
			// margin-right: 5px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			
			.goods-pic{
				width: 100px;
				height: 100px;
				display: block;
			}
		}
		.goods-item-right{
			margin-left: 10px;
			display: flex;
			flex: 1; // 占满整个区域
			flex-direction: column; // 纵向布局
			justify-content: space-between; // 两端排列
			
			.goods-name{
				font-size: 13px;
			}
			.goods-info-box{
				display: flex;
				justify-content: space-between;
				align-items: center;
				
				.goods-price{
					color: #c00000;
					font-size: 16px;
				}
			}
		}
	}
</style>