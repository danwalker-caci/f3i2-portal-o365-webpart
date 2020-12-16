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
      <b-modal ref="FilterModal" id="FilterModal" size="sm" no-fade modal-class="animated bounceInLeft">
        <template v-slot:modal-title>Manning Filter</template>
        <div>
          <ul id="ulFields">
            <li v-for="field in fields" :key="field">
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
        </div>
      </b-modal>
      <b-col cols="12" class="m-0 p-0">
        <b-container fluid class="contentHeight m-0 p-0">
          <!-- <b-row no-gutters class="buttonrow">
            <b-button id="ShowFilters" class="btn btn-warning" @click="ToggleFilters">
              Toggle Filters
            </b-button>
          </b-row> -->
          <b-row no-gutters class="gridrow">
            <ejs-grid
              id="ManningGrid"
              ref="ManningGrid"
              :enablePersistence="false"
              :dataSource="filtereddata"
              :allowPaging="true"
              :allowReordering="true"
              :pageSettings="pageSettings"
              :editSettings="editSettings"
              :filterSettings="filterSettings"
              :toolbar="toolbar"
              :allowExcelExport="true"
              :toolbarClick="toolbarClick"
              :actionBegin="actionBegin"
              :actionComplete="actionComplete"
              rowHeight="20"
              height="100%"
              width="100%"
            >
              <e-columns>
                <!-- <e-column :allowEditing="false" headerText="Actions" textAlign="Left" width="100" :template="ActionsTemplate"></e-column> -->
                <e-column field="Title" headerText="Title" textAlign="Left" width="300"></e-column>
                <e-column field="Number" headerText="Number" width="100"></e-column>
                <e-column field="MasterEffort" headerText="Master Effort" textAlign="Left" width="200" :edit="MEParams"></e-column>
                <e-column field="SubEffort" headerText="Sub Effort" width="200" :edit="SEParams"></e-column>
                <e-column field="FunctionalManager" headerText="Func. Manager" textAlign="Left" width="200"></e-column>
                <e-column field="EmployeeID" :visible="false" headerText="EmployeeID" width="100"></e-column>
                <e-column field="Last" :allowEditing="false" headerText="Last" textAlign="Left" width="100"></e-column>
                <e-column field="First" :allowEditing="false" headerText="First" width="100"></e-column>
                <e-column field="Middle" :allowEditing="false" headerText="Middle" textAlign="Left" width="100"></e-column>
                <e-column field="FullBurdenedCost" headerText="FullBurdenedCost" textAlign="Left" width="100"></e-column>
                <e-column field="Location" :allowEditing="false" headerText="Location" textAlign="Left" width="150"></e-column>
                <e-column field="Email" :allowEditing="false" :visible="false" headerText="Email" textAlign="Left" width="200"></e-column>
                <e-column field="Company" :allowEditing="false" headerText="Company" textAlign="Left" width="180"></e-column>
                <e-column field="PercentSupport" headerText="Percent Support" textAlign="Left" width="150" :edit="PSParams"></e-column>
                <e-column field="StartDate" :allowEditing="false" headerText="Start Date" textAlign="Left" width="140" type="date" format="yMd"></e-column>
                <e-column field="EndDate" :allowEditing="false" headerText="End Date" textAlign="Left" width="140" type="date" format="yMd"></e-column>
                <e-column field="Id" headerText="Id" :visible="false" textAlign="Left" width="40" :isPrimaryKey="true"></e-column>
              </e-columns>
            </ejs-grid>
          </b-row>
          <b-row no-gutters class="bg-warning buttonrow">
            <b-col cols="4" class="p-0 text-left"></b-col>
            <b-col cols="4" class="p-0 text-center"></b-col>
            <b-col cols="4" class="p-0 mt-2 text-right">
              <b-button variant="danger" ref="btnCancel" class="mr-1" @click="FormCancel">Cancel</b-button>
              <b-button variant="success" ref="btnSave" class="mr-2" @click="FormSave">Save</b-button>
            </b-col>
          </b-row>
        </b-container>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"

@Component
export default class Manning extends Vue {}
</script>

<style scoped></style>
