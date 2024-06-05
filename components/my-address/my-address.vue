<template>
	<view>
		<!-- 选择收货地址的盒子 -->
		<view class="address-choose-box" v-if="JSON.stringify(address) === '{}'">
		    <button type="primary" size="mini" class="btnChooseAddress" @click="chooseAddress">请选择收货地址+</button>
		</view>
		
		<!-- 渲染收货信息的盒子 -->
		 <view class="address-info-box" v-else @click="chooseAddress">
		    <view class="row1">
				<view class="row1-left">
					<view class="username">收货人：<text>{{address.userName}}</text></view>
				</view>
				<view class="row1-right">
					<view class="phone">电话：<text>{{address.telNumber}}</text></view>
					<uni-icons type="arrowright" size="16"></uni-icons>
				</view>
		    </view>
		    <view class="row2">
				<view class="row2-left">收货地址：</view>
				<view class="row2-right">{{ addstr }}</view>
		    </view>
		</view>
		
		<!-- 底部的边框线 -->
		<image src="/static/cart_border@2x.png" class="address-border"></image>
	</view>
</template>

<script>
	import { useUser } from '@/store/store' // 解构名称必须与仓库导出的变量名一致
	import { mapState, mapActions } from 'pinia'
	
	export default {
		name:"my-address",
		data() {
			return {
				// address: {}
			};
		},
		methods:{
			...mapActions(useUser, ['updateAddress']),
			// 1. 调用小程序提供的 chooseAddress() 方法，即可使用选择收货地址的功能.返回值是一个数组：第 1 项为错误对象；第 2 项为成功之后的收货地址对象
			// 若无法使用接口可以尝试 mainfest.json里的mp-weixin节点下添加 "requiredPrivateInfos":["chooseAddress"] 
			async chooseAddress(){
				const res = await uni.chooseAddress().catch(err => err)
				// console.log(err)
				if(res.errMsg === 'chooseAddress:ok'){
					// this.address = res
					this.updateAddress(res)
				}
				
				// // 3. 用户没有授权（新版暂无此问题）
				// // 在模拟器和安卓真机上，错误消息 err.errMsg 的值为 chooseAddress:fail auth deny
				// // 在 iPhone 真机上，错误消息 err.errMsg 的值为 chooseAddress:fail authorize no response
				// if (err && (err.errMsg === 'chooseAddress:fail auth deny' || err.errMsg === 'chooseAddress:fail authorize no response')) {
				// 	this.reAuth() // 调用 this.reAuth() 方法，向用户重新发起授权申请
				// }
			},
			// 调用此方法，重新发起收货地址的授权
			async reAuth() {
				// 3.1 提示用户对地址进行授权
				const [err2, confirmResult] = await uni.showModal({
					content: '检测到您没打开地址权限，是否去设置打开？',
					confirmText: "确认",
					cancelText: "取消",
				})
				
				// 3.2 如果弹框异常，则直接退出
				if (err2) return
				
				// 3.3 如果用户点击了 “取消” 按钮，则提示用户 “您取消了地址授权！”
				if (confirmResult.cancel) return uni.$showMsg('您取消了地址授权！')
				
				// 3.4 如果用户点击了 “确认” 按钮，则调用 uni.openSetting() 方法进入授权页面，让用户重新进行授权
				if (confirmResult.confirm) return uni.openSetting({
					// 3.4.1 授权结束，需要对授权的结果做进一步判断
					success: (settingResult) => {
					// 3.4.2 地址授权的值等于 true，提示用户 “授权成功”
					if (settingResult.authSetting['scope.address']) return uni.$showMsg('授权成功！请选择地址')
					// 3.4.3 地址授权的值等于 false，提示用户 “您取消了地址授权”
					if (!settingResult.authSetting['scope.address']) return uni.$showMsg('您取消了地址授权！')
					}
				})
			}
		},
		computed:{
			...mapState(useUser, ['address', 'addstr'])
		}
	}
</script>

<style lang="scss">
.address-border{
	display: block;
	width: 100%;
	height: 5px;
}

.address-choose-box{
	height: 90px;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.address-info-box{
	font-size: 12px;
	height: 90px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 0 5px;
	
	.row1{
		display: flex;
		justify-content: space-between;
		
		.row1-right{
			display: flex;
			justify-content: space-between;
			
			.phone{
				
			}
		}
	}
	.row2{
		display: flex;
		// justify-content: space-between;
		align-items: center;
		margin-top: 10px;
		
		.row2-left{
			white-space: nowrap; // 文本不换行
		}
	}
}
</style>