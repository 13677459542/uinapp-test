<template>
	<view>
		<my-login v-if="!token"></my-login>
		
		<my-userinfo v-else></my-userinfo>
	</view>
</template>

<script>
	import badgeMix from '@/mixins/tabbar-badge.js'
	import { useUser } from '@/store/store'
	import { mapState, mapActions} from 'pinia'
	
	export default {
		mixins: [badgeMix],
		data() {
			return {
				
			};
		},
		computed:{
			...mapState(useUser, ['token'])
		}
	}
</script>

<style lang="scss">
page,
.my-container {
  height: 100%;
}
</style>
