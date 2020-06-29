<template>
  <div>
    <div class="new-list">
      <ul class="new-header-list">
        <li
          v-for="(item,i) in typeList"
          :key="i"
          :class="listIndex === i ? 'select' : ''"
          @click="listchange(i)"
        >{{item.name}}</li>
      </ul>
    </div>
    <div class="disc-box" style="height:380px;overflow:hidden scroll;width:790px">
      <el-row :gutter="30">
        <el-col :span="6" v-for="(item,i) in discList" :key="i" class="disc-box-item">
          <el-card shadow="never">
            <el-image :src="item.picUrl" @click="linksongsDisc(item.id)">
              <div slot="placeholder">
                <i class="el-icon-picture-outline" style="font-size:162.5px;color:#f1f1f1"></i>
              </div>
            </el-image>
          </el-card>
          <div class="recommend-name">
            <span @click="linksongsDisc(item.id)">{{item.name}}</span>
            <br />
            <span
              class="author"
              @click="linksongsMusic(item.artists[0].id)"
            >{{item.artists[0].name}}</span>
          </div>
        </el-col>
      </el-row>
      <div class="main-page">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="(queryData.offset/queryData.limit) + 1"
          :page-size="queryData.limit"
          layout="total, prev, pager, next"
          :total="total"
          background
          :small="true"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      listIndex: 0,
      typeList: [
        { name: '全部专辑', type: 0 }
        // { name: '华语', type: 7 },
        // { name: '欧美', type: 96 },
        // { name: '日本', type: 8 },
        // { name: '韩国', type: 16 }
      ],
      discList: [],
      queryData: {
        type: 0,
        offset: 0,
        limit: 8
      },
      total: 0
    }
  },
  methods: {
    listchange(item) {
      this.listIndex = item
      this.queryData.type = this.typeList[item]
      this.getDiscList()
    },
    async getDiscList() {
      const { data: res } = await this.$request.get('/top/album', {
        params: this.queryData
      })
      this.discList = res.albums
      this.total = res.total
    },
    handleCurrentChange(pagenum) {
      this.queryData.offset = (pagenum - 1) * this.queryData.limit
      this.getDiscList()
    },
    linksongsMusic(id) {
      window.sessionStorage.setItem('songsId', id)
      this.$router.push('songmusiclist')
    },
    linksongsDisc(id) {
      window.sessionStorage.setItem('albumId', id)
      this.$router.push('album')
    }
  },
  created() {
    this.getDiscList()
  }
}
</script>
<style lang="less" scoped>
.el-card {
  border: none;
}
.new-list {
  position: relative;
  height: 40px;
  line-height: 40px;
  .new-header-list {
    display: block;
    list-style-type: none;
    .select {
      font-weight: 600;
      color: #000;
    }
    li {
      float: left;
      margin-right: 15px;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.6);
      cursor: pointer;
    }
    li:hover {
      color: rgba(0, 0, 0, 0.9);
    }
  }
  .el-button {
    position: absolute;
    right: 20px;
    border-radius: 20px;
    top: 5px;
  }
}
.disc-box {
  padding: 10px 30px 0 20px;
  box-sizing: border-box;
  .el-image:hover{cursor: pointer;}
  .main-page {
    width: 350px;
    margin: 0 auto;
    height: 50px;
    padding: 10px 0;
    box-sizing: border-box;
    margin-bottom: 10px;
  }
  .disc-box-item {
    height: 240px;
  }
  .recommend-name {
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    span:hover {cursor: pointer;}
    .author {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.6);
    }
    .author:hover {
      color: rgba(0, 0, 0, 0.9);
      cursor: pointer;
    }
  }
}
</style>
