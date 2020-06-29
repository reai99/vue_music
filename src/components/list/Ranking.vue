<template>
  <div>
    <div class="box-title">排行榜</div>
    <div class="box" v-for="(item,i) in ranklist" :key="i">
      <div class="left">
        <div class="left-box" :style="{backgroundImage:'url('+item.img+')'}">
          <i>{{item.time|dataFormatMD}}</i>
        </div>
      </div>
      <div class="right">
        <el-table
          :data="item.musiclist"
          stripe
          class="right-table"
          :show-header="false"
          size="mini"
          @row-click="getMusicUrl"
        >
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="name"></el-table-column>
          <el-table-column prop="author" width="180"></el-table-column>
        </el-table>
        <div class="right-more" @click="linkList(item.id)">
          查看全部
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ranklist: []
    }
  },
  methods: {
    // 获取排行榜分类、和歌曲
    async getRankList() {
      const { data: res1 } = await this.$request.get(`top/list?id=${19723756}`)
      const { data: res2 } = await this.$request.get(`top/list?id=${3779629}`)
      const { data: res3 } = await this.$request.get(`top/list?id=${2884035}`)
      const { data: res4 } = await this.$request.get(`top/list?id=${3778678}`)
      const { data: res5 } = await this.$request.get(`top/list?id=${991319590}`)
      this.dealRankMsg(res1.playlist)
      this.dealRankMsg(res2.playlist)
      this.dealRankMsg(res3.playlist)
      this.dealRankMsg(res4.playlist)
      this.dealRankMsg(res5.playlist)
    },
    // 获取排行榜歌曲
    dealRankMsg(item) {
      const obj = {}
      obj.name = item.name
      obj.id = item.id
      obj.img = item.coverImgUrl
      obj.musiclist = []
      item.tracks.slice(0, 5).forEach(item => {
        const mobj = {}
        mobj.name = item.name
        mobj.id = item.id
        mobj.pic = item.al.picUrl
        mobj.author = ''
        item.ar.forEach(i => {
          mobj.author += i.name + ' '
        })
        obj.musiclist.push(mobj)
      })
      obj.time = item.updateTime
      this.ranklist.push(obj)
    },
    // 跳转排行榜分类列表
    linkList(id) {
      window.sessionStorage.setItem('rankListId', id)
      this.$router.push('rankplaylist')
    },
    // 获取歌曲地址
    async getMusicUrl(obj) {
      const { data: res } = await this.$request.get(`/song/url?id=${obj.id}`)
      let music = {}
      music = {
        title: obj.name,
        artist: obj.author,
        src: res.data[0].url,
        pic: obj.pic,
        id: obj.id
      }
      window.sessionStorage.setItem('nowMusic', JSON.stringify(music))
      this.$store.dispatch('dealAutoPlay', music)
    }
  },
  mounted() {
    this.getRankList()
  }
}
</script>
<style lang="less" scoped>
.box-title {
  margin-top: 20px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.8);
  text-indent: 30px;
}
.box {
  height: 190px;
  width: 98%;
  margin: 0 auto;
  display: flex;
  .left {
    max-width: 190px;
    min-width: 190px;
    justify-content: center;
    flex: 1;
    display: flex;
    align-items: center;
    cursor: pointer;
    .left-box {
      height: 140px;
      width: 140px;
      border-radius: 4px;
      align-items: center;
      display: flex;
      justify-content: center;
      flex-direction: column;
      background-size: 100% 100%;
      position: relative;
      i {
        font-style: normal;
        font-size: 12px;
        color: #fff;
        position: absolute;
        bottom: 25px;
      }
    }
  }
  .right {
    flex: 1;
    display: flex;
    align-items: center;
    flex-direction: column;
    position: relative;
    .right-table {
      margin-top: 20px;
      width: 100%;
      height: 150px;
    }
    .right-table::before {
      width: 0 !important;
    }
    .right-more {
      position: absolute;
      bottom: -5px;
      left: 0;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.7);
      height: 32px;
      line-height: 32px;
      cursor: pointer;
      i {
        margin-left: 5px;
      }
    }
    .right-more:hover {
      text-decoration: underline;
    }
  }
}
</style>
