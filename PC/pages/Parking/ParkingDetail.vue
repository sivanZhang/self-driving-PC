<template>
	<view id="Detail">
		<view class="h3 container">
			<text>{{title}}</text></view>
		<view class="detail">
			<view class="header">
				<view class="title">reserve Parking Spots</view>
				{{AjaxData.start}} to {{AjaxData.end}}
				<view>Ticket No.{{AjaxData.code}}</view>
			</view>
			<view class="content">
				<view class="item">
					reservation
					<view class="blod">{{AjaxData.number}} Parking spots</view>
				</view>
				<view class="item">
					Vehicle Registration No. & Note
					<view class="blod">{{AjaxData.note}}</view>
				</view>
				<view class="item">
					<view>Submitted</view>
					<view class="blod">
						{{AjaxData.date|FTime}}
					</view>
				</view>
				<view class="item" style="background-color: #efefef;">
					<view class="title replies">Replies:</view>
					<view class="reply" v-for="(item,index) in replyData" :class="{first:index==0}" :key="index">
						<view>
							<text>{{item.replier_name}}:</text>
							<view>
								<text class="date">{{item.date}}</text>
								<!-- <icon type="clear" color="#fab701" @tap="DeleteReply(item.pk)" size="13"/> -->
							</view>
						</view>
						<rich-text :nodes="item.content"></rich-text>
					</view>
					<block v-if="AjaxData.status!=3">
						<view class="reply-footer">
							<textarea class="reply-inp" v-model="replyInp" placeholder="Enter Reply content" />
							</view>
						<view class="text-right">
							<button @tap="SubmitReply" htmltype="button" class="reply-btn">Reply</button>
						</view>
					</block>
				</view>
			</view>
			<block v-if="AjaxData.status==0">
				<view @tap="CancelItem" class="footer">Cancel</view>
			</block>
			<block v-else>
				<view @tap="DeleteItem" class="footer">Delete</view>
			</block>
		</view>
	</view>
</template>
<script>
	import uniSwipeAction from "@/components/uni-swipe-action/uni-swipe-action.vue"
	import {
		GET_ParkingDetail,
		POST_Parking
	} from "@/api/paking";
	import {
		GET_Reply,
		POST_Reply
	} from "@/api/notice";
	let task_id = "";
	export default {
		components: {uniSwipeAction},
		methods: {
			DeleteReply(id) {
				let self = this;
				uni.showModal({
					title: 'Delete confirmation',
					content: 'Will you delete it?',
					cancelText: 'cancel',
					confirmText: 'confirm',
					success: function(res) {
						if (res.confirm) {
							let data = {
								method: "delete",
								id
							};
							POST_Reply(data).then(res => {
								if (res.data.status == "ok") {
									uni.showToast({
										title:res.data.msg,
										icon:"none"
									})
									self.GetReplyList();
								} else if (res.data.status == "error") {
									uni.showToast({
										title:res.data.msg,
										icon:"none"
									})
								}
							});
						}
					}
				});
			},
			GetReplyList() {
				let reolyParams = {
					task_type: 1,
					task_id
				};
				GET_Reply(reolyParams).then(res => {
					this.replyData = res.data;
				});
			},
			SubmitReply() {
				let data = {
					content: this.replyInp,
					task_type: 1,
					replier_id: this.$store.state.userId|| uni.getStorageSync('userId'),
					task_id
				};
				POST_Reply(data).then(res => {
					if (res.data.status == "ok") {
						this.replyInp = "";
						uni.showToast({
							title: res.data.msg,
							icon: "none"
						})
						this.GetReplyList();
					} else if (res.data.status == "error") {
						uni.showToast({
							title: res.data.msg,
							icon: "none"
						})
					}
				});
			},
			CancelItem() {
				let self = this;
				uni.showModal({
					title: 'Confirm this operation?',
					cancelText: 'cancel',
					confirmText: 'confirm',
					success: function(res) {
						if (res.confirm) {
							let data = {
								id: task_id,
								method: "put",
								status: 3
							};
							POST_Parking(data).then(res => {
								if (res.data.status == "ok") {
									uni.showToast({
										title: res.data.msg
									})
									uni.navigateBack({
										delta:1,
									})
								} else {
									uni.showToast({
										title: res.data.msg,
										icon: "none"
									})
								}
							});
						}
					}
				});
			},
			DeleteItem() {
				uni.showModal({
					title: 'Delete confirmation',
					content: 'Will you delete it?',
					cancelText: 'cancel',
					confirmText: 'confirm',
					success: function(res) {
						if (res.confirm) {
							let data = {
								id: task_id,
								method: "delete"
							};
							POST_Parking(data).then(res => {
								if (res.data.status == "ok") {
									uni.showToast({
										title: res.data.msg
									})
									uni.navigateBack({
										delta:1,
									})
								} else {
									uni.showToast({
										title: res.data.msg,
										icon: "none"
									})
								}
							});
						}
					}
				});
			}
		},
		computed: {
			level() {
				switch (this.AjaxData.level) {
					case 0:
						return "average";
						break;
					case 1:
						return "urgent";
						break;
					case 2:
						return "supor urgent";
						break;
				}
			},
			title() {
				switch (this.AjaxData.status) {
					case 0:
						return "Ongoing";
						break;
					case 1:
						return "Accepted";
						break;
					case 2:
						return "Declined";
						break;
					case 3:
						return "Canceled";
						break;
				}
			}
		},
		data() {
			return {
				AjaxData: {},
				replyData: "",
				replyInp: "",
			};
		},
		onLoad(option) {
			task_id = option.id
			let params = {
				id: task_id
			};
			GET_ParkingDetail(task_id).then(res => {
				this.AjaxData = res.data;
				let changeTime = (dateObj)=>{
					return new Date(dateObj).toLocaleDateString()+" "+new Date(dateObj).toLocaleTimeString()
				}
				this.AjaxData = Object.assign(this.AjaxData,{
					modify_date:changeTime(this.AjaxData.modify_date),
					start:changeTime(this.AjaxData.start),
					end:changeTime(this.AjaxData.end),
				})
			});
			this.GetReplyList();
		},
		onNavigationBarButtonTap() {
			uni.reLaunch({
				url:"/pages/home/home"
			})
		},
		filters: {
			FTime(date) {
				if (date) {
					const TIME = new Date(date)

					function add0(val) {
						if (val < 10) {
							return `0${val}`
						} else {
							return val
						}
					}
					let [dd, mm, MM, hh] = [add0(TIME.getDate()),
						add0(TIME.getMonth() + 1),
						add0(TIME.getMinutes()),
						add0(TIME.getHours())
					]

					return `${mm}/${dd}/${TIME.getFullYear()} ${hh}:${MM}`
				} else {
					return ''
				}

			},
			FDate(date) {
				if (date) {
					const TIME = new Date(date)

					function add0(val) {
						if (val < 10) {
							return `0${val}`
						} else {
							return val
						}
					}
					let [dd, mm] = [add0(TIME.getDate()),
						add0(TIME.getMonth() + 1)
					]

					return `${mm}/${dd}/${TIME.getFullYear()}`
				} else {
					return ''
				}

			},
		},
	};
