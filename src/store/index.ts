import Vue from "vue"
import Vuex from "vuex"
import notify from "./modules/notify"
import users from "./modules/users"
import support from "./modules/support"
import sidebar from "./modules/sidebar"
import workplan from "./modules/workplan"
import personnel from "./modules/personnel"
import travel from "./modules/travel"

Vue.use(Vuex)

Vue.config.devtools = true

const store = new Vuex.Store({
  modules: {
    support,
    notify,
    users,
    sidebar,
    workplan,
    personnel,
    travel
  }
})

export default store
