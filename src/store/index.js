import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    playMusic: {
      name: '',
      artist: '',
      url: ''
    },
    controlMsc: {},
    mainIndex: 'first',
    newmusicStatus: true,
    thisPlaylistId: 0
  },
  mutations: {
    // 播放器对象
    controlMusic(state, obj) {
      state.controlMsc = obj
    },
    // 设置当前播放
    setPlayMusic(state, obj) {
      state.playMusic = obj
      if (JSON.parse(window.sessionStorage.getItem('musiclist')) !== null) {
        const id = state.controlMsc.musicList.findIndex(item => obj.id === item.id)
        if (id < state.controlMsc.musicList.length - 1 && id !== -1) {
          state.controlMsc.musicList.splice(id, 1)
        }
        state.controlMsc.musicList.unshift(obj)
        window.sessionStorage.setItem('musiclist', JSON.stringify(state.controlMsc.musicList))
      } else {
        state.controlMsc.musicList.unshift(obj)
        window.sessionStorage.setItem('musiclist', JSON.stringify(state.controlMsc.musicList))
      }
    },
    // 播放器记一次加载
    firstComeMusic(state, obj) {
      state.playMusic = obj
    },
    // 自动播放
    autoPlayMusic(state) {
      state.controlMsc.play()
    },
    // 改变主页切换索引
    changeMainIndex(state, item) {
      state.mainIndex = item
    },
    // 新增播放列表数据
    addMusicList(state) {
      state.controlMsc.musicList.splice(0, state.controlMsc.musicList.length)
      const data = JSON.parse(window.sessionStorage.getItem('musiclist'))
      state.controlMsc.playIndex = 0
      data.forEach(item => {
        state.controlMsc.musicList.push(item)
      })
      state.controlMsc.shuffledList = state.controlMsc.musicList
    },
    // 设置新歌页tabs状态
    setNMStatus(state, str) {
      state.newmusicStatus = str
    },
    // 记录当前歌单id
    setPlaylistId(state, id) {
      state.thisPlaylistId = id
    }
  },
  actions: {
    dealAutoPlay(context, obj) {
      setTimeout(() => {
        context.commit('autoPlayMusic')
      }, 1000)
      context.commit('setPlayMusic', obj)
    }
  },
  modules: {
  }
})
