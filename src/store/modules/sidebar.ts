import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators"
import { SidebarItem } from "@/interfaces/SidebarItem"

@Module({ namespaced: true })
class Sidebar extends VuexModule {
  public sidebaritems: Array<SidebarItem> = [
    {
      id: 100,
      isMenu: true,
      name: "Travel",
      path: "/travel/home",
      children: [
        {
          id: 101,
          name: "Travel Calendar",
          path: "/travel/home/refreshcalendar",
          library: "fas",
          icon: "calendar"
        },
        {
          id: 102,
          name: "Travel Tracker",
          path: "/travel/home/refreshtracker",
          library: "fas",
          icon: "subway",
          filtertype: "travel",
          filtershown: false
        },
        {
          id: 103,
          name: "New Travel Request",
          path: "/travel/home/new",
          library: "fas",
          icon: "plane-departure"
        }
      ],
      library: "fas",
      icon: "plane"
    },
    {
      id: 200,
      isMenu: true,
      name: "Personnel",
      children: [
        {
          id: 201,
          name: "Roster",
          path: "/personnel/roster",
          library: "fas",
          icon: "user-check",
          filtertype: "personnel",
          filtershown: false
        },
        {
          id: 202,
          name: "OnBoarding",
          path: "/personnel/onboarding",
          library: "fas",
          icon: "user-plus"
        },
        {
          id: 203,
          name: "OffBoarding",
          path: "/personnel/offboarding",
          library: "fas",
          icon: "user-minus"
        }
      ],
      library: "fas",
      icon: "users"
    },
    {
      id: 300,
      isMenu: true,
      name: "Workplans",
      children: [
        {
          id: 301,
          name: "Active Work Plans",
          path: "/workplans/home/active",
          library: "fas",
          icon: "briefcase",
          filtertype: "workplans",
          filtershown: false
        }
      ],
      library: "fas",
      icon: "ruler-combined"
    },
    {
      id: 400,
      isMenu: true,
      name: "Financial",
      path: "/financial/home",
      children: [
        {
          id: 401,
          name: "Dashboard",
          path: "/financial/home",
          library: "fas",
          icon: "file-invoice"
        },
        {
          id: 402,
          name: "Documents",
          path: "/financial/library",
          library: "fas",
          icon: "book"
        },
        {
          id: 403,
          name: "Manning Report",
          path: "/financial/manning",
          library: "fas",
          icon: "pusers"
        }
      ],
      library: "fas",
      icon: "money-check-alt",
      permission: "isAdmin",
      permissionvalue: true
    },
    {
      id: 1000,
      isMenu: false,
      children: [],
      name: "Portal Administration",
      path: "/admin/home/home",
      library: "fas",
      icon: "user-lock",
      permission: "isAdmin",
      permissionvalue: true
    }
  ]

  @Mutation
  public addSidebarItem(item: SidebarItem): void {
    // TODO: Update to just push results from axios call as one larger function
    this.sidebaritems.push({
      ...item
    })
  }

  @Action
  public add(item: SidebarItem): void {
    this.context.commit("addSidebarItem", item)
  }
}
export default Sidebar
