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
          <!-- <b-row no-gutters class="buttonrow">
            <b-button id="ShowFilters" class="btn btn-warning" @click="ToggleFilters">
              Toggle Filters
            </b-button>
          </b-row> -->
          <b-row no-gutters class="gridrow">
            <ejs-grid
              v-if="loaded"
              id="RosterGrid"
              ref="RosterGrid"
              :dataSource="filteredpersonnel"
              :allowPaging="true"
              :allowReordering="true"
              :pageSettings="pageSettings"
              :editSettings="editSettings"
              :toolbar="toolbar"
              :allowExcelExport="true"
              :toolbarClick="toolbarClick"
              :dataBound="dataBound"
              :actionBegin="actionBegin"
              :actionComplete="actionComplete"
              rowHeight="20"
              height="100%"
              width="100%"
            >
              <e-columns>
                <e-column field="LastName" headerText="Last" textAlign="Left" width="100" :showInColumnChooser="false"></e-column>
                <e-column field="FirstName" headerText="First" textAlign="Left" width="100" :showInColumnChooser="false"></e-column>
                <e-column field="Middle" headerText="Middle" textAlign="Left" width="100"></e-column>
                <e-column field="Cadency" headerText="Cadency" textAlign="Left" width="100"></e-column>
                <e-column field="Position" headerText="Position" textAlign="Left" width="180"></e-column>
                <e-column field="Location" headerText="Location" textAlign="Left" width="150"></e-column>
                <e-column field="Email" headerText="Email" textAlign="Left" width="300"></e-column>
                <e-column field="Phone" headerText="Phone" textAlign="Left" width="100"></e-column>
                <e-column field="Company" headerText="Company" textAlign="Left" width="250"></e-column>
                <e-column field="SubET" headerText="Sub ET" textAlign="Left" width="100"></e-column>
                <e-column field="CACStatus" :visible="false" :showInColumnChooser="true" headerText="CAC Status" textAlign="Left" width="110"></e-column>
                <e-column field="CACRequestDate" :visible="false" :showInColumnChooser="true" headerText="CAC Req Date" textAlign="Left" width="180"></e-column>
                <e-column field="CACExpirationDate" :visible="false" :showInColumnChooser="true" headerText="CAC Exp Date" textAlign="Left" width="180"></e-column>
                <e-column field="SCIFormStatus" :visible="false" :showInColumnChooser="true" headerText="SCI Form Status" textAlign="Left" width="150"></e-column>
                <e-column field="SCIFormType" :visible="false" :showInColumnChooser="true" headerText="SCI Form Type" textAlign="Left" width="150"></e-column>
                <e-column field="SCIFormSubmitted" :visible="false" :showInColumnChooser="true" headerText="SCI Form Submitted" textAlign="Left" width="150"></e-column>
                <e-column field="PRDueDate" :visible="false" :showInColumnChooser="true" headerText="PR Due Date" textAlign="Left" width="180"></e-column>
                <e-column field="CEDate" :visible="false" :showInColumnChooser="true" headerText="CE Date" textAlign="Left" width="180"></e-column>
                <e-column field="Contact" headerText="Contact" :visible="false" textAlign="Left" width="70" :showInColumnChooser="false"></e-column>
                <e-column field="Active" headerText="Active" :visible="false" textAlign="Left" width="70" :showInColumnChooser="false"></e-column>
                <e-column field="Id" headerText="Id" :visible="false" textAlign="Left" width="40" :isPrimaryKey="true" :showInColumnChooser="false"></e-column>
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
import { PersonnelItem } from "@/interfaces/PersonnelItem"
import { ClickEventArgs } from "@syncfusion/ej2-vue-navigations"
import { GridComponent, EditSettings, ActionEventArgs } from "@syncfusion/ej2-vue-grids"
import { Page, Edit, Toolbar, VirtualScroll, ExcelExport, DetailRow } from "@syncfusion/ej2-vue-grids"

const notify = namespace("notify")
const users = namespace("users")
const personnel = namespace("personnel")

