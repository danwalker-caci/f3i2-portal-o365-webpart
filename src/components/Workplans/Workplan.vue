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
          <b-row no-gutters class="buttonrow">
            <b-button id="ShowFilters" class="btn btn-warning" @click="ToggleFilters">
              Toggle Filters
            </b-button>
          </b-row>
          <b-row no-gutters class="gridrow">
            <ejs-grid
              v-if="loaded"
              id="WorkplanGrid"
              ref="WorkplanGrid"
              :dataSource="filteredworkplans"
              :allowPaging="true"
              :allowReordering="true"
              :pageSettings="pageSettings"
              :editSettings="editSettings"
              :filterSettings="filterSettings"
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
                <e-column headerText="Actions" textAlign="Left" width="100" :template="ActionsTemplate"></e-column>
                <e-column field="Title" headerText="Title" textAlign="Left" width="200"></e-column>
                <e-column field="Number" headerText="Number" width="100"></e-column>
                <e-column field="Revision" headerText="Revision" textAlign="Left" width="100"></e-column>
                <e-column field="POPStart" headerText="POP Start" textAlign="Left" width="150"></e-column>
                <e-column field="POPEnd" headerText="POP End" textAlign="Left" width="150"></e-column>
                <e-column field="Manager" headerText="Manager" textAlign="Left" width="200"></e-column>
                <e-column field="DateApproved" headerText="Date Approved" textAlign="Left" width="150"></e-column>
                <e-column field="Id" headerText="Id" :visible="false" textAlign="Left" width="40" :isPrimaryKey="true"></e-column>
                <e-column field="ManagerEmail" :visible="false" textAlign="Left" width="40"></e-column>
                <e-column field="ManagerId" :visible="false" textAlign="Left" width="40"></e-column>
                <e-column field="uri" :visible="false" textAlign="Left" width="40"></e-column>
                <e-column field="etag" :visible="false" textAlign="Left" width="40"></e-column>
              </e-columns>
            </ejs-grid>
            <b-modal id="EditModal" ref="EditModal" size="xl" centered @ok="editOk">
              <template v-slot:modal-title>Edit Work Plan</template>
              <b-container fluid>
                <table id="EditTable" class="workplantable">
                  <tbody>
                    <tr class="bg-warning text-white">
                      <th>Title</th>
                      <th>Number</th>
                      <th>Revision</th>
                      <th>POP Start</th>
                      <th>POP End</th>
                      <th>Manager</th>
                      <th>Date Approved</th>
                    </tr>
                    <tr>
                      <td class="px300"><input class="e-input" type="text" v-model="rowData.Title" /></td>
                      <td><input class="e-input" type="text" v-model="rowData.Number" /></td>
                      <td><input class="e-input" type="text" v-model="rowData.Revision" /></td>
                      <td><ejs-datepicker v-model="rowData.POPStart"></ejs-datepicker></td>
                      <td><ejs-datepicker v-model="rowData.POPEnd"></ejs-datepicker></td>
                      <td><ejs-dropdownlist id="ddManagerEdit" v-model="rowData.Manager" :dataSource="managers" :fields="ddfields"></ejs-dropdownlist></td>
                      <td><ejs-datepicker v-model="rowData.DateApproved"></ejs-datepicker></td>
                    </tr>
                  </tbody>
                </table>
              </b-container>
            </b-modal>
            <b-modal id="NewModal" ref="NewModal" size="xl" centered @ok="newOk">
              <template v-slot:modal-title>Add New Work Plan</template>
              <b-container fluid>
                <table id="NewTable" class="workplantable">
                  <tbody>
                    <tr class="bg-warning text-white">
                      <th>Title</th>
                      <th>Number</th>
                      <th>Revision</th>
                      <th>POP Start</th>
                      <th>POP End</th>
                      <th>Manager</th>
                      <th>Date Approved</th>
                    </tr>
                    <tr>
                      <td class="px300"><input class="e-input" type="text" v-model="newData.Title" /></td>
                      <td><input class="e-input" type="text" v-model="newData.Number" /></td>
                      <td><input class="e-input" type="text" v-model="newData.Revision" /></td>
                      <td><ejs-datepicker v-model="newData.POPStart"></ejs-datepicker></td>
                      <td><ejs-datepicker v-model="newData.POPEnd"></ejs-datepicker></td>
                      <td><ejs-dropdownlist id="ddManagerNew" v-model="newData.Manager" :dataSource="managers" :fields="ddfields"></ejs-dropdownlist></td>
                      <td><ejs-datepicker v-model="newData.DateApproved"></ejs-datepicker></td>
                    </tr>
                  </tbody>
                </table>
              </b-container>
            </b-modal>
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
import { namespace } from "vuex-class"
import { User } from "@/interfaces/User"
import { Notification } from "@/interfaces/Notification"
import { WorkPlanItem } from "@/interfaces/WorkPlanItem"
import { ClickEventArgs } from "@syncfusion/ej2-vue-navigations"
import { GridComponent, EditSettings, ActionEventArgs } from "@syncfusion/ej2-vue-grids"
import { Page, Edit, Toolbar, VirtualScroll, ExcelExport, DetailRow } from "@syncfusion/ej2-vue-grids"

