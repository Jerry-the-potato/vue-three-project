<template>
  <div>
    <keep-alive>
      <component
        :is="currentLayout"
        v-if="isActive"
      />
    </keep-alive>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { defineAsyncComponent } from 'vue'
const route = useRoute()
const isActive = ref(true)

// 動態加載 layout
const layouts :{ [key: string]: ReturnType<typeof defineAsyncComponent> } = {
    '123': defineAsyncComponent(() => import('@/components/gallerys/WebglPrinter/index.vue')),
    '456': defineAsyncComponent(() => import('@/components/gallerys/SortAlgorithm/index.vue')),
    default: defineAsyncComponent(() => import('@/components/gallerys/DefaultLayout/index.vue')),
}
// 定義路由參數型別
type RouteParams = {
    id: string;
};
const currentLayout = computed(() => layouts[(route.params as RouteParams).id]|| layouts.default)

</script>
