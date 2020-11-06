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
  },
  {
    path: "/admin",
    component: Layout,
    redirect: "/admin/home",
    children: [
      {
        path: "home/:mode",
        name: "Admin",
        component: () => import(/* webpackChunkName: "admin" */ "../components/Admin/Admin.vue"),
        props: true
      }
    ]
  },
  {
    path: "/travel",
    component: Layout,
    redirect: "/travel/home",
    children: [
      {
        path: "home/:mode",
        name: "Travel",
        component: () => import(/* webpackChunkName: "travel" */ "../components/Travel/TravelTracker.vue"),
        props: true
      }
    ]
  },
  {
    path: "/personnel",
    component: Layout,
    redirect: "/personnel/home",
    children: [
      {
        path: "home/reports/:mode",
        name: "Reports",
        component: () => import(/* webpackChunkName: "personnel" */ "../components/Personnel/Personnel.vue"),
        props: true
      },
      {
        path: "home/refresh/:mode",
        name: "Personnel",
        component: () => import(/* webpackChunkName: "personnel" */ "../components/Personnel/Personnel.vue"),
        props: true
      },
      {
        path: "home/new/:mode",
        name: "Onboarding",
        component: () => import(/* webpackChunkName: "personnel" */ "../components/Personnel/Personnel.vue"),
        props: true
      }
    ]
  },
  {
    path: "/workplans",
    component: Layout,
    redirect: "/workplans/home",
    children: [
      {
        path: "home/active",
        name: "Work Plans",
        component: () => import(/* webpackChunkName: "workplan" */ "../components/Workplans/Workplan.vue"),
        props: true
      },
      {
        path: "home/manning",
        name: "Manning Report",
        component: () => import(/* webpackChunkName: "workplan" */ "../components/Workplans/Manning.vue"),
        props: true
      }
    ]
  },
  {
    path: "/refresh",
    component: Layout,
    redirect: "/refresh/home",
    children: [
      {
        path: "home/:action",
        name: "Refresh",
        component: () => import(/* webpackChunkName: "refresh" */ "../components/Layout/Refresh.vue"),
        props: true
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
