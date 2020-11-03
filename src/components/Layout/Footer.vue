<template>
  <footer class="footer">
    <div class="container-fluid d-flex flex-wrap justify-content-between">
      <nav>
        <ul class="footer-menu">
          <li>
            <router-link :to="{ path: '/pages/home' }">Home</router-link>
          </li>
        </ul>
      </nav>
    </div>
  </footer>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, Prop, Vue } from "vue-property-decorator"
import { namespace } from "vuex-class"

const support = namespace("support")

@Component
export default class Footer extends Vue {
  @support.State
  public isShown!: boolean
}
</script>

<style lang="scss" scoped>
/* .sidebarOpen {
  margin-left: 310px !important;
}

.sidebarClosed {
  margin-left: 10px;
} */
</style>
