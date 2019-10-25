<template>
	<view id="reques" class="warp-pb container">
		<!-- <goHome /> -->
		<!-- right-text="save" -->
		<template v-if="PropertyData.length">
			<view class="h3">Select Property</view>
			<radio-group @change="radioChange">
				<view class="select">
					<view v-for="(item,index) in PropertyData" :key="index" @tap="TapRadioWarp(index,item.id)">
						<image src="/static/icons/house.png" mode="aspectFill"></image>
						<view>
							<view class="p">
								{{item.building_name}}
							</view>
							<view class="p">
								{{item.room_number}}
							</view>
						</view>
						<view>
							<radio :value="String(item.id)" :checked="index === current" color="#07c160" />
						</view>
					</view>
				</view>
			</radio-group>
		</template>
		<view class="h3">Request Classification</view>
		<picker mode="selector" :value="index" type="text" class="common-inp" @change="PropertyChange($event)" :range="arrayName">
				<view>
				{{arrayName[index]}}
				<input type="text" :value="classify" disabled />
				</view>
				
		</picker>
		<view class="h3">What do you need to request</view>
		<input v-model="facility" type="text" class="common-inp">
		<view class="h3 urgency-level">Urgency Level</view>
		<view class="scale">
			<view v-for="(item,index) in scaleList" :key="index" @tap="changeScale(item)">
				{{item.content}}
				<view class="p">
				</view>
				<!-- <p class="active"></p> -->
				<image v-if="select==item.content" src="/static/icons/jiantou.png" mode="aspectFit"></image>
			</view>
		</view>
		<view class="line"></view>
		<view class="h3">Preferred Date and Time</view>
		<view class="date-time">
			<picker mode="date" fields="day" :value="date" :start="startDate" :end="endDate" @change="bindDateChange($event,1)">
				<view class="group">
					<image class="own-date-icon" src="/static/icons/date.png" mode="aspectFit"></image>
					<input type="text" :value="date1" placeholder="Start date" disabled />
				</view>
			</picker>
			<picker mode="time" :value="time" start="08:00" end="24:00" @change="bindTimeChange($event,1)">
				<view class="group">
					<image class="own-date-icon" src="/static/icons/clock.png" mode="aspectFit"></image>
					<input type="text" :value="time1" placeholder="Start time" disabled />
				</view>
			</picker>
		</view>
		<view class="date-time" style="margin-top: 31.25upx;">

			<picker mode="date" fields="day" :value="date" :start="startDate" :end="endDate" @change="bindDateChange($event,2)">
				<view class="group">
					<image class="own-date-icon" src="/static/icons/date.png" mode="aspectFit"></image>
					<input type="text" :value="date2" placeholder="End date" disabled />
				</view>
			</picker>
			<picker mode="time" :value="time" start="08:00" end="24:00" @change="bindTimeChange($event,2)">
				<view class="group">
					<image class="own-date-icon" src="/static/icons/clock.png" mode="aspectFit"></image>
					<input type="text" :value="time2" placeholder="End time" disabled />
				</view>
			</picker>
		</view>
		<view class="h3">Contact me before coming
			<switch color="#41b886" size="35.416upx" @tap="checked=!checked" :checked="checked" />
		</view>
		<template v-if="checked">
			<view class="h3">Contact Details</view>
			<input v-model="phone" class="Contact" type="text" placeholder="Phone number">
			<input v-model="email" class="Contact" type="text" placeholder="Email">
		</template>
		<view class="uni-list list-pd">
			<view class="uni-list-cell cell-pd">
				<view class="uni-uploader">
					<view class="uni-uploader-head h3">
						<view class="uni-uploader-title">Upload Image</view>
						<view class="uni-uploader-info">{{imageList.length}}/9</view>
					</view>
					<view class="uni-uploader-body">
						<view class="uni-uploader__files">
							<block v-for="(image,index) in imageList" :key="index">
								<view class="uni-uploader__file">
									<image class="uni-uploader__img" mode="aspectFill" @longpress="deleteImage(index)" :src="image" :data-src="image"
									 @tap="previewImage"></image>
								</view>
							</block>
							<view class="uni-uploader__input-box" v-if="isUpShow">
								<view class="uni-uploader__input" @tap="chooseImage"></view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="h3 note">
			Note
			<text>(optional)</text>
		</view>
		<textarea class="common-inp" v-model="note"></textarea>
		<button class="conmmt-btn" @tap="submit()">Submit</button>
	</view>
