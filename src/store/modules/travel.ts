/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators"
import { TravelItem } from "@/interfaces/TravelItem"
import { FilterFieldItem } from "@/interfaces/FilterFieldItem"
import { ObjectItem } from "@/interfaces/ObjectItem"
import axios from "axios"
import moment from "moment"
import _ from "lodash"

declare const _spPageContextInfo: any
const baseUrl = _spPageContextInfo.webAbsoluteUrl
const turl = baseUrl + "/_api/lists/getbytitle('Travel')/items" // ?$select=*&$orderby=Id desc" [turl == base travel url]
const surl = baseUrl + "/_api/SP.Utilities.Utility.SendEmail" // Email utility not based on list/library so always the same

//#region FUNCTIONS

function formatTravel(j: any): Array<TravelItem> {
  const p: Array<TravelItem> = []
  for (let i = 0; i < j.length; i++) {
    let start = moment(j[i]["StartDate"]).isValid() ? moment(j[i]["StartDate"]) : ""
    let end = moment(j[i]["EndDate"]).isValid() ? moment(j[i]["EndDate"]) : ""
    let actioncompleted = moment(j[i]["SecurityActionCompleted"]).isValid() ? moment(j[i]["SecurityActionCompleted"]) : ""
    let approvedon = moment(j[i]["OCONUSApprovedOn"]).isValid() ? moment(j[i]["OCONUSApprovedOn"]) : ""
    let offset = moment().utcOffset()
    offset = offset * -1
    if (offset === 240) {
      offset = 300
    } // weird DST quirk
    start = String(j[i]["StartDate"])
    end = String(j[i]["EndDate"])
    let created = String(j[i]["Created"])
    start = moment(start)
      .utc()
      .add(offset, "m")
      .format()
    end = moment(end)
      .utc()
      .add(offset, "m")
      .format()
    created = moment(created)
      .utc()
      .add(offset, "m")
      .format()
    if (actioncompleted != "") {
      actioncompleted = moment(created)
        .utc()
        .add(offset, "m")
        .format()
    }
    if (approvedon != "") {
      approvedon = moment(created)
        .utc()
        .add(offset, "m")
        .format()
    }
    p.push({
      Id: Number(j[i]["Id"]),
      Subject: j[i]["Title"] !== null ? String(j[i]["Title"]) : "",
      Status: j[i]["Status"] !== null ? String(j[i]["Status"]) : "",
      Created: created,
      StartTime: start,
      EndTime: end,
      WorkPlan: j[i]["WorkPlan"] !== null ? String(j[i]["WorkPlan"]) : "",
      WorkPlanText: j[i]["WorkPlanText"] !== null ? String(j[i]["WorkPlanText"]) : "",
      WorkPlanNumber: j[i]["WorkPlanNumber"] !== null ? String(j[i]["WorkPlanNumber"]) : "",
      OCONUS: j[i]["OCONUS"] !== null ? String(j[i]["OCONUS"]) : "",
      OCONUSLocation: j[i]["OCONUSLocation"] !== null ? String(j[i]["OCONUSLocation"]) : "",
      OCONUSApprovedBy: j[i]["OCONUSApprovedBy"] !== null ? String(j[i]["OCONUSApprovedBy"]) : "",
      OCONUSApprovedOn: approvedon,
      OCONUSApprovedEmail: j[i]["OCONUSApprovedEmail"] !== null ? String(j[i]["OCONUSApprovedEmail"]) : "",
      PreApproved: j[i]["PreApproved"] !== null ? String(j[i]["PreApproved"]) : "",
      Company: j[i]["Company"] !== null ? String(j[i]["Company"]) : "",
      TravelFrom: j[i]["TravelFrom"] !== null ? String(j[i]["TravelFrom"]) : "",
      TravelTo: j[i]["TravelTo"] !== null ? String(j[i]["TravelTo"]) : "",
      Travelers: j[i]["Travelers"] !== null ? String(j[i]["Travelers"]) : "",
      TravelersText: j[i]["Travelers"] !== null ? String(j[i]["TravelersText"]) : "",
      Sponsor: j[i]["Sponsor"] !== null ? String(j[i]["Sponsor"]) : "",
      POCName: j[i]["POCName"] !== null ? String(j[i]["POCName"]) : "",
      POCEmail: j[i]["POCEmail"] !== null ? String(j[i]["POCEmail"]) : "",
      POCPhone: j[i]["POCPhone"] !== null ? String(j[i]["POCPhone"]) : "",
      Comments: j[i]["Comments"] !== null ? String(j[i]["Comments"]) : "",
      Clearance: j[i]["Clearance"] !== null ? String(j[i]["Clearance"]) : "",
      InternalData: j[i]["InternalData"] !== null ? String(j[i]["InternalData"]) : "",
      VisitRequest: j[i]["VisitRequest"] === "Yes" ? "Yes" : "No",
      SecurityAction: j[i]["SecurityAction"] !== null ? String(j[i]["SecurityAction"]) : "",
      SecurityActionCompleted: actioncompleted,
      EstimatedCost: j[i]["EstimatedCost"] !== null ? Number(String(j[i]["EstimatedCost"])) : 0,
      IndexNumber: j[i]["IndexNumber"] !== null ? String(j[i]["IndexNumber"]) : "",
      Title: j[i]["IndexNumber"] + "-" + j[i]["Title"],
      TripReport: j[i]["TripReport"] !== null ? String(j[i]["TripReport"]["Description"]) : "",
      TripReportLink: j[i]["TripReport"] !== null ? String(j[i]["TripReport"]["Url"]) : "",
      etag: j[i]["__metadata"]["etag"],
      uri: j[i]["__metadata"]["uri"]
    })
  }
  return p
}

