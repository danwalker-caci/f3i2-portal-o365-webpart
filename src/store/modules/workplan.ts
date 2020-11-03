/* eslint-disable @typescript-eslint/no-unused-vars */
import Vue from "vue"
import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators"
import { WorkPlanItem } from "@/interfaces/WorkPlanItem"
import axios from "axios"
import moment from "moment"

declare const _spPageContextInfo: any
const baseUrl = _spPageContextInfo.webServerRelativeUrl
let geturl = baseUrl + "/_api/lists/getbytitle('WorkPlans')/items"
geturl += "?$select=*,Manager/Title,Manager/ID,Manager/Name,Manager/EMail&$expand=Manager"
geturl += "&$filter=(Archived eq 0)"
const murl = baseUrl + "/_api/Web/SiteGroups/GetByName('Workplan Managers')/users"

@Module({ namespaced: true })
class WorkPlan extends VuexModule {
  // #region  STATE
  public digest = ""
  public loaded = false
  public managers: any = []
  public dropdown: any = []
  public subs = ""
  public subsloaded = false
  public workplans: Array<WorkPlanItem> = []
  public filteredworkplans: Array<WorkPlanItem> = []
  // #endregion STATE

  // #region  GETTERS
  get allWorkplans() {
    return this.workplans
  }

  get DropDown() {
    return this.dropdown
  }

  get Managers() {
    return this.managers
  }

  get Loaded() {
    return this.loaded
  }

  get SubsLoaded() {
    return this.subsloaded
  }

  get Subs() {
    return this.subs
  }

  get Digest() {
    return this.digest
  }
  // #endregion GETTERS

  //#region MUTATIONS
  @Mutation updateDigest(digest: string): void {
    this.digest = digest
  }

  @Mutation
  public updateWorkplans(plans: Array<WorkPlanItem>): void {
    this.workplans = plans
    this.filteredworkplans = plans // for now
  }

  @Mutation
  public updateManagers(managers: any): void {
    this.managers = managers
  }

  @Mutation
  public updateDropdown(dropdown: any): void {
    this.dropdown = dropdown
  }
  //#endregion MUTATIONS

  //#region ACTIONS
  @Action
  public async getDigest(): Promise<boolean> {
    const response = await axios.request({
      url: baseUrl + "/_api/contextinfo",
      method: "post",
      headers: { Accept: "application/json; odata=verbose" }
    })
    this.context.commit("updateDigest", response.data.d.GetContextWebInformation.FormDigestValue)
    return true
  }

  @Action
  public async getManagers(): Promise<boolean> {
    const response = await axios.get(murl, {
      headers: {
        accept: "application/json;odata=verbose"
      }
    })
    const p: Array<any> = []
    const j = response.data.d.results
    for (let i = 0; i < j.length; i++) {
      p.push({
        text: j[i]["Title"],
        value: j[i]["Id"]
      })
    }
    this.context.commit("updateManagers", p)
    return true
  }

