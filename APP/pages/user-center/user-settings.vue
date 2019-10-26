<template>
	<view id="setting">
		<!-- <goHome /> -->
		<view class="section" @tap="LogOut">
			<view>Log out</view>
			<image class="icon" src="/static/icons/logout.svg"></image>
		</view>
	</view>
</template>

<script>
	export default {
		methods: {
			LogOut() {
				let self = this;
				this.$store.commit("setToken");
				this.$store.commit("setUserId");
				uni.showToast({
					title: 'Logged out',
					mask: false,
					duration: 1500,
					success() {
						setTimeout(() => {
							uni.navigateTo({
        url:"/pages/login/login-page"
    })
						}, 1000);
					}
				});

			}
		},
		onNavigationBarButtonTap() {
			uni.reLaunch({
				url:"/pages/home/home-page"
			})
		}
	};
</script>

<style lang="scss">
	#setting {
		.section {
			padding:31.25upx 41.666upx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 2.083upx solid #c8c8cc;

			&>view {
				font-weight: bold;
			}

			&>.icon {
				width: 45.833upx;
				height: 45.833upx;
			}
		}
	}
</style>
