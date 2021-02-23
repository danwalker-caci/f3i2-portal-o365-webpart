import axios from "axios"

declare const _spPageContextInfo: any
const baseUrl = _spPageContextInfo.webServerRelativeUrl
const url = baseUrl + "/_api/lists/getbytitle('ErrorLog')/items"

async function logToSharePoint(err: any) {
  const response = await axios.request({
    url: baseUrl + "/_api/contextinfo",
    method: "post",
    headers: { Accept: "application/json; odata=verbose" }
  })
  const digest = response.data.d.GetContextWebInformation.FormDigestValue
  console.log("ERROR: " + err)
  const itemprops: any = {
    __metadata: { type: "SP.Data.ErrorLogListItem" }
  }
  if (err.vm !== undefined) {
    console.log("VUE ERROR")
    itemprops.Message = err.err.message
    itemprops.Stack = err.err.stack
    itemprops.Component = err.vm.$vnode.tag
  } else {
    console.log("WINDOW ERROR")
    itemprops.Message = err.message
    itemprops.Stack = err.error.stack
    itemprops.Component = err.source
    itemprops.Line = String(err.lineno)
    itemprops.Column = String(err.colno)
  }

  const headers = {
    "Content-Type": "application/json;odata=verbose",
    Accept: "application/json;odata=verbose",
    "X-RequestDigest": digest,
    "X-HTTP-Method": "POST"
  }
  const config = {
    headers: headers
  }

  try {
    const response = await axios.post(url, itemprops, config)
    return response
  } catch (error) {
    console.log("Unable to log Error: " + error + ", Actual error object: " + err)
  }
}

class AppLogger {
  [x: string]: (err: any) => void
  constructor() {
    this.initLogger()
  }
  initLogger() {
    this.logToServer = err => {
      logToSharePoint(err)
    }
  }
}

const logger = new AppLogger()

export { logger }