let vm: any = null

@Component({
  name: "Roster",
  provide: {
    grid: [Page, Edit, DetailRow, Toolbar, VirtualScroll, ExcelExport]
  }
})
export default class Roster extends Vue {
  public loaded?: boolean = false
  public filtereddata?: Array<PersonnelItem> = []

  @users.State
  public currentUser!: User

  @notify.Action
  public add!: (notification: Notification) => void

  @personnel.Action
  public getDigest!: () => Promise<boolean>

  @personnel.Action
  public getPersonnel!: () => Promise<boolean>

  @personnel.Action
  public setFilteredPersonnel!: (payload: any) => Promise<boolean>

  get Digest() {
    return this.$store.state.personnel.digest
  }

  get Loaded() {
    return this.$store.state.personnel.loaded
  }

  get personnel() {
    return this.$store.state.personnel.allpersonnel
  }

  get filteredpersonnel() {
    return this.$store.state.personnel.filteredpersonnel
  }

  get isSubcontractor() {
    return this.$store.state.users.currentUser.isSubcontractor
  }

  @Ref("RosterGrid") readonly RosterGrid!: GridComponent

  created() {
    bus.$on("showhide", (data: any) => {
      this.showorhide(data)
    })
    bus.$on("sortit", (data: any) => {
      this.sortit(data)
    })
  }

  mounted() {
    console.log("ROSTER MOUNTED")
    vm = this
    const notification: Notification = {
      id: 0,
      type: "success",
      title: "Getting Data",
      message: "Getting Roster. Please wait..."
    }
    this.add(notification)
    this.getDigest()
    this.getPersonnel().then(response => {
      vm.loaded = true
    })
  }

  errorCaptured(err: any, vm: any, info: any) {
    const notification: Notification = {
      id: 0,
      type: "danger",
      title: "Error in personnel.vue " + err,
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
      case "RosterGrid_excelexport":
        ;(this.$refs["RosterGrid"] as GridComponent).excelExport()
        break

      case "RosterGrid_print":
        ;(this.$refs["RosterGrid"] as GridComponent).print()
        break
    }
  }

  public actionComplete(args: ActionEventArgs) {
    if (args.requestType == "columnstate") {
      ;(this.$refs["RosterGrid"] as GridComponent).autoFitColumns()
    }
    if (args.requestType == "refresh") {
      let h1 = 0
      const h2 = (this.$refs["RosterGrid"] as GridComponent).$el.children[7].children[0].clientHeight // children[7] matches .e-gridcontent
      h1 = Math.floor(h2 / 20)
      this.pageSettings = { pageSize: h1 }
    }
  }

  public dataBound() {
    ;(this.$refs["RosterGrid"] as GridComponent).autoFitColumns()
    let h1 = 0
    const h2 = (this.$refs["RosterGrid"] as GridComponent).$el.children[7].children[0].clientHeight // children[7] matches .e-gridcontent
    h1 = Math.floor(h2 / 20)
    this.pageSettings = { pageSize: h1 }
  }

  public showorhide(e: any) {
    console.log("SHOW OR HIDE: " + e)
    const checked = e.checked
    const displayname = String(e.displayname)
    if (e.type == "personnel") {
      if (checked) {
        ;(this.$refs["RosterGrid"] as GridComponent).showColumns(displayname)
        ;(this.$refs["RosterGrid"] as GridComponent).autoFitColumns()
      } else {
        ;(this.$refs["RosterGrid"] as GridComponent).hideColumns(displayname)
        ;(this.$refs["RosterGrid"] as GridComponent).autoFitColumns()
      }
    }
  }

  public sortit(e: any) {
    let p = this.filteredpersonnel
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
    this.setFilteredPersonnel(p).then(function() {
      ;(vm.$refs["RosterGrid"] as GridComponent).refresh()
    })
  }
}
</script>

<style lang="scss">
.buttonrow {
  height: 50px;
}
.gridrow {
  height: calc(100vh - 100px);
}
</style>
