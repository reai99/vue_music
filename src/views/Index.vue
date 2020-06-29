<template>
  <div class="main">
    <el-row>
      <el-col class="left-list">
        <!-- 关闭、放大、缩小控制 -->
        <div class="control">
          <el-button type="danger" icon="el-icon-circle-close"></el-button>
          <el-button type="warning" icon="el-icon-circle-plus-outline"></el-button>
          <el-button type="success" icon="el-icon-remove-outline"></el-button>
        </div>
        <!-- 用户信息 -->
        <div class="login">
          <div @click="loginDialogVisible= true" v-if="userInfoStatus">
            <i class="el-icon-user"></i>
            <span>未登陆</span>
          </div>
          <div class="userInfo" v-else>
            <img :src="userInfo.avatarUrl" alt />
            <span>{{userInfo.nickname}}</span>
            <i
              class="el-icon-caret-right"
              style="margin-left:20px;cursor: pointer;"
              @click="userLogout"
            ></i>
          </div>
        </div>
        <!-- 左侧菜单选项 -->
        <el-menu
          :default-active="activePath"
          background-color="#ededed"
          text-color="rgba(0,0,0,.8)"
          active-text-color="red"
          :router="true"
        >
          <el-menu-item index="music" key="1">
            <i class="el-icon-headset"></i>
            <span slot="title">发现音乐</span>
          </el-menu-item>
          <el-row class="left-litle-tt">我的音乐</el-row>
          <el-menu-item index="collection">
            <i class="el-icon-star-on"></i>
            <span slot="title">我的收藏</span>
          </el-menu-item>
          <el-submenu index="1" class="music-list">
            <template slot="title">
              <span>创建的歌单</span>
            </template>
            <template v-for="(item, i) in userMusicList">
              <el-menu-item
                class="music-list-item"
                :key="i"
                v-if="item.creator.userId === userInfo.userId"
                @click="getSonglistMusic(item.id)"
              >{{item.name}}</el-menu-item>
            </template>
          </el-submenu>
          <el-submenu index="2" class="music-list">
            <template slot="title">
              <span>收藏的歌单</span>
            </template>
            <template v-for="(item, i) in userMusicList">
              <el-menu-item
                class="music-list-item"
                :key="i"
                v-if="item.creator.userId !== userInfo.userId"
                @click="getSonglistMusic(item.id)"
              >{{item.name}}</el-menu-item>
            </template>
          </el-submenu>
        </el-menu>
      </el-col>
      <el-col class="right-box">
        <router-view></router-view>
      </el-col>
      <!-- 播放器 -->
      <div class="player-box">
        <aplayer
          preload="auto"
          :music="$store.state.playMusic"
          :list="musicList"
          ref="musicRef"
          :listFolded="true"
          :showLrc="isShowLrc"
          :lrcType="1"
          :controls=" true"
          @loadstart="loadStartMusic"
        ></aplayer>
        <i class="el-icon-caret-left el-icon-common" @click="skipBackSong"></i>
        <i class="el-icon-caret-right el-icon-common" @click="skipForwardSong"></i>
        <i
          class="lrcToggle"
          :class="isShowLrc ? 'lrcdisplay' : ''"
          @click="isShowLrc = !isShowLrc"
        >词</i>
        <i></i>
      </div>
    </el-row>
    <!-- 登录框 -->
    <el-dialog
      title="手机登录"
      :visible.sync="loginDialogVisible"
      width="300px"
      @close="loginDialogClose"
    >
      <el-form :model="loginForm" status-icon :rules="loginRules" ref="loginRef" label-width="60px">
        <el-form-item label="手机" prop="phone">
          <el-input type="text" v-model="loginForm.phone" name="phone"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="loginForm.password" name="password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="loginDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveLoginInfo()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import aplayer from 'vue-aplayer'
