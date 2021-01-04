/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-unused-vars */
// import lodash from "lodash"
import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators"
import { PersonnelItem } from "@/interfaces/PersonnelItem"
import { FilterFieldItem } from "@/interfaces/FilterFieldItem"
import { ObjectItem } from "@/interfaces/ObjectItem"
import axios from "axios"
import moment from "moment"
import _ from "lodash"

declare const _spPageContextInfo: any
const baseUrl = _spPageContextInfo.webAbsoluteUrl
let geturl = baseUrl + "/_api/lists/getbytitle('Personnel')/items?$select=*&$orderby=Title"
geturl += "&$filter=((Active eq 1) and (OData__ModerationStatus eq 0))"
let curl = baseUrl + "/_api/lists/getbytitle('Personnel')/items?$select=*&$orderby=ContactOrder"
const zurl = baseUrl + "/_api/lists/getbytitle('Personnel')/items?$select=*&$filter=(Company eq '"
curl += "&$filter=(Contact eq 1)"
let url = baseUrl + "/_api/lists/getbytitle('Personnel')/items"
const surl = baseUrl + "/_api/SP.Utilities.Utility.SendEmail"
const gpbidurl = baseUrl + "/_api/lists/getbytitle('Personnel')/items?$select=*,UserAccount/Title,UserAccount/Id&$expand=UserAccount&$filter=(UserAccount/Id eq "

//#region FUNCTIONS
function formatPersonnel(j: any): Array<PersonnelItem> {
  console.log("Formatting Personnel: " + j.length)
  const p: Array<PersonnelItem> = []
  for (let i = 0; i < j.length; i++) {
    p.push({
      Id: Number(j[i]["Id"]),
      // Contact: j[i]["Contact"] == true ? "Yes" : "No",
      // WPData: j[i]["WPData"] != undefined || j[i]["WPData"] != null ? "" : JSON.parse(j[i]["WPData"]),
      // Active: j[i]["Active"] == true ? "Yes" : "No",
      LastName: j[i]["Title"],
      FirstName: j[i]["FirstName"],
      Middle: j[i]["Middle"],
      Cadency: j[i]["Cadency"],
      Position: j[i]["Position"],
      Location: j[i]["Location"],
      Email: j[i]["Email"],
      Phone: j[i]["Phone"],
      Company: j[i]["Company"],
      SubET: j[i]["SubET"],
      CACStatus: j[i]["CACStatus"],
      CACRequestDate: moment(j[i]["CACRequestDate"]).isValid() ? String(moment(j[i]["CACRequestDate"]).format("MM/DD/YYYY")) : "", // date as string
      CACExpirationDate: moment(j[i]["CACExpirationDate"]).isValid() ? String(moment(j[i]["CACExpirationDate"]).format("MM/DD/YYYY")) : "", // date as string
      SCIFormStatus: j[i]["SCIFormStatus"],
      SCIFormType: j[i]["SCIFormType"],
      SCIFormSubmitted: moment(j[i]["SCIFormSubmitted"]).isValid() ? String(moment(j[i]["SCIFormSubmitted"]).format("MM/DD/YYYY")) : "", // date as string
      PRDueDate: moment(j[i]["PRDueDate"]).isValid() ? String(moment(j[i]["PRDueDate"]).format("MM/DD/YYYY")) : "", // date as string
      CEDate: moment(j[i]["CEDate"]).isValid() ? String(moment(j[i]["CEDate"]).format("MM/DD/YYYY")) : "", // date as string
      ModifiedBy: j[i]["ModifiedBy"],
      Modification: j[i]["Modification"],
      ModDeniedReason: j[i]["ModDeniedReason"],
      SubContractorModifier: j[i]["SubContractorModifier"],
      etag: j[i]["__metadata"]["etag"],
      uri: j[i]["__metadata"]["uri"]
    })
  }
  return p
}

