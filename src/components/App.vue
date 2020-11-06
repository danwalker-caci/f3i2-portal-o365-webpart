<template>
  <div id="app">
    <router-view name="dialog"></router-view>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import { namespace } from "vuex-class"
import { User } from "@/interfaces/User"
import { Notification } from "@/interfaces/Notification"

const users = namespace("users")
const notify = namespace("notify")
const workplan = namespace("workplan")

@Component
export default class App extends Vue {
  public userid!: number

  @notify.Action
  public add!: (notification: Notification) => void

  @users.Action
  public getUserId!: () => Promise<User>

  @users.Action
  public getUserProfile!: () => Promise<boolean>

  @users.Action
  public getUserPermissions!: (id: number) => Promise<User>

  @workplan.Action
  public getWorkplans!: () => Promise<boolean>

  created() {
    this.getUserId().then(response => {
      this.userid = response.userid
      this.getUserProfile().then(response => {
        if (response === true) {
          this.getUserPermissions(this.userid).then(response => {
            if (response) {
              this.getWorkplans().then(response => {
                if (response) {
                  // TODO: Get Personnel and Companies
                } else {
                  const notification: Notification = {
                    id: 0,
                    type: "danger",
                    title: "Error",
                    message: "Could not load Workplans."
                  }
                  this.add(notification)
                }
              })
            } else {
              console.log("Error getting user permissions.")
            }
          })
        } else {
          console.log("Error getting user profile.")
        }
      })
    })
  }
}
</script>

<style lang="scss">
@import "../assets/scss/portal.scss";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000;
  background-color: white !important;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 1000 !important;
}
</style>
