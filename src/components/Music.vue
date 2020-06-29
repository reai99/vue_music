<template>
  <div>
    <el-tabs v-model="$store.state.mainIndex" @tab-click="handleClick" class="le-tab-demo">
      <el-tab-pane label="个性推荐" name="first" class="applyScroll">
        <m-home></m-home>
      </el-tab-pane>
      <el-tab-pane label="排行榜" name="third" class="applyScroll">
        <m-ranklist></m-ranklist>
      </el-tab-pane>
      <el-tab-pane label="歌手" name="fourth" style="overflow: hidden!important">
        <div :is="Components"></div>
      </el-tab-pane>
      <el-tab-pane label="最新歌曲" name="fifth">
        <div :is="NewMusicComponents"></div>
      </el-tab-pane>
    </el-tabs>
    <!-- 搜索框 -->
    <div class="search">
      <input
        type="text"
        class="input-search"
        @focus="searchGuide"
        v-model="searchValue"
        @keyup.enter="searchEvent"
      />
      <i class="el-icon-search" @click="searchEvent"></i>
    </div>
    <!-- 搜索向导 -->
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
  </div>
</template>

<script>
import Home from './home/Home.vue'
import rankList from './list/Ranking.vue'
import songsRank from './songs/Rank.vue'
import NewMusic from './newmusic/Main.vue'

export default {
  data() {
    return {
      searchHots: [],
      searchOpenclose: false,
      searchValue: '',
      historyTags: [],
      Components: '',
      NewMusicComponents: ''
    }
  },
  components: {
    'm-ranklist': rankList,
    'm-home': Home
  },
  methods: {
    handleClick(tab, event) {
      this.$store.commit('changeMainIndex', tab.name)
      if (tab.name === 'fourth') {
        this.Components = songsRank
      } else if (tab.name.trim() === 'fifth') {
        this.NewMusicComponents = NewMusic
      }
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
    // 搜索热词
    hotTagEvent(e) {
      this.searchValue = e.target.innerText.trim()
      this.searchEvent()
    },
    // 搜索事件
    searchEvent() {
      if (this.searchValue.trim().length === 0) {
        return this.$message.error('输入搜索内容为空！')
      }
      window.sessionStorage.setItem('searchValue', this.searchValue)
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
      this.$router.push('searchlist')
    },
    // 历史搜索
    historyTagClose(tag) {
      this.historyTags.splice(this.historyTags.indexOf(tag), 1)
      window.sessionStorage.setItem(
        'searchHistory',
        JSON.stringify(this.historyTags)
      )
    }
  },
  mounted() {
    const mainIndex = this.$store.state.mainIndex
    if (mainIndex === 'fourth') {
      this.Components = songsRank
    } else if (mainIndex === 'fifth') {
      this.NewMusicComponents = NewMusic
    }
  }
}
</script>
<style lang="less" scoped>
.applyScroll {
  overflow: hidden scroll;
  height: 480px;
}
.le-tab-demo {
  width: 100%;
  box-sizing: border-box;
  border: 0;
  height: 600px;
  overflow: hidden;
}

.el-tabs__header {
  background: #f4f4f4;
}
.search {
  position: absolute;
  width: 200px;
  right: 0;
  top: 0;
  height: 36px;
  .el-icon-search {
    font-size: 18px;
    position: absolute;
    right: 30px;
    top: 10px;
    cursor: pointer;
  }
}
.input-search {
  position: absolute;
  right: 20px;
  top: 4px;
  border-radius: 20px;
  height: 26px;
  border: 1px solid #f1f1f1;
  outline: 0;
  background: #ededed;
  text-indent: 10px;
}

.el-tab-pane {
  padding: 0 10px;
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
