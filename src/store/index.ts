import Vue from "vue"
import Vuex from "vuex"
// import Notification from './modules/notification'
// import User from './modules/user'
import support from "./modules/support"

Vue.use(Vuex)

Vue.config.devtools = true

const store = new Vuex.Store({
  modules: {
    support
  }
})

export default store
