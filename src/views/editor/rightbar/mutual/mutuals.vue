<template>
  <div>
    <a-collapse v-model="activeKey" :bordered="false">
      <a-collapse-panel
        v-for="(item, index) in data"
        :key="item.key"
        :header="item.title"
        :style="customStyle"
      >
        <div style="position: absolute;top:14px;right:14px" @click="del(item)">
          del
        </div>
        <p>{{ text }}</p>
      </a-collapse-panel>
    </a-collapse>
    <a-button block @click="add">
      +
    </a-button>
  </div>
</template>

<script>
export default {
  name: "mutuals",
  components: {},
  data() {
    return {
      data: [
        {
          title: "Ant Design Title 1",
          key: "2"
        },
        {
          title: "Ant Design Title 2",
          key: "3"
        },
        {
          title: "Ant Design Title 3",
          key: "1"
        },
        {
          title: "Ant Design Title 4",
          key: "4"
        }
      ],
      activeKey: [],
      text: `A dog is a type of domesticated animal.Known for its loyalty and faithfulness,it can be found as a welcome guest in many households across the world.`,
      customStyle:
        "background: #fff;border-radius: 4px;margin-bottom: 14px;border: 0;overflow: hidden;position:relative"
    }
  },
  watch: {},
  methods: {
    add() {
      let len = this.data.length + 1
      let obj = {
        title: "Ant Design Title 1",
        key: len.toString()
      }
      this.data.push(obj)
    },
    change(key) {
      console.log(key)
    },
    del(item) {
      if (this.data.indexOf(item) > -1) {
        this.data.splice(this.data.indexOf(item), 1)
      }
    }
  }
}
</script>

<style scoped></style>
