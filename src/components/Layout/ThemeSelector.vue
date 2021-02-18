<template>
  <b-sidebar v-model="isThemeSelectorShown" no-header id="ThemePicker" ref="ThemePicker" bg-variant="dark" text-variant="light" right>
    <div class="sidebar">
      <div class="sidebar-wrapper">
        <ul class="nav">
          <li class="nav-item nav-header">
            <div class="row no-gutters" style="height: 50px !important;">
              <div class="col-8">
                <h3 style="line-height: 50px;" class="text-light">Select Theme</h3>
              </div>
              <div class="col-4">
                <b-button size="sm" @click="CloseThemeSelector" variant="warning">Close</b-button>
              </div>
            </div>
          </li>
        </ul>
        <ul class="accordion nav" role="tablist">
          <li class="nav-item">
            <a v-b-toggle.menu_A class="nav-link">
              <span class="sidebar-icon">
                <font-awesome-icon fas icon="palette" class="icon"></font-awesome-icon>
              </span>
              <span class="sidebar-text">
                Standard Themes
              </span>
              <b class="caret"></b>
            </a>
            <b-collapse id="menu_A" accordion="right-sidebar-accordion" role="tabpanel" class="ml-1">
              <b-form-radio-group v-model="activeTheme" :options="Themes" name="ThemeRadios" stacked @change="ThemeChanged" class="text-left"></b-form-radio-group>
            </b-collapse>
          </li>
          <li class="nav-item">
            <a v-b-toggle.menu_B class="nav-link">
              <span class="sidebar-icon">
                <font-awesome-icon fas icon="swatchbook" class="icon"></font-awesome-icon>
              </span>
              <span class="sidebar-text">
                Create Your Theme
              </span>
              <b class="caret"></b>
            </a>
            <b-collapse id="menu_B" accordion="right-sidebar-accordion" role="tabpanel" class="ml-1">
              &nbsp;
            </b-collapse>
          </li>
        </ul>
      </div>
    </div>
  </b-sidebar>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import { ThemeLabel, ThemeName } from "@/themes/theme.types"
import { ObjectItem } from "@/interfaces/ObjectItem"
import { namespace } from "vuex-class"

const support = namespace("support")

@Component
export default class ThemeSelector extends Vue {
  /** @state */
  @support.State
  public isThemeSelectorShown!: boolean

  /** @property */
  public get activeTheme(): ThemeName {
    return this.$store.state.support.theme
  }

  /** @property */
  public set activeTheme(themeName: ThemeName) {
    this.setTheme(themeName)
  }

  @support.Action
  public setThemeSelectorShown!: (newVal: boolean) => void

  @support.Action
  public setTheme!: (theme: ThemeName) => void

  public CloseThemeSelector() {
    this.setThemeSelectorShown(false)
  }

  public get Themes(): ObjectItem[] {
    const options: ObjectItem[] = []

    Object.values(ThemeName).forEach(themeName => {
      options.push({
        text: ThemeLabel[themeName],
        value: themeName
      })
    })

    return options
  }
}
</script>

<style scoped></style>
