import Text from "./basic/text"
import Image from "./basic/image"

const components = [Text,Image]
const widgets = {}
components.forEach(item => {
  widgets[item.name] = item
})
export default widgets
