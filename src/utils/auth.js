import { removeToken } from "./cookie"
export const logout = () => {
  removeToken()
  location.href = `/auth/login?fromUrl=${location.host}/ruban_cds`
}
