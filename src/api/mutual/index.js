import instance from "@/api/index"

const add = params =>
  instance.post(`/api/ruban-cds/studio/widget/action`, params) // 新建交互
const edit = params =>
  instance.put(`/api/ruban-cds/studio/widget/action`, params)
const list = params =>
  instance.get(`/api/ruban-cds/studio/widget/action/list`, { params })
const del = actionId =>
  instance.delete(`/api/ruban-cds/studio/widget/action/${actionId}`)
const query = actionId =>
  instance.get(`/api/ruban-cds/studio/widget/action/${actionId}`)

const queryPageWidgetsActions = pageId => instance.get(`/api/ruban-cds/studio/widget/action/getListByPageId/`,{pageId})

export default {
  add,
  query,
  list,
  del,
  edit,
  queryPageWidgetsActions,
}