export default {
  data() {
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的手机号'))
    }
    return {
      loginDialogVisible: false,
      loginForm: {},
      loginRules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 20,
            message: '密码长度在 6 到 20 个字符',
            trigger: 'blur'
          }
        ]
      },
      userInfoStatus: true,
      userInfo: {},
      isShowLrc: false,
      firstplayIndex: -1,
      activePath: 'music',
      userMusicList: []
    }
  },
  components: {
    aplayer
  },
  methods: {
    // 登录框关闭
    loginDialogClose() {
      this.$refs.loginRef.resetFields()
    },
    // 登录
    saveLoginInfo() {
      this.$refs.loginRef.validate(async valid => {
        if (!valid) return false
        const { data: isRegister } = await this.$request.get(
          `/cellphone/existence/check?phone=${this.loginForm.phone}`
        )
        if (isRegister.exist === -1) return this.$message.error('该账号未注册')
        const { data: res } = await this.$request.get('login/cellphone', {
          params: {
            phone: this.loginForm.phone,
            password: encodeURIComponent(this.loginForm.password)
          }
        })
        if (res.code !== 200) {
          return this.$message.error(res.message)
        }
        this.$message.success('登录成功')
        this.getUserInfo()
        this.loginDialogVisible = false
      })
    },
    // 获取用户信息
    async getUserInfo() {
      try {
        const time = new Date().getTime()
        const { data: res } = await this.$request.get(
          `login/status?timestamp=${time}`
        )
        const { data: res1 } = await this.$request.get(
          `user/playlist?uid=${res.profile.userId}`
        )
        this.userInfoStatus = false
        this.userInfo = res.profile
        this.userMusicList = res1.playlist
      } catch (error) {}
    },
    // 用户退出
    async userLogout() {
      this.userInfoStatus = true
      this.userInfo = {}
      await this.$request.get('logout')
      this.$message.success('账号已退出')
    },
    // 切换上一首
    skipBackSong() {
      const listLength = this.$refs.musicRef.musicList.length
      this.$refs.musicRef.playIndex =
        this.$refs.musicRef.playIndex === 0 ||
        this.$refs.musicRef.playIndex === -1
          ? listLength - 1
          : this.$refs.musicRef.playIndex - 1
      setTimeout(() => {
        this.$refs.musicRef.play()
      }, 500)
    },
    // 切换下一首
    skipForwardSong() {
      let step = 1
      if (this.$refs.musicRef.playIndex === -1) {
        step = 2
      }
      const listLength = this.$refs.musicRef.musicList.length
      this.$refs.musicRef.playIndex =
        this.$refs.musicRef.playIndex === listLength - 1
          ? 0
          : this.$refs.musicRef.playIndex + step
      setTimeout(() => {
        this.$refs.musicRef.play()
      }, 500)
    },
    // 加载音乐开始时候 加载歌词
    async loadStartMusic(e) {
      if (
        this.$refs.musicRef.currentMusic.id &&
        this.$refs.musicRef.currentMusic.lrc === undefined
      ) {
        const { data: res } = await this.$request.get(
          `/lyric?id=${this.$refs.musicRef.currentMusic.id}`
        )
        if (res.lrc !== undefined) {
          this.$refs.musicRef.currentMusic.lrc = res.lrc.lyric
        } else {
          this.$refs.musicRef.currentMusic.lrc = '[00:00.000]暂无歌词'
        }
        if (this.isShowLrc) {
          this.isShowLrc = false
          setTimeout(() => {
            this.isShowLrc = true
          }, 300)
        }
      }
    },
    // 获取歌单列表
    async getSonglistMusic(id) {
      this.$store.commit('setPlaylistId', id)
      window.sessionStorage.setItem('playListId', id)
      this.$router.push('playlist')
    }
  },
  computed: {
    musicList: () => {
      // 获取音乐列表
      if (window.sessionStorage.getItem('musiclist')) {
        return JSON.parse(window.sessionStorage.getItem('musiclist'))
      } else {
        return []
      }
    }
  },
  mounted() {
    this.$store.commit('controlMusic', this.$refs.musicRef)
    this.$refs.musicRef.playIndex = this.firstplayIndex
    this.activePath = this.$route.path.replace('/', '')
  },
  watch: {
    $route(to, from) {
      if (to.path.replace('/', '') === 'collection') {
        this.activePath = 'collection'
      } else if (to.path.replace('/', '') === 'music') {
        this.activePath = 'music'
      }
    }
  },
  created() {
    // 记录当前播放
    if (
      window.sessionStorage.getItem('nowMusic') &&
      window.sessionStorage.getItem('musiclist')
    ) {
      this.$store.commit(
        'firstComeMusic',
        JSON.parse(window.sessionStorage.getItem('nowMusic'))
      )
      this.firstplayIndex = JSON.parse(
        window.sessionStorage.getItem('musiclist')
      ).findIndex(
        item =>
          JSON.parse(window.sessionStorage.getItem('nowMusic')).src === item.src
      )
    }
    this.getUserInfo()
  }
}
</script>
<style lang='less' scoped>
.main {
  width: 1000px;
  background: #fff;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.23);
  height: 600px;
  .el-menu {
    height: 420px;
    overflow: hidden scroll;
    width: 215px;
  }
  .player-box {
    width: 100%;
    height: 60px;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 999;
    .el-icon-common {
      position: absolute;
      font-size: 30px;
      top: 20px;
      color: red;
      cursor: pointer;
    }
    .el-icon-caret-left {
      left: 50%;
      margin-left: -80px;
    }
    .el-icon-caret-right {
      right: 50%;
      margin-right: -85px;
    }
    .aplayer {
      margin: 0 !important;
    }
  }
  .el-row {
    height: 100%;
  }
  .right-box {
    height: 540px;
    width: 800px;
  }
  .left-list {
    background: #ededed;
    height: 540px;
    width: 200px;
    position: relative;
    overflow: hidden;
    .login {
      height: 70px;
      display: flex;
      align-items: center;
      .el-icon-user {
        width: 40px;
        height: 40px;
        text-align: center;
        border: 1px solid rgba(0, 0, 0, 0.6);
        border-radius: 50%;
        font-size: 22px;
        line-height: 35px;
        margin-left: 20px;
        cursor: pointer;
      }
      span {
        font-size: 14px;
        margin-left: 20px;
        color: rgba(0, 0, 0, 0.6);
        cursor: pointer;
      }
      .userInfo {
        display: flex;
        align-items: center;
      }
      .userInfo img {
        width: 40px;
        height: 40px;
        border: 1px solid rgba(0, 0, 0, 0.6);
        border-radius: 50%;
        margin-left: 20px;
      }
    }
    .left-litle-tt {
      color: rgba(0, 0, 0, 0.6);
      font-size: 12px;
      padding-left: 20px;
      margin-top: 15px;
      height: 28px !important;
    }
  }
  .control {
    height: 40px;
    line-height: 30px;
    background: rgba(255, 255, 255, 0.4);
  }
  .control .el-button {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    margin: 0;
    margin-left: 8px;
    font-size: 12px;
    padding: 0;
  }
}
.lrcToggle {
  border: 1px solid #333;
  font-style: normal;
  width: 18px;
  height: 18px;
  display: inline-block;
  position: absolute;
  top: 22px;
  right: 150px;
  box-sizing: border-box;
  text-align: center;
  line-height: 18px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
  cursor: pointer;
  border-radius: 2px;
}
.lrcdisplay {
  color: red !important;
  border-color: red;
}
.lrcToggle:hover {
  color: #000;
}

.music-list-item {
  font-size: 12px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  padding: 0 20px !important;
}
</style>
