<template>
  <div>
    <keep-alive :max="5">
      <component
        :is="currentLayout"
      />
    </keep-alive>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { defineAsyncComponent } from 'vue'
const route = useRoute()
// 定義路由參數型別
type RouteParams = {
  id: string
  url: string
}
type RouteQuery = {
  value: string
}
const params = computed(() => route.params as RouteParams)
const query = computed(() => route.query as RouteQuery)

// 動態加載 layout
const layouts = import.meta.glob('@/components/gallerys/*/*.vue')

// 範例
// const layouts :{ [key: string]: ReturnType<typeof defineAsyncComponent> } = {
//     '123': defineAsyncComponent(() => import('@/components/gallerys/WebglPrinter/index.vue')),
//     '456': defineAsyncComponent(() => import('@/components/gallerys/SortAlgorithm/index.vue')),
//     default: defineAsyncComponent(() => import('@/components/gallerys/DefaultLayout/index.vue')),
// }

// 使用 Map 來快取已載入的元件
const componentCache: Record<string, ReturnType<typeof defineAsyncComponent>> = {};

const currentLayout = computed(() => {
  // 如果快取裡有這個元件，直接回傳
  const key = query.value.value
  if (componentCache[key]) {
    return componentCache[key];
  }
  const path = `/src/components/gallerys/${params.value.id}/${params.value.url}.vue`;

  // 確保該路徑存在
  const loader = layouts[path] as (() => Promise<any>) | undefined;

  componentCache[key] = defineAsyncComponent(loader || layouts['/src/components/gallerys/WebglPter/index.vue'] as () => Promise<any>)
  
  return componentCache[key]
});

console.log(layouts)
console.log(currentLayout)
// const currentLayout = computed(() => layouts[params.id]|| layouts.default)

</script>
