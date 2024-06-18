<template>
	<view class="login-container">
		<!-- 提示登录的图标 -->
		<uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
		<!-- 登录按钮 -->
		<!-- 可以从 @getuserinfo 事件处理函数的形参中，获取到用户的基本信息 -->
		<!-- <button type="primary" class="btn-login" open-type="getUserInfo" @getuserinfo="getUserInfo">一键登录</button> -->
		<button type="primary" class="btn-login" @click="getUserProfile">一键登录</button>
		<!-- 登录提示 -->
		<view class="tips-text">登录后尽享更多权益</view>
	</view>
</template>

<script>
	import { useUser } from '@/store/store'
	import { mapState, mapActions} from 'pinia'
	
	export default {
		name:"my-login",
		data() {
			return {
				
			};
		},
		computed:{
			...mapState(useUser, ['redirectInfo'])
		},
		methods:{
			...mapActions(useUser, ['updateUserInfo','updateToken','updateRedirectInfo']),
			getUserInfo(e){
				console.log((e))
			},
			// 用户授权弹框，先在微信开发者工具把基础库调到2.27.0以下（我选的是2.26.2）
			async getUserProfile(){
				const res = await uni.getUserProfile({
					desc: "获取你的昵称、头像、地区及性别",
					success: async (res) => {
						// console.log(res)
						this.updateUserInfo(res.userInfo)
						
						// 获取登录成功后的 Token 字符串
						this.getToken(res)
					},
					fail:err=>{
						console.log(err)
						if(err.errMsg === 'getUserProfile:fail auth deny'){
							console.log('用户取消授权！')
						}
					}
				})
			},
			async getToken(info){
				// 准备参数对象
				let query = {}
				// // 调用微信登录接口
				// const getloginData = await uni.login({
				// 	// provider: 'weixin',
				// 	success: res => {
				// 		console.log('微信登录接口登录成功', res);
				// 		// 处理登录成功后的逻辑，比如保存用户信息等
				// 		query = {
				// 			code: res.code,
				// 			encryptedData: info.encryptedData,
				// 			iv: info.iv,
				// 			rawData: info.rawData,
				// 			signature: info.signature
				// 		}
				// 	},
				// 	fail: err => {
				// 		console.error('微信登录接口登录失败', err);
				// 		return
				// 	}
				// });
				
				// 调用微信登录接口
				const res  = await uni.login().catch(err => err)
				if (res instanceof Error || res.errMsg !== 'login:ok') return uni.$showError('登录失败！')
				
				query = {
					code: res.code,
					encryptedData: info.encryptedData,
					iv: info.iv,
					rawData: info.rawData,
					signature: info.signature
				}
				// // 换取 token  , 无权限调用接口Token直接写死
				// const { data: loginResult }  = await uni.$http.post('/api/public/v1/users/wxlogin', query)
				// if (loginResult.meta.status !== 200) return uni.$showMsg('登录失败！')
				// uni.$showMsg('登录成功')
				uni.$showMsg('登录成功')
				this.updateToken('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo')
				
				// 判断 vuex 中的 redirectInfo 是否为 null
				// 如果不为 null，则登录成功之后，需要重新导航到对应的页面
				this.navigateBack()
			},
			// 返回登录之前的页面
			navigateBack() {
				// redirectInfo 不为 null，并且导航方式为 switchTab
				if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
					// 调用小程序提供的 uni.switchTab() API 进行页面的导航
					uni.switchTab({
						// 要导航到的页面地址
						url: this.redirectInfo.from,
						// 导航成功之后，把 vuex 中的 redirectInfo 对象重置为 null
						complete: () => {
							this.updateRedirectInfo(null)
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: white;
	}
	
.login-container{
	height: 750rpx;
	background-color: #f8f8f8;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	position: relative;
	overflow: hidden;
	
	&::after{
		content: ' ';
		display: block;
		width: 100%;
		height: 40px;
		background-color: white;
		position: absolute;
		bottom: 0;
		left: 0;
		border-radius: 100%;
		transform: translateY(50%);
	}
	
	.btn-login{
		width: 90%;
		border-radius: 100px;
		margin: 15px 0;
		background-color: #c00000;
	}
	
	.tips-text{
		font-size: 12px;
		color: gray;
	}
}
</style>