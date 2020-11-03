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
          icon: "subway"
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
          name: "Onboarding",
          path: "/personnel/home/new/onboarding",
          library: "fas",
          icon: "user-check"
        },
        {
          id: 202,
          name: "Reports",
          path: "/personnel/home/reports/default",
          library: "fas",
          icon: "id-card"
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
          icon: "briefcase"
        }
      ],
      library: "fas",
      icon: "ruler-combined"
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
