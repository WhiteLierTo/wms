<template>
  <div class="home-container">
    <div class="home-text">欢迎使用简易版仓库管理系统:admin</div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  mounted() {
    const obj = { name: 'Lee', age: 24 }
    const [{ name: a1, age: b1 }] = [obj]
    console.log('a', a1)
    console.log('b', b1)
  }
}
</script>

<style lang="scss" scoped>
.home {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
