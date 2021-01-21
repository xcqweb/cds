import instance from "@/api/index"

const dataUrlList = params => instance.get(`/api/ruban-cds/studioDataSource/tenant/list`, {params})

const query =  widgetId => instance.get(`/api/ruban-cds/widgetParamSource/${widgetId}`)

const batchAdd = params => instance.post(`/api/ruban-cds/widgetParamSource/bindBatch`, params)  

const add = params => instance.post(`/api/ruban-cds/widgetParamSource`, params)  

const edit = params => instance.put(`/api/ruban-cds/widgetParamSource`, params)

export default {
  dataUrlList,
  query,
  batchAdd,
  add,
  edit,
}
