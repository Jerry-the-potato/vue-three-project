<template>
  <v-app-bar app>
    <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
    <v-toolbar-title>My App</v-toolbar-title>
    <v-spacer />

    <v-tooltip 
      top 
      content-class="w-96"
    >
      <template #activator="{ props }">
        
        <v-btn
          icon 
          v-bind="props"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
      <span>確定刪除分頁？</span>
    </v-tooltip>
    
  </v-app-bar>
</template>
  
<script lang="ts" setup>
// import router from '@/router';
// import { useRoute } from 'vue-router'
// const route = useRoute()
const drawer = ref(false)
// router.push({ name: '/views/MainView', params: { id: '123' }})

</script>
  