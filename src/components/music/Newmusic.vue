<template>
  <div>
    <div class="home-header">最新音乐</div>
    <div class="new-music-box">
      <el-row
        :gutter="24"
        style="padding:0 12px;"
        type="flex"
        v-for="(item,i) in newSongs"
        :key="i"
      >
        <template v-if="i<5">
          <el-col :span="12">
            <el-card class="box-card" shadow="hover">
              <img :src="item.picUrl" @click="getMusicUrl(item)" />
              <i class="el-icon-video-play video-play-hover"></i>
              <div class="new-music-nav">
                <div class="flex">{{i+1 > 9 ? (i+1) : '0'+ (i+1) }}</div>
                <div class="flex">
                  <div class="music-name" @click="getMusicUrl(item)">
                    {{item.name}}
                    <span
                      style="color:#bebebe"
                      v-if="item.song.alias.length>0"
                    >{{item.song.alias[0]}}</span>
                  </div>
                  <div class="music-name">
                    <template v-for="item1 in item.song.artists">{{item1.name+" "}}</template>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="box-card" shadow="hover">
              <img :src="newSongs[i+5].picUrl" @click="getMusicUrl(newSongs[i+5])" />
              <i class="el-icon-video-play video-play-hover"></i>
              <div class="new-music-nav">
                <div class="flex">{{i+5> 9 ? (i+1) : '0'+ (i+5) }}</div>
                <div class="flex">
                  <div class="music-name" @click="getMusicUrl(newSongs[i+5])">
                    {{newSongs[i+5].name}}
                    <span
                      style="color:#bebebe"
                      v-if="newSongs[i+5].song.alias.length>0"
                    >{{newSongs[i+5].song.alias[0]}}</span>
                  </div>
                  <div class="music-name">
                    <template v-for="item1 in newSongs[i+5].song.artists">{{item1.name+" "}}</template>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </template>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newSongs: []
    }
  },
  methods: {
    async getNewSongs() {
      const { data: res } = await this.$request.get('personalized/newsong')
      this.newSongs = res.result
    },
    async getMusicUrl(obj) {
      const { data: res } = await this.$request.get(`/song/url?id=${obj.id}`)
      let music = {}
      music = {
        title: obj.name,
        artist: obj.song.artists[0].name,
        src: res.data[0].url,
        pic: obj.picUrl,
        id: obj.id
      }
      window.sessionStorage.setItem('nowMusic', JSON.stringify(music))
      this.$store.dispatch('dealAutoPlay', music)
    }
  },
  created() {
    this.getNewSongs()
  }
}
</script>
<style lang="less" scoped>
.new-music-box {
  .box-card {
    margin-bottom: 5px;
    height: 70px;
    padding: 10px 0;
    position: relative;
    .video-play-hover {
      position: absolute;
      left: 28px;
      top: 30px;
      font-size: 32px;
      color: red;
      opacity: 0.4;
      font-weight: 900;
    }
    img {
      float: left;
      height: 100%;
      width: 70px;
      margin-left: 10px;
      border-radius: 5px;
    }
  }
  .box-card:hover {
    background: #f1f1f1;
    cursor: pointer;
  }
  .new-music-nav {
    margin-left: 90px;
    height: 100%;
    display: flex;
    .flex {
      flex: 1;
      height: 100%;
      .music-name {
        padding-left: 6px;
        color: #000;
        opacity: 0.7;
        font-size: 14px;
        height: 35px;
        line-height: 35px;
        max-width: 180px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .music-name:nth-child(2) {
        line-height: 30px;
        font-size: 12px !important;
        opacity: 0.6;
      }
    }
    .flex:nth-child(1) {
      font-size: 14px;
      max-width: 20px;
      line-height: 70px;
      color: #333333;
      opacity: 0.4;
    }
    .playing-music {
      position: absolute;
      top: 26px;
      right: 28px;
      font-size: 30px;
      color: red;
      opacity: 0.7;
    }
  }
}
</style>
