<template>
  <div>
    <nav-header></nav-header>
    <div class="main-nav">
      <div class="main-nav-tt">
        <img :src="userMsg.pic" alt />
        <div class="main-nav-text">
          <div class="main-tt-name">
            {{userMsg.name}}
            <el-button
              round
              class="tt-conlection"
              @click="conllectionSongs(userMsg.id,2)"
              v-if="conllectStatus"
            >
              <i class="el-icon-folder-checked"></i> 已收藏
            </el-button>
            <el-button round class="tt-conlection" @click="conllectionSongs(userMsg.id,1)" v-else>
              <i class="el-icon-folder-add"></i> 未收藏
            </el-button>
          </div>
          <div class="main-tt-label">&nbsp;&nbsp;&nbsp;{{userMsg.time| dataFormat}}</div>
          <div class="main-tt-label">描述: {{userMsg.discription}}</div>
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
      userMsg: {
        pic: '',
        author: '',
        time: '',
        name: '',
        discription: '',
        tag: []
      },
      songsList: [],
      conllectStatus: false
    }
  },
  components: {
    'nav-header': NavHeader
  },
  methods: {
    // 获取歌曲列表
    async getPlayList() {
      const id = window.sessionStorage.getItem('songsId')
      const { data: res } = await this.$request.get(`/artists?id=${id}`)
      // 获取发布者信息部分
      const userData = {
        pic: res.artist.picUrl,
        name: res.artist.name,
        discription: res.artist.briefDesc,
        author: res.artist.name,
        time: res.artist.publishTime,
        followed: res.artist.followed,
        id: res.artist.id
      }
      this.conllectStatus = res.artist.followed
      this.userMsg = userData
      const arrData = []
      // 获取歌曲部分
      res.hotSongs.forEach(item => {
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
    },
    async conllectionSongs(id, status) {
      try {
        await this.$request.get(`artist/sub?id=${id}&t=${status}`)
        if (status === 1) {
          this.$message.success('已添加收藏')
          this.conllectStatus = true
        } else {
          this.conllectStatus = false
          this.$message.success('已取消收藏')
        }
      } catch (error) {
        this.$message.error('请先登录')
      }
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
.tt-conlection {
  margin-left: 20px;
  height: 30px;
  line-height: 0;
  font-size: 12px;
  font-weight: 500;
  user-select: none;
  background: #fff !important;
  border-color: #dcdfe6 !important;
  color: rgba(0, 0, 0, 0.6) !important;
  text-indent: 20px;
  padding: 0 15px !important;
  position: relative;
  i {
    position: absolute;
    font-size: 16px;
    left: -5px;
    top: 5px;
  }
}
.tt-conlection:hover,
.tt-conlection:active {
  background: #f1f1f1 !important;
  border-color: #dcdfe6 !important;
  color: rgba(0, 0, 0, 0.6) !important;
}
</style>
