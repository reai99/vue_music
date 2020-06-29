<template>
  <div class="main">
    <div class="new-header">
      <div class="new-header-select">
        <span
          v-for=" (item,i) in headerSelect"
          :key="i"
          :class="selectIndex === i ? 'select' : ''"
          @click="selectchange(i)"
        >{{item}}</span>
      </div>
    </div>

    <div :is="Components"></div>
  </div>
</template>

<script>
import first from './Newmusic.vue'
import second from './Newdisc.vue'
export default {
  data() {
    return {
      headerSelect: ['新歌速递', '新碟上架'],
      selectIndex: this.$store.state.newmusicStatus ? 0 : 1,
      Components: this.$store.state.newmusicStatus ? first : second
    }
  },
  methods: {
    selectchange(item) {
      this.selectIndex = item
      if (item === 1) {
        this.Components = second
        this.$store.commit('setNMStatus', false)
      } else {
        this.Components = first
        this.$store.commit('setNMStatus', true)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.new-header {
  display: flex;
  height: 40px;
  line-height: 40px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  .new-header-select {
    font-size: 13px;
    height: 26px;
    line-height: 26px;
    border: 1px solid #bebebe;
    border-radius: 20px;
    .select {
      background: #bebebe;
      color: #fff;
    }
    span {
      padding: 0 20px;
      display: inline-block;
      border-radius: 20px;
      cursor: pointer;
    }
  }
}
</style>
