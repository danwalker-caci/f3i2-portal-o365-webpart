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
    path: "/financial",
    component: Layout,
    redirect: "/financial/home",
    children: [
      {
        path: "home",
        name: "Home",
        component: () => import(/* webpackChunkName: "financial" */ "../components/Financial/Dashboard.vue"),
        props: true
      },
      {
        path: "library",
        name: "Financial Documents",
        component: () => import(/* webpackChunkName: "financial" */ "../components/Financial/Library.vue"),
        props: true
      },
      {
        path: "library/clin/:clin",
        name: "Financial Documents",
        component: () => import(/* webpackChunkName: "financial" */ "../components/Financial/Library.vue"),
        props: true
      },
      {
        path: "library/clin/:clin/month/:month",
        name: "Financial Documents",
        component: () => import(/* webpackChunkName: "financial" */ "../components/Financial/Library.vue"),
        props: true
      },
      {
        path: "library/clin/:clin/year/:year",
        name: "Financial Documents",
        component: () => import(/* webpackChunkName: "financial" */ "../components/Financial/Library.vue"),
        props: true
      },
      {
        path: "library/clin/:clin/workplan/:workplan",
        name: "Financial Documents",
        component: () => import(/* webpackChunkName: "financial" */ "../components/Financial/Library.vue"),
        props: true
      },
      {
        path: "library/clin/:clin/month/:month/year/:year",
        name: "Financial Documents",
        component: () => import(/* webpackChunkName: "financial" */ "../components/Financial/Library.vue"),
        props: true
      },
      {
        path: "library/clin/:clin/month/:month/year/:year/workplan/:workplan",
        name: "Financial Documents",
        component: () => import(/* webpackChunkName: "financial" */ "../components/Financial/Library.vue"),
        props: true
      },
      {
        path: "library/month/:month/",
        name: "Financial Documents",
        component: () => import(/* webpackChunkName: "financial" */ "../components/Financial/Library.vue"),
        props: true
      },
      {
        path: "library/month/:month/year/:year",
        name: "Financial Documents",
        component: () => import(/* webpackChunkName: "financial" */ "../components/Financial/Library.vue"),
        props: true
      },
      {
        path: "library/month/:month/workplan/:workplan",
        name: "Financial Documents",
        component: () => import(/* webpackChunkName: "financial" */ "../components/Financial/Library.vue"),
        props: true
      },
      {
        path: "library/year/:year/",
        name: "Financial Documents",
        component: () => import(/* webpackChunkName: "financial" */ "../components/Financial/Library.vue"),
        props: true
      },
      {
        path: "library/year/:year/workplan/:workplan",
        name: "Financial Documents",
        component: () => import(/* webpackChunkName: "financial" */ "../components/Financial/Library.vue"),
        props: true
      },
      {
        path: "library/workplan/:workplan",
        name: "Financial Documents",
        component: () => import(/* webpackChunkName: "financial" */ "../components/Financial/Library.vue"),
        props: true
      },
      {
        path: "manning",
        name: "Manning Report",
        component: () => import(/* webpackChunkName: "financial" */ "../components/Financial/Manning.vue"),
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
        component: () => import(/* webpackChunkName: "travel" */ "../components/Travel/Home.vue"),
        props: true
      },
      {
        path: "page/tracker",
        name: "Travel Tracker",
        component: () => import(/* webpackChunkName: "travel" */ "../components/Travel/TravelTracker.vue"),
        props: true
      },
      {
        path: "page/calendar",
        name: "Travel Calendar",
        component: () => import(/* webpackChunkName: "travel" */ "../components/Travel/TravelCalendar.vue"),
        props: true
      },
      {
        path: "page/new",
        name: "New Travel",
        component: () => import(/* webpackChunkName: "travel" */ "../components/Travel/NewTravel.vue"),
        props: true
      },
      {
        path: "page/edit",
        name: "Edit Travel",
        component: () => import(/* webpackChunkName: "travel" */ "../components/Travel/EditTravel.vue"),
        props: true
      },
      {
        path: "page/report",
        name: "Trip Report",
        component: () => import(/* webpackChunkName: "travel" */ "../components/Travel/TripReport.vue"),
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
        name: "Roster",
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
