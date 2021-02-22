<template>
  <b-container fluid class="m-0 p-0">
    <b-row no-gutter class="cui">
      <b-col cols="4" class="p-0"></b-col>
      <b-col cols="4" class="p-0 text-center text-white">THIS SITE CONTAINS CONTROLLED UNCLASSIFIED INFORMATION</b-col>
      <b-col cols="4" class="p-0"></b-col>
    </b-row>
    <b-row no-gutter>
      <div v-if="userloaded" class="wrapper" :class="isShown === true ? 'bsidebarOpen' : 'bsidebarClosed'">
        <NotificationContainer />
        <b-sidebar no-slide no-close-on-route-change v-model="isShown" no-header bg-variant="black" text-variant="white" sidebar-class="bsvSidebar">
          <template v-slot:default>
            <Sidebar v-if="userloaded"></Sidebar>
          </template>
          <template v-slot:footer>
            <div class="d-flex bg-black text-white align-items-center p-1">
              <strong class="mr-auto">Legend</strong>
              <b-button size="sm" v-b-toggle.legend>Hide</b-button>
              <b-collapse id="legend" class="m-1">
                LEGEND WILL GO HERE
              </b-collapse>
            </div>
          </template>
        </b-sidebar>
        <div v-if="userloaded" class="main-panel" :class="isShown === true ? 'sidebarOpen' : 'sidebarClosed'">
          <Header />
          <Content />
          <Footer />
        </div>
      </div>
      <div v-else id="LoadingBars">
        <div class="blockG" id="rotateG_01"></div>
        <div class="blockG" id="rotateG_02"></div>
        <div class="blockG" id="rotateG_03"></div>
        <div class="blockG" id="rotateG_04"></div>
        <div class="blockG" id="rotateG_05"></div>
        <div class="blockG" id="rotateG_06"></div>
        <div class="blockG" id="rotateG_07"></div>
        <div class="blockG" id="rotateG_08"></div>
      </div>
    </b-row>
    <b-row no-gutter class="cui">
      <b-col cols="4" class="p-0"></b-col>
      <b-col cols="4" class="p-0 text-center text-white">THIS SITE CONTAINS CONTROLLED UNCLASSIFIED INFORMATION</b-col>
      <b-col cols="4" class="p-0"></b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import { namespace } from "vuex-class"
// import { Notification } from "@/interfaces/Notification"
import Header from "./Header.vue"
import Footer from "./Footer.vue"
import Content from "./Content.vue"
import Sidebar from "./Sidebar.vue"
import NotificationContainer from "../Notifications/NotificationContainer.vue"

const support = namespace("support")
// const notify = namespace("notify")
const users = namespace("users")

@Component({
  name: "Layout",
  components: {
    Sidebar,
    Header,
    Footer,
    Content,
    NotificationContainer
  }
})
export default class Layout extends Vue {
  public userloaded?: boolean = false
  public interval: any

  @users.State
  public loaded!: boolean

  @support.State
  public isShown!: boolean

  mounted() {
    this.interval = setInterval(this.waitforit, 1000)
  }

  public waitforit() {
    // wait for user to finish loading
    if (this.loaded) {
      clearInterval(this.interval)
      this.userloaded = true
    }
  }
}
</script>

<style lang="scss">
.cui {
  height: 25px;
  line-height: 25px;
  background-color: #8d1d8d;
}

#LoadingBars {
  position: relative;
  width: 240px;
  height: 298px;
  margin: auto;
}

.blockG {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.69);
  width: 39px;
  height: 93px;
  border-radius: 31px 31px 0 0;
  -o-border-radius: 31px 31px 0 0;
  -ms-border-radius: 31px 31px 0 0;
  -webkit-border-radius: 31px 31px 0 0;
  -moz-border-radius: 31px 31px 0 0;
  transform: scale(0.4);
  -o-transform: scale(0.4);
  -ms-transform: scale(0.4);
  -webkit-transform: scale(0.4);
  -moz-transform: scale(0.4);
  animation-name: fadeG;
  -o-animation-name: fadeG;
  -ms-animation-name: fadeG;
  -webkit-animation-name: fadeG;
  -moz-animation-name: fadeG;
  animation-duration: 0.732s;
  -o-animation-duration: 0.732s;
  -ms-animation-duration: 0.732s;
  -webkit-animation-duration: 0.732s;
  -moz-animation-duration: 0.732s;
  animation-iteration-count: infinite;
  -o-animation-iteration-count: infinite;
  -ms-animation-iteration-count: infinite;
  -webkit-animation-iteration-count: infinite;
  -moz-animation-iteration-count: infinite;
  animation-direction: normal;
  -o-animation-direction: normal;
  -ms-animation-direction: normal;
  -webkit-animation-direction: normal;
  -moz-animation-direction: normal;
}

