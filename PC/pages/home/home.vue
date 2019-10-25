<template>
	<view id="home">
		<view class="header">
			<view class="title">
				Home
				<view class="hint">
					<template v-if="noticeData.length > 0">
						<image @tap="target('/pages/notifications/Notifications')" src="/static/icons/bell.png" mode="aspectFit"></image>
						<view class="badge">
							<uni-badge type="error" :text="String(noticeData.length)"></uni-badge>
						</view>
					</template>
					<template v-else>
						<image @tap="target('/pages/notifications/Notifications')" src="/static/icons/bell.png" mode="aspectFit"></image>
					</template>
				</view>
			</view>
			<view class="main-nav">
				<view @tap="$url('/pages/repair/RequestRepair')">
					<view class="icons-bg">
						<image class="icons-bg-icon" src="/static/icons/yy.png" mode="aspectFit"></image>
					</view>
					<view class="main-nav-name">Request</view>
				</view>
				<view @tap="$url('/pages/soket')">
					<!-- bill -->
					<view class="icons-bg">
						<image class="icons-bg-icon" src="/static/icons/Bitmap.png" mode="aspectFit"></image>
					</view>
					<view class="main-nav-name">Pay bills</view>
				</view>
				<view>
					<view class="icons-bg">
						<image class="icons-bg-icon" src="/static/icons/barbecue.png" mode="aspectFit"></image>
					</view>
					<view class="main-nav-name">Reserve Amennity</view>
				</view>
			</view>
		</view>
		<view class="subnav">
			<view @tap="$url('/pages/Parking/ReserveParkingSpot')">
				<view class="image-warp">
					<image src="/static/icons/parked-car.png" style="width:64.583upx;height: 47.916upx" @tap="uni.$navigateTo({ url: '/Parking/ReserveParkingSpot' })"></image>
				</view>
				<view class="tag-p">Reseve</view>
				<view class="tag-p">Parking Spot</view>
			</view>
			<view>
				<view class="image-warp">
					<image src="/static/icons/parcel.png" style="width:58.333upx;height: 45.833upx"></image>
				</view>
				<view class="tag-p">Parcel</view>
			</view>
			<view>
				<view class="image-warp">
					<image src="/static/icons/market.png" style="width:58.333upx;height: 45.833upx"></image>
				</view>
				<view class="tag-p">Market</view>
			</view>
			<view>
				<view class="image-warp">
					<image src="/static/icons/event.png" style="width:52.083upx;height:52.083upx;"></image>
				</view>
				<view class="tag-p">Events</view>
			</view>
		</view>
		<view class="main">
			<view class="mask">
				<view class="left" @tap="$url('/pages/notifications/news')">
					<image src="/static/icons/laba.svg"></image>
					<view class="tag-p">All News</view>
					<uni-icon type="arrowdown" size="18" style="color: #c8c8c8;"></uni-icon>
				</view>
				<view v-if="newsListData.length" class="right" @tap="target('/pages/notifications/newdetail?id='+newsListData[0].pk)">
					<view class="notice">
						{{ notice }}
					</view>
					<uni-icon type="arrowright" size="18" style="color: #c8c8c8;"></uni-icon>
				</view>
				<view v-else class="right">No news</view>
			</view>
			<view class="home-pic">
				<image src="/static/image/home.png" mode="aspectFill"></image>
			</view>
			<view class="user">
				<image @tap="target('/pages/userCenter/MyAccount')" src="/static/icons/user.png"></image>
			</view>
		</view>
	</view>
</template>

<script>
	/* import { GET_Notice, GET_News } from "@/api/notice"; */
	import uniRequest from '@/http/http'
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
		beforeCreate() {

		},
		onLoad() {
			const Token = this.$store.state.estateToken || uni.getStorageSync('estateToken');
			if (!Token) {
				this.$url("/pages/login/Login")
			} else {
				this.$ajax.get('/notice/notice/?json').then(res => {
					this.noticeData = [...res.data.msg];
					this.noticeData = this.noticeData.filter(item => item.fields.read == 0);
				});
				this.$ajax.get('/annoucement/annoucement/?json').then(res => {
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

			.home-pic {
				text-align: center;
				margin-top: 31.25upx;

				image {
					height: 270.833upx;
					width: 100%;
					border-radius: 10.416upx;
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

					.tag-p {
						color: #e96f6c;
						font-size: 25upx;
					}

					image {
						height: 37.5upx;
						width: 37.5upx;
					}
				}
			}
		}

		.subnav {
			height: 147.916upx;
			color: #fab701;
			display: flex;
			justify-content: space-around;
			box-shadow: 0 6.25upx 6.25upx rgba(200, 200, 204, 0.8);
			align-items: baseline;
			padding-top: 20.833upx;

			.tag-p {
				font-size: 20.833upx;
				line-height: 1;
				text-align: center;
			}

			.image-warp {
				height: 54.166upx;
				display: flex;
				align-items: center;
				justify-content: center;

				&>image {
					margin-bottom: 8.333upx;
				}
			}
		}

		.header {
			position: relative;
			height: 468.75upx;
			background: #ddd url('~@/static/image/h4.jpg') no-repeat center center;
			background-size: cover;
			color: #fff;
			padding-top: 58.333upx;
			border-bottom-right-radius: 50% 13%;
			border-bottom-left-radius: 50% 13%;

			.main {
				padding: 25upx;
			}

			.main-nav {
				margin-top: 62.5upx;
				display: flex;
				justify-content: space-around;

				view {
					text-align: center;

					.main-nav-name {
						height: 50upx;
						text-align: center;
						margin-top: 5.833upx;
						word-wrap: break-word;
						max-width: 132.708upx;
						font-size: 22.916upx;
						line-height: 20.833upx;

						&:last-child {
							line-height: 25upx;
						}
					}
				}

				.icons-bg {
					display: flex;
					justify-content: center;
					align-items: center;
					background: #fff;
					border-radius: 50%;
					height: 132.708upx;
					width: 132.708upx;

					image {
						max-width: 71.666upx;
						max-height: 71.666upx;
					}
				}
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
