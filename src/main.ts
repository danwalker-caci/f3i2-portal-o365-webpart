import Vue from "vue"
import BootstrapVue from "bootstrap-vue"
import VueLodash from "vue-lodash"
import lodash from "lodash"
import VueMoment from "vue-moment"
import moment from "moment-timezone"
import crono from "vue-crono"
import { logger } from "./applogger"
import { GanttPlugin } from "@syncfusion/ej2-vue-gantt"
import { GridPlugin } from "@syncfusion/ej2-vue-grids"
import { RichTextEditorPlugin } from "@syncfusion/ej2-vue-richtexteditor"
import { DatePickerPlugin } from "@syncfusion/ej2-vue-calendars"
import { DropDownListPlugin } from "@syncfusion/ej2-vue-dropdowns"
import { CheckBoxPlugin } from "@syncfusion/ej2-vue-buttons"
import { UploaderPlugin } from "@syncfusion/ej2-vue-inputs"
import { SpreadsheetPlugin } from "@syncfusion/ej2-vue-spreadsheet"
import App from "./components/App.vue"
import router from "./router"
import store from "./store"

import { library } from "@fortawesome/fontawesome-svg-core"
import { dom } from "@fortawesome/fontawesome-svg-core"
import { far } from "@fortawesome/free-regular-svg-icons"
import { fas } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"

library.add(far, fas)
dom.watch()

import jquery from "jquery"
Object.defineProperty(Vue.prototype, "$jQuery", { value: jquery })

Vue.component("font-awesome-icon", FontAwesomeIcon)
Vue.use(VueMoment, {
  moment
})
Vue.use(BootstrapVue)
Vue.use(VueLodash, { lodash: lodash })
Vue.use(crono)
Vue.use(UploaderPlugin)
Vue.use(GanttPlugin)
Vue.use(GridPlugin)
Vue.use(RichTextEditorPlugin)
Vue.use(DatePickerPlugin)
Vue.use(DropDownListPlugin)
Vue.use(CheckBoxPlugin)
Vue.use(SpreadsheetPlugin)

export const bus = new Vue()
Vue.config.errorHandler = (err, vm, info) => {
  logger.logToServer({ err, vm, info })
}

window.onerror = function(message, source, lineno, colno, error) {
  logger.logToServer({ message, source, lineno, colno, error })
}

window.addEventListener("beforeunload", function(e) {
  if (String(window.location).indexOf("msr/form") > 0) {
    bus.$emit("Unloading")
    e.preventDefault()
    e.returnValue = ""
  }
})

Vue.config.productionTip = false

Vue.config.devtools = true

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app")
