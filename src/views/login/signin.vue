<template>
  <div class="login-container" style="width:100%;margin-bottom:30px; height:37px;">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">嗨自驾</h3>
      </div>

     
      <el-form-item prop="phone">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="phone"
          v-model.number="loginForm.phone"
          placeholder="电话号码"
          name="phone"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px; height:37px;"
        @click.native.prevent="handleLogin"
      >登录</el-button>
      <el-row :gutter="15">
        <!-- <el-col :span="12" class="link">
          <router-link to="/signup">申请账号</router-link>
        </el-col> -->
        <el-col :span="12" class="link" :offset="12">
          <router-link to="/forgot">找回密码</router-link>
        </el-col>
      </el-row>
      
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SignIn",
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
       // console.log(reg.test(value));
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的手机号"));
        }
      }
    };

    return {
      loginForm: {
        phone: "", //18888888888
        password: ""
      },
      loginRules: {
        phone: [
          {
            validator: checkPhone,
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            trigger: "blur",
            message: "请输入密码"
          }
        ]
      },
      loading: false,
      passwordType: "password",
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  methods: {
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
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("login/login", this.loginForm)
            .then(res => {
              this.$router.push({ path: this.redirect || "/" });
              this.loading = false;
              this.$message.success(res.msg);
            })
            .catch(err => {
              this.$message.error(err.msg);
            })
            .finally(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

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
   // border: 1px solid rgba(255, 255, 255, 0.1);
   border: 1px solid #d2c1c1;
    //background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
 // background-color: $bg;
  overflow: hidden;
  background-image: url('../../icons/bkground.jpg');
  background-size:100%;

  .login-form {
    position: relative;
    width: 407px;
    height: 400px;
    max-width: 100%;
    padding: 70px 35px 0;
    margin: 0 auto;
    overflow: hidden;
   // border: 2px solid #d2c1c1;
    margin-top:100px;
  }

  .svg-container {
    padding: 6px 31px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      // color: $light_gray;
      color:#795548;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
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
}
</style>