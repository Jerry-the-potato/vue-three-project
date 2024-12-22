<template>
    <v-app-bar app>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>My App</v-toolbar-title>
        <v-spacer></v-spacer>

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
  
<script lagn="ts" setup>
import router from '@/router';
import { useRoute } from 'vue-router'
const route = useRoute()

// router.push({ name: '/views/MainView', params: { id: '123' }})

</script>
  