import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators"
import { User } from "@/interfaces/User"
import axios from "axios"

declare const _spPageContextInfo: any

const baseUrl = _spPageContextInfo.webServerRelativeUrl
const userurl = baseUrl + "/_api/SP.UserProfiles.PeopleManager/GetMyProperties"
const idurl = baseUrl + "/_api/Web/CurrentUser?$select=Id"

@Module({ namespaced: true })
class Users extends VuexModule {
  public currentUser: Array<User> = []

  @Mutation
  public addUser(newUser: User): void {
    this.currentUser.push(newUser)
  }

  @Action
  public updateUser(newUser: User): void {
    this.context.commit("addUser", newUser)
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

  async getUserProfile() {
    const response = await axios.get(userurl, {
      headers: {
        accept: "application/json;odata=verbose"
      }
    })
    return response
  }

  async getUserGroups(id: number) {
    const groupurl = baseUrl + "/_api/web/getuserbyid('" + id + "')/groups"
    const response = await axios.get(groupurl, {
      headers: {
        accept: "application/json;odata=verbose"
      }
    })
    return response
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
