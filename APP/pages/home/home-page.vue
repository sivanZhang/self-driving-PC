<template>
	<view id="home">
		<view class="header">
			<view class="title">
				Home
				<view class="hint">
					<template v-if="noticeData.length > 0">
						<image @tap="target('/pages/notifications/notification-list')" src="/static/icons/bell.png" mode="aspectFit"></image>
						<view class="badge">
							<uni-badge type="error" :text="String(noticeData.length)"></uni-badge>
						</view>
					</template>
					<template v-else>
						<image @tap="target('/pages/notifications/notification-list')" src="/static/icons/bell.png" mode="aspectFit"></image>
					</template>
				</view>
			</view>
		</view>
		<view class="main">
			<view class="mask">
				<view class="left" @tap="target('/pages/notifications/new-list')">
					<image src="/static/icons/laba.svg"></image>
					<view class="tag-p">All News</view>
					<uni-icon type="arrowdown" size="18" style="color: #c8c8c8;"></uni-icon>
				</view>
				<view v-if="newsListData.length" class="right" @tap="target('/pages/notifications/new-detail?id='+newsListData[0].pk)">
					<view class="notice">
						{{ notice }}
					</view>
					<uni-icon type="arrowright" size="18" style="color: #c8c8c8;"></uni-icon>
				</view>
				<view v-else class="right">No news</view>
			</view>
			<view class="user">
				<image @tap="target('/pages/user-center/my-account')" src="/static/icons/user.png"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import {GET_Notice,GET_News} from '@/api/notice'
	import dayjs from "dayjs";
	import uniIcon from "@/components/uni-icon/uni-icon.vue"
	import uniBadge from "@/components/uni-badge/uni-badge.vue"
	export default {
		components: {
			uniBadge,
			uniIcon
		},
		data() {
			return {
				noticeData: [],
				newsListData: [],
				notice: '',
			};
		},
		methods: {
			target(url) {
				uni.navigateTo({
					url
				});
			}
		},
		onLoad() {
			const Token = this.$store.state.estateToken || uni.getStorageSync('estateToken');
			if (!Token) {
				uni.navigateTo({
        url:"/pages/login/login-page"
    })
			} else {
				GET_Notice().then(res => {
					this.noticeData = [...res.data.msg];
					this.noticeData = this.noticeData.filter(item => item.fields.read == 0);
				});
				GET_News().then(res => {
					this.newsListData = [...res.data.msg];
					this.notice = this.newsListData[0].fields.title;
				});
			}

		}
	}
</script>

<style lang="scss" scoped>
	#home {
		height: 100%;

		.main {
			padding: 41.666upx 31.25upx 0;

			.user {
				text-align: center;
				margin-top: 31.25upx;

				image {
					width: 150upx;
					height: 150upx;
					text-align: center;
				}
			}

			.mask {
				display: flex;
				align-items: center;
				height: 122.916upx;
				padding: 20.833upx 25upx;
				box-shadow: 0 0 12.5upx 2.083upx rgba(200, 200, 204, 0.8);
				line-height: 1;

				.right {
					width:78%;
					height: 68.75upx;
					line-height: 68.75upx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					border-left: 2.083upx solid #c8c8cc;
					padding-left: 31.25upx;
					margin-left: 31.25upx;
					font-size: 27.083upx;
					.notice{
						overflow:hidden;//超出的隐藏
						text-overflow:ellipsis;//省略号
						white-space:nowrap;//强制一行显示
					}
				}

				.left {
					text-align: center;
					font-size: 25upx;
					line-height: 1.4;

					image {
						height: 37.5upx;
						width: 37.5upx;
					}
				}
			}
		}

		.header {
			position: relative;
			height: 468.75upx;
			background: #ddd;
			/* url('~@/static/image/h4.jpg') */
			background-size: cover;
			color: #fff;
			padding-top: 58.333upx;

			.main {
				padding: 25upx;
			}

			.title {
				font-size: 62.5upx;
				height: 85.416upx;
				line-height: 85.416upx;
				text-align: center;
				position: relative;

				.hint {
					position: absolute;
					top: 0;
					right: 66.666upx;
					height: 85.416upx;
					line-height: 85.416upx;

					.badge {
						position: absolute;
						top: -41.666upx;
						left: 20.833upx;
					}

					image {
						width: 41.666upx;
						height: 41.666upx;
					}
				}
			}
		}
	}
</style>
