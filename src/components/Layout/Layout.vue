<template>
  <div class="wrapper">
    <!-- <NotificationContainer /> -->
    <b-sidebar v-model="isShown" title="F3I2 Site Navigation" bg-variant="black" text-variant="white">
      <template v-slot:default>
        NAVIGATION HERE
      </template>
      <template v-slot:footer>
        <div class="d-flex bg-black text-white align-items-center px-3 py-2">
          <strong class="mr-auto">Legend</strong>
          <b-button size="sm" v-b-toggle.legend>Hide</b-button>
          <b-collapse id="legend" class="mt-1">
            LEGEND WILL GO HERE
          </b-collapse>
        </div>
      </template>
    </b-sidebar>
    <div class="main-panel">
      <Header />
      <Content />
      <Footer />
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, Prop, Vue } from "vue-property-decorator"
import { namespace } from "vuex-class"
import Header from "./Header.vue"
import Footer from "./Footer.vue"
import Content from "./Content.vue"
// import NotificationContainer from "../Notifications/NotificationContainer.vue"

const support = namespace("support")

@Component({
  components: {
    Header,
    Footer,
    Content
    // NotificationContainer
  }
})
export default class Layout extends Vue {
  // TODO: convert to prop to control from other components using the store.
  @support.State
  public isShown!: boolean

  mounted() {
    if (console) {
      console.log("Layout Mounted")
    }
  }
}
</script>

<style lang="scss" scoped>
/* Styles */
</style>
