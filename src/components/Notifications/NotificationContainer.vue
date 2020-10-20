<template>
  <div class="notification-container">
    <Notification v-for="notification in notifications" :key="notification.id" :notification="notification" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Notification from "./Notification.vue";

@Component({
  components: {
    Notification
  }
})
export default class NotificationContainer extends Vue {}
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
