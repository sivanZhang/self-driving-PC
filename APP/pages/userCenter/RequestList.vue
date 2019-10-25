<template>
	<view id="RepairList" class="warp-pb">
		<Search @onSearch="search" v-model="searchVal" :searchText="'ticket No'" />
		<TabNav :activeKey="activeKey" :menuList="menuList" @tapChange="change" />
		<block v-if="activeKey=='Repair'">
			<view v-if="AjaxData==''" class="text-center">No data.</view>
			<view class="container section" v-for="(item,index) in AjaxData" :key="index" @tap="targetDetails(1,item.pk)">
				<view class="date">{{item.fields.date|dateTimeFormat}}</view>
				<view class="detail">
					<view class="content">
						<view class="title">{{item.fields.code}}</view>
						<view class="p">{{item.fields.facilities}}</view>
						<view class="time">{{item.fields.prefertime_start|dateTimeFormat}} to
							{{item.fields.prefertime_end|dateTimeFormat}}
						</view>
						<uni-rate v-if="item.fields.rating!==null" :value="item.fields.rating" size="16" disabled></uni-rate>
					</view>
					<view class="operation text-right">
						<view :class="[{ongoing:item.fields.status==1},{completed:item.fields.status==2},{cancel:item.fields.status==3},{draft:item.fields.status==0},{declined:item.fields.status==5},{accept:item.fields.status==4}]">{{item.fields.showText}}</view>
						<template v-if="item.fields.status==1">
							<view class="draft">cancel</view>
						</template>
						<template v-else>
							<view class="text-right" v-if="item.fields.rating===null && item.fields.status==2">
								<image class="delete-icon" @tap.stop="showRate(item.pk)" src="/static/icons/rate.svg" mode="aspectFit"></image>
							</view>
							<view class="text-right">
								<image class="delete-icon" @tap.stop="deleteRepair(item.pk)" src="/static/icons/delete.svg" mode="aspectFit"></image>
							</view>
						</template>
					</view>
				</view>
			</view>
		</block>
		<block v-else-if="activeKey=='Parking'">
			<view v-show="ParkingData==''" class="text-center">No data.</view>
			<view class="container section" v-for="(item,index) in ParkingData" :key="index" @tap="targetDetails(2,item.pk)">
				<view class="date">{{item.fields.date|dateTimeFormat}}</view>
				<view class="detail">
					<view class="content">
						<view class="title">{{item.fields.code}}</view>
						<view class="p">{{item.fields.number}} Parking spots</view>
						<view class="time">
							{{item.fields.start|dateFormat}} to {{item.fields.end|dateFormat}}
						</view>
						<uni-rate v-if="item.fields.rating!==null" :value="item.fields.rating" size="16" disabled></uni-rate>
					</view>
					<view class="operation text-right">
						<view :class="[{ongoing:item.fields.status==0},{accept:item.fields.status==1},{declined:item.fields.status==2},{cancel:item.fields.status==3}]">{{item.fields.showText}}</view>
						<view class="text-right" v-if="item.fields.status==2　||item.fields.status==1">
							<image v-if="item.fields.rating==null" class="delete-icon" @tap.stop="showRate(item.pk)" src="/static/icons/rate.svg" mode="aspectFit"></image>
						</view>
						<template v-if="item.fields.status==0">
							<view class="text-right">
								<view class="draft text-right">cancel</view>
							</view>
						</template>
						<template v-else>
							<view class="text-right">
								<image class="delete-icon" @tap.stop="deleteParking(item.pk)" src="/static/icons/delete.svg"></image>
							</view>
						</template>
					</view>
				</view>
			</view>
		</block>
		<!-- 弹出框 评分 -->
		<neil-modal :show="dialogShow" @close="clickCancel" @confirm="clickConfirm" confirm-text="Submit" cancel-text="Cancel">
			<view class="dialog-content" slot="con">
				<uni-rate :value="rating" @change="handelChange"></uni-rate>
			</view>
		</neil-modal>
	</view>
