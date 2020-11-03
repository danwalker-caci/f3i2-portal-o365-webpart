<template>
  <li>
    <a v-if="link.isMenu" class="nav-link sidebar-menu-item" :aria-expanded="!collapsed" data-toggle="collapse" @click="collapseMenu">
      <font-awesome-icon v-if="link.library === 'fas'" fas :icon="link.icon" class="icon"></font-awesome-icon>
      <font-awesome-icon v-else-if="link.library === 'far'" far :icon="link.icon" class="icon"></font-awesome-icon>
      <p>
        {{ link.name }}
        <b class="caret"></b>
      </p>
    </a>
    <div v-if="link.isMenu" class="ml-3">
      <ul class="nav" v-show="!collapsed">
        <slot></slot>
      </ul>
    </div>
    <slot name="title" v-if="children.length === 0 && !$slots.default && link.path">
      <component :to="link.path" @click.native="linkClick" :is="elementType(link, false)" :class="{ active: link.active }" class="nav-link" :target="link.target" :href="link.path">
        <template>
          <span class="sidebar-mini">
            <font-awesome-icon v-if="link.library === 'fas'" fas :icon="link.icon" class="icon"></font-awesome-icon>
            <font-awesome-icon v-else-if="link.library === 'far'" far :icon="link.icon" class="icon"></font-awesome-icon>
          </span>
          <span class="sidebar-normal">{{ link.name }}</span>
          <span v-if="link.badgeId != ''" :id="link.badgeId" class="badge badge-xs badge-danger float-right"></span>
        </template>
      </component>
    </slot>
  </li>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, Inject, Provide, Prop, Vue } from "vue-property-decorator"

@Component
export default class NavItem extends Vue {
  public children!: []
  public collapsed!: boolean

  get baseComponent() {
    return this.children.length > 0 ? "li" : "router-link"
  }

  public elementType(link: { isRoute: boolean }, isParent = true) {
    if (link.isRoute === false) {
      return isParent ? "li" : "a"
    } else {
      return "router-link"
    }
  }

  public collapseMenu() {
    this.collapsed = !this.collapsed
  }
}
</script>

<style scoped></style>
