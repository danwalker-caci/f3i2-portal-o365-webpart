interface User {
  appversion?: string
  loaded?: boolean
  userid: number
  usergroups?: []
  isPM?: boolean
  isSecurity?: boolean
  isDeveloper?: boolean
  isOwner?: boolean
  isWPManager?: boolean
  isApprover?: boolean
  isTravelApprover?: boolean
  isPCA?: boolean
  isQA?: boolean
  isMember?: boolean
  isSubcontractor?: boolean
  isAdmin?: boolean
  isAFRL?: boolean
  isAFRLCEU?: boolean
  Account?: string
  PictureUrl?: string
  PersonalUrl?: string
  Email?: string
  EmailLink?: string
  DisplayName?: string
  FirstName?: string
  LastName?: string
  Phone?: string
  CellPhone?: string
  Manager?: string
  About?: string
  Company?: string
  WPData?: string
}

export { User }