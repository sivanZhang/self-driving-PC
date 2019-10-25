<template>
	<view id="parking">
		<!-- <van-popup v-model="show" position="bottom">
      <van-datetime-picker type="date" :min-date="new Date()" @confirm="pickSucsses" @cancel="show=!show" />
    </van-popup> -->
		<!-- <goHome /> -->
		<view class="container">
			<view class="h3">Request date</view>
			<view class="date-time">
				<picker mode="date" fields="day" :value="date" :start="startDate" :end="endDate" @change="bindDateChange($event,1)">
					<view class="group">
						<image class="own-date-icon" src="/static/icons/date.png" mode="aspectFit"></image>
						<input type="text" :value="date1" placeholder="Start date" disabled/>
					</view>
				</picker>
				<picker mode="date" fields="day" :value="date" :start="startDate" :end="endDate" @change="bindDateChange($event,2)">
					<view class="group">
						<image class="own-date-icon" src="/static/icons/date.png"  mode="aspectFit"></image>
						<input type="text" :value="date2" placeholder="End date" disabled/>
					</view>
				</picker>
			</view>
			<view class="number">I Need
				<input class="common-inp numbertype" type="number" v-model="number" :min="1" />
				parking spot
			</view>
			<view class="h3">Vehicle Registration No.</view>
			<view class="inputGroup">
				<input v-model="Registration" class="common-inp" placeholder="Enter Registration No." />
				<!-- <input
          v-model="value"
          placeholder="Enter something..."
          style="width: 100%;margin-top: .12rem;"
        />-->
			</view>
			<!-- <view class="h3">Contact Details</view>
      <input type="input" class="inp" v-model="phoneNumber" placeholder="Phone Number">
      <input type="email" class="inp" v-model="email" placeholder="Email">-->
			<view class="h3 note">
				Note
				<text>(optional)</text>
			</view>
			<textarea v-model="note"></textarea>
			<button class="conmmt-btn" @tap="submit()">Submit</button>
		</view>
	</view>
</template>

<script>
	import {
		POST_Parking
	} from "@/api/paking";
	export default {
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				number: 1,
				Registration: "",
				phoneNumber: "",
				email: "",
				note: "",
				date1: "",
				date2: "",
				date: currentDate,
				show: false,
				type: 0,
			};
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		methods: {
			bindDateChange(e, type) {
				type == 1 && (this.date1 = e.target.value);
				type == 2 && (this.date2 = e.target.value);
			},
			toList() {
				this.$store.commit("setListType", "Parking");
				this.$url("")
			},
			submit() {
				let rex = /^(\d{4})-(\d{2})-(\d{2})$/;
				if (!rex.test(this.date1)) {
					uni.showToast({
						title: "Start date format error",
						icon: "none"
					})
					return;
				} else if (!rex.test(this.date2)) {
					uni.showToast({
						title: "End date format error",
						icon: "none"
					})
					return;
				}
				if (!this.number) {
					uni.showToast({
						title: "number required",
						icon: "none"
					});
					return;
				}

				let data = {
					number: this.number,
					start: this.date1,
					end: this.date2,
					note: `${this.note},${this.Registration}`,
					mgr_id: 1
				};
				POST_Parking(data).then(res => {
					if (res.data.status == "ok") {
						uni.showToast({
							title: res.data.msg,
							icon: "none"
						})
						this.$store.commit("setListType", "Parking");
						this.$url("/pages/userCenter/RequestList")
					} else {
						this.$toast.fail(res.data.msg);
					}
				});
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year;
				} else if (type === 'end') {
					year = year + 10;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
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
					this.$store.commit("setListType", "Parking");
					this.$url("/pages/userCenter/RequestList")
					break;
			}
		}
	};
</script>

<style lang="scss">
	#parking {
		.own-date-icon {
			margin: 0 12px;
			width: 41.666upx;
		}
		.number {
			margin: 83.333upx 0;
			display: flex;
			justify-content: flex-start;
			align-items: center;
		}
		.date-time {
			display: flex;
			justify-content: space-between;

			.group {
				border: 2.083upx solid #c8c8cc;
				width: 312.5upx;
				height: 81.25upx;
				display: flex;
				align-items: center;
			}

			font-size: 25upx;
		}

		input.numbertype {
			width: 312.5upx;
			text-align: center;
			margin: 0 20.833upx;
			box-sizing: border-box;
			padding: 0;
		}

		.inp {
			outline: none;
			border: none;
			width: 100%;
			padding: 20.833upx 0 12.5upx;
			font-size: 29.166upx;
			border-bottom: 2.083upx solid #c8c8cc;
			text-indent: 10px;
			height: 85.416upx;

			&:first-of-type {
				padding-top: 0;
			}
		}

		textarea {
			display: block;
			border: 2.083upx solid #c8c8cc;
			resize: none;
			width: auto;
			height: 177.083upx;
			padding: 12.5upx 25upx;
		}

		button.conmmt-btn {
			display: block;
			width: 485.416upx;
			height: 106.25upx;
			line-height: 106.25upx;
			border-radius: 106.25upx;
			margin: 0 auto;
			background-color: #fad87b;
			margin-top: 35.416upx;
			font-size: 31.25upx;
		}

		.h3 {
			font-size: 31.25upx;
			height: 95.833upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 8.333upx;

			&.note {
				justify-content: flex-start;

				text {
					color: #c8c8c8;
					font-weight: 300;
				}
			}
		}
	}
</style>
