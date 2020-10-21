import Vue from "vue"
import Vuex from "vuex"
import notify from "./modules/notify"
import users from "./modules/users"
import support from "./modules/support"

Vue.use(Vuex)

Vue.config.devtools = true

const store = new Vuex.Store({
  modules: {
    support,
    notify,
    users
  }
})

export default store
