import Cookie from "js-cookie"
const HOST_NAME = window.location.hostname
// 获取有效期：一个自然月
const getExpires = () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

const COOKIE_TOKEN_KEY = "dev_access_token"
const COOKIE_TOKENTYPE_KEY = "dev_token_type"

export function getToken() {
  const tokenType = Cookie.get(COOKIE_TOKENTYPE_KEY, { domain: HOST_NAME })
  const accessToken = Cookie.get(COOKIE_TOKEN_KEY, { domain: HOST_NAME })
  return accessToken ? tokenType + " " + accessToken : ""
}
export function getAccessToken() {
  return Cookie.get(COOKIE_TOKEN_KEY, { domain: HOST_NAME })
}

// token和token类型存入cookie
export function setToken(accessToken, tokenType) {
  const expires = getExpires()
  Cookie.set(COOKIE_TOKEN_KEY, accessToken, { expires, domain: HOST_NAME })
  if (tokenType) {
    Cookie.set(COOKIE_TOKENTYPE_KEY, tokenType, { expires, domain: HOST_NAME })
  }
}

export function removeToken () {
  Cookie.remove(COOKIE_TOKEN_KEY, { domain: HOST_NAME })
  Cookie.remove(COOKIE_TOKENTYPE_KEY, { domain: HOST_NAME })
}