#rotateG_01 {
  left: 0;
  top: 109px;
  animation-delay: 0.2695s;
  -o-animation-delay: 0.2695s;
  -ms-animation-delay: 0.2695s;
  -webkit-animation-delay: 0.2695s;
  -moz-animation-delay: 0.2695s;
  transform: rotate(-90deg);
  -o-transform: rotate(-90deg);
  -ms-transform: rotate(-90deg);
  -webkit-transform: rotate(-90deg);
  -moz-transform: rotate(-90deg);
}

#rotateG_02 {
  left: 31px;
  top: 39px;
  animation-delay: 0.366s;
  -o-animation-delay: 0.366s;
  -ms-animation-delay: 0.366s;
  -webkit-animation-delay: 0.366s;
  -moz-animation-delay: 0.366s;
  transform: rotate(-45deg);
  -o-transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
  -moz-transform: rotate(-45deg);
}

#rotateG_03 {
  left: 101px;
  top: 12px;
  animation-delay: 0.4525s;
  -o-animation-delay: 0.4525s;
  -ms-animation-delay: 0.4525s;
  -webkit-animation-delay: 0.4525s;
  -moz-animation-delay: 0.4525s;
  transform: rotate(0deg);
  -o-transform: rotate(0deg);
  -ms-transform: rotate(0deg);
  -webkit-transform: rotate(0deg);
  -moz-transform: rotate(0deg);
}

#rotateG_04 {
  right: 31px;
  top: 39px;
  animation-delay: 0.549s;
  -o-animation-delay: 0.549s;
  -ms-animation-delay: 0.549s;
  -webkit-animation-delay: 0.549s;
  -moz-animation-delay: 0.549s;
  transform: rotate(45deg);
  -o-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
}

#rotateG_05 {
  right: 0;
  top: 109px;
  animation-delay: 0.6355s;
  -o-animation-delay: 0.6355s;
  -ms-animation-delay: 0.6355s;
  -webkit-animation-delay: 0.6355s;
  -moz-animation-delay: 0.6355s;
  transform: rotate(90deg);
  -o-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  -webkit-transform: rotate(90deg);
  -moz-transform: rotate(90deg);
}

#rotateG_06 {
  right: 31px;
  bottom: 27px;
  animation-delay: 0.732s;
  -o-animation-delay: 0.732s;
  -ms-animation-delay: 0.732s;
  -webkit-animation-delay: 0.732s;
  -moz-animation-delay: 0.732s;
  transform: rotate(135deg);
  -o-transform: rotate(135deg);
  -ms-transform: rotate(135deg);
  -webkit-transform: rotate(135deg);
  -moz-transform: rotate(135deg);
}

#rotateG_07 {
  bottom: 0;
  left: 101px;
  animation-delay: 0.8185s;
  -o-animation-delay: 0.8185s;
  -ms-animation-delay: 0.8185s;
  -webkit-animation-delay: 0.8185s;
  -moz-animation-delay: 0.8185s;
  transform: rotate(180deg);
  -o-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  -webkit-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
}

#rotateG_08 {
  left: 31px;
  bottom: 27px;
  animation-delay: 0.905s;
  -o-animation-delay: 0.905s;
  -ms-animation-delay: 0.905s;
  -webkit-animation-delay: 0.905s;
  -moz-animation-delay: 0.905s;
  transform: rotate(-135deg);
  -o-transform: rotate(-135deg);
  -ms-transform: rotate(-135deg);
  -webkit-transform: rotate(-135deg);
  -moz-transform: rotate(-135deg);
}

@keyframes fadeG {
  0% {
    background-color: rgb(255, 0, 0);
  }

  100% {
    background-color: rgb(255, 255, 255);
  }
}

@-o-keyframes fadeG {
  0% {
    background-color: rgb(255, 0, 0);
  }

  100% {
    background-color: rgb(255, 255, 255);
  }
}

@-ms-keyframes fadeG {
  0% {
    background-color: rgb(255, 0, 0);
  }

  100% {
    background-color: rgb(255, 255, 255);
  }
}

@-webkit-keyframes fadeG {
  0% {
    background-color: rgb(255, 0, 0);
  }

  100% {
    background-color: rgb(255, 255, 255);
  }
}

@-moz-keyframes fadeG {
  0% {
    background-color: rgb(255, 0, 0);
  }

  100% {
    background-color: rgb(255, 255, 255);
  }
}
</style>
