<template>
  <div class="sidebar">
    <div class="sidebar-wrapper">
      <ul class="nav">
        <li class="nav-item nav-header">
          <b-link class="nav-link" :href="homepage">
            <span class="sidebar-icon">
              <font-awesome-icon fas icon="fighter-jet" class="icon"></font-awesome-icon>
            </span>
            <span class="sidebar-text sidebar-header">{{ title }}</span>
          </b-link>
        </li>
      </ul>
      <ul class="accordion nav" role="tablist">
        <UserMenu />
        <li v-for="(link, index) in sidebaritems" :key="link.name + index" :link="link" class="nav-item" :to="link.path ? link.path : '/'">
          <template v-if="link.children.length > 0">
            <a v-b-toggle="'menu' + link.id" class="nav-link">
              <span class="sidebar-icon">
                <font-awesome-icon v-if="link.library === 'fas'" fas :icon="link.icon" class="icon"></font-awesome-icon>
                <font-awesome-icon v-else-if="link.library === 'far'" far :icon="link.icon" class="icon"></font-awesome-icon>
              </span>
              <span class="sidebar-text">
                {{ link.name }}
                <span v-if="link.badgeId && link.badgeId.length > 0" :id="link.badgeId" class="badge badge-xs badge-danger sidebar-badge">0</span>
              </span>
              <b class="caret"></b>
            </a>
            <b-collapse :id="'menu' + link.id" accordion="sidebar-accordion" role="tabpanel" class="ml-3">
              <ul class="nav">
                <li v-for="(sublink, index) in link.children" :key="sublink.name + index" :sublink="sublink" class="nav-item">
                  <router-link :to="sublink.path" class="nav-link">
                    <span class="sidebar-icon">
                      <font-awesome-icon v-if="sublink.library === 'fas'" fas :icon="sublink.icon" class="icon"></font-awesome-icon>
                      <font-awesome-icon v-else-if="sublink.library === 'far'" far :icon="sublink.icon" class="icon"></font-awesome-icon>
                      <font-awesome-icon v-if="sublink.filtertype && sublink.filtertype.length > 0" v-b-toggle="'filtermenu_' + sublink.filtertype" fas icon="filter" class="icon"></font-awesome-icon>
                    </span>
                    <span class="sidebar-text">
                      {{ sublink.name }}
                      <span v-if="sublink.badgeId && sublink.badgeId.length > 0" :id="sublink.badgeId" class="badge badge-xs badge-danger sidebar-badge">0</span>
                    </span>
                  </router-link>
                  <GridFilter v-if="sublink.filtertype && sublink.filtertype.length > 0" :filtertype="sublink.filtertype"></GridFilter>
                </li>
              </ul>
            </b-collapse>
          </template>
          <template v-else>
            <router-link v-if="currentUser[link.permission] === link.permissionvalue" :to="link.path" class="nav-link">
              <span class="sidebar-icon">
                <font-awesome-icon v-if="link.library === 'fas'" fas :icon="link.icon" class="icon"></font-awesome-icon>
                <font-awesome-icon v-else-if="link.library === 'far'" far :icon="link.icon" class="icon"></font-awesome-icon>
              </span>
              <span class="sidebar-text">
                {{ link.name }}
                <span v-if="link.badgeId && link.badgeId.length > 0" :id="link.badgeId" class="badge badge-xs badge-danger sidebar-badge">0</span>
              </span>
            </router-link>
          </template>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator"
import { namespace } from "vuex-class"
import { User } from "@/interfaces/User"
import { SidebarItem } from "@/interfaces/SidebarItem"
import GridFilter from "./GridFilter.vue"
import UserMenu from "./UserMenu.vue"

const sidebar = namespace("sidebar")
const users = namespace("users")

@Component({
  name: "Sidebar",
  components: {
    UserMenu,
    GridFilter
  }
})
export default class Sidebar extends Vue {
  public Shown!: boolean

  @users.State
  public currentUser!: User

  @Prop({ default: process.env.VUE_APP_HOMEPAGE }) readonly homepage!: string

  @Prop({ default: process.env.VUE_APP_TITLE }) readonly title!: string

  @sidebar.State
  public sidebaritems!: Array<SidebarItem>
}
</script>

<style lang="scss"></style>