function getOptions(j: any, field: string): Array<ObjectItem> {
  let fake: Array<any> = []
  const opts: Array<ObjectItem> = []
  for (let i = 0; i < j.length; i++) {
    const val = j[i][field]
    if (!_.includes(fake, val)) {
      fake.push(val)
    }
  }
  fake = _.uniq(fake)
  fake = _.orderBy(fake, [f => f.toLowerCase()], ["asc"])
  for (let i = 0; i < fake.length; i++) {
    opts.push({
      text: fake[i],
      value: fake[i]
    })
  }
  opts.unshift({
    text: "Select...",
    value: "S"
  })
  return opts
}

//#endregion FUNCTIONS

@Module({ namespaced: true })
class Travel extends VuexModule {
  // #region  STATE
  public digest?: string = ""
  public loaded = false
  public travel: Array<TravelItem> = []
  public filteredtravel: Array<TravelItem> = []
  public companies: Array<ObjectItem> = []

  public status: Array<ObjectItem> = [
    { text: "Select...", value: "S" },
    { text: "WPMReview", value: "WPMReview" },
    { text: "Approved", value: "Approved" },
    { text: "Rejected", value: "Rejected" },
    { text: "Trip Report Late", value: "ReportLate" },
    { text: "Trip Report Due", value: "ReportDue" },
    { text: "Trip Report Review", value: "TripReportReview" },
    { text: "AFRLReview", value: "AFRLReview" },
    { text: "ATPRequested", value: "ATPRequested" },
    { text: "ATPApproved", value: "ATPApproved" },
    { text: "Completed", value: "Completed" },
    { text: "Postponed", value: "Postponed" },
    { text: "Cancelled", value: "Cancelled" }
  ]

  public clearance: Array<ObjectItem> = [
    { text: "Select...", value: "S" },
    { text: "None", value: "None" },
    { text: "S", value: "S" },
    { text: "TS", value: "TS" },
    { text: "TS/SCI", value: "TS/SCI" }
  ]

