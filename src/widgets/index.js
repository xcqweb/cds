import Text from "./basic/text"

const components = [Text]
const widgets = {}
components.forEach(item => {
  widgets[item.name] = item
})
export default widgets
