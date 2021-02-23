<template>
  <b-collapse :id="'filtermenu_' + filtertype" accordion="sidebar-subaccordion" role="tabpanel" class="ml-4" @shown="onShown">
    <ul v-if="ready" class="nav">
      <li v-for="field in filterfields" :key="field" class="nav-link nav-filter-item">
        <!-- <div :style="randomstyle">{{ field.DisplayName }}</div> -->
        <div>
          <ejs-checkbox :label="field.DisplayName" :checked="field.Visible" @change="showorhide" :value="field.FieldName"></ejs-checkbox>
          <b-button size="sm" class="actionbutton float-right" :class="field.Filter ? null : 'collapsed'" :aria-expanded="field.Filter ? 'true' : 'false'" :aria-controls="getRef('collapse', field.FieldName)" @click="field.Filter = !field.Filter">
            <font-awesome-icon fas icon="filter" class="icon"></font-awesome-icon>
          </b-button>
          <b-button size="sm" class="actionbutton float-right" :class="field.Sort == 'Down' ? 'sorted' : ''" :id="getRef('sortdown', field.FieldName)" @click="sortit(field.FieldName, field.DataType, 'desc')">
            <font-awesome-icon fas icon="arrow-down" class="icon"></font-awesome-icon>
          </b-button>
          <b-button size="sm" class="actionbutton float-right" :class="field.Sort == 'Up' ? 'sorted' : ''" :id="getRef('sortup', field.FieldName)" @click="sortit(field.FieldName, field.DataType, 'asc')">
            <font-awesome-icon fas icon="arrow-up" class="icon"></font-awesome-icon>
          </b-button>
          <b-collapse class="mt-1" :id="getRef('collapse', field.FieldName)" v-model="field.Filter">
            <b-container fluid>
              <b-row class="mb-1">
                <ejs-dropdownlist v-if="field.DataType == 'Text'" v-model="field.Predicate" :dataSource="textpredicate" :fields="ddfields"></ejs-dropdownlist>
                <ejs-dropdownlist v-if="field.DataType == 'Number'" v-model="field.Predicate" :dataSource="numberpredicate" :fields="ddfields"></ejs-dropdownlist>
                <ejs-dropdownlist v-if="field.DataType == 'Date'" v-model="field.Predicate" :dataSource="datepredicate" :fields="ddfields"></ejs-dropdownlist>
              </b-row>
              <b-row v-if="field.Control == 'DropdownBox'" class="mb-1">
                <div v-if="field.DataType == 'Choice'" class="full">
                  <ejs-dropdownlist v-model="field.Selected" :dataSource="field.Options" :fields="ddfields"></ejs-dropdownlist>
                </div>
              </b-row>
              <b-row v-if="field.Control != 'DropdownBox'" class="mb-1">
                <b-form-input class="filterform" v-if="field.DataType == 'Text'" v-model="field.FilterValue"></b-form-input>
                <b-form-input class="filterform" v-if="field.DataType == 'Number'" v-model="field.FilterValue"></b-form-input>
                <ejs-datepicker v-if="field.DataType == 'Date'" v-model="field.FilterValue"></ejs-datepicker>
              </b-row>
              <b-row v-if="field.Predicate == 'B'" class="mb-1">
                <ejs-datepicker v-if="field.DataType == 'Date'" v-model="field.FilterValue2"></ejs-datepicker>
              </b-row>
              <b-row>
                <div class="full">
                  <b-button size="sm" variant="danger" :id="getRef('clear', field.FieldName)" class="float-right ml-1" @click="clearfilter(filterfields, field.FieldName)">Clear</b-button>
                  <b-button size="sm" variant="success" :id="getRef('filter', field.FieldName)" class="float-right" @click="setfilter(filterfields)">Filter</b-button>
                </div>
              </b-row>
            </b-container>
          </b-collapse>
        </div>
      </li>
      <li class="py30">
        <div class="full py30">
          <b-button size="sm" variant="danger" id="clearfilters" class="float-right ml-1" @click="clearfilters">Clear Filters</b-button>
          <b-button size="sm" variant="success" id="savefilters" class="float-right ml-1" @click="savefilters(filterfields)">Save Filters</b-button>
          <b-button size="sm" variant="primary" class="float-right" @click="loadfilter()">Filter</b-button>
        </div>
      </li>
    </ul>
  </b-collapse>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, Prop, Vue, Ref } from "vue-property-decorator"
import { namespace } from "vuex-class"
import { bus } from "../../main"
import { User } from "@/interfaces/User"
import { FilterFieldItem } from "@/interfaces/FilterFieldItem"
import { ObjectItem } from "@/interfaces/ObjectItem"

const personnel = namespace("personnel")
const travel = namespace("travel")
const users = namespace("users")

let vm: any = null

@Component({
  name: "GridFilter"
})
export default class GridFilter extends Vue {
  @Prop() filtertype!: string
  @Prop() shown!: boolean

