import instance from "@/api/index"

const queryAll = params => instance.get(`/api/ruban-cds/studio/widget/list`,{params})

const modifyPatch = params => instance.post(`/api/ruban-cds/studio/widget/addBatchOrUpdate`, params)

const delPatch = params => instance.delete(`/api/ruban-cds/studio/widget/{ids}`,{params})

export default {
  queryAll,
  modifyPatch,
  delPatch
}
