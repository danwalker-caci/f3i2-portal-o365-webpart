<template>
  <b-collapse :id="'filtermenu_' + filtertype" accordion="sidebar-subaccordion" role="tabpanel" class="ml-4" @shown="onShown">
    <ul class="nav">
      <!-- <li class="nav-item">{{ filtertype }} FILTER HERE</li> -->
      <li v-for="field in filterfields" :key="field" class="nav-link nav-filter-item">
        <div v-if="field.FieldName !== 'Version'">
          <ejs-checkbox :label="field.DisplayName" :checked="field.Visible" @change="showorhide" :value="field.FieldName"></ejs-checkbox>
          <b-button size="sm" class="actionbutton float-right" :class="field.Filter ? null : 'collapsed'" :aria-expanded="field.Filter ? 'true' : 'false'" :aria-controls="getRef('collapse', field.FieldName)" @click="field.Filter = !field.Filter">
            <font-awesome-icon fas icon="filter" class="icon"></font-awesome-icon>
          </b-button>
          <b-button size="sm" class="actionbutton float-right" :class="field.Sort == 'Down' ? 'sorted' : ''" :id="getRef('sortdown', field.FieldName)" @click="sortdown(field.FieldName, field.DataType)">
            <font-awesome-icon fas icon="arrow-down" class="icon"></font-awesome-icon>
          </b-button>
          <b-button size="sm" class="actionbutton float-right" :class="field.Sort == 'Up' ? 'sorted' : ''" :id="getRef('sortup', field.FieldName)" @click="sortup(field.FieldName, field.DataType)">
            <font-awesome-icon fas icon="arrow-up" class="icon"></font-awesome-icon>
          </b-button>
          <b-collapse class="mt-1" :id="getRef('collapse', field.FieldName)" v-model="field.Filter">
            <b-container fluid>
              <b-row class="mb-1">
                <ejs-dropdownlist v-if="field.DataType == 'Text'" v-model="field.Predicate" :dataSource="textpredicate" :fields="ddfields"></ejs-dropdownlist>
                <ejs-dropdownlist v-if="field.DataType == 'Number'" v-model="field.Predicate" :dataSource="numberpredicate" :fields="ddfields"></ejs-dropdownlist>
                <ejs-dropdownlist v-if="field.DataType == 'Date'" v-model="field.Predicate" :dataSource="datepredicate" :fields="ddfields"></ejs-dropdownlist>
              </b-row>
              <!-- <b-row v-if="field.Control == 'DropdownBox'" class="mb-1">
                <div v-if="field.DataType == 'Choice'" class="full">
                  <ejs-dropdownlist v-if="field.DropdownSource === 'status'" v-model="field.Selected" :dataSource="status" :fields="ddfields"></ejs-dropdownlist>
                </div>
              </b-row> -->
              <b-row v-if="field.Control == 'DropdownBox'" class="mb-1">
                <div v-if="field.DataType == 'Choice'" class="full">
                  <!-- <ejs-dropdownlist v-if="field.DropdownSource === 'status'" v-model="field.Selected" :dataSource="status" :fields="ddfields"></ejs-dropdownlist> -->
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
                  <b-button size="sm" variant="danger" :id="getRef('clear', field.FieldName)" class="float-right ml-1" @click="clearfilter">Clear</b-button>
                  <b-button size="sm" variant="success" :id="getRef('filter', field.FieldName)" class="float-right" @click="setfilter">Filter</b-button>
                </div>
              </b-row>
            </b-container>
          </b-collapse>
        </div>
      </li>
      <li class="py30">
        <div class="full py30">
          <b-button size="sm" variant="danger" id="clearfilters" class="float-right ml-1" @click="clearfilters">Clear Filters</b-button>
          <b-button size="sm" variant="success" id="savefilters" class="float-right" @click="savefilters">Save Filters</b-button>
        </div>
      </li>
    </ul>
  </b-collapse>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, Prop, Vue, Ref } from "vue-property-decorator"
// import { namespace } from "vuex-class"
import { bus } from "../../main"
import { FilterFieldItem } from "@/interfaces/FilterFieldItem"
import { ObjectItem } from "@/interfaces/ObjectItem"

@Component({
  name: "GridFilter"
})
export default class GridFilter extends Vue {
  @Prop() filtertype!: string
  @Prop() shown!: boolean

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

  public filterfields?: Array<FilterFieldItem> = []

  mounted() {
    console.log("FILTER MOUNTED")
  }

  updated() {
    console.log("FILTER UPDATED: " + this.shown)
  }

  public getRef(text: any, idx: any) {
    return text + "_" + idx
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
    }
  }

  public showorhide(e: any) {
    console.log("SHOW OR HIDE: " + e)
    const payload: any = {}
    payload.checked = e.checked
    payload.displayname = e.event.target.labels[0].innerText

    switch (this.filtertype) {
      case "personnel":
        payload.type = "personnel"
        bus.$emit("showhide", payload)
        break

      case "workplans":
        payload.type = "workplan"
        bus.$emit("showhide", payload)
        break
    }
  }
}
</script>

<style scoped></style>
