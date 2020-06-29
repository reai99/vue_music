<template>
  <div>
    <nav-header returnLink="/collection">
      <ul class="collect-list">
        <li
          v-for="(item, i) in changeList"
          :key="i"
          :class="listIndex === i ? 'select' : ''"
          @click="listChange(i)"
        >{{item}}</li>
      </ul>
    </nav-header>
    <div class="list-box">
      <div class="list-box-item" v-show="listIndex == 0">
        <div class="header">
          收藏的歌手
          <span>({{songsCount}})</span>
        </div>
        <div
          class="card-item"
          v-for="(item,i) in collectSongs"
          :key="i"
          @click="getSongsMusic(item.id)"
        >
          <img :src="item.img1v1Url" alt />
          <div class="item-title">{{item.name}}</div>
          <div class="item-album">专辑: {{item.albumSize}}</div>
          <div class="item-mv">MV: {{item.mvSize}}</div>
        </div>
      </div>
      <div class="list-box-item" v-show="listIndex == 1"></div>
    </div>
  </div>
</template>

<script>
import NavHeader from './common/Navheader.vue'
export default {
  data() {
    return {
      changeList: ['歌手', '视频'],
      listIndex: 0,
      collectSongs: [],
      songsCount: 0
    }
  },
  components: {
    'nav-header': NavHeader
  },
  methods: {
    listChange(index) {
      this.listIndex = index
    },
    async getCollectSongs() {
      try {
        const time = new Date().getTime()
        await this.$request.get(`login/status?timestamp=${time}`)
        const { data: res } = await this.$request.get(
          `/artist/sublist?timestamp=${time}`
        )
        this.collectSongs = res.data
        this.songsCount = res.count
      } catch (error) {
        this.$message.error('该功能需要先登录,请先登录')
        this.$router.push('/music')
      }
    },
    // 获取歌手歌单
    async getSongsMusic(id) {
      window.sessionStorage.setItem('songsId', id)
      this.$router.push('songmusiclist')
    }
  },
  mounted() {
    this.getCollectSongs()
  }
}
</script>
<style lang="less" scoped>
.collect-list {
  list-style-type: none;
  margin: 0;
  height: 45px;
  line-height: 45px;
  font-size: 14px;
  cursor: pointer;
  .select {
    color: #000;
    font-weight: 600;
  }
}
.collect-list li {
  float: left;
  margin-left: 30px;
  color: rgba(0, 0, 0, 0.6);
}
.collect-list li:hover {
  color: #000;
  font-weight: 600;
}
.list-box-item {
  box-sizing: border-box;
  height: 490px;
  overflow: hidden scroll;
  .header {
    height: 60px;
    line-height: 60px;
    font-size: 13px;
    font-weight: 600;
    margin-left: 30px;
    span {
      font-weight: 400 !important;
      color: rgba(0, 0, 0, 0.6);
      margin-left: 5px;
    }
  }
}
.card-item {
  height: 80px;
  background: #f6f6f6;
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  img {
    height: 62px;
    width: 62px;
    border-radius: 4px;
    margin-left: 30px;
  }
  .item-title {
    width: 240px;
    padding: 0 10px;
    box-sizing: border-box;
    color: rgba(0, 0, 0, 0.8);
    font-size: 14px;
  }
  .item-album {
    position: absolute;
    right: 240px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.6);
  }
  .item-mv {
    position: absolute;
    right: 100px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.6);
  }
}
.card-item:hover {
  background: #f1f1f1;
}
</style>>
