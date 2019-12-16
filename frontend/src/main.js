import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import { MdButton, MdContent, MdTabs, MdSwitch, MdChips } from 'vue-material/dist/components'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import VueTimepicker from 'vue2-timepicker'
import 'vue2-timepicker/dist/VueTimepicker.css'


Vue.use(MdButton)
Vue.use(MdContent)
Vue.use(MdTabs)
Vue.use(MdSwitch)
Vue.use(MdChips)
//Vue.use(MdBottomBarItem)


Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  VueTimepicker,
  render: h => h(App)
}).$mount('#app')
