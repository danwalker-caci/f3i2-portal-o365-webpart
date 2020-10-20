import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators"
import axios from "axios"

@Module({ namespaced: true, name: "user" })
export default class User extends VuexModule {
  public Developer = true

  /* @Mutation
  public addNotification(notification: any): void {
    this.notifications.push({
      ...notification,
      id: nextId++
    })
  }
  @Mutation
  public deleteNotification(notificationToRemove: any): void {
    this.notifications = this.notifications.filter(notification => notification.id !== notificationToRemove.id)
  }
  @Action
  public add(notification: any) {
    this.context.commit('addNotification', notification)
  }
  @Action
  public delete(notificationToRemove: any) {
    this.context.commit('deleteNotification', notificationToRemove)
  } */

  get isDeveloper() {
    return this.Developer
  }
}
