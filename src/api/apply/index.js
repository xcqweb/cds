import instance from '@/api/index'

const add = (params) => instance.get(`/api/poros-bpmengine/actGroup/tree/parentId`,{params}) // 获取流程组树


export default {
  add
}