import Text from "./basic/text"
import Image from "./basic/image"
import Group from './basic/group'

const components = [Text, Image,Group]
const widgets = {}
components.forEach(item => {
  widgets[item.name] = item
})
export default widgets
