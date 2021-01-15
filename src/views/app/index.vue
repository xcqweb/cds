<template>
  <div class="apply-con">
    <a-button class="btn-con" type="link" @click.prevent="e => add(e, true)">
      + 新增
    </a-button>
    <div class="main-con">
      <a-modal
        v-model="visible"
        title="新增应用"
        @ok="handleOk"
        @cancel="handleCancel"
        ok-text="提交"
        cancel-text="取消"
      >
        <a-form-model
          ref="ruleForm"
          :model="form"
          :rules="rules"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-form-model-item
            ref="studioName"
            label="应用名称"
            prop="studioName"
          >
            <a-input
              v-model="form.studioName"
              @blur="
                () => {
                  $refs.studioName.onFieldBlur()
                }
              "
            />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <a-table
        :columns="columns"
        :data-source="data"
        rowKey="id"
        style="width:100%"
      >
        <a
          slot="studioName"
          @click="() => jump(record)"
          slot-scope="text, record"
          >{{ text }}</a
        >
        <span slot="action" slot-scope="text, record">
          <a @click="() => del(record)">Delete</a>
          <a-divider type="vertical" />
          <a @click="() => edit(record)">Edit</a>
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
      data: [],
      columns,
      visible: false,
      formLayout: "horizontal",
      form: {
        studioName: ""
      },
      rules: {
        studioName: [
          { required: true, message: "请输入应用名称", trigger: "blur" },
          { min: 3, message: "至少输入3个字符", trigger: "blur" }
        ]
      },
      appId: ""
    }
  },
  created() {
    this.queryApply()
  },
  methods: {
    jump(e) {
      // 命名的路由
      this.$router.push({ path: "/editor", query: { appId: e.id } })
    },
    queryApply() {
      let params = {
        appType: "",
        classifyId: "",
        keyword: "",
        limit: 10,
        pageNo: 1,
        state: 1,
        status: 0,
        studioName: "",
        tenantId: ""
      }
      api.list(params).then(res => {
        if (res.code === 0) {
          this.data = res.data.records
        }
      })
    },
    add(e) {
      console.log("click", e)
      this.visible = true
    },
    edit(e) {
      this.visible = true
      this.form = e
    },
    del(e) {
      console.log(e)
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
      this.resetForm()
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const params = {
            appType: 0,
            classifyId: "",
            descript: "test",
            height: "768",
            picUrl: "",
            scale: "1",
            studioName: this.form.studioName,
            id: this.form.id,
            tenantId: "",
            theme: "",
            width: "1024"
          }
          if (this.form.id) {
            api.edit(params).then(res => {
              if (res.code === 0) {
                this.$message.success("修改应用成功")
                this.resetForm()
                this.visible = false
                this.queryApply()
              }
            })
          } else {
            api.add(params).then(res => {
              if (res.code === 0) {
                this.$message.success("新建应用成功")
                this.resetForm()
                this.visible = false
                this.queryApply()
              }
            })
          }
        } else {
          console.log("error submit!!")
          return false
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
  .btn-con {
    padding: 10px 100px;
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
