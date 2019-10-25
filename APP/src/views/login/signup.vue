<template>
  <div class="login-container">

    <el-form ref="emailForm" :model="emailForm" :rules="emailRules" class="login-form">
      <div class="title-container">
        <h3 class="title">申请账号</h3>
      </div>
      <el-form-item prop="email">
        <span class="svg-container">
          <i class="el-icon-message"></i>
        </span>
        <el-input ref="email" v-model="emailForm.email" placeholder="邮箱地址" name="email" type="text" />
      </el-form-item>
    </el-form>


    <el-form ref="SignUpForm" :model="SignUpForm" :rules="SignUpRules" class="login-form">
      <div class="codeWarp">
        <el-form-item prop="emailcode">
          <span class="svg-container">
            <svg-icon icon-class="code" />
          </span>
          <el-input placeholder="验证码" name="emailcode" v-model="SignUpForm.emailcode"></el-input>
        </el-form-item>
        <el-button type="text" @click="sendCode" :disabled="isDisabled">{{isDisabled?`${count}秒后重新发送`:'获取验证码'}}</el-button>
      </div>
      <el-form-item prop="username	">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input ref="username" v-model="SignUpForm.username" type="text" placeholder="用户名" name="username" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input :key="passwordType" ref="password" v-model="SignUpForm.password" :type="passwordType" placeholder="密码" name="password" @keyup.enter.native="handleLogin" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">提交申请</el-button>
      <el-row :gutter="15">
        <el-col :span="12" class="link" :offset="12">
          <router-link to="/login">返回登录</router-link>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import { postRegister, getEmailCode } from '@/api/login'
  export default {
    name: "SignUp",
    data() {
      const emailRules = {
        email: [
          { required: true, trigger: "blur", message: "邮箱未填写" },
          { type: "email", trigger: "blur", message: "邮箱格式错误" }
        ]
      }
      const SignUpRules = {
        username: [
          { required: true, trigger: "blur", message: "用户名未填写" }
        ],
        emailcode: [
          { required: true, trigger: "blur", message: "验证码未填写" }
        ],
        password: [{
          required: true,
          trigger: "blur",
          len: 6,
          message: "输入新密码",
        }]
      }
      return {
        emailForm: { email: '' },
        SignUpForm: { username: '', emailcode: null, password: '' },
        emailRules,
        SignUpRules,
        loading: false,
        passwordType: "password",
        redirect: undefined,
        count: 30,
        isDisabled: false,
      };
    },
    methods: {
      //转换密码input状态
      showPwd() {
        if (this.passwordType === "password") {
          this.passwordType = "";
        } else {
          this.passwordType = "password";
        }
        this.$nextTick(() => {
          this.$refs.password.focus();
        });
      },
      //提交申请
      handleLogin() {
        //验证表单，如果通过则触发http请求
        this.$refs['emailForm'].validate((valid) => {
          if (valid) {
            this.$refs['SignUpForm'].validate((validEmail) => {
              if (validEmail) {
                this.loading = true;
                postRegister({ ...this.emailForm, ...this.SignUpForm }).then(({ data }) => {
                  let type;
                  if (data.status == 0) {
                    type = 'success'
                  } else {
                    type = 'error'
                  }
                  this.$message[type](data.msg)
                  this.loading = false;
                }).catch(()=>{
                  this.loading = false;
                })
                
              } else {
                return false;
              }

            })
          } else {
            return false;
          }
        })
      },
      //发送验证码
      sendCode() {
        //验证表单，如果通过则触发http请求
        this.$refs['emailForm'].validate((valid) => {
          if (valid) {
            this.isDisabled = true;
            getEmailCode({ ...this.emailForm, state: false }).then(({ data }) => {
              let type;
              if (data.status == 0) {
                type = 'success'
              } else {
                type = 'error'
              }
              this.$message[type](data.msg)
            });
            //30秒后重新发送验证码
            this.count = 30
            let newInterval = window.setInterval(() => {
              this.count--
              if (this.count <= 0) {
                window.clearInterval(newInterval);
                this.isDisabled = false;
              }
            }, 1000)
          } else {
            this.$refs['email'].focus();
            return false;
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  $bg: #283443;
  $light_gray: #fff;
  $cursor: #fff;

  .link {
    font-size: 14px;
    color: #fff;

    &:last-of-type {
      text-align: right;
    }
  }

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>
<style lang='scss' scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;

    .login-form {
      position: relative;
      width: 407px;
      max-width: 100%;
      padding: 0 35px 0;
      margin: 0 auto;
      overflow: hidden;

      &:first-child {
        margin-top: 160px;
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: 100;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }

    .codeWarp {
      position: relative;

      .el-button {
        position: absolute;
        right: 15px;
        top: 7px;
      }
    }
  }
</style>