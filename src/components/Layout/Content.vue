<template>
  <div class="content" id="maincontent">
    <div class="container-fluid">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, Prop, Vue } from "vue-property-decorator"

@Component
export default class Content extends Vue {}
</script>

<style scoped>
/* Styles */
</style>
