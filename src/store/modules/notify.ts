import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators"
import { Notification } from "@/interfaces/Notification"

let nextId = 1

@Module({ namespaced: true })
class Notify extends VuexModule {
  public notifications: Array<Notification> = []
  @Mutation
  public addNotification(notification: Notification): void {
    this.notifications.push({
      ...notification,
      id: nextId++
    })
  }
  @Mutation
  public deleteNotification(notificationToRemove: Notification): void {
    this.notifications = this.notifications.filter(notification => notification.id !== notificationToRemove.id)
  }
  @Action
  public add(notification: Notification): void {
    this.context.commit("addNotification", notification)
  }
  @Action
  public delete(notificationToRemove: Notification) {
    this.context.commit("deleteNotification", notificationToRemove)
  }
}

export default Notify
