<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator"

@Component
export default class Refresh extends Vue {
  @Prop() action?: string
  @Prop() id?: any
  @Prop() msrdata?: any
  @Prop() dashboardtab?: any
  @Prop() fundingtab?: any
  @Prop() traveltab?: any
  @Prop() arotab?: any

  mounted() {
    switch (this.action) {
      case "travel":
        this.$router.push({ name: "Travel Calendar", params: { mode: "default" } })
        break

      case "traveltracker":
        this.$router.push({ name: "Travel", path: "/travel/home/tracker" })
        break

      case "activeworkplans":
        this.$router.push({ name: "Work Plans", path: "home/active" })
        break

      case "msrhome":
        this.$router.push({ name: "Home", path: "/msr/home" })
        break

      case "msrform":
        this.$router.push({
          name: "MSRForm",
          params: {
            id: this.id,
            msrdata: this.msrdata,
            dashboardtab: this.dashboardtab,
            fundingtab: this.fundingtab,
            traveltab: this.traveltab,
            arotab: this.arotab
          }
        })
        break

      case "personnel":
        this.$router.push({ path: "/personnel/home/reports/default" })
        break

      case "features":
        this.$router.push({ name: "Features" })
        break

      case "bugs":
        this.$router.push({ name: "Bugs" })
        break
    }
  }
}
</script>

<style scoped></style>
