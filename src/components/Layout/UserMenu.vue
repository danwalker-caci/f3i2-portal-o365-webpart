<template>
  <li class="nav-item">
    <a v-b-toggle.menu0 class="nav-link sidebar-menu-item">
      <span class="sidebar-icon">
        <font-awesome-icon fas icon="user" class="icon"></font-awesome-icon>
      </span>
      <span class="sidebar-text">
        {{ CurrentUser.DisplayName }}
        <span class="badge badge-xs badge-danger sidebar-badge">0</span>
      </span>
    </a>
    <b-collapse id="menu0" accordion="sidebar-accordion" role="tabpanel" class="ml-3">
      <ul class="nav"></ul>
    </b-collapse>
  </li>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, Vue } from "vue-property-decorator"
import { namespace } from "vuex-class"
import { User } from "@/interfaces/User"

const users = namespace("users")

@Component({
  name: "UserMenu"
})
export default class UserMenu extends Vue {
  get CurrentUser(): User {
    return this.$store.state.users.currentUser
  }
}
</script>

<style lang="scss"></style>
