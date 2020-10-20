<template>
  <div id="app">
    <router-view name="dialog"></router-view>
    <router-view></router-view>
  </div>
</template>

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
