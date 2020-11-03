import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators"
import { User } from "@/interfaces/User"
import axios from "axios"

declare const _spPageContextInfo: any

const baseUrl = _spPageContextInfo.webServerRelativeUrl
const userurl = baseUrl + "/_api/SP.UserProfiles.PeopleManager/GetMyProperties"
const idurl = baseUrl + "/_api/Web/CurrentUser?$select=Id"

@Module({ namespaced: true })
class Users extends VuexModule {
  public loaded?: boolean = false
  public currentUser!: User

  @Mutation
  public updateLoaded(loaded: boolean): void {
    this.loaded = loaded
  }

  @Mutation
  public addUser(newUser: User): void {
    this.currentUser = newUser
  }

  @Mutation
  public updateUserProfile(data: any): void {
    this.currentUser.Account = data.Account
    this.currentUser.Email = data.Email
    this.currentUser.EmailLink = data.EmailLink
    this.currentUser.DisplayName = data.DisplayName
    this.currentUser.Phone = data.Phone
    this.currentUser.CellPhone = data.CellPhone
    this.currentUser.Manager = data.Manager
    this.currentUser.FirstName = data.FirstName
    this.currentUser.LastName = data.LastName
  }

  @Mutation
  public updateUserPermissions(data: any): void {
    this.currentUser.isPM = data.isPM === true ? true : false
    this.currentUser.isSecurity = data.isSecurity === true ? true : false
    this.currentUser.isDeveloper = data.isDeveloper === true ? true : false
    this.currentUser.isOwner = data.isOwner === true ? true : false
    this.currentUser.isWPManager = data.isWPManager === true ? true : false
    this.currentUser.isApprover = data.isApprover === true ? true : false
    this.currentUser.isTravelApprover = data.isTravelApprover === true ? true : false
    this.currentUser.isPCA = data.isPCA === true ? true : false
    this.currentUser.isQA = data.isQA === true ? true : false
    this.currentUser.isMember = data.isMember === true ? true : false
    this.currentUser.isSubcontractor = data.isSubcontractor === true ? true : false
    this.currentUser.isAdmin = data.isAdmin === true ? true : false
    this.currentUser.isAFRL = data.isAFRL === true ? true : false
    this.currentUser.isAFRLCEU = data.isAFRLCEU === true ? true : false
  }

  @Action
  public async getUserId(): Promise<User | boolean> {
    const response = await axios.get(idurl, {
      headers: {
        accept: "application/json;odata=verbose"
      }
    })
    const id = response.data.d.Id
    const nuser: User = {
      userid: id
    }
    this.context.commit("addUser", nuser)
    return nuser
  }

  @Action
  public async getUserProfile(): Promise<boolean> {
    const response = await axios.get(userurl, {
      headers: {
        accept: "application/json;odata=verbose"
      }
    })
    const profile = {} as any
    const properties = response.data.d.UserProfileProperties.results
    profile.Account = response.data.d.AccountName
    profile.Email = response.data.d.Email
    profile.EmailLink = "mailto:" + response.data.d.Email
    profile.DisplayName = response.data.d.DisplayName
    for (let i = 0; i < properties.length; i++) {
      const property = properties[i]
      switch (property.Key) {
        case "WorkPhone":
          profile.Phone = property.Value
          break

        case "CellPhone":
          profile.CellPhone = property.Value
          break

        case "Manager":
          profile.Manager = property.Value
          break

        case "LastName":
          profile.LastName = property.Value
          break

        case "FirstName":
          profile.FirstName = property.Value
          break
      }
    }
    this.context.commit("updateUserProfile", profile)
    this.context.commit("updateUserName", profile.DisplayName)
    return true
  }

  @Action
  public async getUserPermissions(id: number): Promise<User> {
    const groupurl = baseUrl + "/_api/web/getuserbyid('" + id + "')/groups"
    const response = await axios.get(groupurl, {
      headers: {
        accept: "application/json;odata=verbose"
      }
    })
    const usergroups = response.data.d.results
    const permissions = {} as any
    for (let i = 0; i < usergroups.length; i++) {
      switch (usergroups[i].Title) {
        case "Approvers":
          permissions.isApprover = true
          break

        case "Security Officers":
          permissions.isSecurity = true
          break

        case "Travel Approvers":
          permissions.isTravelApprover = true
          break

        case "Developers":
          permissions.isDeveloper = true
          break

        case "F3I-2 Owners":
          permissions.isOwner = true
          break

        case "F3I-2 PCAs":
          permissions.isPCA = true
          break

        case "F3I-2 QA":
          permissions.isQA = true
          break

        case "F3I-2 Admins":
          permissions.isAdmin = true
          break

        case "F3I-2 Members":
          permissions.isMember = true
          break

        case "F3I2 Developers":
          permissions.isDeveloper = true
          break

        case "F3I2 Owners":
          permissions.isOwner = true
          break

        case "F3I2 PCAs":
          permissions.isPCA = true
          break

        case "F3I2 QA":
          permissions.isQA = true
          break

        case "F3I2 Admins":
          permissions.isAdmin = true
          break

        case "F3I2 Members":
          permissions.isMember = true
          break

        case "Subcontractors":
          permissions.isSubcontractor = true
          break

        case "Workplan Managers":
          permissions.isWPManager = true
          break

        case "Program Managers":
          permissions.isPM = true
          break

        case "AFRL":
          permissions.isAFRL = true
          break

        case "AFRLCEU":
          permissions.isAFRLCEU = true
          break
      }
    }
    this.context.commit("updateUserPermissions", permissions)
    this.context.commit("updateLoaded", true)
    return this.currentUser
  }

  async getUserById(payload: any) {
    const url = baseUrl + "/_api/Web/GetUserById('" + payload.id + "')"
    const response = await axios.get(url, {
      headers: {
        accept: "application/json;odata=verbose"
      }
    })
    return response
  }

  async getUserProfileFor(payload: any) {
    const url = baseUrl + "/_api/sp.userprofiles.peoplemanager/GetPropertiesFor(AccountName=@v)?@v='" + encodeURIComponent(payload.login) + "'"
    const response = await axios.get(url, {
      headers: {
        accept: "application/json;odata=verbose"
      }
    })
    return response
  }
}

export default Users
