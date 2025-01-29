// Utilities
import { defineStore } from 'pinia'

export const useWorkStore = defineStore('app', () => {
  const tab = ref(1)
  const value = ref(1)
  const items = reactive<CustomTabItem[]>([
    { text: "One", value: value.value, icon: "mdi-numeric-1-circle", id: "WebglPrinter", url: "index"},
    { text: "Two", value: 2, icon: "mdi-numeric-2-circle", id: "SortAlgorithm", url: "index"},
    // { text: "Three", value: 3, icon: "mdi-numeric-3-circle" },
    // { text: "Four", value: 4, icon: "mdi-numeric-4-circle" },
    // { text: "Five", value: 5, icon: "mdi-numeric-5-circle" },
    // { text: "Six", value: 6, icon: "mdi-numeric-6-circle" },
    // { text: "Seven", value: 7, icon: "mdi-numeric-7-circle" },
    // { text: "Eight", value: 8, icon: "mdi-numeric-8-circle" },
    // { text: "Nine", value: 9, icon: "mdi-numeric-9-circle" },
    // { text: "Ten", value: 10, icon: "mdi-numeric-10-circle" },
    // { text: "Eleven", value: 11, icon: "mdi-numeric-11-circle" },
    // { text: "Twelve", value: 12, icon: "mdi-numeric-12-circle" },
    // { text: "Thirteen", value: 13, icon: "mdi-numeric-13-circle" },
    // { text: "Fourteen", value: 14, icon: "mdi-numeric-14-circle" },
    // { text: "Fifteen", value: 15, icon: "mdi-numeric-15-circle" },
    // { text: "Sixteen", value: 16, icon: "mdi-numeric-16-circle" },
    // { text: "Seventeen", value: 17, icon: "mdi-numeric-17-circle" },
    // { text: "Eighteen", value: 18, icon: "mdi-numeric-18-circle" },
    // { text: "Nineteen", value: 19, icon: "mdi-numeric-19-circle" },
    // { text: "Twenty", value: 20, icon: "mdi-numeric-20-circle" },
  ])
  // Testing
  // function addTab() {
  //   items.push({
  //     text: `New Tab ${items.length + 1}`,
  //     value: items.length + 1,
  //     icon: "mdi-plus-circle",
  //   })
  // }
  function addTab(item: CustomTabItem) {
    if(item.action == 'Get'){
      if(item.repeatable == false){
        const index = items.findIndex((item) => item.value)
        items.splice(index, 1)
      }
      items.push(item)
    }
    else if(item.action == 'Put'){
      const index = items.findIndex((item) => item.value)
      items.splice(index, 1)
      items.push(item)
    }
  }
  return {
    items,
    tab,
    addTab,
  }
})
