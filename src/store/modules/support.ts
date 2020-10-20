import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators"
@Module({ namespaced: true })
class Support extends VuexModule {
  public isShown?: boolean = true

  @Mutation
  public updateShown(newVal: boolean): void {
    this.isShown = newVal
  }

  @Action
  public setShown(newVal: boolean): void {
    this.context.commit("updateShown", newVal)
  }
}
export default Support
