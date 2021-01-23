import instance from "@/api/index"

const dataUrlList = params =>
  instance.get(`/api/ruban-cds/studioDataSource/tenant/list`, { params })

const query = params =>
  instance.get(`/api/ruban-cds/widgetParamSource/singleWidgetSource`, {
    params
  })

const batchAdd = params =>
  instance.post(`/api/ruban-cds/widgetParamSource/bindBatch`, params)

const add = params => instance.post(`/api/ruban-cds/widgetParamSource`, params)

const edit = params => instance.put(`/api/ruban-cds/widgetParamSource`, params)

const del = id => instance.delete(`/api/ruban-cds/widgetParamSource/${id}`)

const queryPageWidgetsDataBind = params =>
  instance.get(`/api/ruban-cds/widgetParamSource/allWidgetBindData`, { params })

export default {
  dataUrlList,
  query,
  batchAdd,
  add,
  edit,
  del,
  queryPageWidgetsDataBind
}
