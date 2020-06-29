import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'
import Music from '../components/Music.vue'
import Video from '../components/Video.vue'
import MusicList from '../components/music/MusicList.vue'
import PlayList from '../components/music/Playlist.vue'
import Rankplaylist from '../components/list/Liebiao.vue'
import SearchList from '../components/search/searchList.vue'
import SongsMusiclist from '../components/songs/Musiclist.vue'
import SongsAlbum from '../components/music/Album.vue'
import Collection from '../components/Collection'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Index,
    redirect: '/music',
    children: [
      { path: '/music', component: Music },
      { path: '/video', component: Video },
      { path: '/songlist', component: MusicList },
      { path: '/playlist', component: PlayList },
      { path: '/rankplaylist', component: Rankplaylist },
      { path: '/searchlist', component: SearchList },
      { path: '/songmusiclist', component: SongsMusiclist },
      { path: '/album', component: SongsAlbum },
      { path: '/collection', component: Collection }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
