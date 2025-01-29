import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'

// 找到所有子路徑並加入參數需求 :id
function findChildren(routes: RouteRecordRaw){
  routes.children = routes.children?.map((route) => {
    if(route.children == undefined) return {
      ...route,
      path: `${route.path}/:id/:url`,  // 加 :id，限制頁面
    }
    findChildren(route)
    return route
  })
  return routes
}

const customRoutes = routes.map((route) => {
  if (route.path.includes("view")) {
    return findChildren(route);
  } else {
    return route
  }
}).concat([
  {
    path: '/:catchAll(.*)',
    redirect: '/',
  }
])

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(customRoutes),
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
