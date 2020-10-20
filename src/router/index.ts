import Vue from "vue"
import VueRouter, { RouteConfig } from "vue-router"
import Layout from "../components/Layout/Layout.vue"
import Dashboard from "../components/Layout/Dashboard.vue"

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: "/",
    redirect: "/pages/home"
  },
  {
    path: "/pages",
    component: Layout,
    redirect: "/pages/home",
    children: [
      {
        path: "home",
        name: "Home",
        component: Dashboard
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
