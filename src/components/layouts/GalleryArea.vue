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
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useComponentStore } from '@/stores/componentStore';

const route = useRoute();
const store = useComponentStore();

// 取得路由參數
type RouteParams = {
  id: string;
  url: string;
};
type RouteQuery = {
  value: string;
};

const params = computed(() => route.params as RouteParams);
const query = computed(() => route.query as RouteQuery);

const currentLayout = computed(() => {
  const key = query.value.value;
  const path = `/src/components/gallerys/${params.value.id}/${params.value.url}.vue`;
  return store.getComponent(key, path);
});
</script>
