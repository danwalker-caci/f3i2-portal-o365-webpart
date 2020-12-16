<template>
  <div class="content" id="maincontent">
    <router-view></router-view>
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
