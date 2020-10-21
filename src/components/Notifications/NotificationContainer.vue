<template>
  <div class="notification-container">
    <NotificationBar v-for="notification in notifications" :key="notification.id" :notification="notification" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import { namespace } from "vuex-class"
import { Notification } from "@/interfaces/Notification"
import NotificationBar from "./NotificationBar.vue"

const notify = namespace("notify")

@Component({
  components: {
    NotificationBar
  }
})
export default class NotificationContainer extends Vue {
  @notify.State
  public notifications!: Array<Notification>
}
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 0;
  right: 0;
  padding-right: 40px;
  z-index: 5000;
}
</style>
