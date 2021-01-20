import instance from "@/api/index"

const dataUrlList = params => instance.get(`/api/ruban-cds/studioDataSource/tenant/list`, {params})


export default {
  dataUrlList,
}
