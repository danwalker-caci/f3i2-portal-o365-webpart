<template>
  <div class="content" id="maincontent">
    <div class="container-fluid p-0 m-0">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"

@Component({
  name: "Content"
})
export default class Content extends Vue {}
</script>

<style scoped>
/* Styles */
</style>