  public ready: boolean = false

  @users.State
  public currentUser!: User

  public ddfields: ObjectItem = { text: "text", value: "value", index: "index" }
  public textpredicate: Array<ObjectItem> = [
    { text: "Select...", value: "S" },
    { text: "Starts With", value: "SW" },
    { text: "Ends With", value: "EW" },
    { text: "Contains", value: "C" },
    { text: "Equal", value: "E" },
    { text: "Not Equal", value: "NE" }
  ]
  public datepredicate: Array<ObjectItem> = [
    { text: "Select...", value: "S" },
    { text: "Greater Than", value: "GT" },
    { text: "Less Than", value: "LT" },
    { text: "Equal", value: "E" },
    { text: "Between", value: "B" }
  ]
  public numberpredicate: Array<ObjectItem> = [
    { text: "Select...", value: "S" },
    { text: "Greater Than", value: "GT" },
    { text: "Less Than", value: "LT" },
    { text: "Equal", value: "E" }
  ]

  public filterfields: Array<FilterFieldItem> = []

  @personnel.Action
  public setFilteredPersonnel!: (payload: any) => Promise<boolean>

  @travel.Action
  public setFilteredTravel!: (payload: any) => Promise<boolean>

  /* @users.Action
  public getDigest!: () => Promise<boolean> */

  @users.Action
  public updateJSONData!: (payload: any) => Promise<boolean>

  mounted() {
    vm = this
    console.log("GRIDFILTER MOUNTED: " + this.filtertype)
  }

  public getRef(text: any, idx: any) {
    return text + "_" + idx
  }

  public randomstyle() {
    const style = "background: rgb('" + Math.random() * 250 + "', '" + Math.random() * 250 + "', '" + Math.random() * 250 + "')"
    return style
  }

  public onShown() {
    console.log("SHOWN")
    // go get the filterfields based on the filtertype prop
    switch (this.filtertype) {
      case "personnel":
        this.filterfields = this.$store.state.personnel.filterfields
        break

      case "workplans":
        this.filterfields = this.$store.state.workplan.filterfields
        break

      case "travel":
        this.filterfields = this.$store.state.travel.filterfields
        break
    }
    console.log("FILTERFIELDS LOADED -- LENGTH: " + this.filterfields.length)
    if (this.filterfields.length > 0) {
      this.ready = true
    }
  }

  public showorhide(e: any) {
    console.log("SHOW OR HIDE: " + e)
    const payload: any = {}
    payload.checked = e.checked
    payload.displayname = e.event.target.labels[0].innerText
    payload.type = this.filtertype
    bus.$emit("showhide", payload)
  }

  public sortit(FieldName: any, DataType: any, Direction: string) {
    const payload: any = {}
    payload.fieldname = FieldName
    payload.datatype = DataType
    payload.direction = Direction
    payload.type = this.filtertype
    bus.$emit("sortit", payload)
    for (let i = 0; i < this.filterfields.length; i++) {
      if (this.filterfields[i].FieldName == FieldName) {
        this.filterfields[i].Sort = Direction
      }
    }
  }

  public setfilter(filterfields: Array<FilterFieldItem>) {
    console.log("FILTER: " + filterfields.length)
    let p: Array<any> = []
    switch (this.filtertype) {
      case "personnel":
        p = this.$store.state.personnel.personnel
        break

      case "workplans":
        p = this.$store.state.workplan.workplans
        break

      case "travel":
        p = this.$store.state.travel.travel
        break
    }
    for (let i = 0; i < filterfields.length; i++) {
      if (filterfields[i].Predicate !== "S") {
        if (filterfields[i].FilterValue !== "" || filterfields[i].Selected !== "S") {
          // determine what to filter based on predicate
          switch (filterfields[i].Predicate) {
            case "SW":
              // Starts With
              p = p.filter(search => Vue._.startsWith(search[filterfields[i].FieldName], filterfields[i].FilterValue))
              break

            case "EW":
              // Ends With
              p = p.filter(search => Vue._.endsWith(search[filterfields[i].FieldName], filterfields[i].FilterValue))
              break

            case "C":
              // Contains
              p = p.filter(search => Vue._.includes(search[filterfields[i].FieldName], filterfields[i].FilterValue))
              break

            case "E":
              // Equals
              if (filterfields[i].DataType == "Choice") {
                p = p.filter(search => Vue._.isEqual(search[filterfields[i].FieldName], filterfields[i].Selected))
              } else {
                if (filterfields[i].DataType == "Number") {
                  p = p.filter(search => search[filterfields[i].FieldName] == filterfields[i].FilterValue)
                } else {
                  p = p.filter(search => vm.$moment(search[filterfields[i].FieldName]).isSame(vm.$moment(filterfields[i].FilterValue), "day"))
                }
              }
              break

            case "NE":
              // Not Equals
              p = p.filter(search => Vue._.without(search[filterfields[i].FieldName], filterfields[i].FilterValue))
              break

            case "GT":
              // Greater Than
              if (filterfields[i].DataType == "Number") {
                p = p.filter(search => search[filterfields[i].FieldName] > Number(filterfields[i].FilterValue))
              } else {
                // date
                p = p.filter(search => vm.$moment(search[filterfields[i].FieldName]).isAfter(vm.$moment(filterfields[i].FilterValue)))
              }
              break

            case "LT":
              // Less Than
              if (filterfields[i].DataType == "Number") {
                p = p.filter(search => search[filterfields[i].FieldName] < Number(filterfields[i].FilterValue))
              } else {
                // date
                p = p.filter(search => vm.$moment(filterfields[i].FilterValue).isAfter(vm.$moment(search[filterfields[i].FieldName])))
              }
              break

            case "B":
              // Between
              p = p.filter(search => vm.$moment(search[filterfields[i].FieldName]).isBetween(vm.$moment(filterfields[i].FilterValue), vm.$moment(filterfields[i].FilterValue2)))
              break
          }
          if (vm.sortfield !== "") {
            // if this is a date field we need to do a bit more work to convert and test for sorting
            if (filterfields[i].DataType == "Date") {
              const f = filterfields[i].FieldName
              p = Vue._.orderBy(
                p,
                function(o) {
                  return new vm.$moment(o[f]).format("YYYYMMDD")
                },
                vm.sortdir
              )
            } else {
              p = Vue._.orderBy(p, vm.sortfield, vm.sortdir)
            }
          }
        }
      }
    }
    switch (this.filtertype) {
      case "personnel":
        vm.setFilteredPersonnel(p)
        break

      case "workplans":
        // placeholder
        break

      case "travel":
        vm.setFilteredTravel(p)
        break
    }
  }