  public olocation: Array<ObjectItem> = [
    { text: "Select...", value: "S" },
    { text: "Germany", value: "Germany" },
    { text: "Korea", value: "Korea" },
    { text: "Other", value: "Other" }
  ]

  public securityaction: Array<ObjectItem> = [
    { text: "Select...", value: "S" },
    { text: "Collateral VR Sent", value: "Collateral VR Sent" },
    { text: "SCI VR Sent", value: "SCI VR Sent" },
    { text: "Verified VR Processed in JPAS", value: "Verified VR Processed in JPAS" },
    { text: "Contacted Sub FSO", value: "Contacted Sub FSO" }
  ]

  public yesno: Array<ObjectItem> = [
    { text: "Select...", value: "S" },
    { text: "Yes", value: "Yes" },
    { text: "No", value: "No" }
  ]

  public filterfields: Array<FilterFieldItem> = [
    {
      FieldName: "Status",
      Visible: false,
      DisplayName: "Status",
      Filter: false,
      Control: "DropdownBox",
      DataType: "Choice",
      Selected: "S",
      Predicate: "E",
      FilterValue: "",
      Sort: "",
      Options: this.status
    },
    {
      FieldName: "Comments",
      Visible: true,
      DisplayName: "Purpose",
      Filter: false,
      Control: "",
      DataType: "Text",
      Predicate: "S",
      FilterValue: "",
      Sort: ""
    },
    {
      FieldName: "WorkPlanNumber",
      Visible: true,
      DisplayName: "Workplan Number",
      Filter: false,
      Control: "",
      DataType: "Text",
      Predicate: "S",
      FilterValue: "",
      Sort: ""
    },
    {
      FieldName: "WorkPlanText",
      Visible: true,
      DisplayName: "Workplan Name",
      Filter: false,
      Control: "",
      DataType: "Text",
      Predicate: "S",
      FilterValue: "",
      Sort: ""
    },
    {
      FieldName: "IndexNumber",
      Visible: true,
      DisplayName: "Index Number",
      Filter: false,
      Control: "",
      DataType: "Number",
      Predicate: "S",
      FilterValue: "",
      Sort: ""
    },
    {
      FieldName: "Created",
      Visible: true,
      DisplayName: "Travel Requested",
      Filter: false,
      Control: "",
      DataType: "Date",
      Predicate: "S",
      FilterValue: "",
      FilterValue2: "",
      Sort: ""
    },
    {
      FieldName: "StartDate",
      Visible: true,
      DisplayName: "Departure Date",
      Filter: false,
      Control: "",
      DataType: "Date",
      Predicate: "S",
      FilterValue: "",
      FilterValue2: "",
      Sort: ""
    },
    {
      FieldName: "EndDate",
      Visible: true,
      DisplayName: "Return Date",
      Filter: false,
      Control: "",
      DataType: "Date",
      Predicate: "S",
      FilterValue: "",
      FilterValue2: "",
      Sort: ""
    },
    {
      FieldName: "Company",
      Visible: true,
      DisplayName: "Company",
      Filter: false,
      Control: "DropdownBox",
      DataType: "Choice",
      DropdownSource: "companies",
      Selected: "S",
      Predicate: "E",
      FilterValue: "",
      Sort: "",
      Options: []
    },
    {
      FieldName: "Sponsor",
      Visible: true,
      DisplayName: "Sponsor",
      Filter: false,
      Control: "",
      DataType: "Text",
      Predicate: "S",
      FilterValue: "",
      Sort: ""
    },
    {
      FieldName: "EstimatedCost",
      Visible: true,
      DisplayName: "Est Cost",
      Filter: false,
      Control: "",
      DataType: "Number",
      Predicate: "S",
      FilterValue: "",
      Sort: ""
    },
    {
      FieldName: "PreApproved",
      Visible: true,
      DisplayName: "Pre Approved",
      Filter: false,
      Control: "DropdownBox",
      DataType: "Choice",
      Selected: "S",
      Predicate: "E",
      FilterValue: "",
      Sort: "",
      Options: this.yesno
    },
    {
      FieldName: "VisitRequest",
      Visible: true,
      DisplayName: "Visit Request",
      Filter: false,
      Control: "DropdownBox",
      DataType: "Choice",
      DropdownSource: "yesno",
      Selected: "S",
      Predicate: "E",
      FilterValue: "",
      Sort: "",
      Options: this.yesno
    },
    {
      FieldName: "Clearance",
      Visible: true,
      DisplayName: "Clearance",
      Filter: false,
      Control: "DropdownBox",
      DataType: "Choice",
      DropdownSource: "clearance",
      Selected: "S",
      Predicate: "E",
      FilterValue: "",
      Sort: "",
      Options: this.clearance
    },
    {
      FieldName: "OCONUS",
      Visible: true,
      DisplayName: "OCONUS",
      Filter: false,
      Control: "DropdownBox",
      DataType: "Choice",
      DropdownSource: "yesno",
      Selected: "S",
      Predicate: "E",
      FilterValue: "",
      Sort: "",
      Options: this.yesno
    },
    {
      FieldName: "OCONUSLocation",
      Visible: true,
      DisplayName: "OCONUS Location",
      Filter: false,
      Control: "DropdownBox",
      DataType: "Choice",
      DropdownSource: "olocations",
      Selected: "S",
      Predicate: "E",
      FilterValue: "",
      Sort: "",
      Options: this.olocation
    },
    {
      FieldName: "OCONUSApprovedBy",
      Visible: true,
      DisplayName: "OCONUS Approved By",
      Filter: false,
      Control: "",
      DataType: "Text",
      Predicate: "S",
      FilterValue: "",
      Sort: ""
    },
    {
      FieldName: "OCONUSApprovedOn",
      Visible: true,
      DisplayName: "OCONUS Approved Date",
      Filter: false,
      Control: "",
      DataType: "Date",
      Predicate: "S",
      FilterValue: "",
      FilterValue2: "",
      Sort: ""
    },
    {
      FieldName: "TravelFrom",
      Visible: true,
      DisplayName: "Travel From",
      Filter: false,
      Control: "",
      DataType: "Text",
      Predicate: "S",
      FilterValue: "",
      Sort: ""
    },
    {
      FieldName: "TravelTo",
      Visible: true,
      DisplayName: "Travel To",
      Filter: false,
      Control: "",
      DataType: "Text",
      Predicate: "S",
      FilterValue: "",
      Sort: ""
    },
    {
      FieldName: "POCName",
      Visible: true,
      DisplayName: "POC Name",
      Filter: false,
      Control: "",
      DataType: "Text",
      Predicate: "S",
      FilterValue: "",
      Sort: ""
    },
    {
      FieldName: "POCEmail",
      Visible: true,
      DisplayName: "POC Email",
      Filter: false,
      Control: "",
      DataType: "Text",
      Predicate: "S",
      FilterValue: "",
      Sort: ""
    },
    {
      FieldName: "POC Phone",
      Visible: true,
      DisplayName: "POC Phone",
      Filter: false,
      Control: "",
      DataType: "Text",
      Predicate: "S",
      FilterValue: "",
      Sort: ""
    },
    {
      FieldName: "SecurityAction",
      Visible: true,
      DisplayName: "Security Action",
      Filter: false,
      Control: "DropdownBox",
      DataType: "Choice",
      DropdownSource: "actions",
      Selected: "S",
      Predicate: "E",
      FilterValue: "",
      Sort: "",
      Options: this.securityaction
    },
    {
      FieldName: "SecurityActionCompleted",
      Visible: true,
      DisplayName: "Security Action Completed",
      Filter: false,
      Control: "",
      DataType: "Date",
      Predicate: "S",
      FilterValue: "",
      FilterValue2: "",
      Sort: ""
    }
  ]
  // #endregion STATE

