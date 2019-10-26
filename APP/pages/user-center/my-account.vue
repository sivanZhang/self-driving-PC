<template>
	<view id="MyAccount">
		<view class="card">
			<image src="/static/image/touxiang.png"></image>
			<view class="main-nav">
				<view>
					<view>
						My
					</view>
					<view>Property</view>
					<view>
						<uni-icon type="arrowright" style="color: #ffffff;"></uni-icon>
					</view>
				</view>
				<view>
					<view>
						My
					</view>
					<view>Vehicle</view>
					<uni-icon type="arrowright" style="color: #ffffff;"></uni-icon>
				</view>
				<view>
					<view>
						My
					</view>
					<view>Information</view>
					<uni-icon type="arrowright" style="color: #ffffff;"></uni-icon>
				</view>
			</view>
		</view>
		<view class="section" @tap="target('/pages/notifications/notification-list')">
			<view>
				<image class="icon" src="/static/icons/notify.png"></image>
				Notifications
			</view>
			<view>
				<block v-if="noticeData.length>0">
					<uni-badge type="error" class="badge" :text="String(noticeData.length)"></uni-badge>
				</block>
				<uni-icon type="arrowright"></uni-icon>
			</view>
		</view>
		<view class="section">
			<view>
				<image class="icon" src="/static/icons/chatbox.png"></image>
				Chatbox
			</view>
			<view>
				<uni-icon type="arrowright"></uni-icon>
			</view>
		</view>
		<view class="section" @tap="target('/pages/user-center/user-settings')">
			<view>
				<image class="icon" src="/static/icons/setting.png"></image>
				Setting
			</view>
			<view>
				<uni-icon type="arrowright"></uni-icon>
			</view>
		</view>
	</view>
</template>

<script>
	import {GET_Notice} from '@/api/notice'
	import uniBadge from "@/components/uni-badge/uni-badge.vue"
	import uniIcon from "@/components/uni-icon/uni-icon.vue"
	export default {
		components: {
			uniBadge,
			uniIcon,
		},
		data() {
			return {
				noticeData: [],
			};
		},
		methods:{
			target(url){
				uni.navigateTo({
					url
				})
			}
		},
		onLoad() {
			GET_Notice().then(res => {
				this.noticeData = res.data.msg;
				this.noticeData = this.noticeData.filter(item => item.fields.read == 0);
			})
		}
	};
</script>

<style lang="scss">
	#MyAccount {
		.badge {
			background-color: #e60000 !important;
			font-size: 25upx !important;
		}

		.section {
			padding: 0 41.666upx;
			height: 125upx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 2.083upx solid #c8c8cc;

			&>view:nth-child(1) {
				font-weight: bold;

				.icon {
					width: 62.5upx;
					height: 62.5upx;
					display: inline-block;
					margin-right: 37.5upx;
				}
			}

			&>view:nth-child(2) {
				color: #c8c8cc;
				display: flex;
				align-items: center;
			}
		}

		.card {
			image {
				width: 158.333upx;
				height: 158.333upx;
				border-radius: 50%;
				margin-top: 22.916upx;
			}

			.main-nav {
				padding-bottom: 31.25upx;
				display: flex;
				justify-content: space-between;
				color: #fff;
				margin: 45.833upx 31.25upx 0;

				&>view {
					height: 170.833upx;
					width: 197.916upx;
					border-radius: 8.333upx;
					font-size: 27.083upx;
					display: flex;
					align-items: center;
					flex-flow: row wrap;
					padding: 25upx;

					&>view {
						width: 100%;
					}
				}

				&>view:nth-child(1) {
					background-color: #f5a2a0;
				}

				&>view:nth-child(2) {
					background-color: #71d6ac;
				}

				&>view:nth-child(3) {
					background-color: #7db8fd;
				}
			}

			border-radius: 8.333upx;
			background: linear-gradient(to bottom, #efeff4, white);
			text-align: center;
			margin: 41.666upx 31.25upx 0.15rem;
			box-shadow: 0 0 16.666upx 4.166upx rgba(200, 200, 204, 0.8);
		}
	}
</style>
