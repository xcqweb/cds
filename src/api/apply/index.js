import instance from "@/api/index"

const add = params => instance.post(`/api/ruban-cds/studioApplyInfo`, params) // 新建应用
const query = id => instance.get(`/api/ruban-cds/studioApplyInfo/${id}`)

export default {
  add,
  query,
}
