<template>
  <li class="nav-item">
    <a v-b-toggle.menu0 class="nav-link sidebar-menu-item">
      <span class="sidebar-icon">
        <font-awesome-icon fas icon="user" class="icon"></font-awesome-icon>
      </span>
      <span class="sidebar-text">
        {{ CurrentUser.DisplayName }}
        <span class="badge badge-xs badge-danger sidebar-badge">{{ todoCount }}</span>
      </span>
    </a>
    <b-collapse id="menu0" accordion="sidebar-accordion" role="tabpanel" class="ml-3">
      <ul class="nav"></ul>
    </b-collapse>
  </li>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import { User } from "@/interfaces/User"

@Component({
  name: "UserMenu"
})
export default class UserMenu extends Vue {
  get todoCount(): number {
    return this.$store.state.users.todos.length
  }

  get CurrentUser(): User {
    return this.$store.state.users.currentUser
  }
}
</script>

<style lang="scss"></style>