function formatPerson(j: any): any {
  const p: any = {}
  p.Id = Number(j["Id"])
  p.Contact = j["Contact"] == true ? "Yes" : "No"
  p.WPData = j["WPData"] != undefined || j["WPData"] != null ? "" : JSON.parse(j["WPData"])
  p.Active = j["Active"] == true ? "Yes" : "No"
  p.LastName = j["Title"] // This is the Title column in SharePoint
  p.FirstName = j["FirstName"]
  p.Middle = j["Middle"]
  p.Cadency = j["Cadency"]
  p.Position = j["Position"]
  p.Location = j["Location"]
  p.Email = j["Email"]
  p.Phone = j["Phone"]
  p.Company = j["Company"]
  p.SubET = j["SubET"]
  p.CACStatus = j["CACStatus"]
  p.CACRequestDate = moment(j["CACRequestDate"]).isValid() ? String(moment(j["CACRequestDate"]).format("MM/DD/YYYY")) : "" // date as string
  p.CACExpirationDate = moment(j["CACExpirationDate"]).isValid() ? String(moment(j["CACExpirationDate"]).format("MM/DD/YYYY")) : "" // date as string
  p.SCIFormStatus = j["SCIFormStatus"]
  p.SCIFormType = j["SCIFormType"]
  p.SCIFormSubmitted = moment(j["SCIFormSubmitted"]).isValid() ? String(moment(j["SCIFormSubmitted"]).format("MM/DD/YYYY")) : "" // date as string
  p.PRDueDate = moment(j["PRDueDate"]).isValid() ? String(moment(j["PRDueDate"]).format("MM/DD/YYYY")) : "" // date as string
  p.CEDate = moment(j["CEDate"]).isValid() ? String(moment(j["CEDate"]).format("MM/DD/YYYY")) : "" // date as string
  p.ModifiedBy = j["ModifiedBy"]
  p.Modification = j["Modification"]
  p.ModDeniedReason = j["ModDeniedReason"]
  p.SubContractorModifier = j["SubContractorModifier"]
  p.etag = j["__metadata"]["etag"]
  p.uri = j["__metadata"]["uri"]
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
class Personnel extends VuexModule {
  // #region  STATE
  public digest?: string = ""
  public loaded = false
  public dropdown: any = []
  public allpersonnel: Array<PersonnelItem> = []
  public filteredpersonnel: Array<PersonnelItem> = []
  public person: any = {} // would be assigned as a single PersonnelItem
  public companies: Array<ObjectItem> = []

  public subet: Array<ObjectItem> = [
    { text: "Select...", value: "S" },
    { text: "N/A", value: "N/A" },
    { text: "Existing", value: "Existing" },
    { text: "Required", value: "Required" },
    { text: "Terminated", value: "Terminated" }
  ]
  public cacstatus: Array<ObjectItem> = [
    { text: "Select...", value: "S" },
    { text: "Not Required", value: "Not Required" },
    { text: "Pending Info", value: "Pending Info" },
    { text: "CACI Review", value: "CACI Review" },
    { text: "Requested", value: "Requested" },
    { text: "Renewal", value: "Renewal" },
    { text: "Issued", value: "Issued" },
    { text: "Issuance Cancelled", value: "Issuance Cancelled" },
    { text: "Return Pending", value: "Return Pending" },
    { text: "Disposition-Returned", value: "Disposition-Returned" },
    { text: "Disposition-Transferred", value: "Disposition-Transferred" },
    { text: "Non-F3I2 CAC", value: "Non-F3I2 CAC" }
  ]
  public formstatus: Array<ObjectItem> = [
    { text: "Select...", value: "S" },
    { text: "Not Required", value: "Not Required" },
    { text: "Pending Info", value: "Pending Info" },
    { text: "CACI Review", value: "CACI Review" },
    { text: "Submitted", value: "Submitted" },
    { text: "SSO Processed", value: "SSO Processed" },
    { text: "Debrief Notification Submitted", value: "Debrief Notification Submitted" },
    { text: "Disposition-Transfer", value: "Disposition-Transfer" },
    { text: "Disposition-Debriefed", value: "Disposition-Debriefed" }
  ]
  public formtype: Array<ObjectItem> = [
    { text: "Select...", value: "S" },
    { text: "N/A", value: "N/A" },
    { text: "Nomination", value: "Nomination" },
    { text: "Transfer", value: "Transfer" }
  ]
  public filterfields: Array<FilterFieldItem> = [
    {
      FieldName: "LastName",
      Visible: true,
      DisplayName: "Last",
      Filter: false,
      DataType: "Text",
      Selected: "S",
      Predicate: "E",
      FilterValue: "",
      Sort: ""
    },
    {
      FieldName: "FirstName",
      Visible: true,
      DisplayName: "First",
      Filter: false,
      DataType: "Text",
      Predicate: "S",
      FilterValue: "",
      Sort: ""
    },
    {
      FieldName: "Middle",
      Visible: true,
      DisplayName: "Middle",
      Filter: false,
      DataType: "Text",
      Predicate: "S",
      FilterValue: "",
      Sort: ""
    },
    {
      FieldName: "Cadency",
      Visible: true,
      DisplayName: "Cadency",
      Filter: false,
      DataType: "Text",
      Predicate: "S",
      FilterValue: "",
      Sort: ""
    },
    {
      FieldName: "Position",
      Visible: true,
      DisplayName: "Position",
      Filter: false,
      DataType: "Text",
      Predicate: "S",
      FilterValue: "",
      Sort: ""
    },
    {
      FieldName: "Location",
      Visible: true,
      DisplayName: "Location",
      Filter: false,
      DataType: "Text",
      Predicate: "S",
      FilterValue: "",
      Sort: ""
    },
    {
      FieldName: "Email",
      Visible: true,
      DisplayName: "Email",
      Filter: false,
      DataType: "Text",
      Predicate: "S",
      FilterValue: "",
      Sort: ""
    },
    {
      FieldName: "Phone",
      Visible: true,
      DisplayName: "Phone",
      Filter: false,
      DataType: "Text",
      Predicate: "S",
      FilterValue: "",
      Sort: ""
    },
    {
      FieldName: "Company",
      Visible: true,
      DisplayName: "Company",
      Filter: false,
      Control: "DropdownBox",
      DataType: "Choice",
      Selected: "S",
      Predicate: "E",
      FilterValue: "",
      Sort: "",
      Options: []
    },
    {
      FieldName: "SubET",
      Visible: true,
      DisplayName: "Sub ET",
      Filter: false,
      Control: "DropdownBox",
      DataType: "Choice",
      Selected: "S",
      Predicate: "E",
      FilterValue: "",
      Sort: "",
      Options: this.subet
    },
    {
      FieldName: "CACStatus",
      Visible: false,
      DisplayName: "CAC Status",
      Filter: false,
      Control: "DropdownBox",
      DataType: "Choice",
      Selected: "S",
      Predicate: "E",
      FilterValue: "",
      Sort: "",
      Options: this.cacstatus
    },
    {
      FieldName: "CACRequestDate",
      Visible: false,
      DisplayName: "CAC Req Date",
      Filter: false,
      DataType: "Date",
      Predicate: "S",
      FilterValue: "",
      FilterValue2: "",
      Sort: ""
    },
    {
      FieldName: "CACExpirationDate",
      Visible: false,
      DisplayName: "CAC Exp Date",
      Filter: false,
      DataType: "Date",
      Predicate: "S",
      FilterValue: "",
      FilterValue2: "",
      Sort: ""
    },
    {
      FieldName: "SCIFormStatus",
      Visible: false,
      DisplayName: "SCI Form Status",
      Filter: false,
      Control: "DropdownBox",
      DataType: "Choice",
      Selected: "S",
      Predicate: "E",
      FilterValue: "",
      Sort: "",
      Options: this.formstatus
    },
    {
      FieldName: "SCIFormType",
      Visible: false,
      DisplayName: "SCI Form Type",
      Filter: false,
      Control: "DropdownBox",
      DataType: "Choice",
      Selected: "S",
      Predicate: "E",
      FilterValue: "",
      Sort: "",
      Options: this.formtype
    },
    {
      FieldName: "SCIFormSubmitted",
      Visible: false,
      DisplayName: "SCI Form Submitted",
      Filter: false,
      DataType: "Date",
      Predicate: "",
      FilterValue: "",
      FilterValue2: "",
      Sort: ""
    },
    {
      FieldName: "PRDueDate",
      Visible: false,
      DisplayName: "PR Due Date",
      Filter: false,
      DataType: "Date",
      Predicate: "S",
      FilterValue: "",
      FilterValue2: "",
      Sort: ""
    },
    {
      FieldName: "CEDate",
      Visible: false,
      DisplayName: "CE Date",
      Filter: false,
      DataType: "Date",
      Predicate: "S",
      FilterValue: "",
      FilterValue2: "",
      Sort: ""
    }
  ]
  // #endregion STATE

  // #region  GETTERS
  get allPersonnel() {
    return this.allpersonnel
  }

  get DropDown() {
    return this.dropdown
  }

  get FilteredPersonnel() {
    return this.filteredpersonnel
  }

  get Person() {
    return this.person
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
  public updatePersonnel(personnel: Array<PersonnelItem>): void {
    console.log("MUTATION updatePersonnel called with: " + personnel.length + ", " + typeof personnel)
    this.allpersonnel = personnel
  }

  @Mutation
  public updatefilteredPersonnel(personnel: Array<PersonnelItem>): void {
    this.filteredpersonnel = personnel
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
  public async getPersonnel(): Promise<boolean> {
    this.context.commit("updateLoaded", false)
    let allPersonnel: any[] = []
    let p: Array<PersonnelItem> = []
    let c: Array<ObjectItem> = []
    this.context.commit("updateCompanies", c) // ensure empty collection
    const that = this
    async function getAllPersonnel(purl: string): Promise<void> {
      console.log("Personnel URL: " + purl)
      if (purl === "") {
        purl = geturl
      }
      const response = await axios.get(purl, {
        headers: {
          accept: "application/json;odata=verbose"
        }
      })
      allPersonnel = allPersonnel.concat(response.data.d.results)
      // recursively load items if there is a next result
      if (response.data.d.__next) {
        purl = response.data.d.__next
        return getAllPersonnel(purl)
      } else {
        // call a function from here?
        p = formatPersonnel(allPersonnel)
        c = getOptions(allPersonnel, "Company")
        that.context.commit("updateCompanies", c)
        that.context.commit("updatePersonnel", p)
        that.context.commit("updatefilteredPersonnel", p) // initiall set flltered personnel as all personnel
        that.context.commit("updateLoaded", true)
      }
    }
    getAllPersonnel("")
    return true
  }

  @Action
  public async getFilteredPersonnel(payload: any): Promise<boolean> {
    this.context.commit("updateLoaded", false)
    let allFilteredPersonnel: any[] = []
    async function getAllFilteredPersonnel(purl: string): Promise<void> {
      console.log("Personnel URL: " + purl)
      if (purl === "") {
        purl = payload.url
      }
      const response = await axios.get(purl, {
        headers: {
          accept: "application/json;odata=verbose"
        }
      })
      const results = response.data.d.results
      allFilteredPersonnel = allFilteredPersonnel.concat(results)
      // recursively load items if there is a next result
      if (response.data.d.__next) {
        purl = response.data.d.__next
        return getAllFilteredPersonnel(purl)
      } else {
        // just a placeholder here. Once the recursion completes the rest of the code will run.
      }
    }
    getAllFilteredPersonnel("")
    this.context.commit("updatefilteredPersonnel", allFilteredPersonnel) // initiall set flltered personnel as all personnel
    this.context.commit("updateLoaded", true)
    return true
  }

  @Action
  public async editPersonnel(payload: any) {
    url = payload.uri
    const headers = {
      "Content-Type": "application/json;odata=verbose",
      Accept: "application/json;odata=verbose",
      "X-RequestDigest": this.digest,
      "X-HTTP-Method": "MERGE",
      "If-Match": "*"
    }

    const config = {
      headers: headers
    }

    try {
      console.log("POST URL: " + url)
      await axios.post(url, payload.itemprops, config)
      return true
    } catch (error) {
      console.log("PersonnelService Error Updating Personnel: " + error)
    }
  }

  @Action
  public async newPersonnel(payload: any) {
    const headers = {
      "Content-Type": "application/json;odata=verbose",
      Accept: "application/json;odata=verbose",
      "X-RequestDigest": this.digest,
      "X-HTTP-Method": "POST"
    }

    const config = {
      headers: headers
    }

    try {
      console.log("POST URL: " + url)
      await axios.post(url, payload.itemprops, config)
      return true
    } catch (error) {
      console.log("PersonnelService Error Updating Personnel: " + error)
    }
  }
  //#endregion ACTIONS
}
export default Personnel
