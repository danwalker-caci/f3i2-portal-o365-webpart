<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-row no-gutters class="contentHeight">
      <b-col cols="12" class="m-0 p-0">
        <ejs-spreadsheet ref="spreadsheet"></ejs-spreadsheet>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import { namespace } from "vuex-class"
import { Notification } from "@/interfaces/Notification"

const notify = namespace("notify")

@Component({
  name: "Admin"
})
export default class Admin extends Vue {
  @notify.Action
  public add!: (notification: Notification) => void

  mounted() {
    const notification: Notification = {
      id: "AdminPage",
      type: "success",
      title: "Welcome!",
      message: "Admin Page Loaded."
    }
    this.add(notification)
  }
}
</script>

<style lang="scss"></style>
