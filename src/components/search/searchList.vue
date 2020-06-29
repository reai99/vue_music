<template>
  <div>
    <div class="main-header">
      <i class="el-icon-arrow-left" @click="$router.push('../music')"></i>
      <div class="search">
        <input
          type="text"
          class="input-search"
          v-model="searchValueNew"
          @keyup.enter="searchEvent"
          @focus="searchGuide"
        />
        <i class="el-icon-search" @click="searchEvent"></i>
      </div>
    </div>
    <div class="search-guide" v-show="searchOpenclose">
      <div class="guide-box">
        <div class="guide-box-tt">热门搜索</div>
        <div class="hot-tags">
          <el-tag
            effect="plain"
            type="info"
            v-for="(item, i) in searchHots"
            :key="i"
            @click="hotTagEvent"
          >{{item.first}}</el-tag>
        </div>
        <div class="guide-box-tt">历史搜索</div>
        <div class="hot-tags">
          <el-tag
            effect="plain"
            type="info"
            v-for="(item, i) in historyTags"
            :key="i"
            @click="hotTagEvent"
            :closable="true"
            @close="historyTagClose(item)"
          >{{item}}</el-tag>
        </div>
      </div>
    </div>
    <div class="main-nav">
      <div class="main-song-tt">
        <span>{{searchValue}}</span>
        <i>找到 {{total}} 首单曲</i>
      </div>
      <div class="main-song-list">
        <el-table :data="searchlist" style="width: 100%" :stripe="true" @row-click="getMusicUrl">
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
        <div class="main-page">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="(searchQury.offset/searchQury.limit) + 1"
            :page-size="searchQury.limit"
            layout="total, prev, pager, next"
            :total="total"
            background
            :small="true"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQury: {
        offset: 0,
        limit: 10,
        type: 1
      },
      searchValue: '',
      total: 0,
      searchValueNew: '',
      searchlist: [],
      searchOpenclose: false,
      searchHots: [],
      historyTags: []
    }
  },
  methods: {
    // 获取搜索列表
    async getSearchList(val) {
      const { data: res } = await this.$request.get(`/search?keywords=${val}`, {
        params: this.searchQury
      })
      const arrData = []
      res.result.songs.forEach(item => {
        const arr = {}
        arr.name = item.name
        arr.author = []
        item.artists.forEach(i => {
          arr.author.push(i.name)
        })
        arr.id = item.id
        arr.album = item.album.name
        arr.pic = item.artists[0].img1v1Url
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
      this.searchlist = arrData
      this.total = res.result.songCount
    },
    handleCurrentChange(pagenum) {
      this.searchQury.offset = (pagenum - 1) * this.searchQury.limit
      this.getSearchList(this.searchValue)
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
    },
    // 搜索事件
    searchEvent() {
      window.sessionStorage.setItem('searchValue', this.searchValueNew)
      this.searchValue = this.searchValueNew
      this.getSearchList(this.searchValue)
      const history = window.sessionStorage.getItem('searchHistory')
      var arr = history === null ? [] : JSON.parse(history)
      if (!arr.includes(this.searchValue.trim())) {
        if (arr.length < 10) {
          arr.unshift(this.searchValue.trim())
        } else {
          arr.splice(9, 1)
          arr.unshift(this.searchValue.trim())
        }
      }
      window.sessionStorage.setItem('searchHistory', JSON.stringify(arr))
      this.searchOpenclose = false
    },
    // 搜索向导框
    async searchGuide(el) {
      this.$store.state.controlMsc.showList = false
      const { data: res } = await this.$request.get('/search/hot')
      this.searchHots = res.result.hots
      const history = window.sessionStorage.getItem('searchHistory')
      var arr = history === null ? [] : JSON.parse(history)
      this.historyTags = arr
      this.searchOpenclose = true
      const guideBox = document.querySelector('.search-guide')
      window.onclick = e => {
        if (!guideBox.contains(e.target) && !el.target.contains(e.target)) {
          this.searchOpenclose = false
          window.onclick = null
        }
      }
    },
    hotTagEvent(e) {
      this.searchValueNew = e.target.innerText.trim()
      this.searchEvent()
    },
    historyTagClose(tag) {
      this.historyTags.splice(this.historyTags.indexOf(tag), 1)
      window.sessionStorage.setItem(
        'searchHistory',
        JSON.stringify(this.historyTags)
      )
    }
  },
  created() {
    const searchValue = window.sessionStorage.getItem('searchValue')
    this.searchValue = searchValue.trim()
    this.getSearchList(searchValue)
  }
}
</script>
<style lang="less" scoped>
.main-nav {
  overflow: hidden;
}
.main-song-list .main-page {
  width: 350px;
  margin: 0 auto;
  height: 50px;
  padding: 10px 0;
  box-sizing: border-box;
  margin-bottom: 10px;
}
.main-song-tt {
  height: 80px;
  background: #fff;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
  span {
    font-size: 20px;
  }
  i {
    font-size: 13px;
    font-style: normal;
    margin-left: 10px;
    color: rgba(0, 0, 0, 0.75);
  }
}
.main-song-list {
  height: 420px;
  overflow: scroll;
}
.search-guide {
  height: 494px;
  width: 340px;
  background: #fff;
  position: absolute;
  z-index: 999;
  top: 40px;
  right: 0;
  box-shadow: -6px 6px 6px rgba(0, 0, 0, 0.25);
  .guide-box {
    box-sizing: border-box;
    padding: 8px 15px;
  }
  .guide-box-tt {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.6);
  }
  .hot-tags .el-tag {
    border-radius: 15px;
    padding: 0 12px;
    height: 26px;
    line-height: 26px;
    cursor: pointer;
    margin-right: 10px;
    margin-bottom: 8px;
  }
  .hot-tags .el-tag:hover {
    background: #f1f1f1;
  }
}
</style>
