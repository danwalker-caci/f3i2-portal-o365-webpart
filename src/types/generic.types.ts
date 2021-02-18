/** @type */
export type Dictionary<T> = { [key: string]: T }

/** @type */
export type Nullable<T> = T | null

/** @type */
export type VueCssStyleObject = Partial<CSSStyleDeclaration> & Record<string, Nullable<string>>

/** @type */
export type VueCssClassObject = Dictionary<boolean>