</script>
<style lang="scss" scoped>
	#Detail {
		padding-bottom: 62.5upx;
		.reply-footer{
			background: #fff;
			padding: 12.5upx 25upx;
			border: 1px solid #C8C8CC;
		}
		textarea{
			width: 100%;
			background: #fff;
			margin-top: 10.416rpx;
			height: 170.833upx;
		}
		.text-right{
			margin-top:20.833upx;
			text-align: right;
			button.reply-btn{
				display: inline-block;
				font-size: 27.083upx;
				height: 60upx;
				line-height: 60upx;
				border-radius: 30upx;
				background: rgb(65, 184, 134);
				color: #fff;
				display: inline-block;
				margin: 0;
				width: 80px;
				text-align: center;
			}
		}
		.detail {
			.content {
				.item {
					.reply {
						box-sizing: border-box;
						padding: 20.833upx;
						border-top: 2.083upx solid #c8c8cc;
						&.first{
							border-top:none;
							margin-top: 20.833upx;
						}
						view:first-child {
							display: flex;
							justify-content: space-between;

							&>test {
								font-family: "OpenSans-SemiBold";
							}

							&>view {
								display: flex;
								align-items: center;
								font-size: 25upx;
								.date{
									color: #8c8c8c;
									padding-right: 16.666upx;
								}
							}
						}

						&>view:last-child {
							text {
								font-size: 22.916upx;
								color: #c8c8cc;
							}
						}
					}

					padding: 31.25upx;

					&+.item {
						border-top: 2.083upx solid #c8c8cc;
					}
				}
			}

			border-radius: 8.333upx;
			overflow: hidden;

			.footer {
				font-family: "OpenSans-SemiBold";
				background-color: #fad87b;
				border-radius: 8.333upx;
				text-align: center;
				height: 125upx;
				line-height: 125upx;
				font-size: 14px;
			}

			.header {
				.title {
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;

					&.replies {
						margin-bottom: 31.25upx;
					}
				}

				&>view {
					font-family: "OpenSans-SemiBold";
					font-size: 31.25upx;
				}

				padding: 31.25upx;
				min-height: 162.5upx;
				background-color: #fad87b;
			}

			margin: 0 16.666upx;
			background-color: #fff;
		}

		background-color: rgb(34, 35, 41);
		min-height: 100vh;

		.container {
			text{
				color: #fff;
			}
			&.h3{
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
		}

		.h3 {
			font-size: 41.666upx;
			height: 91.666upx;
			line-height: 91.666upx;
			margin-bottom: 27.083upx;
		}

		.blod {
			font-family: "OpenSans-SemiBold";
		}
	}
</style>