</template>
<script>
	import uniIcon from "@/components/uni-icon/uni-icon.vue"
	import { Get_Category } from "@/api/classify"
	import {
		POST_Repair
	} from "@/api/repair";
	import {
		GET_Property,Get_UserMsg
	} from "@/api/login";
	var sourceType = [
		['camera'],
		['album'],
		['camera', 'album']
	]
	export default {
		components: {
			uniIcon
		},
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				files:[],
				isUpShow: true,
				countIndex: 8,
				count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
				sourceTypeIndex: 2,
				imageList: [],
				type: 0,
				show: false,
				phone: "",
				email: "",
				facility: "",
				array:[],
				arrayName:[],
				index:0,
				scaleList: [{
						content: "average"
					},
					{
						content: "urgent"
					},
					{
						content: "super urgent"
					}
				],
				note: "",
				radio: "",
				checked: false,
				select: "average",
				PropertyData: [],
				current: 0,
				date1: "",
				date2: "",
				date: currentDate,
				time1: '',
				time2: '',
				time: "00:00",
				classify:"",
				IndexClassify:null
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
		onLoad() {
			GET_Property().then(res => {
				this.PropertyData = res.data;
				this.radio = this.PropertyData[0].id;
				if (!this.PropertyData) {
					uni.showToast({
						title: 'No property',
						mask: false,
						duration: 1500,
						icon: "none",
					});
				}
			});
		},
		created(){
			this.Property();
			Get_UserMsg().then(res => {
				this.phone = res.data.msg.phone,
				this.email = res.data.msg.email
			})
		},
		methods: {
			changeScale(item){
				this.select=item.content
			},
			Property:function(e){
				 // console.log('picker发送选择改变，携带值为', e.target.value)
				 Get_Category().then(res =>{
					 // console.log(res.data)
					 this.array = res.data.msg;
					
					 this.array.forEach((item,index) =>{ 
						this.arrayName[index]=item.name;
						
					 });					
					 console.log(this.array);
			})
			},
			PropertyChange:function(e){
				this.classify = this.arrayName[e.target.value]
				this.IndexClassify = e.target.value
			},
			bindTimeChange: function(e, type) {
				type == 1 && (this.time1 = e.target.value)
				type == 2 && (this.time2 = e.target.value)
			},
			deleteImage(i) {
				//#ifdef APP-PLUS
				const actionstyle = {
					cancel: "Cancel",
					buttons: [{
						title: "Delete",
						style: "destructive"
					}]
				}
				plus.nativeUI.actionSheet(actionstyle, (e) => {
					if (e.index) {
						this.imageList.splice(i, 1)
						this.isFullImg()
					} else {
						return
					}
				});
				// #endif
			},
			chooseImage: async function() {
				uni.chooseImage({
					sourceType: sourceType[this.sourceTypeIndex],
					count: this.imageList.length + this.count[this.countIndex] > 9 ? 9 - this.imageList.length : this.count[this.countIndex],
					success: (res) => {
						this.imageList = this.imageList.concat(res.tempFilePaths);
						this.files = this.files.concat(res.tempFiles)
						console.log(this.files);
						this.isFullImg()
					},
					fail: (err) => {
						// #ifdef APP-PLUS
						if (err['code'] && err.code !== 0 && this.sourceTypeIndex === 2) {
							this.checkPermission(err.code);
						}
						// #endif
					}
				})
			},
			isFullImg() {
				if (this.imageList.length === 9) {
					this.isUpShow = false
				} else {
					this.isUpShow = true
				}
			},
			previewImage: function(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: this.imageList
				})
			},
			async checkPermission(code) {
				let type = code ? code - 1 : this.sourceTypeIndex;
				let status = permision.isIOS ? await permision.requestIOS(sourceType[type][0]) :
					await permision.requestAndroid(type === 0 ? 'android.permission.CAMERA' :
						'android.permission.READ_EXTERNAL_STORAGE');

				if (status === null || status === 1) {
					status = 1;
				} else {
					uni.showModal({
						content: "没有开启权限",
						confirmText: "设置",
						success: function(res) {
							if (res.confirm) {
								permision.gotoAppSetting();
							}
						}
					})
				}

				return status;
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
			},
			bindDateChange(e, type) {
				type == 1 && (this.date1 = e.target.value);
				type == 2 && (this.date2 = e.target.value);
			},
			TapRadioWarp(index, val) {
				this.current = index, this.radio = String(val)
			},
			radioChange(val) {
				this.radio = val.detail.value
			},
			toList() {},
			submit() {
				let starttime = `${this.date1} ${this.time1}:00`,
					endtime = `${this.date2} ${this.time2}:00`,
					rex = /^\d{4}-(0\d|1[0-2])-([0-2]\d|3[01])( ([01]\d|2[0-3])\:[0-5]\d\:[0-5]\d)$/;
				if (this.facility == "") {
					uni.showToast({
						title: 'Need to complete facility!',
						mask: false,
						duration: 1500,
						icon: "none"
					});
					return;
				}
				if (!rex.test(starttime) || !rex.test(endtime)) {
					uni.showToast({
						title: 'Unselected time!',
						mask: false,
						duration: 1500,
						icon: "none"
					});
					return;
				}
				if (this.checked == true) {
					if (!this.phone || !this.email) {
						uni.showToast({
							title: 'Need to complete phone and email!',
							mask: false,
							duration: 1500,
							icon: "none"
						});
						return;
					}
					let reg = /^\d+$/;
					if (false == reg.test(this.phone)) {
						uni.showToast({
							title: 'Wrong format of phone number!',
							mask: false,
							duration: 1500,
							icon: "none"
						});
						return;
					}
					let regE = /^[\w.\-]+@(?:[a-z0-9]+(?:-[a-z0-9]+)*\.)+[a-z]{2,3}$/;
					if (false == regE.test(this.email)) {
						uni.showToast({
							title: 'Wrong format of email!',
							mask: false,
							duration: 1500,
							icon: "none"
						});
						return;
					}
				}
				uni.showLoading({
				    title: 'Loading'
				});
				let level = 0;
				switch (this.select) {
					case "average":
						level = 0;
						break;
					case "urgent":
						level = 1;
						break;
					case "super urgent":
						level = 2;
						break;
				}
				let data = {
					property_id: this.radio,
					facility: this.facility,
					level,
					starttime,
					endtime,
					confirm: this.checked ? 1 : 0,
					phone: this.phone,
					email: this.email,
					note: this.note,
					category_id: this.array[this.IndexClassify].id,
				};
				console.log(data)
				// let myfiles= this.files.map((t,i)=>{
				// 	return {
				// 		uri:t.path,
				// 		name:"image"+i
				// 	}
				// })imageList
				let myfiles= this.imageList.map((t,i)=>{
					return {
						uri:t,
						name:"image"+i
					}
				})
				//根据有没有图片决定用哪种方式上传
				if (this.imageList.length) {
					//上传图
					uni.uploadFile({
						url: `${this.$BaseUrl}/repair/repair/?json`,
						files:myfiles,
						name: 'file',
						header: {
							"Content-Type": "multipart/form-data",
							'Authorization': uni.getStorageSync('estateToken') || this.$store.state.estateToken,
						},
						formData: data
					}).then(res=>{
						/* uni.showToast({
							title: res.data.msg,
							mask: false,
							duration: 1500,
							icon: "none"
						}); */
						
						// console.log(res);
						/* if (res.data.status == "ok") {
							this.$store.commit("setListType", "Repair");
							this.$url("/pages/userCenter/RequestList")
						} */
						uni.hideLoading()
						this.$store.commit("setListType", "Repair");
						this.$url("/pages/userCenter/RequestList")
					}).catch(err=>{
						uni.hideLoading()
					});
				} else {
					POST_Repair(data).then(res => {
						uni.hideLoading()
						uni.showToast({
							title: res.data.msg,
							mask: false,
							duration: 1500,
							icon: "none"
						});
						if (res.data.status == "ok") {
							this.$store.commit("setListType", "Repair");
							this.$url("/pages/userCenter/RequestList")
						}
					}).catch(err=>{
						uni.hideLoading()
					});
				}
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
					this.$store.commit("setListType", "Repair");
					this.$url("/pages/userCenter/RequestList")
					break;
			}
		}
	};
