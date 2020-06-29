<template>
  <div>
    <div class="main-header">
      <i class="el-icon-arrow-left" @click="$router.push(returnLink)"></i>
      <slot></slot>
      <div class="search">
        <input
          type="text"
          class="input-search"
          v-model="searchValue"
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
  </div>
</template>

<script>
export default {
  props: {
    returnLink: {
      type: String,
      default: '/music',
      required: false
    }
  },
  data() {
    return {
      searchValue: '',
      searchOpenclose: false,
      searchHots: [],
      historyTags: []
    }
  },
  methods: {
    searchEvent() {
      if (this.searchValue.trim().length === 0) {
        return this.$message.error('输入搜索内容为空！')
      }
      window.sessionStorage.setItem('searchValue', this.searchValue.trim())
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
      this.searchValue = e.target.innerText.trim()
      this.searchEvent()
    },
    historyTagClose(tag) {
      this.historyTags.splice(this.historyTags.indexOf(tag), 1)
      window.sessionStorage.setItem(
        'searchHistory',
        JSON.stringify(this.historyTags)
      )
    }
  }
}
</script>
<style lang="less" scoped>
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
