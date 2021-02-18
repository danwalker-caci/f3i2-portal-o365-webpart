<template>
  <div id="app">
    <router-view name="dialog"></router-view>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios"
import { Component, Watch, Vue } from "vue-property-decorator"
import { Theme, ThemeName, ThemePropertiesDictionary } from "@/themes/theme.types"
import { namespace } from "vuex-class"
import { User } from "@/interfaces/User"
import { Notification } from "@/interfaces/Notification"

const users = namespace("users")
const notify = namespace("notify")
const workplan = namespace("workplan")

declare const _spPageContextInfo: any
const baseUrl = _spPageContextInfo.webAbsoluteUrl
const geturl = baseUrl + "/_api/web/getfolderbyserverrelativeurl('/sites/f3i2/siteassets/themes/standard')/Files('"

@Component
export default class App extends Vue {
  public readonly $el!: HTMLElement
  public userid!: number

  /** @property */
  public get theme(): ThemeName {
    return this.$store.state.support.theme
  }

  @notify.Action
  public add!: (notification: Notification) => void

  @users.Action
  public getUserId!: () => Promise<User>

  @users.Action
  public getUserProfile!: () => Promise<boolean>

  @users.Action
  public getUserPermissions!: (id: number) => Promise<User>

  @users.Action
  public getTodosByUser!: () => Promise<boolean>

  @workplan.Action
  public getWorkplans!: () => Promise<boolean>

  /** @method - lifecycle hook */
  public created(): void {
    this.getUserId().then(response => {
      this.userid = response.userid
      this.getUserProfile().then(response => {
        if (response === true) {
          this.getUserPermissions(this.userid).then(response => {
            if (response) {
              this.getTodosByUser().then(response => {
                if (response) {
                  this.setTheme()
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

  /** @method - watcher */
  @Watch("theme")
  public onThemeChange(): void {
    this.setTheme()
  }

  /** @method */
  public async setTheme(): Promise<void> {
    console.log("GETTING THEME " + this.theme)
    // load from document library
    let turl = geturl + this.theme
    turl += ".json')/$value"

    const response = await axios.get(turl, {
      headers: {
        accept: "application/json;odata=verbose"
      }
    })

    const r = response.data

    Object.entries(ThemePropertiesDictionary).forEach(entry => {
      const key = entry[0]
      const property = entry[1]
      // console.log("key: " + key + ", property: " + property + ", theme[key]: " + r[key])
      this.$el.style.setProperty(property, r[key])
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

.wrapper {
  width: 100vw;
  height: calc(100vh - 50px);
}
</style>
