<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-row no-gutters class="contentHeight">
      <b-toast id="busy-toast" variant="warning" solid no-auto-hide>
        <template v-slot:toast-title>
          <div class="d-flex flex-grow-1 align-items-baseline">
            <b-img blank blank-color="#ff0000" class="mr-2" width="12" height="12"></b-img>
            <strong class="mr-auto">{{ busyTitle }}</strong>
          </div>
        </template>
        <b-spinner style="width: 7rem; height: 7rem;" variant="success" label="Waiting Spinner"></b-spinner>
      </b-toast>
      <b-col cols="12" class="m-0 p-0">
        <b-container fluid class="contentHeight m-0 p-0">
          <b-row no-gutters class="gridrow">
            <ejs-grid
              v-if="loaded"
              id="TravelGrid"
              ref="TravelGrid"
              :frozenColumns="2"
              :enablePersistence="false"
              :dataSource="filteredtravel"
              :allowPaging="true"
              :allowReordering="true"
              :allowResizing="true"
              :pageSettings="pageSettings"
              :editSettings="editSettings"
              :toolbar="toolbar"
              :allowExcelExport="true"
              :toolbarClick="toolbarClick"
              :dataBound="dataBound"
              :actionBegin="actionBegin"
              :actionComplete="actionComplete"
              :queryCellInfo="formatCell"
              :excelQueryCellInfo="formatExcelCell"
              rowHeight="20"
              :height="contentrect.height - 125"
              :width="contentrect.width - 5"
            >
              <e-columns>
                <e-column headerText="Actions" textAlign="Left" width="100" :lockColumn="true" :template="actionsTemplate"></e-column>
                <e-column field="Status" :lockColumn="true" headerText="Status" width="150"></e-column>
                <e-column field="Comments" headerText="Purpose" textAlign="Left" minWidth="150" width="200" maxWidth="300"></e-column>
                <e-column field="WorkPlanNumber" headerText="Workplan Number" textAlign="Left" width="150"></e-column>
                <e-column field="WorkPlanText" headerText="Workplan Name" textAlign="Left" width="250"></e-column>
                <e-column field="IndexNumber" headerText="Index Number" textAlign="Left" width="140"></e-column>
                <e-column field="Created" headerText="Travel Requested" textAlign="Left" width="150" type="date" format="yMd"></e-column>
                <e-column field="StartTime" headerText="Departure Date" textAlign="Left" width="140" type="date" format="yMd"></e-column>
                <e-column field="EndTime" headerText="Return Date" textAlign="Left" width="140" type="date" format="yMd"></e-column>
                <e-column field="TravelersText" headerText="Travelers" textAlign="Left" width="200"></e-column>
                <e-column field="Company" headerText="Company" textAlign="Left" width="150"></e-column>
                <e-column field="Sponsor" headerText="Sponsor" textAlign="Left" width="150"></e-column>
                <e-column field="EstimatedCost" headerText="Est Cost" textAlign="Left" width="100"></e-column>
                <e-column field="PreApproved" headerText="Pre Approved" textAlign="Left" width="100"></e-column>
                <e-column field="VisitRequest" headerText="Visit Request" textAlign="Left" width="150"></e-column>
                <e-column field="Clearance" headerText="Clearance" textAlign="Left" width="100"></e-column>
                <e-column field="OCONUS" headerText="OCONUS" textAlign="Left" width="100"></e-column>
                <e-column field="OCONUSLocation" headerText="OCONUS Location" textAlign="Left" width="150"></e-column>
                <e-column field="OCONUSApprovedBy" headerText="OCONUS Approved By" textAlign="Left" width="180"></e-column>
                <e-column field="OCONUSApprovedOn" headerText="OCONUS Approved Date" textAlign="Left" width="200" type="date" format="yMd"></e-column>
                <e-column field="TravelFrom" headerText="Travel From" textAlign="Left" width="150"></e-column>
                <e-column field="TravelTo" headerText="Travel To" textAlign="Left" width="150"></e-column>
                <e-column field="POCName" headerText="POC Name" textAlign="Left" width="120"></e-column>
                <e-column field="POCEmail" headerText="POC Email" textAlign="Left" width="180"></e-column>
                <e-column field="POCPhone" headerText="POC Phone" textAlign="Left" width="100"></e-column>
                <e-column field="SecurityAction" headerText="Security Action" textAlign="Left" width="200"></e-column>
                <e-column field="SecurityActionCompleted" headerText="Security Action Completed" textAlign="Left" width="200" type="date" format="yMd"></e-column>
                <!-- <e-column field="TripReport" headerText="Trip Report" textAlign="Left" width="180" :template="TripReportTemplate"></e-column> -->
                <e-column field="Id" headerText="Id" :visible="false" textAlign="Left" width="40" :isPrimaryKey="true"></e-column>
              </e-columns>
            </ejs-grid>
          </b-row>
        </b-container>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, Vue, Ref } from "vue-property-decorator"
import { bus } from "../../main"
import { namespace } from "vuex-class"
import { User } from "@/interfaces/User"
import { Notification } from "@/interfaces/Notification"
import { TravelItem } from "@/interfaces/TravelItem"
import { ClickEventArgs } from "@syncfusion/ej2-vue-navigations"
import { GridComponent, EditSettings, ActionEventArgs } from "@syncfusion/ej2-vue-grids"
import { Page, Edit, Toolbar, Resize, Reorder, VirtualScroll, ExcelExport, DetailRow, Freeze } from "@syncfusion/ej2-vue-grids"
import ActionsTemplate from "./ActionsTemplate.vue"