const notify = namespace("notify")
const users = namespace("users")
const workplan = namespace("workplan")

let vm: any = null

@Component({
  provide: {
    grid: [Page, Edit, DetailRow, Toolbar, VirtualScroll, ExcelExport]
  }
})
export default class Workplan extends Vue {
  public loaded?: boolean = false

  @users.State
  public currentUser!: User

  /* @workplan.State
  public workplans!: Array<WorkPlanItem> */

  /* @workplan.State
  public filteredworkplans!: Array<WorkPlanItem> */

  @workplan.Action
  public getDigest!: () => Promise<boolean>

  @workplan.Action
  public getManagers!: () => Promise<boolean>

  @workplan.Action
  public editWorkplan!: (payload: any) => Promise<boolean>

  @workplan.Action
  public newWorkplan!: (payload: any) => Promise<boolean>

  @workplan.Action
  public getWorkplans!: () => Promise<boolean>

  @workplan.Action
  public archive!: (payload: any) => Promise<boolean>

  get Digest() {
    return this.$store.state.workplan.digest
  }

  get Loaded() {
    return this.$store.state.workplan.loaded
  }

  get workplans() {
    return this.$store.state.workplan.workplans
  }

  get filteredworkplans() {
    return this.$store.state.workplan.filteredworkplans
  }

  get isSubcontractor() {
    return this.$store.state.users.currentUser.isSubcontractor
  }

  get managers() {
    return this.$store.state.workplan.managers
  }

  @Ref("WorkplanGrid") readonly WorkplanGrid!: GridComponent

  mounted() {
    console.log("ACTIVE WORKPLANS MOUNTED")
    vm = this
    this.getDigest()
    this.getManagers().then(response => {
      this.getWorkplans().then(response => {
        vm.loaded = true
      })
    })
  }

