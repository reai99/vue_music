<template>
  <div>
    <nav-header></nav-header>
    <div class="main-nav">
      <div class="main-nav-tt">
        <img
          src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3167851396,2438977824&fm=26&gp=0.jpg"
          alt
        />
        <div class="main-nav-text">
          <div class="main-tt-name">每日推荐歌曲</div>
          <div class="main-tt-label">根据你的音乐口味自动生成，每天更新</div>
          <div class="main-tt-btn">
            <el-button
              type="danger"
              icon="el-icon-video-play"
              @click="playMusicAtonce(songsList)"
            >立即播放</el-button>
          </div>
        </div>
      </div>
      <div class="main-song-list">
        <el-table :data="songsList" style="width: 100%" :stripe="true" @row-click="getMusicUrl">
          <el-table-column type="index" width="60px"></el-table-column>
          <el-table-column prop="name" label="音乐标题"></el-table-column>
          <el-table-column prop="author" label="歌手" width="180">
            <template slot-scope="scope">
              <span v-for="(item,i) in scope.row.author" :key="i">{{item + ' '}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="album" label="专辑" width="180"></el-table-column>
          <el-table-column prop="time" label="时长" width="100"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import NavHeader from '../common/Navheader.vue'
export default {
  data() {
    return {
      songsList: []
    }
  },
  components: {
    'nav-header': NavHeader
  },
  methods: {
    // 获取推荐表单歌曲列表
    async getRecommendList() {
      const { data: res } = await this.$request.get('recommend/songs')
      const arrData = []
      res.recommend.forEach(item => {
        const arr = {}
        arr.name = item.name
        arr.author = []
        item.artists.forEach(i => {
          arr.author.push(i.name)
        })
        arr.id = item.id
        arr.album = item.album.name
        arr.pic = item.artists[0].picUrl
        arr.time =
          Math.floor((item.duration % 3600000) / 60000) > 10
            ? Math.floor((item.duration % 3600000) / 60000)
            : '0' + Math.floor((item.duration % 3600000) / 60000)
        arr.time +=
          ':' +
          (Math.floor((item.duration % 60000) / 1000) > 10
            ? Math.floor((item.duration % 60000) / 1000)
            : '0' + Math.floor((item.duration % 60000) / 1000))
        arrData.push(arr)
      })
      this.songsList = arrData
    },
    // 获取音乐播放地址
    async getMusicUrl(obj) {
      const { data: res } = await this.$request.get(`/song/url?id=${obj.id}`)
      let music = {}
      music = {
        title: obj.name,
        artist: obj.author.join(' '),
        src: res.data[0].url,
        pic: obj.pic,
        id: obj.id
      }
      window.sessionStorage.setItem('nowMusic', JSON.stringify(music))
      this.$store.dispatch('dealAutoPlay', music)
    }
  },
  async mounted() {
    try {
      const time = new Date().getTime()
      await this.$request.get(`login/status?timestamp=${time}`)
      this.getRecommendList()
    } catch (error) {
      this.$message.error('该功能需要先登录,请先登录')
    }
  }
}
</script>
<style>
</style>
