<template>
  <div>
    <nav-header></nav-header>
    <div class="main-nav">
      <div class="main-nav-tt">
        <img :src="userMsg.pic" alt />
        <div class="main-nav-text">
          <div class="main-tt-name">
            <span>专辑</span>
            {{userMsg.name}}
          </div>
          <div class="main-tt-label">&nbsp;&nbsp;&nbsp;{{userMsg.time| dataFormat}}</div>
          <div class="main-tt-label">描述: {{userMsg.discription}}</div>
          <div class="main-tt-btn">
            <el-button type="danger" icon="el-icon-video-play" @click="playMusicAtonce(songsList)">立即播放</el-button>
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
      userMsg: {
        pic: '',
        author: '',
        time: '',
        name: '',
        discription: '',
        tag: []
      },
      songsList: []
    }
  },
  components: {
    'nav-header': NavHeader
  },
  methods: {
    // 获取歌单
    async getPlayList() {
      const id = window.sessionStorage.getItem('albumId')
      const { data: res } = await this.$request.get(`/album?id=${id}`)
      // 获取发布者信息部分
      const userData = {
        pic: res.album.picUrl,
        name: res.album.name,
        discription: res.album.description,
        author: res.album.artists[0].name,
        time: res.album.publishTime
      }
      this.userMsg = userData
      const arrData = []
      // 获取歌曲部分
      res.songs.forEach(item => {
        const arr = {}
        arr.name = item.name
        arr.author = []
        item.ar.forEach(i => {
          arr.author.push(i.name)
        })
        arr.id = item.id
        arr.album = item.al.name
        arr.pic = item.al.picUrl
        arr.time =
          Math.floor((item.dt % 3600000) / 60000) > 10
            ? Math.floor((item.dt % 3600000) / 60000)
            : '0' + Math.floor((item.dt % 3600000) / 60000)
        arr.time +=
          ':' +
          (Math.floor((item.dt % 60000) / 1000) > 10
            ? Math.floor((item.dt % 60000) / 1000)
            : '0' + Math.floor((item.dt % 60000) / 1000))
        arrData.push(arr)
      })
      this.songsList = arrData
    },
    // 获取歌曲地址
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
  created() {
    this.getPlayList()
  }
}
</script>
<style lang="less" scoped>
.main-nav .main-nav-tt img {
  width: 130px !important;
  height: 130px !important;
}
.main-nav .main-tt-name {
  display: flex;
  align-items: center;
}
.main-nav .main-tt-name span {
  border: 2px solid red;
  font-weight: 600;
  margin-right: 10px;
  border-radius: 4px;
  color: red;
  padding: 0px 10px;
  font-size: 12px;
  display: inline-block;
  height: 18px;
  line-height: 18px;
}
.main-nav .main-nav-tt .main-tt-label {
  height: 20px;
  line-height: 20px;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 600;
  max-width: 300px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.main-nav .main-nav-tt .main-tt-btn {
  margin-top: 10px;
}
</style>
