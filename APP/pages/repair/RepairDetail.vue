<template>
	<view id="Detail">
		<view class="h3 container">
			<text>{{title}}</text>
		</view>

		<view class="detail">
			<view class="header">
				<view class="title">Request - {{AjaxData.facilities}}</view>
				{{AjaxData.start|FTime}} To {{AjaxData.end|FTime}}
				<view class="p">Ticket No.{{AjaxData.code}}</view>
			</view>
			<view class="content">
				<view class="item">
					Address
					<view class="blod">{{AjaxData.building}}</view>
				</view>
				<view class="item">
					Request Classification
					<view class="blod">{{AjaxData.category}}</view>
				</view>
				<view class="item">
					Urgency Level
					<view class="blod">{{level}}</view>
				</view>
				<view class="item">
					<view class="title">Contact me before coming</view>
					<view class="blod">Phone {{AjaxData.phone}}</view>
					<view class="blod">Email {{AjaxData.email}}</view>
				</view>
				<view class="item">
					Note
					<view class="blod">{{AjaxData.note}}</view>
				</view>
				<view class="item">
					<view>Submitted</view>
					<view class="blod">{{AjaxData.start|FTime}}</view>
				</view>
				<view class="item" v-if="AjaxData.images.length">
					Photos
					<view class="uni-uploader__files">
						<view v-for="(src,index) in AjaxData.images" class="uni-uploader__file" :key="index">
							<image class="uni-uploader__img" mode="aspectFill" :src="src" :data-src="src" @tap="previewImage"></image>
						</view>
					</view>
				</view>
				<view class="item" style="background-color: #efefef;">
					<view class="title">Replies:</view>
					<view class="reply" v-for="(item,index) in replyData" :key="index" :class="{first:index==0}">
						<view>
							<text>{{item.replier_name}}:</text>
							<view>
								<text class="date">{{item.date}}</text>
								<!-- <icon type="clear" color="#fab701" @tap="DeleteReply(item.pk)" size="13" /> -->
							</view>
						</view>
						<rich-text :nodes="item.content"></rich-text>
					</view>

					<template v-if="AjaxData.status!=3">
						<view class="reply-footer">
							<textarea class="reply-inp" v-model="replyInp" placeholder="Enter Reply content" />
							</view>
						<view class="text-right">
							<button @tap="SubmitReply" htmltype="button" class="reply-btn">Reply</button>
						</view>
					</template>
				</view>
			</view>

			<template v-if="AjaxData.status==1">
				<view @tap="CancelItem" class="footer">Cancel</view>
			</template>
			<template v-else>
				<view @tap="DeleteItem" class="footer">Delete</view>
			</template>
		</view>
	</view>
</template>
<script>
	import uniSwipeAction from "@/components/uni-swipe-action/uni-swipe-action.vue"
	import {
		GET_Repair,
		POST_Repair
	} from "@/api/repair";
	import {
		GET_Reply,
		POST_Reply
	} from "@/api/notice";
	export default {
		components: {uniSwipeAction},
		data() {
			return {
				task_id:'',
				AjaxData: {images:[]},
				replyData: "",
				replyInp: "",
			};
		},
		methods: {
			//取消repair申请
			CancelItem() {
				var self = this;

				uni.showModal({
					content: 'Confirm this operation?',
					cancelText: 'cancel',
					confirmText: 'confirm',
					success: mres => {
						if (mres.confirm) {
							let data = {
								repair_id:self.task_id,
								method: "put",
								status: 3
							};
							POST_Repair(data).then(({data}) => {
								if (data.status == "ok") {
									uni.showToast({
										title: data.msg,
										icon: "none"
									})
									uni.navigateBack({
										delta: 1
									})
								} else {
									uni.showToast({
										title: data.msg,
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
					content: 'Confirm this operation?',
					cancelText: 'cancel',
					confirmText: 'confirm',
					success: mres=> {
						if (mres.confirm) {
							let data = {
								repair_id:self.task_id,
								method: "delete"
							};
							POST_Repair(data).then(res => {
								if (res.data.status == "ok") {
									uni.showToast({
										title: res.data.msg,
										icon: "none"
									})
									uni.navigateBack({
										delta: 1
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
			//显示图片
			previewImage(e){
				var current = e.target.dataset.src
				uni.previewImage({
					current,
					urls:this.AjaxData.images
				})
			},
			DeleteReply(id) {
				let data = {
					method: "delete",
					id
				};
				let self = this;
				// #ifdef APP-PLUS
				plus.nativeUI.confirm('Will you delete it?', ()=>{
					POST_Reply(data).then(res => {
						if (res.data.status == "ok") {
							uni.showToast({
								title: res.data.msg,
								icon: "none"
							})
							self.GetReplyList();
						} else if (res.data.status == "error") {
							uni.showToast({
								title: res.data.msg,
								icon: "none"
							})
						}
					});
				})
				// #endif
				// #ifndef APP-PLUS
				uni.showModal({
					title: 'Delete confirmation',
					content: 'Will you delete it?',
					cancelText: 'cancel',
					confirmText: 'confirm',
					success: function(mres) {
						if (mres.confirm) {
							POST_Reply(data).then(res => {
								if (res.data.status == "ok") {
									uni.showToast({
										title: res.data.msg,
										icon: "none"
									})
									self.GetReplyList();
								} else if (res.data.status == "error") {
									uni.showToast({
										title: res.data.msg,
										icon: "none"
									})
								}
							});
						}
					}
				});
				// #endif
			},
			GetReplyList() {
				let reolyParams = {
					task_type: 0,
					task_id:this.task_id
				};
				GET_Reply(reolyParams).then(res => {
					this.replyData = res.data;
				});
			},
			SubmitReply() {
				let data = {
					content: this.replyInp,
					task_type: 0,
					replier_id: this.$store.state.userId|| uni.getStorageSync('userId'),
					task_id:this.task_id
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
						return "Draft";
						break;
					case 1:
						return "Ongoing";
						break;
					case 2:
						return "Completed";
						break;
					case 3:
						return "Canceled";
						break;
					case 4:
						return "Accepted";
						break;
					case 5:
						return "Declined";
						break;
				}
			}
		},
		onLoad(option) {
			this.task_id = option.id;
			let params = {
				repair_id:this.task_id,
				
			};
			let _self = this
			GET_Repair(params).then(res => {
				// console.log(res.data)
				_self.AjaxData = Object.assign({},res.data.msg);
				console.log(_self.AjaxData)
				if(_self.AjaxData.images.length){
					_self.AjaxData.images.forEach((t,i,arr)=>{
						arr[i] = _self.$BaseUrl+'/'+t
					})
				}
				
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
					const TIME = new Date(date * 1000)

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
					const TIME = new Date(date * 1000)

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
		.uni-uploader__files {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
		}
		.uni-uploader__file {
			padding: 10upx;
			height: 219upx;
			width: 219upx;
		}
		
		.uni-uploader__img {
			display: block;
			width: 100%;
			height: 100%;
		}
		padding-bottom: 30px;
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
							&>text {
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
				font-size: 29.166upx;
			}

			.header {
				padding: 31.25upx;
				min-height: 162.5upx;
				background-color: #fad87b;

				.title {
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				&>view {
					font-family: "OpenSans-SemiBold";
					font-size: 31.25upx;
				}

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
