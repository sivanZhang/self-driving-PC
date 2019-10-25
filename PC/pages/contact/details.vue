<template>
	<view id="contact_detail">
		<!-- <goHome /> -->
		<view class="card">
			<view class="section">
					<view >Email:
						{{email}}
						<!-- //获取邮箱的值 -->
					</view>
			</view>
			<view class="section">
					<view>Phone Number:
						{{phone}}
					</view>
			</view>
			<view class="section">
				<view @click="show" v-if="!inputShow">
					{{address?address:"null"}}
				</view>
				<view>
					<input type="text" v-if="inputShow" placeholder="Address" v-model="eidtAddress"/>
				</view>
					<!-- <input type="text" focus placeholder="Address" v-model="address"/> -->
			</view>
			<view class="save" style="padding: 50.25upx 41.666upx; ">
					<button class="conmmt-btn" @tap="submit">save</button>
			</view>
			
			</view>
		</view>
	</view>
</template>

<script>
	import { User_Address ,Get_UserMsg} from "@/api/login";
	export default {
		data(){
			return{
				contactDetail: this.$store.state.userData,
				address:'',
				inputShow:false,
				eidtAddress:'',
				email:'',
				phone:'',
				
			};
			},
		// onLoad(option) {
		//   POST_LOGIN().then(res => {
		// 	this.contactDetail = [...res.data.msg];
		// 	// console.log(this.contactDetail)
		// 	
		//   });
		// },
		created(){
			Get_UserMsg().then(res => {
					console.log(res.data)
					this.address=res.data.msg.address,
					this.email = res.data.msg.email,
					this.phone = res.data.msg.phone
				})
		},
		methods: {
			show(){
				this.inputShow = true
			},
			submit(){
				
				let data = {
					 address:this.eidtAddress,
				     method :"put",
				}
				// console.log(data);
				User_Address(data).then(res => {
					if(res.data.status === 0){
						this.address = this.eidtAddress,
						this.inputShow =false;
						uni.showToast({
							title: 'save success',
							mask: false,
							duration: 1500,
							icon: "none"
						});
						
					}else{
						uni.showToast({
							title: 'save fail',
							mask: false,
							duration: 1500,
							icon: "none"
						});
						
						
					}
				}).catch(err => {
					// alert("save fail");
				});
				
				
			},
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
							self.$url("/")
						}, 1000);
					}
				});

			}
		},
		onNavigationBarButtonTap() {
			uni.reLaunch({
				url:"/pages/home/home"
			})
		}
	};
</script>

<style lang="scss">
	#contact_detail {
		.card {
			padding:100upx 10upx;
		  .section {
			padding: 50.25upx 41.666upx;
			border-bottom: 2.083upx solid #c8c8cc;

			&>view {
				font-weight: bold;
			}
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
       }
	}
</style>
