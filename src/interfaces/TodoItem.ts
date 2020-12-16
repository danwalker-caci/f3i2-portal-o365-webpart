interface TodoItem {
  Id: number
  Title: string
  AssignedTo?: object
  Status?: string
  StartDate?: string
  DueDate?: string
  TaskType?: string
  Body?: string
  etag?: string
  uri?: string
}
export { TodoItem }
