<template>
  <div class="home-container">
    <div class="home-text">欢迎使用简易版仓库管理系统:admin</div>
  </div>
</template>

<script>
import { getValFnc } from '@/utils/validate';
import { getDictionaryAll } from '@/api/baseData';
export default {
  name: 'Home',
  data() {
    return {
      jsonObj: {
        创维电视: 50,
        卡萨帝北京: 40,
        家电: 40,
        松下: 30,
        格力: 200,
        海尔: 20,
        海尔商城: 20,
        海尔客服: 1220,
        美的: 120,
        美菱: 100
      }
    }
  },
  mounted() {
    console.log('根据key获取value:' + getValFnc(this.jsonObj, '海尔客服'))
    // 获取通用字典
    this.getDictionaryAllFnc()
  },
  methods: {
    getDictionaryAllFnc() {
      getDictionaryAll().then(res => {
        localStorage.setItem('dictionary', JSON.stringify(res.result))
      })
    }
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
