<template>
  <footer class="footer">
    <div class="container-fluid d-flex flex-wrap justify-content-between">
      <nav>
        <ul class="footer-menu">
          <li>
            <router-link :to="{ path: '/pages/home' }">Home</router-link>
          </li>
        </ul>
      </nav>
    </div>
  </footer>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, Prop, Vue } from "vue-property-decorator"

@Component
export default class Footer extends Vue {}
</script>

<style lang="scss" scoped>
/* Styles */
</style>