  public ddfields?: any = { text: "text", value: "value" }
  public manager?: any | null
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
  public filterSettings = { type: "Menu" }
  public toolbar?: any = this.isSubcontractor ? ["Search"] : ["Add", "Edit", "Print", "Search", "ExcelExport"]
  public ActionsTemplate = function() {
    return {
      template: Vue.component("columnTemplate", {
        template: `
            <div>
              <b-button v-if="isWPManager" class="actionbutton" variant="danger" @click="archiveme(data)" title="Archive">
                <font-awesome-icon far icon="times-circle" class="icon"></font-awesome-icon>
              </b-button>
              <b-button :href="href" class="actionbutton ml-1" variant="success" title="Email Workplan Manager">
                <font-awesome-icon far icon="envelope" class="icon"></font-awesome-icon>
              </b-button>
            </div>`,
        data: function() {
          return {
            data: {}
          }
        },
        computed: {
          href: function() {
            return "mailto:" + this.$data.ManagerEmail
          },
          isWPManager() {
            return this.$store.state.users.currentUser.isWPManager
          }
        },
        methods: {
          archiveme: function(data: any) {
            this.$bvModal
              .msgBoxConfirm("Archive This Work Plan?", {
                title: "Please Confirm",
                size: "sm",
                buttonSize: "sm",
                okVariant: "danger",
                okTitle: "YES",
                cancelTitle: "NO",
                footerClass: "p-2",
                hideHeaderClose: false,
                centered: true
              })
              .then(value => {
                if (value == true) {
                  console.log("ARCHIVE ID: " + data.Id)
                  const payload = {
                    etag: data.etag,
                    uri: data.uri,
                    id: data.Id
                  }
                  vm.archive(payload).then((response: any) => {
                    vm.$router.push({ name: "Refresh", params: { action: "activeworkplans" } })
                  })
                }
              })
              .catch(err => {
                console.log(err)
              })
          }
        }
      })
    }
  }

  public toolbarClick(args: ClickEventArgs) {
    switch (args.item.id) {
      case "WorkplanGrid_excelexport":
        ;(this.$refs["WorkplanGrid"] as GridComponent).excelExport()
        break

      case "WorkplanGrid_print":
        ;(this.$refs["WorkplanGrid"] as GridComponent).print()
        break
    }
  }

  public actionBegin(args: ActionEventArgs) {
    switch (args.requestType) {
      case "beginEdit":
        if (!this.isSubcontractor) {
          this.editRow(args.rowData)
        }
        args.cancel = true
        break

      case "add":
        args.cancel = true
        if (!this.isSubcontractor) {
          this.$bvModal.show("NewModal")
        }
        break
    }
  }

  public actionComplete(args: ActionEventArgs) {
    if (args.requestType == "columnstate") {
      ;(this.$refs["WorkplanGrid"] as GridComponent).autoFitColumns()
    }
    if (args.requestType == "refresh") {
      let h1 = 0
      const h2 = (this.$refs["WorkplanGrid"] as GridComponent).$el.children[7].children[0].clientHeight // children[7] matches .e-gridcontent
      h1 = Math.floor(h2 / 20)
      this.pageSettings = { pageSize: h1 }
    }
  }

  public dataBound() {
    ;(this.$refs["WorkplanGrid"] as GridComponent).autoFitColumns()
    let h1 = 0
    const h2 = (this.$refs["WorkplanGrid"] as GridComponent).$el.children[7].children[0].clientHeight // children[7] matches .e-gridcontent
    h1 = Math.floor(h2 / 20)
    this.pageSettings = { pageSize: h1 }
  }

  /* public EditManagerSelected() {
    const s = String(this.rowData.Manager)
    const t = this.managers.filter((manager: { text: string }) => manager.text == s)
    this.rowData.ManagerId = t[0].value
  }

  public NewManagerSelected() {
    const s = String(this.newData.Manager)
    const t = this.managers.filter((manager: { text: string }) => manager.text == s)
    this.newData.ManagerId = t[0].value
  } */

  public editRow(data: any) {
    this.rowData = data
    this.$bvModal.show("EditModal")
  }

  public editOk(bvEvent: any) {
    bvEvent.preventDefault()
    this.editWorkplan(this.rowData).then(response => {
      console.log("editWorkplan Completed: " + response)
      vm.$router.push({ name: "Refresh", params: { action: "activeworkplans" } })
    })
  }

  public newOk() {
    this.newWorkplan(this.newData).then(response => {
      console.log("newWorkplan Completed: " + response)
      vm.$router.push({ name: "Refresh", params: { action: "activeworkplans" } })
    })
  }
}
</script>

<style lang="scss">
.buttonrow {
  height: 50px;
}
.gridrow {
  height: calc(100vh - 150px);
}
</style>
