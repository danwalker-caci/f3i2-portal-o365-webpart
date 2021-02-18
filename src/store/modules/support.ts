import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators"
import { ThemeName } from "@/themes/theme.types"
@Module({ namespaced: true })
class Support extends VuexModule {
  public isShown?: boolean = true
  public isThemeSelectorShown?: boolean = false
  public theme: ThemeName = ThemeName.DEFAULT
  public contentrect?: DOMRect

  @Mutation
  public updateRect(newVal: DOMRect): void {
    this.contentrect = newVal
  }

  @Action
  public setRect(newVal: DOMRect): void {
    this.context.commit("updateRect", newVal)
  }

  @Mutation
  public updateShown(newVal: boolean): void {
    this.isShown = newVal
  }

  @Action
  public setShown(newVal: boolean): void {
    this.context.commit("updateShown", newVal)
  }

  @Mutation
  public updateThemeSelectorShown(newVal: boolean): void {
    this.isThemeSelectorShown = newVal
  }

  @Action
  public setThemeSelectorShown(newVal: boolean): void {
    this.context.commit("updateThemeSelectorShown", newVal)
  }

  @Mutation
  private SET_THEME(theme: ThemeName): void {
    this.theme = theme
  }
  @Action
  public setTheme(theme: ThemeName): void {
    this.context.commit("SET_THEME", theme)
  }
}
export default Support