const notify = namespace("notify")
const support = namespace("support")
const users = namespace("users")
const travel = namespace("travel")

let vm: any = null

@Component({
  name: "TravelTracker",
  provide: {
    grid: [Page, Edit, DetailRow, Toolbar, Resize, Reorder, VirtualScroll, ExcelExport, Freeze]
  }
})
export default class TravelTracker extends Vue {
  public loaded?: boolean = false
  public filtereddata?: Array<TravelItem> = []

  @support.State
  public contentrect!: DOMRect

  @users.State
  public currentUser!: User

  @notify.Action
  public add!: (notification: Notification) => void

  @travel.Action
  public getDigest!: () => Promise<boolean>

  @travel.Action
  public getTravel!: (payload: any) => Promise<boolean>

  @travel.Action
  public setFilteredTravel!: (payload: any) => Promise<boolean>

  public actionsTemplate() {
    return { template: ActionsTemplate }
  }

  get Digest() {
    return this.$store.state.travel.digest
  }

  get Loaded() {
    return this.$store.state.travel.loaded
  }

  get travel() {
    return this.$store.state.travel.alltravel
  }

  get filteredtravel() {
    return this.$store.state.travel.filteredtravel
  }

  get isSubcontractor() {
    return this.$store.state.users.currentUser.isSubcontractor
  }

  @Ref("TravelGrid") readonly TravelGrid!: GridComponent

  /* updated() {
    console.log("TravelTracker Updated: " + this.contentrect.height)
  } */

  created() {
    bus.$on("showhide", (data: any) => {
      this.showorhide(data)
    })
    bus.$on("sortit", (data: any) => {
      this.sortit(data)
    })
  }

  mounted() {
    console.log("TRAVEL MOUNTED")
    vm = this
    const notification: Notification = {
      id: 0,
      type: "success",
      title: "Getting Data",
      message: "Getting Travel. Please wait..."
    }
    this.add(notification)
    this.getDigest()
    const payload: any = {}
    payload.query = "?$select=*&$orderby=Id desc"
    this.getTravel(payload).then(response => {
      vm.loaded = true
    })
  }

  errorCaptured(err: any, vm: any, info: any) {
    const notification: Notification = {
      id: 0,
      type: "danger",
      title: "Error in TravelTracker.vue " + err,
      message: info
    }
    this.add(notification)
  }

  public rowData?: any = {}
  public newData?: any = {}
  public busyTitle?: string = "Getting Data. Please Wait."
  public pageSettings?: any = { pageSize: 30 }
  public editSettings: any = {
    allowEditing: this.isSubcontractor ? false : true,
    allowAdding: this.isSubcontractor ? false : true,
    allowDeleting: false,
    mode: "Dialog"
  }
  public toolbar?: any = this.isSubcontractor ? ["Search"] : ["Add", "Edit", "Print", "Search", "ExcelExport"]

  public toolbarClick(args: ClickEventArgs) {
    switch (args.item.id) {
      case "TravelGrid_excelexport":
        ;(this.$refs["TravelGrid"] as GridComponent).excelExport()
        break

      case "TravelGrid_print":
        ;(this.$refs["TravelGrid"] as GridComponent).print()
        break
    }
  }

  public actionComplete(args: ActionEventArgs) {
    if (args.requestType == "columnstate") {
      ;(this.$refs["TravelGrid"] as GridComponent).autoFitColumns()
    }
    if (args.requestType == "refresh") {
      let h1 = 0
      const h2 = (this.$refs["TravelGrid"] as GridComponent).$el.children[7].children[0].clientHeight // children[7] matches .e-gridcontent
      h1 = Math.floor(h2 / 20)
      this.pageSettings = { pageSize: h1 }
    }
  }

  public dataBound() {
    ;(this.$refs["TravelGrid"] as GridComponent).autoFitColumns()
    let h1 = 0
    const h2 = (this.$refs["TravelGrid"] as GridComponent).$el.children[7].children[0].clientHeight // children[7] matches .e-gridcontent
    h1 = Math.floor(h2 / 20)
    this.pageSettings = { pageSize: h1 }
  }

  public showorhide(e: any) {
    console.log("SHOW OR HIDE: " + e)
    const checked = e.checked
    const displayname = String(e.displayname)
    if (e.type == "travel") {
      if (checked) {
        ;(this.$refs["TravelGrid"] as GridComponent).showColumns(displayname)
        ;(this.$refs["TravelGrid"] as GridComponent).autoFitColumns()
      } else {
        ;(this.$refs["TravelGrid"] as GridComponent).hideColumns(displayname)
        ;(this.$refs["TravelGrid"] as GridComponent).autoFitColumns()
      }
    }
  }

  public sortit(e: any) {
    let p = this.filteredtravel
    if (e.datatype == "Date") {
      p = Vue._.orderBy(
        p,
        function(o: any) {
          return new vm.$moment(o[e.fieldname]).format("YYYYMMDD")
        },
        e.direction
      )
    } else {
      p = Vue._.orderBy(p, e.fieldname, e.direction)
    }
    this.setFilteredTravel(p).then(function() {
      ;(vm.$refs["TravelGrid"] as GridComponent).refresh()
    })
  }
}
</script>

<style lang="scss">
.buttonrow {
  height: 50px;
}
.gridrow {
  height: calc(100vh - 200px);
}
.tableHeight {
  height: calc(100vh - 180px);
}
</style>
