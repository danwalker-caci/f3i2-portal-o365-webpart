import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators"
import { User } from "@/interfaces/User"
import { TodoItem } from "@/interfaces/TodoItem"
import { ObjectItem } from "@/interfaces/ObjectItem"
import axios from "axios"
import moment from "moment"

declare const _spPageContextInfo: any

const baseUrl = _spPageContextInfo.webServerRelativeUrl
const userurl = baseUrl + "/_api/SP.UserProfiles.PeopleManager/GetMyProperties"
const idurl = baseUrl + "/_api/Web/CurrentUser?$select=Id"
const personnelByIdUrl = baseUrl + "/_api/lists/getbytitle('Personnel')/items?$select=*,UserAccount/Title,UserAccount/Id&$expand=UserAccount&$filter=(UserAccount/Id eq "
const upbidUrl = baseUrl + "/_api/lists/getbytitle('Personnel')/items("

@Module({ namespaced: true })
class Users extends VuexModule {
  public digest?: string = ""
  public loaded?: boolean = false
  public currentUser!: User
  public todoCount?: number
  public todos?: Array<TodoItem> = []
  public vm = this

  @Mutation updateDigest(digest: string): void {
    this.digest = digest
  }

  @Mutation
  public updateTodos(todos: Array<any>): void {
    this.todos = todos
  }

  @Mutation
  public updateCount(count: number): void {
    this.todoCount = count
  }

  @Mutation
  public updateLoaded(loaded: boolean): void {
    this.loaded = loaded
    console.log("User Loaded")
  }

  @Mutation
  public addUser(newUser: User): void {
    this.currentUser = newUser
  }

  @Mutation
  public updateUserProfile(data: any): void {
    this.currentUser.recordid = data.recordid // row id in personnel list not user id
    this.currentUser.Account = data.Account
    this.currentUser.Email = data.Email
    this.currentUser.EmailLink = data.EmailLink
    this.currentUser.DisplayName = data.DisplayName
    this.currentUser.Phone = data.Phone
    this.currentUser.CellPhone = data.CellPhone
    this.currentUser.Manager = data.Manager
    this.currentUser.FirstName = data.FirstName
    this.currentUser.LastName = data.LastName
    this.currentUser.JSONData = data.JSONData
  }

  @Mutation
  public updateUserJSONData(data: any): void {
    this.currentUser.JSONData = data
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
  public async getTodosByUser(): Promise<boolean> {
    this.context.commit("updateCount", 0)
    let allTodos: any[] = []
    const p: Array<TodoItem> = []
    const userid: number = this.currentUser.userid
    async function getAllTodos(turl: string): Promise<void> {
      if (turl === "") {
        turl = baseUrl + "/_api/lists/getbytitle('Tasks')/items?"
        turl += "$select=*,AssignedTo/Id&$expand=AssignedTo/Id"
        turl += "&$filter=(AssignedTo/Id eq " + userid + ") and (Status ne 'Completed')"
      }
      const response = await axios.get(turl, {
        headers: {
          accept: "application/json;odata=verbose"
        }
      })
      const results = response.data.d.results
      allTodos = allTodos.concat(results)
      if (response.data.d.__next) {
        turl = response.data.d.__next
        return getAllTodos(turl)
      } else {
        // Use the results
        const j = allTodos
        for (let i = 0; i < j.length; i++) {
          p.push({
            Id: Number(j[i]["Id"]),
            Title: j[i]["Title"], // This is the Title column in SharePoint
            Status: j[i]["Status"],
            StartDate: moment(j[i]["StartDate"]).isValid() ? moment(j[i]["StartDate"]).format("MM/DD/YYYY") : "",
            DueDate: moment(j[i]["DueDate"]).isValid() ? moment(j[i]["DueDate"]).format("MM/DD/YYYY") : "",
            TaskType: j[i]["TaskType"],
            AssignedTo: {
              Title: j[i]["AssignedTo"]["Title"],
              Id: j[i]["AssignedTo"]["ID"],
              Email: j[i]["AssignedTo"]["EMail"]
            },
            etag: j[i]["__metadata"]["etag"],
            uri: j[i]["__metadata"]["uri"]
          })
        }
      }
    }
    getAllTodos("")
    this.context.commit("updateTodos", p)
    // this.context.commit("updateCount", p.length)
    return true
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
    let response = await axios.get(userurl, {
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
    const url = personnelByIdUrl + this.currentUser.userid + ")"
    response = await axios.get(url, {
      headers: {
        accept: "application/json;odata=verbose"
      }
    })
    const results = response.data.d.results
    profile.recordid = results[0].Id
    if (results[0].JSONData && results[0].JSONData.length > 0) {
      profile.JSONData = JSON.parse(results[0].JSONData) as Array<ObjectItem>
    } else {
      profile.JSONData = []
    }
    this.context.commit("updateUserProfile", profile)
    // this.context.commit("updateUserName", profile.DisplayName)
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

  @Action
  public async updateJSONData(payload: any): Promise<boolean> {
    // though this is the user module, some data is stored in the Personnel list and we update that information wherever needed.
    // await this.getDigest()
    const url = upbidUrl + this.currentUser.recordid + ")"
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

    await axios.post(url, payload.itemprops, config)
    this.context.commit("updateUserJSONData", payload.data)
    return true
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