</template>
<script>
	import {
		GET_Repair,
		POST_Repair
	} from "@/api/repair";
	import {
		GET_Parking,
		POST_Parking
	} from "@/api/paking";
	import Search from "@/components/search";
	import TabNav from "@/components/tabNav";
	import uniRate from "@/components/uni-rate/uni-rate.vue"
	import neilModal from '@/components/neil-modal/neil-modal.vue'
	export default {
		components: {
			Search,
			TabNav,
			uniRate,
			neilModal
		},
		data() {
			return {
				activeId: "",
				rating: 1,
				dialogShow: false, //是否显示评价弹框
				confirm: true,
				show: true,
				isLoading: false,
				searchVal: "",
				activeKey: "",
				AjaxData: [],
				ParkingData: [],
				menuList: [{
						name: "Request",
						src: require("@/static/icons/gg.png"),
						activeSrc: require("@/static/icons/yy.png"),
					},
					{
						name: "Amenity",
						src: require("@/static/icons/barbecue-grey.png"),
						activeSrc: require("@/static/icons/barbecue.png"),
					},
					{
						name: "Parking",
						src: require("@/static/icons/parked-car-grey.png"),
						activeSrc: require("@/static/icons/parked_car.png"),
					}
				]
			};
		},
		methods: {
			handelChange({
				value
			}) {
				console.log('this.rating', value);
				this.rating = value
			},
			clickCancel() {
				this.dialogShow = false;
			},
			//Repair和parking评分
			clickConfirm() {
				this.dialogShow = false;
				if (this.activeKey == "Repair") {
					POST_Repair({
						method: 'put',
						rating: this.rating,
						repair_id: this.activeId
					}).then(({
						data
					}) => {
						uni.showToast({
							title: data.msg,
							icon: "none",
						});
						if (data.status === "ok") {
							this.getAjax(1)
						}
					})
				} else if (this.activeKey == "Parking") {
					POST_Parking({
						method: 'put',
						rating: this.rating,
						id: this.activeId
					}).then(({
						data
					}) => {
						uni.showToast({
							title: data.msg,
							icon: "none",
						});
						if (data.status === "ok") {
							this.getAjax(3)
						}
					})
				} else {
					return;
				}

			},
			showRate(id) {
				this.dialogShow = true;
				this.activeId = id
			},
			targetDetails(type, id) {
				if (type == 1) {
					uni.navigateTo({
						url: "/pages/repair/RepairDetail?id=" + id
					})
				}
				if (type == 2) {
					uni.navigateTo({
						url: "/pages/Parking/ParkingDetail?id=" + id
					})
				}
			},
			onRefresh(type) {
				const refresh = true;
				this.getAjax(type, refresh);
			},
			deleteParking(id) {
				uni.showModal({
					title: 'Delete confirmation',
					content: 'Will you delete it?',
					cancelText: 'cancel',
					confirmText: 'confirm',
					success: mres => {
						if (mres.confirm) {
							let data = {
								id,
								method: "delete"
							};
							POST_Parking(data).then(res => {
								if (res.data.status == "ok") {
									uni.showToast({
										title: res.data.msg,
										icon: "none"
									})
									this.getAjax();
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
			deleteRepair(repair_id) {
				uni.showModal({
					title: 'Delete confirmation',
					content: 'Will you delete it?',
					cancelText: 'cancel',
					confirmText: 'confirm',
					success: mres => {
						if (mres.confirm) {
							let data = {
								repair_id,
								method: "delete"
							};
							POST_Repair(data).then(res => {
								if (res.data.status == "ok") {
									uni.showToast({
										title: res.data.msg,
										icon: "none"
									})
									this.getAjax();
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
			change(name) {
				this.activeKey = name;
			},
			search() {
				if (!this.searchVal) {
					return;
				}
				let params = {
					code: this.searchVal
				};
				if (this.activeKey == "Repair") {
					GET_Repair(params).then(res => {
						this.AjaxData = [...res.data.msg];
					});
				} else if (this.activeKey == "Parking") {
					GET_Parking(params).then(res => {
						this.ParkingData = [...res.data.msg];
					});
				} else {
					return;
				}
			},
			getAjax(tab = 0) {
				if (tab == 1) {
					GET_Repair().then(res => {
						this.AjaxData = [...res.data.msg];
					});
				} else if (tab == 3) {
					GET_Parking().then(res => {
						this.ParkingData = [...res.data.msg];
					});
				} else {
					GET_Repair().then(res => {
						this.AjaxData = [...res.data.msg];
					});
					GET_Parking().then(res => {
						this.ParkingData = [...res.data.msg];
					});
				}
			}
		},
		onLoad() {
			this.activeKey = this.$store.state.ListType || "Repair";
			this.getAjax();
		},
		async onPullDownRefresh() {
			if (this.activeKey == "Repair") {
				await GET_Repair().then(res => {
					this.AjaxData = [...res.data.msg];
					uni.showToast({
						title: "Refresh success",
						success() {
							uni.stopPullDownRefresh();
						}
					})
				});
			} else if (this.activeKey == "Parking") {
				await GET_Parking().then(res => {
					this.ParkingData = [...res.data.msg];
					uni.showToast({
						title: "Refresh success",
						success() {
							uni.stopPullDownRefresh()
						}
					})
				});
			} else {
				uni.stopPullDownRefresh()
				return;
			}
		},
		onNavigationBarButtonTap(option) {
			switch (option.index) {
				case 0:
					uni.reLaunch({
						url: "/pages/home/home"
					})
					break;
				case 1:
					if (this.activeKey == "Repair") {
						this.$url("/pages/repair/RequestRepair")
					} else if (this.activeKey == "Parking") {
						this.$url("/pages/Parking/ReserveParkingSpot")
					}
					break;
			}
		},
		watch: {
			"AjaxData": (newV, oldV) => {
				newV.forEach(item => {
					switch (item.fields.status) {
						case 0:
							item.fields.showText = "Draft";
							break;
						case 1:
							item.fields.showText = "Ongoing";
							break;
						case 2:
							item.fields.showText = "Completed";
							break;
						case 3:
							item.fields.showText = "Canceled";
							break;
						case 4:
							item.fields.showText = "Accepted";
							break;
						case 5:
							item.fields.showText = "Declined";
							break;
					}
					/* item.fields.prefertime_start = new Date(item.fields.prefertime_start+'')
					item.fields.prefertime_end =  new Date(item.fields.prefertime_end+'') */
				})
			},
			"ParkingData": (newV, oldV) => {
				newV.forEach(item => {
					switch (item.fields.status) {
						case 0:
							item.fields.showText = "Ongoing";
							break;
						case 1:
							item.fields.showText = "Accepted";
							break;
						case 2:
							item.fields.showText = "Declined";
							break;
						case 3:
							item.fields.showText = "Canceled";
							break;
					}
				})
			}
		}
	};
</script>
<style lang="scss" scoped>
	#RepairList {
		.dialog-content {
			padding: 31.25rpx 0;
			display: flex;
			justify-content: center;
		}

		position: relative;

		.text-center {
			text-align: center;
			padding: 62.5upx 0;
		}

		.ongoing {
			color: #f5a623;
		}

		.accept {
			color: #41b886;
		}

		.cancel {
			color: #e60404;
		}

		.draft {
			color: #c8c8cc;
		}

		.declined {
			color: #ed8482;
		}

		.completed {
			color: #7db8fd;
		}

		.section {
			.detail {
				display: flex;
				justify-content: space-between;
				padding: 20.833rpx;
				min-height: 212.5upx;
				border: 2.083upx solid #ececec;
				box-shadow: 0 6.25upx 6.25upx rgba(200, 200, 204, 0.8);
				font-size: 27.083upx;

				.operation {
					flex: 1 1 20%;
					display: flex;
					flex-flow: column nowrap;
					justify-content: space-between;
					text-align: right;
				}

				.content {
					flex: 0 1 80%;
					width: 0;
					font-size: 27.083upx;

					.title {
						font-weight: 600;
						font-size: 29.166upx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						line-height: 1.8;
					}

					.p {
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						line-height: 1.8;
					}
				}
			}

			.date {
				margin: 37.5upx 0 18.75upx;
				height: 43.75upx;
				line-height: 43.75upx;
				background-color: #fad87b;
				border-radius: 17.708upx;
				display: inline-block;
				padding: 0 12.5upx;
				font-size: 25upx;
			}
		}
	}
</style>
