import Text from "./basic/text"
import Image from "./basic/image"
import Group from "./basic/group"
import Button from "./basic/button"
import Circle from "./basic/circle"
import Rect from "./basic/rect"
import Link from "./basic/link"
import Line from "./basic/line"

import BorderAnimate1 from "./decorate/BorderAnimate1"
import BorderAnimate2 from "./decorate/BorderAnimate2"

const components = [
  Text,
  Image,
  Group,
  Button,
  Circle,
  Link,
  Line,
  Rect,
  BorderAnimate1,
  BorderAnimate2
]
const widgets = {}
components.forEach(item => {
  widgets[item.name] = item
})
export default widgets
