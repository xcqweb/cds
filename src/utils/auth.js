import {removeToken} from './cookie'
export const logout = (url='/login') => {
  removeToken()
  location.href="/login"
}