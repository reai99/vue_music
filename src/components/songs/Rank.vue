<template>
  <div>
    <div class="select-box">
      <div class="songs-type">
        <span>地区</span>
        <ul class="type-lang">
          <li
            v-for="(item, i) in areaSongs"
            :key="i"
            :class=" i === selectArr[0] ? 'select': ''"
            @click="langSelectEvent(0,i)"
          >{{item.name}}</li>
        </ul>
      </div>
      <div class="songs-type">
        <span>分类</span>
        <ul class="type-lang">
          <li
            v-for="(item, i) in typeSongs"
            :key="i"
            :class=" i === selectArr[1] ? 'select': ''"
            @click="langSelectEvent(1,i)"
          >{{item}}</li>
        </ul>
      </div>
      <div class="songs-type songs-screen">
        <span>筛选</span>
        <ul class="type-lang">
          <li
            v-for="(item, i) in screenSongs"
            :key="i"
            :class=" i === selectArr[2] ? 'select': ''"
            @click="langSelectEvent(2,i)"
          >{{item}}</li>
        </ul>
      </div>
    </div>
    <div class="songs-box">
      <el-row :gutter="20" class="songs-box-row">
        <el-col :span="4" v-for="(item,i) in songsList" :key="i" class="songs-item">
          <el-card shadow="never">
            <el-image :src="item.img1v1Url" :lazy="true" @click="getSongsMusic(item.id)">
              <div slot="placeholder">
                <img src="../../assets/songs.png" alt />
              </div>
            </el-image>
          </el-card>
          <div class="recommend-name">
            <span @click="getSongsMusic(item.id)">{{item.name}}</span>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      areaSongs: [
        { name: '全部', value: -1 },
        { name: '华语', value: 7 },
        { name: '欧美', value: 96 },
        { name: '日本', value: 8 },
        { name: '韩国', value: 16 },
        { name: '其他', value: 0 }
      ],
      typeSongs: ['全部', '男歌手', '女歌手', '乐队组合'],
      selectArr: [0, 0, 0],
      songsList: [],
      queryData: {
        limit: 100,
        offset: 0,
        type: -1,
        area: -1,
        initial: -1
      }
    }
  },
  computed: {
    screenSongs() {
      const str = '热门,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z'
      return str.split(',')
    }
  },
  methods: {
    // 获取歌手列表
    async getSongsList() {
      const { data: res } = await this.$request.get('/artist/list', {
        params: this.queryData
      })
      this.songsList = res.artists
    },
    // 切换语言歌手排行榜
    langSelectEvent(index, item) {
      this.$set(this.selectArr, index, item)
      this.queryData.area = this.areaSongs[this.selectArr[0]].value
      if (this.selectArr[1] === 0) {
        this.queryData.type = -1
      } else {
        this.queryData.type = this.selectArr[1]
      }
      if (this.selectArr[2] === 0) {
        this.queryData.initial = -1
      } else {
        this.queryData.initial = this.screenSongs[this.selectArr[2]]
      }
      this.getSongsList()
    },
    // 获取歌手歌单
    async getSongsMusic(id) {
      window.sessionStorage.setItem('songsId', id)
      this.$router.push('songmusiclist')
    }
  },
  created() {
    this.getSongsList()
  }
}
</script>
<style lang="less" scoped>
.select-box {
  margin-bottom: 40px;
}
.songs-type {
  height: 26px !important;
  font-size: 13px;
  margin: 0;
  margin-left: 20px;
  span {
    float: left;
    margin-right: 10px;
    margin-top: 2px;
    padding: 0 10px;
  }
  .type-lang {
    margin: 0 !important;
  }
  .type-lang li {
    float: left;
    list-style-type: none;
    padding: 1px 12px;
    margin-right: 10px;
    line-height: 20px;
    cursor: pointer;
    color: rgba(0, 0, 0, 0.7);
  }
  .type-lang li:hover {
    color: #000;
  }
  .select {
    color: red !important;
    background: rgba(255, 0, 0, 0.05);
    border-radius: 10px;
  }
}
.songs-box {
  .songs-box-row {
    padding-left: 13px;
    height: 360px;
    overflow: auto;
  }
  .songs-item {
    box-sizing: content-box;
    margin-bottom: 20px;
    width: 130px;
    height: 152px;
  }
  .recommend-name {
    font-size: 12px;
    color: #333;
  }
  .recommend-name:hover {
    color: #000;
    cursor: pointer;
  }
  .el-card {
    border: 0 !important;
    cursor: pointer;
  }
}
</style>
