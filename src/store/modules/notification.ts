import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators"

let nextId = 1

interface Notification {
  id: number
  type: string
  title: string
  message: string
}

@Module({ namespaced: true, name: "notification" })
export default class Notify extends VuexModule {
  notifications: Notification[] = []
  @Mutation
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
    this.context.commit("addNotification", notification)
  }
  @Action
  public delete(notificationToRemove: any) {
    this.context.commit("deleteNotification", notificationToRemove)
  }
}
