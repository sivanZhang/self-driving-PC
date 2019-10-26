<template>
	<view id="notifications">
		<view class="subnav">
			<view>
				<image src="/static/icons/parked-car.png" mode="aspectFit" style="width:64.375upx"></image>
				<view class="p">Parking</view>
			</view>
			<view>
				<image mode="aspectFit" src="/static/icons/parcel.png" style="width:54.791upx"></image>
				<view class="p">Parcel</view>
			</view>
			<view>
				<image mode="aspectFit" src="/static/icons/market.png" style="width:55.208upx"></image>
				<view class="p">Market</view>
			</view>
			<view>
				<image mode="aspectFit" src="/static/icons/event.png" style="width:48.125upx"></image>
				<view class="p">Events</view>
			</view>
		</view>
		<uni-swipe-action v-for="item in notiData" :key="item.pk" :is-opened="false" @tap="deleteNotice($event,item.pk)"
		 :options="options">
			<view class="section container" @tap.stop="target_detail(item)">
				<view class="badge" v-if="item.fields.read==0">
				</view>
				<image mode="aspectFill" src="/static/image/touxiang.png"></image>
				<view class="content">
					<view>
						<view class="name">{{item.fields.title}}</view>
						<view class="date">{{item.fields.date|dateTimeFormat}}</view>
						<view class="msg" v-html="item.fields.content"></view>
					</view>
				</view>
			</view>
		</uni-swipe-action>
	</view>
</template>

<script>
	import uniSwipeAction from "@/components/uni-swipe-action/uni-swipe-action.vue"
	import {
		GET_Notice,
		POST_Notice
	} from "@/api/notice.js";
	export default {
		components: {
			uniSwipeAction
		},
		data() {
			return {
				notiData: [],
				options: [{
					text: 'cancel',
					style: {
						backgroundColor: '#007aff'
					}
				}, {
					text: 'delete',
					style: {
						backgroundColor: '#dd524d'
					}
				}]
			};
		},
		onLoad() {
			GET_Notice()
				.then(res => {
					this.notiData = [...res.data.msg];

					function compare(p, cp) {
						//这是比较函数
						return function(m, n) {
							var a = m[p][cp];
							var b = n[p][cp];
							return a - b; //升序
						};
					}
					this.notiData.sort(compare("fields", "read"));
				})
				.catch(err => {});
		},
		methods: {
			target_detail(data) {
				this.isRead(data.pk);
				if (data.fields.category == 0) {
					uni.navigateTo({
        url:`/pages/repair/RepairDetail?id=${data.fields.task_id}`
    })
				} else if (data.fields.category == 1) {
					uni.navigateTo({
        url:`/pages/Parking/ParkingDetail?id=${data.fields.task_id}`
    })
				} else if (data.fields.category == 2) {
					uni.navigateTo({
        url:`/pages/notifications/new-listditail?id=${data.fields.task_id}`
    })
				}
			},
			deleteNotice(e, ids) {
				if (e.index) {
					let data = {
						ids,
						method: "delete"
					};
					uni.showModal({
						cancelText: "cancel",
						confirmText: "confirm",
						title: "Delete confirmation",
						content: "Will you delete it?",
						success() {
							POST_Notice(data).then(res => {
								uni.showToast({
									title: res.data.msg,
									icon: "none"
								})
								GET_Notice()
									.then(res => {
										this.notiData = [...res.data.msg];

										function compare(p, cp) {
											//这是比较函数
											return function(m, n) {
												var a = m[p][cp];
												var b = n[p][cp];
												return a - b; //升序
											};
										}
										this.notiData.sort(compare("fields", "read"));
									})
							});
						}
					})
				}
			},
			isRead(id) {
				let data = {
					id,
					read: 1,
					method: "put"
				};
				POST_Notice(data);
			}
		},
		onNavigationBarButtonTap() {
			uni.reLaunch({
				url: "/pages/home/home-page"
			})
		}
	};
</script>

<style lang="scss" scoped>
	#notifications {
		.section {
			position: relative;
			display: flex;
			flex-flow: row nowrap;
			justify-content: flex-start;
			border-top: 2.083upx solid #c8c8cc;
			padding: 31.25upx;

			.badge {
				position: absolute;
				left: 31.25upx;
				top: 31.25upx;
				width: 10upx;
				height: 10upx;
				border-radius: 50%;
				background: #dd524d;
			}

			.content {
				flex: 1 0 80%;
				line-height: 1.8;
				padding-left: 10px;

				&>view {
					.date {
						display: flex;
						justify-content: space-between;
						color: #c8c8c8;
					}

					.name {
						font-weight: 600;
						font-size: 29.166upx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						width: 520.833upx;
					}
					.msg{
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						overflow:hidden;
						/*! autoprefixer: off */
						-webkit-box-orient: vertical;
					}
				}
			}

			&>image {
				flex: 1 1 20%;
				border-radius: 50%;
				width: 118.75upx;
				height: 118.75upx;
				display: inline-block;
			}
		}

		.subnav {
			height: 170.833upx;
			line-height: 1;
			color: #fab701;
			display: flex;
			justify-content: space-around;
			box-shadow: 0 6.25upx 6.25upx rgba(200, 200, 204, 0.8);
			align-items: baseline;
			padding-top: 31.25upx;

			view {
				text-align: center;
				font-size: 20.833upx;

				image {
					margin-bottom: 8.333upx;
					height: 41.666upx;
				}
			}
		}
	}
</style>
