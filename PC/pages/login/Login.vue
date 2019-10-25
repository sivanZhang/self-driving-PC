<template>
	<view id="login">
		<view class="logo">
			<image src="/static/image/touxiang.png"></image>
		</view>
		<view class="inputs">
			<input type="number" v-model="PhoneNumber" placeholder="Phone Number" placeholder-style="color:#fab701;">
			<input :password="true" v-model="Password" placeholder="Password" placeholder-style="color:#fab701;">
		</view>
		<view class="links">
			<navigator url="/pages/login/Forgot">Reset My Password</navigator>
		</view>
		<button class="sunbmit common-btn" :loading="isLoding" @tap="submit">Log In</button>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				PhoneNumber: "",
				Password: "",
				isLoding: false,
			};
		},
		onLoad() {
		},
		methods: {
			submit() {
				this.isLoding = true;
				let reg = /^\d+$/;
				if (false == reg.test(this.PhoneNumber)) {
					uni.showToast({
						title: "Wrong format of phone number!",
						icon: "none",
					});
					return;
				}
				if (!this.Password) {
					uni.showToast({
						title: "Enter your password!",
						icon: "none"
					});
					return;
				}
				let data = {
					phone: this.PhoneNumber,
					password: this.Password,
				};
				uni.request({
					url: `${this.$BaseUrl}/users/login/?json`,
					data,
					method: "post",
					success: res => {
						this.isLoding = false;
						if (res.data.status == "ok") {
							this.$store.commit("setToken", `JWT ${res.data.token}`);
							this.$store.commit("setUserId", res.data.id);
							console.log(res.data)
							uni.showToast({
								title: res.data.msg,
								icon: "none",
								success() {
									setTimeout(() => {
										uni.redirectTo({
											url: "/pages/home/home",
											animationType: 'pop-in',
											animationDuration: 200
										})
									}, 1000)
								}
							});
						}else{
							this.isLoding = false;
							uni.showToast({
								title: res.data.msg,
								icon: "none",
							})
						}
					},
					fail() {
						this.isLoding = false;
						uni.showToast({
							title: "Fail",
							icon: "none",
						})
					}
				});
				// }.then(res => {
				//             this.loading = false;
				//             if (res.data.status == "ok") {
				//               this.isloding = false;
				//               this.$toast(res.data.msg);
				//               this.$store.commit("setToken", `JWT ${res.data.token}`);
				//               this.$store.commit("setUserId", res.data.id);
				//               /* this.$store.commit("setUserName", res.data.username);
				//               this.$store.commit("setPortrait", res.data.portrait); */
				//               let redirect = decodeURIComponent(
				//                 this.$route.query.redirect || "/"
				//               );
				//               this.$router.replace({
				//                 path: redirect
				//               });
				//             } else if (res.data.status == "error") {
				//               this.$toast(res.data.msg);
				//               this.isloding = false;
				//             }
				//           })
				//           .catch(error => { this.isloding = false; });
			}
		}
	};
</script>

<style lang="scss">
	#login {
		padding-bottom: 145.833upx;

		.logo {
			margin: 329.166upx auto 239.583upx;
			text-align: center;

			image {
				height: 270.833upx;
				width: 270.833upx;
				border-radius: 50%;
				background-color: #d8d8d8;
				border: 2.083upx solid #c8c8cc;
			}
		}

		.sunbmit {
			position: fixed;
			bottom: 0;
			width: 100%;
			background-color: #fad87b;
			font-size: 31.25upx;
			font-family: "OpenSans-SemiBold";
			height: 145.833upx;
			line-height: 145.833upx;
			padding: 0;
			color: #222329;
			border-radius: 0;
		}

		.inputs {
			margin: 0 58.333upx;

			input {
				display: block;
				outline: none;
				padding: 12.5upx 25upx;
				font-size: 29.166upx;
				border-bottom: 2.083upx solid #c8c8cc;

				&+input {
					margin-top: 25upx;
				}
			}
		}

		.links {
			margin-top: 35.416upx;
			text-align: center;
			color: #fab701;
			font-size: 29.166upx;

			span {
				padding: 0 12.5upx;
			}
		}
	}
</style>
