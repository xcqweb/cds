import instance from "@/api/index"

const queryAll = params =>
  instance.get(`/api/ruban-cds/studio/pageInfo/list`, { params })

const add = params => instance.post(`/api/ruban-cds/studio/pageInfo/`, params)

const modify = params => instance.put(`/api/ruban-cds/studio/pageInfo/`, params)

const query = id => instance.get(`/api/ruban-cds/studio/pageInfo/${id}`)

const del = id => instance.delete(`/api/ruban-cds/studio/pageInfo/${id}`)

export default {
  queryAll,
  add,
  query,
  modify,
  del
}
