<template>
  <div class="content" id="maincontent">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, Vue } from "vue-property-decorator"
import { namespace } from "vuex-class"

const support = namespace("support")

@Component({
  name: "Content"
})
export default class Content extends Vue {
  public rect!: DOMRect
  public interval: any

  @support.Action
  public setRect!: (newVal: DOMRect) => void

  mounted() {
    const element = document.getElementById("maincontent")!
    this.rect = element.getBoundingClientRect()
    console.log("CALCULATED CONTENT AREA: HEIGHT: " + this.rect?.height + ", WIDTH: " + this.rect?.width)
    this.setRect(this.rect)
  }
}
</script>

<style scoped>
/* Styles */
</style>
