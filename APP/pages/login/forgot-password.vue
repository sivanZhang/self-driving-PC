<template>
	<view id="forgot">
		<view class="logo">
			<image src="/static/image/touxiang.png" alt=""></image>
		</view>
		<view class="h3">Need help with your password?</view>
		<view class="p">Enter the Email you use for<br />Estrata, and you will receive a<br />verfication code from us.</view>
		</uni-steps>
		<uni-steps :data="steps" :active="active" active-color="#fad87b">
		</uni-steps>
		<view class="form">
			<block v-if="active==0">
				<input v-model="email" type="text" class="common-inp" placeholder="Email">
				<button @tap="next" class="conmmt-btn">Next</button>
			</block>
			<block v-if="active==1">
				<input v-model="code" type="number" class="common-inp" placeholder="Code">
				<button @tap="verify" class="conmmt-btn">Verify</button>
			</block>
			<block v-if="active==2">
				<input v-model="password" type="text" class="common-inp" placeholder="New Password">
				<button @tap="reset" class="conmmt-btn">Reset</button>
			</block>
		</view>
	</view>
</template>

<script>
	import { GET_Password, SET_Password } from "@/api/login";
	import uniSteps from "@/components/uni-steps/uni-steps.vue"
	export default {
		components: {
			uniSteps,
		},
		data() {
			return {
				code: "",
				email: "",
				isSend: false,
				active: 0,
				steps: [{
						title: 'Email'
					},
					{
						title: 'Code'
					},
					{
						title: 'New Password'
					}
				]
			};
		},
		methods: {
			verify() {
				const rex = /\d{4}/;
				if (rex.test(this.code)) {
					GET_Password(`${this.email}/${this.code}`).then(res => {
					    if (res.data.status == "ok") {
							if (res.data.status == "ok") {
								uni.showToast({
								  title: res.data.msg,
								  icon: "none",
								});
								this.active = 2;
							} else {
								uni.showToast({
								  title: res.data.msg,
								  icon: "none",
								});
							}
					    }
					  })
				} else {
					uni.showToast({
					  title:"Code error!",
					  icon: "none",
					});
				}
			},
			reset() {
				let data = {
					email: this.email,
					password: this.password,
					code: this.code
				};
				SET_Password(data).then(
					res => {
					  if (res.data.status == "ok") {
					  	uni.showToast({
					  	  title: res.data.msg,
					  	  icon: "none",
					  	});
					  	uni.navigateTo({
					  	  url: "/pages/login/login-page"
					  	});
					  } else {
					  	uni.showToast({
					  	  title: res.data.msg,
					  	  icon: "none",
					  	});
					  }
				  }
				)
			},
			next() {
				const pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
				if (pattern.test(this.email)) {
					GET_Password(`${this.email}`).then(res => {
					    if (res.data.status == "ok") {
							if (res.data.status == "ok") {
								uni.showToast({
								  title: res.data.msg,
								  icon: "none",
								});
								this.active = 1;
							} else {
								uni.showToast({
								  title: res.data.msg,
								  icon: "none",
								});
							}
					    }
					  })
				} else {
					uni.showToast({
					  title: "Mailbox format error!",
					  icon: "none",
					});
				}
				
			}
		},
	}
</script>

<style lang="scss" scoped>
	#forgot {
  .p {
    width: 520.833upx;
    color: #c8c8c8;
    margin: 0 auto 31.25upx;
		 text-align: center;
  }

  .h3 {
    text-align: center;
    font-size: 37.5upx;
    height:97.916upx;
    line-height: 97.916upx;
  }

  button.conmmt-btn {
    display: block;
    width:  520.833upx;
    height: 85.416upx;
    border-radius: 85.416upx;
    margin: 0 auto;
    background-color: #fad87b;
    margin-top: 58.333upx;
    font-size: 31.25upx;
  }
  .common-inp {
		height: 89.583upx;
		line-height: 89.583upx;
    width:  520.833upx;
		display: block;
		margin: 0 auto;
  }

  .logo {
    margin: 31.25upx auto 31.25upx;
    text-align: center;

    image {
      height: 195.833upx;
      width:195.833upx;
      border-radius: 50%;
      background-color: #d8d8d8;
      border: 1px solid #c8c8cc;
    }
  }
}

</style>
