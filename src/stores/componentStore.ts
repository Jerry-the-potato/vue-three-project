import { defineStore } from 'pinia';
import { defineAsyncComponent } from 'vue';
// 路徑範例
// const layouts :{ [key: string]: ReturnType<typeof defineAsyncComponent> } = {
//     '123': defineAsyncComponent(() => import('@/components/gallerys/WebglPrinter/index.vue')),
//     '456': defineAsyncComponent(() => import('@/components/gallerys/SortAlgorithm/index.vue')),
//     default: defineAsyncComponent(() => import('@/components/gallerys/DefaultLayout/index.vue')),
// }

// 動態加載 layout
const layouts = import.meta.glob('@/components/gallerys/*/*.vue');

export const useComponentStore = defineStore('componentStore', {
  state: () => ({
    componentCache: {} as Record<string, ReturnType<typeof defineAsyncComponent>>,
  }),
  actions: {
    // 新增或獲取快取中的元件
    getComponent(key: string, path: string) {
      if (this.componentCache[key]) {
        return this.componentCache[key];
      }

      const loader = layouts[path] as (() => Promise<any>) | undefined;
      const component = defineAsyncComponent(
        loader || layouts['/src/components/gallerys/WebglPrinter/index.vue'] as () => Promise<any>
      );
      this.componentCache[key] = markRaw(component)
      return this.componentCache[key];
    },

    // 手動刪除快取中的元件
    removeComponent(key: string) {
      if (this.componentCache[key]) {
        delete this.componentCache[key];
      }
    },

    // 清空所有快取
    clearCache() {
      this.componentCache = {};
    }
  }
});