  @Action
  public async getWorkplans(): Promise<boolean> {
    let allWorkPlans: any[] = []
    const p: Array<WorkPlanItem> = []
    const q: Array<any> = []
    async function getAllWorkPlans(purl: string): Promise<void> {
      console.log("Workplan URL: " + purl)
      if (purl === "") {
        purl = geturl
      }
      const response = await axios.get(purl, {
        headers: {
          accept: "application/json;odata=verbose"
        }
      })
      const results = response.data.d.results
      allWorkPlans = allWorkPlans.concat(results)
      // recursively load items if there is a next result
      if (response.data.d.__next) {
        purl = response.data.d.__next
        return getAllWorkPlans(purl)
      } else {
        // Use the results
        const j = allWorkPlans
        for (let i = 0; i < j.length; i++) {
          const value = j[i]["Number"] + ", " + j[i]["Title"] + ", " + j[i]["Revision"] + ", " + j[i]["LastIndex"] + ", " + j[i]["__metadata"]["uri"] + ", " + j[i]["__metadata"]["etag"]
          q.push({
            text: j[i]["Number"] + " " + j[i]["Title"],
            value: j[i]["Number"],
            data: value
          })
          p.push({
            Id: Number(j[i]["Id"]),
            Title: j[i]["Title"], // This is the Title column in SharePoint
            Number: j[i]["Number"],
            Revision: j[i]["Revision"],
            Subs: j[i]["Subs"],
            POPStart: moment(j[i]["POPStart"]).isValid() ? moment(j[i]["POPStart"]).format("MM/DD/YYYY") : "",
            POPEnd: moment(j[i]["POPEnd"]).isValid() ? moment(j[i]["POPEnd"]).format("MM/DD/YYYY") : "",
            DateApproved: moment(j[i]["DateApproved"]).isValid() ? moment(j[i]["DateApproved"]).format("MM/DD/YYYY") : "",
            Manager: j[i]["Manager"]["Title"],
            ManagerId: j[i]["Manager"]["ID"],
            ManagerEmail: j[i]["Manager"]["EMail"],
            etag: j[i]["__metadata"]["etag"],
            uri: j[i]["__metadata"]["uri"]
          })
        }
      }
    }
    getAllWorkPlans("")
    this.context.commit("updateWorkplans", p)
    this.context.commit("updateDropdown", q)
    return true
  }

  @Action
  public async editWorkplan(payload: any) {
    const url = payload.uri
    const headers = {
      "Content-Type": "application/json;odata=verbose",
      Accept: "application/json;odata=verbose",
      "X-RequestDigest": this.digest,
      "X-HTTP-Method": "MERGE",
      "If-Match": payload.etag
    }
    const config = {
      headers: headers
    }
    const itemprops = {
      __metadata: { type: "SP.Data.WorkPlansListItem" },
      Title: payload.Title,
      Number: payload.Number,
      Revision: payload.Revision,
      POPStart: moment(payload.POPStart).isValid()
        ? moment(payload.POPStart)
            .add(6, "hours")
            .format("YYYY-MM-DD[T]HH:MM:[00Z]")
        : null,
      POPEnd: moment(payload.POPEnd).isValid()
        ? moment(payload.POPEnd)
            .add(6, "hours")
            .format("YYYY-MM-DD[T]HH:MM:[00Z]")
        : null,
      DateApproved: moment(payload.DateApproved).isValid()
        ? moment(payload.DateApproved)
            .add(6, "hours")
            .format("YYYY-MM-DD[T]HH:MM:[00Z]")
        : null,
      ManagerId: Number(payload.Manager)
    }

    try {
      await axios.post(url, itemprops, config)
      // go get the data for the saved item to return back to the user
      return axios
        .get(url, {
          headers: {
            accept: "application/json;odata=verbose"
          }
        })
        .then(function(response) {
          return response
        })
    } catch (error) {
      console.log("WorkplanService Error Updating Workplan: " + error)
    }
  }
  //#endregion ACTIONS

  //#region FUNCTIONS
  public formatDropdown(j: any) {
    let p = []
    for (let i = 0; i < j.length; i++) {
      const value = j[i]["Number"] + ", " + j[i]["Title"] + ", " + j[i]["Revision"] + ", " + j[i]["LastIndex"] + ", " + j[i]["__metadata"]["uri"] + ", " + j[i]["__metadata"]["etag"]
      p.push({
        text: j[i]["Number"] + " " + j[i]["Title"],
        value: j[i]["Number"],
        data: value
      })
    }
    p = Vue._.orderBy(p, "value", "asc")
    return p
  }

  public formatManagers(j: any) {
    const p = []
    for (let i = 0; i < j.length; i++) {
      p.push({
        text: j[i]["Title"],
        value: j[i]["Id"]
      })
    }
    return p
  }
  //#endregion FUNCTIONS
}
export default WorkPlan
