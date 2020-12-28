import config from "@/config"
export const dealWidget = (type, cname) => {
  return config.widgets[type].find(item => item.cname === cname)
}
