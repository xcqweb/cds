<template>
  <div>
    <name-position></name-position>
    <text-info></text-info>
    <text-color></text-color>
  </div>
</template>

<script>
import namePosition from "./name-position"
import textColor from "./text-color"
import textInfo from "./text-info"
export default {
  name: "index",
  components: {
    namePosition,
    textColor,
    textInfo
  }
}
</script>

<style scoped></style>
