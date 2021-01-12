import Vue from "vue"
import VueRouter from "vue-router"

Vue.use(VueRouter)

const routes = [
  {
    path: "*",
    redirect: "/editor"
  },
  {
    path: "/",
    redirect: "/editor"
  },
  {
    path: "/editor",
    name: "Editor",
    component: () =>
      import(/* webpackChunkName: "Editor" */ "@v/editor/index.vue")
  },
  {
    path: "/preview-app",
    name: "Preview",
    component: () =>
      import(/* webpackChunkName: "Preview" */ "@v/preview/index.vue")
  }
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
})

export default router
