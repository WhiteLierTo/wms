<template>
  <div class="loginBody">
    <div class="loginContent">
      <h4 class="title">USER LOGIN</h4>
      <el-form status-icon ref="ruleForm2" :rules="rules2" class="demo-ruleForm">
        <el-form-item prop="username" class="sty">
          <el-input auto-complete="off" placeholder="账号:"/>
        </el-form-item>
        <el-form-item class="sty">
          <el-input type="password" auto-complete="off" placeholder="密码:"/>
        </el-form-item>
        <el-form-item>
          <el-button class="login_btn" @click="submitForm('ruleForm2')">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
$bg: #fff;
.loginBody {
  width: 100%;
  height: 1000px;
  background-image: url("../../assets/bg.png");
  background-size: cover;
  overflow: hidden;
}

.login_btn {
  margin: 20px 0;
  border-radius: 20px 20px;
  background: rgba(247, 22, 13, 0.76);
  color: $bg;
  font-size: 20px;
}

.title {
  border-radius: 6px 6px 0 0;
  width: 100%;
  height: 150px;
  background: url("../../assets/bg-small.jpg") 0px no-repeat
    rgba(47, 51, 62, 0.3);
  color: #ffffff;
  font-family: 微软雅黑;
  padding-top: 50px;
  font-size: 23px;
  text-align: center;
}

.loginContent {
  width: 380px;
  height: auto;
  background: #fff;
  border-radius: 5px;
  margin: 8% auto;
}

h4 {
  padding: 6.5%;
}

.el-input {
  width: 80%;
  margin-left: 5%;
}

.sty {
  margin: 0 12px 38px 18px !important;
}

.el-button {
  width: 90%;
  margin-left: 5% !important;
}
</style>
