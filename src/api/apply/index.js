import instance from "@/api/index"

const add = params => instance.post(`/api/ruban-cds/studioApplyInfo`, params) // 新建应用
const query = id => instance.get(`/api/ruban-cds/studioApplyInfo/${id}`)
const list = params =>
  instance.get(`/api/ruban-cds/studioApplyInfo/list`, params)
const del = ids => instance.delete(`/api/ruban-cds/studioApplyInfo/${ids}`)
const edit = params => instance.put(`/api/ruban-cds/studioApplyInfo`, params)

export default {
  add,
  query,
  list,
  del,
  edit
}