</script>
<style lang="scss" scoped>
	/* 上传 */
	.uni-uploader {
		flex: 1;
		flex-direction: column;
	}

	.uni-uploader-head {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.uni-uploader-info {
		color: #B2B2B2;
	}

	.uni-uploader-body {
		margin-top: 16upx;
	}

	.uni-uploader__files {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		position: relative;
	}

	.uni-uploader__file {
		margin: 10upx;
		width: 210upx;
		height: 210upx;
	}

	.uni-uploader__img {
		display: block;
		width: 210upx;
		height: 210upx;
	}

	.uni-uploader__input-box {
		position: relative;
		margin: 10upx;
		width: 208upx;
		height: 208upx;
		border: 2upx solid #D9D9D9;
	}

	.uni-uploader__input-box:before,
	.uni-uploader__input-box:after {
		content: " ";
		position: absolute;
		top: 50%;
		left: 50%;
		-webkit-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
		background-color: #D9D9D9;
	}

	.uni-uploader__input-box:before {
		width: 4upx;
		height: 79upx;
	}

	.uni-uploader__input-box:after {
		width: 79upx;
		height: 4upx;
	}

	.uni-uploader__input-box:active {
		border-color: #999999;
	}

	.uni-uploader__input-box:active:before,
	.uni-uploader__input-box:active:after {
		background-color: #999999;
	}

	.uni-uploader__input {
		position: absolute;
		z-index: 1;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
	}

	#reques {
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

		textarea {
			display: block;
			border: 2.083upx solid #c8c8cc;
			resize: none;
			width: 100%;
			height: 177.083upx;
		}

		.Contact {
			border-bottom: 2.083upx solid $border-color;
			padding: 12.5upx 25upx;
			font-size: 31.25upx;
			height: 75upx;
		}

		.date-time {
			display: flex;
			justify-content: space-between;

			.own-date-icon {
				margin: 0 12px;
				width: 41.666upx;
			}

			.group {
				border: 2.083upx solid #c8c8cc;
				width: 312.5upx;
				height: 81.25upx;
				display: flex;
				align-items: center;
			}

			font-size: 25upx;
		}

		.line {
			height: 4.166upx;
			width: 575upx;
			background-color: #c7c7c7;
			margin: 0 auto;
			z-index: -1;
		}

		.scale {
			color: #979797;
			display: flex;
			justify-content: space-between;
			font-size: 25upx;
			text-align: center;

			&>view {
				width: 26%;
				position: relative;
				height: 72.916upx;

				&>.p:not(.active) {
					position: absolute;
					bottom: 2.083upx;
					left: 50%;
					transform: translateX(-50%);
					width: 2.083upx;
					height: 12.5upx;
					background-color: #c7c7c7;
					z-index: -1;
				}

				&>image {
					position: absolute;
					bottom: 2.083upx;
					left: 50%;
					transform: translate(-50%, 30%);
					z-index: 1;
					width: 37.5upx;
					height: 52.083upx;
					object-fit: initial;
				}
			}
		}

		.urgency-level {
			margin-top: 12.5upx;
		}

		.van-nav-bar.van-hairline--bottom {
			margin: 0 -31.25upx;
		}

		.h3 {
			font-size: 31.25upx;
			line-height: 2;
			margin-top: 20.833upx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			&.note {
				justify-content: flex-start;

				text {
					color: #c8c8cc;
					font-weight: 300;
				}
			}
		}

		.select {
			line-height: initial;
			display: flex;
			justify-content: space-between;
			flex-flow: row wrap;

			&>view {
				padding: 0 20.833upx;
				margin: 20.833upx 0;
				display: flex;
				justify-content: space-between;
				flex-flow: row wrap;
				height: 193.75upx;
				align-items: center;
				width: 297.916upx;
				background: linear-gradient(to bottom right, #fff, #dfdfea);
				border-radius: 12.5upx;

				&>view:last-of-type {
					width: 100%;
					text-align: right;
				}

				image {
					width: 68.75upx;
					height: 68.75upx;
				}
			}
		}
	}
</style>
