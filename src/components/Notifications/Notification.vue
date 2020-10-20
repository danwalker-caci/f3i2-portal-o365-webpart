<template>
  <b-toast :variant="notification.type" solid append-toast auto-hide-delay="8000" visible>
    <template v-slot:toast-title>
      <div class="d-flex flex-grow-1 align-items-baseline">
        <strong class="mr-auto">{{ notification.title }}</strong>
      </div>
    </template>
    <span>{{ notification.message }}</span>
  </b-toast>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";
const notification = namespace("notification");

@Component
export default class NotificationBar extends Vue {
  @notification.Action
  public remove!: (notificationToRemove: Notification) => void;

  @Prop()
  public notification!: Notification;

  private timeout!: number;

  mounted() {
    this.timeout = setTimeout(() => this.remove(this.notification), 8000);
  }

  beforeDestroy() {
    clearTimeout(this.timeout);
  }
}
</script>

<style scoped></style>
