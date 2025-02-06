<template>
  <v-navigation-drawer
    :width="261"
    :rail="rail"
    permanent
  >
    <v-list-item 
      prepend-avatar="https://randomuser.me/api/portraits/women/72.jpg"
      title="Jerry 超級應用程式"
    />
    <v-divider />
    <v-list lines="two">
      <v-list-item
        v-for="item in items"
        :key="item.title"
        :prepend-icon="item.icon"
        @click="router.push({
          name: route.name, // 保持當前路徑
          params: { id: item.id }, // 更新新的 params
        })"
      >
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
  
  <v-app-bar app>
    <v-app-bar-nav-icon @click.stop="rail = !rail" />
    <v-toolbar-title>My App</v-toolbar-title>
    <v-spacer />

    <v-tooltip location="bottom" content-class="custom-tooltip" attach="#app" >
      <template #activator="{ props }">
        
        <v-btn
          icon 
          v-bind="props"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
      <span >確定刪除分頁？</span>
    </v-tooltip>

    <v-btn icon>
      <v-icon>mdi-magnify</v-icon>
    </v-btn>

    <v-btn icon>
      <v-icon>mdi-heart</v-icon>
    </v-btn>

    <v-btn icon>
      <v-icon>mdi-dots-vertical</v-icon>
    </v-btn>
  </v-app-bar>
</template>
  
<script lang="ts" setup>
import router from '@/router';
import { useRoute } from 'vue-router'
const route = useRoute()

// router.push({ name: '/views/MainView', params: { id: '123' }})

const items = [
  { title: '我的主頁', name: './', id: 100, icon: 'mdi-home-city' },
  { title: '盡情享受', name: './', id: 200, icon: 'mdi-account' },
  { title: '高聲歡唱', name: './', id: 300, icon: 'mdi-account-group-outline' },
]

const rail = ref(true);

</script>

<style scoped>
.custom-tooltip {
  background-color: #f78166;  /* 設定背景顏色 */
  color: white;               /* 設定文字顏色 */
  padding: 8px;               /* 設定內邊距 */
  border-radius: 4px;         /* 設定圓角 */
}
</style>