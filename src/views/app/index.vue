<template>
  <div class="apply-con">
    <a-button class="btn-con" type="primary" @click.prevent="add">
      + 新增
    </a-button>
    <div class="main-con">
      <a-modal
        v-model="visible"
        :title="pageTitle"
        @ok="handleOk"
        @cancel="handleCancel"
        ok-text="提交"
        cancel-text="取消"
      >
        <a-form
          :form="form"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-form-item label="应用名称">
            <a-input
              v-decorator="[
                'studioName',
                {
                  rules: [
                    { required: true, message: '应用名称不能为空' },
                    {
                      pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/g,
                      message: '应用名称不能包含除下划线以外的其他特殊字符'
                    }
                  ]
                }
              ]"
              placeholder="请输入应用名称"
              :maxLength="50"
            />
          </a-form-item>
        </a-form>
      </a-modal>
      <a-table
        :columns="columns"
        :data-source="data"
        rowKey="id"
        :pagination="pagination"
        @change="tableChange"
        style="width:100%"
      >
        <a
          slot="studioName"
          @click="() => jump(record)"
          slot-scope="text, record"
          >{{ text }}</a
        >
        <span slot="action" slot-scope="text, record">
          <a @click="() => del(record)">删除</a>
          <a-divider type="vertical" />
          <a @click="() => edit(record)">编辑</a>
        </span>
      </a-table>
    </div>
  </div>
</template>
<script>
import api from "@a/apply"
const columns = [
  {
    title: "序号",
    width: 100,
    fixed: "left",
    customRender: (text, record, index) => `${index + 1}`
  },
  {
    title: "应用名称",
    dataIndex: "studioName",
    key: "studioName",
    scopedSlots: { customRender: "studioName" }
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" }
  }
]
export default {
  data() {
    return {
      pageTitle: "新增应用",
      data: [],
      columns,
      visible: false,
      form: this.$form.createForm(this),
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10, // 每页中显示10条数据
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "50"], // 每页中显示的数据
        showTotal: total => `共有 ${total} 条数据` // 分页中显示总的数据
      },
      currentAppId: ""
    }
  },
  created() {
    this.queryApply()
  },
  methods: {
    jump(record) {
      this.$router.push({ path: "/editor", query: { appId: record.id } })
    },
    queryApply() {
      let params = {
        appType: "",
        classifyId: "",
        keyword: "",
        limit: this.pagination.pageSize,
        pageNo: this.pagination.current,
        state: 1,
        status: 0,
        studioName: "",
        tenantId: ""
      }
      api.list(params).then(res => {
        if (res.code === 0) {
          this.data = res.data.records
          this.pagination.total = res.data.total
        }
      })
    },
    tableChange(pageOptions) {
      this.pagination.current = pageOptions.current
      this.pagination.pageSize = pageOptions.pageSize
      this.queryApply()
    },
    add() {
      this.visible = true
      this.currentAppId = ""
      this.form = this.$form.createForm(this)
    },
    edit(data) {
      this.pageTitle = "编辑应用"
      this.visible = true
      this.currentAppId = data.id
      this.$nextTick(() => {
        this.form.setFieldsValue({
          studioName: data.studioName
        })
      })
    },
    del(e) {
      api.del(e.id).then(res => {
        if (res.code === 0) {
          this.$message.success("删除应用成功")
          this.queryApply()
        }
      })
    },
    //关闭模态框
    handleCancel() {
      this.visible = false
    },
    handleOk() {
      this.form.validateFields((err, values) => {
        if (!err) {
          const params = {
            appType: 0,
            classifyId: "",
            descript: "test",
            height: "768",
            picUrl: "",
            scale: "1",
            studioName: values.studioName,
            id: this.currentAppId,
            tenantId: "",
            theme: "",
            width: "1024"
          }
          let fun
          let msg
          if (params.id) {
            msg = "修改应用成功"
            fun = "edit"
          } else {
            msg = "新建应用成功"
            fun = "add"
          }
          api[fun](params).then(res => {
            if (res.code === 0) {
              this.$message.success(msg)
              this.visible = false
              this.queryApply()
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less">
.apply-con {
  height: 100%;
  color: rgb(91, 107, 115);
  margin-top: 50px;
  .btn-con {
    margin-left: 100px;
  }
  .main-con {
    margin: 10px 100px;
    flex: 1 1 0%;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    overflow: hidden;
  }
}
</style>
