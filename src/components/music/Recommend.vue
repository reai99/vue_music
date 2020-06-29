<template>
  <div>
    <div class="home-header">推荐歌单</div>
    <el-row :gutter="16" style="padding:0 10px;">
      <el-col :span="6">
        <el-card shadow="never">
          <img
            src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3167851396,2438977824&fm=26&gp=0.jpg"
            @click="getSongList"
          />
          <i class="el-icon-video-play video-play-hover"></i>
        </el-card>
        <div class="recommend-name">
          <span @click="getSongList">每日歌曲推荐</span>
        </div>
      </el-col>
      <el-col :span="6" v-for="(item,i) in recommendData" :key="i">
        <el-card shadow="never">
          <img :src="item.picUrl" @click="getPlayList(item.id)" />
          <div class="playNum">
            <i class="el-icon-video-play"></i>
            <i>{{item.playCount}}次</i>
          </div>
          <i class="el-icon-video-play video-play-hover"></i>
        </el-card>
        <div class="recommend-name">
          <span @click="getPlayList(item.id)">{{item.name}}</span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      recommendData: []
    }
  },
  methods: {
    async getRecommendData() {
      const { data: res } = await this.$request.get('/personalized?limit=7')
      this.recommendData = res.result
    },
    getSongList() {
      this.$router.push('songlist')
    },
    getPlayList(id) {
      window.sessionStorage.setItem('playListId', id)
      this.$router.push('playlist')
    }
  },
  created() {
    this.getRecommendData()
  }
}
</script>
<style lang="less" scoped>
.el-card {
  height: 160px;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  .playNum {
    position: absolute;
    color: #fff;
    top: 10px;
    right: 10px;
    z-index: 10;
    font-style: normal;
    font-size: 12px;
    opacity: 0.7;
    i {
      font-style: normal;
    }
  }
  .video-play-hover {
    font-size: 32px;
    color: #fff;
    position: absolute;
    bottom: 12px;
    right: 12px;
    opacity: 0;
    transition: opacity 0.3s;
  }
}
.el-card:hover .video-play-hover {
  opacity: 0.5;
}
.recommend-name {
  height: 60px;
  font-size: 14px;
  padding: 10px 0;
  span {
    cursor: pointer;
    opacity: 0.7;
  }
}
.recommend-name span:hover {
  opacity: 1;
}
</style>
