<template>
  <div class="wrapper">
    <NotificationContainer />
    <b-sidebar no-slide no-close-on-route-change v-model="isShown" no-header bg-variant="black" text-variant="white">
      <template v-slot:default>
        <Sidebar v-if="loaded"></Sidebar>
      </template>
      <template v-slot:footer>
        <div class="d-flex bg-black text-white align-items-center p-1">
          <strong class="mr-auto">Legend</strong>
          <b-button size="sm" v-b-toggle.legend>Hide</b-button>
          <b-collapse id="legend" class="m-1">
            LEGEND WILL GO HERE
          </b-collapse>
        </div>
      </template>
    </b-sidebar>
    <div class="main-panel" :class="isShown === true ? 'sidebarOpen' : 'sidebarClosed'">
      <Header />
      <Content />
      <Footer />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import { namespace } from "vuex-class"
import { Notification } from "@/interfaces/Notification"
import Header from "./Header.vue"
import Footer from "./Footer.vue"
import Content from "./Content.vue"
import Sidebar from "./Sidebar.vue"
import NotificationContainer from "../Notifications/NotificationContainer.vue"

const support = namespace("support")
const notify = namespace("notify")
const users = namespace("users")

@Component({
  name: "Layout",
  components: {
    Sidebar,
    Header,
    Footer,
    Content,
    NotificationContainer
  }
})
export default class Layout extends Vue {
  @users.State
  public loaded!: boolean

  @support.State
  public isShown!: boolean

  @notify.Action
  public add!: (notification: Notification) => void

  mounted() {
    const notification: Notification = {
      id: 0,
      type: "success",
      title: "Welcome!",
      message: "F3I2 Portal Loaded."
    }
    this.add(notification)
  }
}
</script>

<style lang="scss">
.sidebarOpen {
  margin-left: 320px !important;
}

.sidebarClosed {
  margin-left: 0px;
}
</style>