  public clearfilter(filterfields: Array<FilterFieldItem>, filterfield: string) {
    const f = filterfield
    for (let i = 0; i < filterfields.length; i++) {
      if (filterfields[i].FieldName == f) {
        filterfields[i].Predicate = "S"
        filterfields[i].FilterValue = ""
        if (filterfields[i].DataType == "Date") {
          filterfields[i].FilterValue2 = ""
        }
        if (filterfields[i].DataType == "Choice") {
          filterfields[i].Predicate = "E"
          filterfields[i].Selected = "S"
        }
        if (filterfields[i].DataType == "Number" && filterfields[i].Control == "DropdownBox") {
          filterfields[i].Predicate = "S"
          filterfields[i].FilterValue = "S"
        }
      }
    }
    this.filterfields = filterfields
    this.setfilter(this.filterfields)
  }

  public async savefilters(filterfields: Array<FilterFieldItem>) {
    console.log("SAVING USER FILTER")
    // await this.getDigest()
    // const fields = JSON.stringify(filterfields)
    const payload: any = {}
    // does the user have any settings yet?
    const data: Array<ObjectItem> = []
    if (this.currentUser.JSONData !== undefined) {
      if (this.currentUser.JSONData.length > 0) {
        // the user has settings
        const d = this.currentUser.JSONData
        for (let i = 0; i < d.length; i++) {
          data.push({
            text: d[i].text,
            value: d[i].value
          })
        }
        // Need to determine if the user has saved the filter before. Overwrite if yes or add if no.
        let overwrite = false
        const t = this.filtertype + "_filter"
        for (let i = 0; i < data.length; i++) {
          console.log("DATA: " + data[i].text)
          if (data[i].text == t) {
            // User has filter so overwrite it
            console.log("OVERWRITE: " + t)
            overwrite = true
            data[i].value = filterfields
          }
        }
        if (overwrite == true) {
          // just send the updated data for update
        } else {
          // add the filter to the data object and send for update
          data.push({
            text: this.filtertype + "_filter",
            value: filterfields
          })
        }
      } else {
        // the user has no settings yet. TODO: Add the filter if selected and ensure all settings exist.
        console.log("CREATING JSONData:")
        data.push({
          text: this.filtertype + "_filter",
          value: filterfields
        })
      }
    } /*  else {
      console.log("CREATING JSONData:")
      data.push({
        text: this.filtertype + "_filter",
        value: filterfields
      })
    } */
    payload.itemprops = {
      __metadata: { type: "SP.Data.PersonnelListItem" },
      JSONData: JSON.stringify(data)
    }
    payload.data = data
    this.updateJSONData(payload)
  }

  public async clearFilters() {
    // TODO: Determine if the saved filter in the personnel item should be deleted or left alone so the user can load the last saved filter whenever they like.
    switch (this.filtertype) {
      case "personnel":
        this.filterfields = this.$store.state.personnel.filterfields
        break

      case "workplans":
        this.filterfields = this.$store.state.workplan.filterfields
        break

      case "travel":
        this.filterfields = this.$store.state.travel.filterfields
        break
    }
  }

  // public async loadfilter() {}
}
</script>

<style scoped></style>
