<template>
	<view>
		<view class="search-box">
		  <!-- 使用 uni-ui 提供的搜索组件 -->
		  <uni-search-bar @input="input" :radius="100" cancelButton="none" placeholder="请输入搜索内容" :focus="true"></uni-search-bar>
		</view>
		
		<!-- 搜索建议列表 -->
		<view class="sugg-list" v-if="searchResults.length !== 0">
		  <view class="sugg-item" v-for="(item, i) in searchResults" :key="i" @click="gotoDetail(item.goods_id)">
		    <view class="goods-name">{{item.goods_name}}</view>
		    <uni-icons type="arrowright" size="16"></uni-icons>
		  </view>
		</view>
		
		<!-- 搜索历史 -->
		<view class="history-box" v-else>
		  <!-- 标题区域 -->
		  <view class="history-title">
		    <text>搜索历史</text>
		    <uni-icons type="trash" size="17" @click="clean"></uni-icons>
		  </view>
		  <!-- 列表区域 -->
		  <view class="history-list">
		    <uni-tag :text="item" v-for="(item, i) in historyList" :key="i" @click="gotoGoodsList(item)"></uni-tag>
		  </view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				timer: null,
				keyword : '',
				// 搜索结果列表
				searchResults: [],
				// 搜索关键词的历史记录
				historyList: []
			};
		},
		onLoad() {
			// 首次加载界面将本地存储的历史记录加载到历史记录列表中
			this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
		},
		methods:{
			input(e) {
				// e 是最新的搜索内容
				// console.log(e)
			  
				// 清除 timer 对应的延时器
				clearTimeout(this.timer)
				// 重新启动一个延时器，并把 timerId 赋值给 this.timer
				this.timer = setTimeout(() => {
				// 如果 500 毫秒内，没有触发新的输入事件，则为搜索关键词赋值
				this.keyword = e
				// console.log(this.keyword)
				// 根据关键词，查询搜索建议列表
				this.getSearchList(this.keyword)
				}, 500)
			},
			// 根据搜索关键词，搜索商品建议列表
			async getSearchList() {
				// 判断关键词是否为空
				if (this.keyword === '') {
					this.searchResults = []
					return
				}
				// 发起请求，获取搜索建议列表
				const { data: res } = await uni.$http.get('/api/public/v1/goods/qsearch', { query: this.keyword })
				if (res.meta.status !== 200) return uni.$showMsg()
				this.searchResults = res.message
				// console.log(this.searchResults)
				
				// 1. 查询到搜索建议之后，调用 saveSearchHistory() 方法保存搜索关键词
				this.saveSearchHistory()
			},
			gotoDetail(goods_id){
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods_id
				})
			},
			saveSearchHistory(){
				// 2.1 直接把搜索关键词 push 到 historyList 数组中
				// this.historyList.push(this.keyword)
				
				this.historyList.unshift(this.keyword) // 将搜索关键词加入数组最前
				this.historyList = [...new Set(this.historyList)] // 使用 new Set 对象对关键字进行去重操作，并重新赋值给 historyList
				
				// 对搜索数据进行本地持久化存储
				uni.setStorageSync('kw', JSON.stringify(this.historyList))
			},
			clean(){
				// 清空 data 中保存的搜索历史
				this.historyList = []
				// 清空本地存储中记录的搜索历史
				uni.setStorageSync('kw', '[]')
			},
			gotoGoodsList(kw){
				uni.navigateTo({
					url: '/subpkg/goods_list/goods_list?query=' + kw
				})
			}
		}
	}
</script>

<style lang="scss">
.uni-searchbar{
	/* 将uni-search-bar 搜索组件默认的 #FFFFFF 改为 #C00000 */
	background-color: #c00000;
}

.search-box{
	// 设置定位效果为“吸顶”
	position: sticky;
	// 吸顶的“位置”
	top: 0;
	// 提高层级，防止被轮播图覆盖
	z-index: 999;
}

.sugg-list {
  padding: 0 5px;

  .sugg-item {
    font-size: 12px;
    padding: 13px 0;
    border-bottom: 1px solid #efefef;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .goods-name {
      // 文字不允许换行（单行文本）
      white-space: nowrap;
      // 溢出部分隐藏
      overflow: hidden;
      // 文本溢出后，使用 ... 代替
      text-overflow: ellipsis;
      margin-right: 3px;
    }
  }
}

.history-box {
  padding: 0 5px;

  .history-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    font-size: 13px;
    border-bottom: 1px solid #efefef;
  }

  .history-list {
    display: flex;
    flex-wrap: wrap;

    .uni-tag {
      margin-top: 5px;
      margin-right: 5px;
    }
  }
}
</style>
