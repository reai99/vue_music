<template>
  <div>
    <div class="swiper">
      <el-carousel :interval="4000" type="card" height="160px">
        <el-carousel-item v-for="(item, i) in swiperData" :key="i">
          <img :src="item.pic" alt @click="getMusicUrl(item.song)" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 推荐歌单 -->
    <div class="recommend">
      <m-recommend></m-recommend>
    </div>
    <!-- 最新音乐 -->
    <div class="newMusic">
      <m-newmusic></m-newmusic>
    </div>
  </div>
</template>

<script>
import Recommend from '../music/Recommend.vue'
import NewSongs from '../music/Newmusic.vue'
export default {
  data() {
    return {
      swiperData: []
    }
  },
  components: {
    'm-recommend': Recommend,
    'm-newmusic': NewSongs
  },
  methods: {
    async getSwiperData() {
      const { data: res } = await this.$request.get('banner?type=1')
      this.swiperData = res.banners
    },
    // 获取音乐播放地址
    async getMusicUrl(obj) {
      if (obj !== null) {
        const { data: res } = await this.$request.get(`/song/url?id=${obj.id}`)
        let music = {}
        music = {
          title: obj.name,
          artist: [],
          src: res.data[0].url,
          pic: obj.al.picUrl,
          id: obj.id
        }
        obj.ar.forEach(item => {
          music.artist.push(item.name)
        })
        music.artist = music.artist.join(' ')
        window.sessionStorage.setItem('nowMusic', JSON.stringify(music))
        this.$store.dispatch('dealAutoPlay', music)
      } else {
        this.$message({
          message: '点我没用,我没有数据!!!',
          type: 'warning'
        })
      }
    }
  },
  created() {
    this.getSwiperData()
  }
}
</script>
<style lang="less" scoped>
.swiper {
  height: 190px;
  width: 98%;
  border-radius: 10px;
  margin: 0 auto;
  img {
    width: 100%;
    height: 100%;
    border-radius: 6px;
  }
}
</style>