  // #region  GETTERS  [TODO: Validate need for getters]
  get allTravel() {
    return this.travel
  }

  get FilteredTravel() {
    return this.filteredtravel
  }

  get Loaded() {
    return this.loaded
  }

  get Digest() {
    return this.digest
  }
  // #endregion GETTERS

  //#region MUTATIONS
  @Mutation updateLoaded(loaded: boolean): void {
    this.loaded = loaded
  }
  @Mutation updateDigest(digest: string): void {
    this.digest = digest
  }

  @Mutation
  public updateTravel(travel: Array<TravelItem>): void {
    console.log("MUTATION updateTravel called with: " + travel.length + ", " + typeof travel)
    this.travel = travel
  }

  @Mutation
  public updatefilteredTravel(travel: Array<TravelItem>): void {
    this.filteredtravel = travel
  }

  @Mutation
  public updateCompanies(companies: Array<ObjectItem>): void {
    this.companies = companies
    this.filterfields[8].Options = companies
  }

  //#endregion MUTATIONS

  //#region ACTIONS
  @Action
  public async getDigest(): Promise<boolean> {
    console.log("getDigest baseUrl: " + baseUrl)
    const response = await axios.request({
      url: baseUrl + "/_api/contextinfo",
      method: "POST",
      headers: { Accept: "application/json; odata=verbose" }
    })
    this.context.commit("updateDigest", response.data.d.GetContextWebInformation.FormDigestValue)
    return true
  }

