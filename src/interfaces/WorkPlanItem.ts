interface WorkPlanItem {
  Id: number
  Title: string
  Number: string
  Revision: string
  POPStart: string
  POPEnd: string
  Manager: string
  ManagerId: number
  ManagerEmail: string
  DateApproved: string
  Subs: string
  LastIndex?: number
  etag: string
  uri: string
}
export { WorkPlanItem }
