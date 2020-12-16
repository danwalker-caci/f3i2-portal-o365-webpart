interface PersonnelItem {
  Id: number
  WPData: string
  Contact: string
  Active: string
  LastName: string // This is the Title column in SharePoint
  FirstName: string
  Middle: string
  Cadency: string
  Position: string
  Location: string
  Email: string
  Phone: string
  SubET: string
  Company: string
  CACStatus: string
  CACRequestDate: Date
  CACExpirationDate: Date
  SCIFormStatus: string
  SCIFormType: string
  SCIFormSubmitted: Date
  PRDueDate: Date
  CEDate: Date
  Modification: string
  ModDeniedREason: string
  etag: string
  uri: string
}
export { PersonnelItem }