  @Action
  public async getTravel(payload: any): Promise<boolean> {
    this.context.commit("updateLoaded", false)
    let allTravel: any[] = []
    let p: Array<TravelItem> = []
    let c: Array<ObjectItem> = []
    this.context.commit("updateCompanies", c) // ensure empty collection
    const that = this
    async function getAllTravel(url: string): Promise<void> {
      // console.log("Travel URL: " + turl)
      if (url === "") {
        url = turl + payload.query // "?$select=*&$orderby=Id desc"
      }
      const response = await axios.get(url, {
        headers: {
          accept: "application/json;odata=verbose"
        }
      })
      allTravel = allTravel.concat(response.data.d.results)
      // recursively load items if there is a next result
      if (response.data.d.__next) {
        url = response.data.d.__next
        return getAllTravel(url)
      } else {
        // call a function from here?
        p = formatTravel(allTravel)
        c = getOptions(allTravel, "Company")
        that.context.commit("updateCompanies", c)
        that.context.commit("updateTravel", p)
        that.context.commit("updatefilteredTravel", p) // initial set flltered travel as all travel
        that.context.commit("updateLoaded", true)
      }
    }
    getAllTravel("")
    return true
  }

  @Action
  public async getFilteredTravel(payload: any): Promise<boolean> {
    this.context.commit("updateLoaded", false)
    let allFilteredTravel: any[] = []
    async function getAllFilteredTravel(turl: string): Promise<void> {
      // console.log("Travel URL: " + turl)
      if (turl === "") {
        turl = payload.url
      }
      const response = await axios.get(turl, {
        headers: {
          accept: "application/json;odata=verbose"
        }
      })
      const results = response.data.d.results
      allFilteredTravel = allFilteredTravel.concat(results)
      // recursively load items if there is a next result
      if (response.data.d.__next) {
        turl = response.data.d.__next
        return getAllFilteredTravel(turl)
      } else {
        // just a placeholder here. Once the recursion completes the rest of the code will run.
      }
    }
    getAllFilteredTravel("")
    this.context.commit("updatefilteredTravel", allFilteredTravel) // initial set flltered travel as all travel
    this.context.commit("updateLoaded", true)
    return true
  }

  @Action
  public async setFilteredTravel(travel: any): Promise<boolean> {
    this.context.commit("updatefilteredTravel", travel)
    return true
  }

  //#endregion ACTIONS
}
export default Travel
