import instance from "@/api/index"

const add = params => instance.post(`/api/ruban-cds/studio/widget/action`, params) // 新建交互
const edit = params => instance.put(`//api/ruban-cds/studio/widget/action`, params)
const queryAll = params => instance.get(`/api/ruban-cds/studio/widget/action/list`, {params})
const del = actionIds => instance.delete(`/api/ruban-cds/studio/widget/action/${actionIds}`)
const query = actionId => instance.get(`/api/ruban-cds/studio/widget/action/${actionId}`)

export default {
  add,
  query,
  queryAll,
  del,
  edit
}
