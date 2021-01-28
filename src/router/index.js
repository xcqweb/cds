import Vue from "vue"
import VueRouter from "vue-router"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    redirect: "/app"
  },
  {
    path: "/app",
    name: "app",
    component: () => import(/* webpackChunkName: "apply" */ "@v/app/index.vue")
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
  },
  {
    path: "*",
    redirect: "/"
  },
]

const router = new VueRouter({
  mode: "history",
  base: "ruban_cds",
  routes
})
export default router
