<template>
    <div>
    <h1>固定的 ItemView</h1>
    <keep-alive>
        <component v-if="isActive" :is="currentLayout" />
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
const layouts :{ [key: string]: any } = {
    '123': defineAsyncComponent(() => import('@/components/gallerys/WebglPrinter/index.vue')),
    '456': defineAsyncComponent(() => import('@/components/gallerys/SortAlgorithm/index.vue')),
    default: defineAsyncComponent(() => import('@/components/gallerys/DefaultLayout/index.vue')),
}

const currentLayout = computed(() => layouts[route.params.id as string]|| layouts.default)

</script>
