/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

import './styles/final.css'

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

const app = createApp(App)

registerPlugins(app)

app.mount('#app')