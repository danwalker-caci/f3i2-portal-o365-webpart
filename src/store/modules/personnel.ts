/* eslint-disable @typescript-eslint/no-unused-vars */
import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators"
import { PersonnelItem } from "@/interfaces/PersonnelItem"
import axios from "axios"
import moment from "moment"

declare const _spPageContextInfo: any
const baseUrl = _spPageContextInfo.webAbsoluteUrl
let geturl = baseUrl + "/_api/lists/getbytitle('Personnel')/items?$select=*&$orderby=Title"
geturl += "&$filter=((Active eq 1) and (OData__ModerationStatus eq 0))"
let curl = baseUrl + "/_api/lists/getbytitle('Personnel')/items?$select=*&$orderby=ContactOrder"
const zurl = baseUrl + "/_api/lists/getbytitle('Personnel')/items?$select=*&$filter=(Company eq '"
curl += "&$filter=(Contact eq 1)"
const url = baseUrl + "/_api/lists/getbytitle('Personnel')/items"
const surl = baseUrl + "/_api/SP.Utilities.Utility.SendEmail"
const gpbidurl = baseUrl + "/_api/lists/getbytitle('Personnel')/items?$select=*,UserAccount/Title,UserAccount/Id&$expand=UserAccount&$filter=(UserAccount/Id eq "

@Module({ namespaced: true })
class Personnel extends VuexModule {
  // #region  STATE
  public digest?: string = ""
  public loaded = false
  public dropdown: any = []
  public personnel: Array<PersonnelItem> = []
  public filteredpersonnel: Array<PersonnelItem> = []
  // #endregion STATE

  // #region  GETTERS
  get allPersonnel() {
    return this.personnel
  }

  get DropDown() {
    return this.dropdown
  }

  get FilteredPersonnel() {
    return this.filteredpersonnel
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
    this.personnel = personnel
    this.filteredpersonnel = personnel // for now
  }

  @Mutation
  public updateDropdown(dropdown: any): void {
    this.dropdown = dropdown
  }
  //#endregion MUTATIONS
}
export default Personnel
