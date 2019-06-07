import Vue from 'vue'
import store from '@/store'
import App from './App.vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import VueNativeSocket from 'vue-native-websocket'

Vue.config.productionTip = false
Vue.use(Vuetify)

Vue.use(VueNativeSocket, process.env.VUE_APP_BITMEX_WSS_ENDPOINT, {
  store: store,
  format: 'json',
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 3000
})

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
