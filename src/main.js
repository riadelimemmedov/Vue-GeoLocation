import Vue from 'vue'
import App from './App.vue'

import VueGeolocation from 'vue-browser-geolocation';
import * as VueGoogleMaps from 'vue2-google-maps'
import Notifications from 'vue-notification'

import { store } from '../store/store.js'

require('dotenv').config()
console.log('working main js',  process.env.VUE_APP_GOOGLEMAPAPIKEY)

//!Use VueGeoLocation App
Vue.use(VueGeolocation)

//!Use VueGoogleMaps
Vue.use(VueGoogleMaps, {
  load: {
    key:process.env.VUE_APP_GOOGLEMAPAPIKEY
  }
})

//!Use VueSweetalert2
Vue.use(Notifications)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store
}).$mount('#app')
