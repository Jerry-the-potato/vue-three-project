<template>
  <div ref="vtab">
    <v-tabs
      v-model="tab"
      color="white"
      height="60"
      slider-color="#f78166"
    >
      <v-tab
        v-for="item in items"
        :key="item.value"
        :prepend-icon="item.icon"
        :text="item.text"
        :value="item.value"
        :class="{ 'opacity-0': item.value != tab || islastDragged }"
      >
      </v-tab>
    </v-tabs>
  </div>
  
  <Teleport :to="slideGroupContentRef" :disabled="!valid">
    <div class="absolute ">
      <div ref="el" class="v-slide-group v-slide-group--is-overflowing v-slide-group--mobile v-tabs--horizontal v-tabs--align-tabs-start">
        <v-tab
          v-for="item in items"
          :key="item.value"
          :prepend-icon="item.icon"
          :text="item.text"
          :value="item.value"
          :class="{ 'opacity-0': item.value == tab && !islastDragged }"
          @mousedown="onDown($event)"
          @mousemove="onMove($event)"
          @mouseup="onUp($event)"
          @mouseleave="onLeave($event)"
        >
        </v-tab>
      </div>
    </div>
  </Teleport>

  <v-tabs-window v-model="tab" direction="vertical" selectedClass="breadcrumb-enter">
    <v-tabs-window-item
      v-for="(item, index) in items"
      :key="useKey ? item.value : undefined"
      :value="item.value" class="pa-4"
      :style="{
        transition: `all ${isUpdate ? '0s' : '1s'}`, // breadcrumb
        animation: `fadeOut ${isUpdate ? '0s' : '0.5s'} forwards` // breadcrumb-leave
      }"
      >
      我是麵包屑 > 的小孩 > 孫子 > {{item.value}}
      <v-btn @click="addTab">Add Tab</v-btn>
    </v-tabs-window-item>
  </v-tabs-window>
</template>

<script lang="ts" setup>
import { VTabsWindow } from 'vuetify/components/VTabs';
import { VueDraggable } from 'vue-draggable-plus'
import { useDraggable } from 'vue-draggable-plus'
import { useAppStore } from '@/stores/app';
import { storeToRefs } from 'pinia'
import { Teleport } from 'vue';

const store = useAppStore()
const {items, tab} = storeToRefs(store)
const {addTab} = store

const slideGroupContentRef = ref<Element | null>()
const valid = ref(false)
onMounted(() => {
  // 確保在組件掛載後可以取得具有 class 'v-slide-group__content' 的元素
  slideGroupContentRef.value = vtab.value.querySelector('.v-slide-group__container')
  console.log(slideGroupContentRef.value)
  if(slideGroupContentRef.value) valid.value = true
});

const useKey = ref(false) // 暫時不使用 key 因為會干擾分頁動畫

const lastSelectedIndex = ref(items.value.findIndex(item => item.value === tab.value))
const lastSelectedItem = ref(items.value.find((item) => item.value === tab.value))
const focusedButton = ref<HTMLElement | undefined>()
const islastDragged = ref(false)
const isUpdate = ref(false)
const onDown = (e: MouseEvent) => {
  isUpdate.value = false
  const that = e.target as HTMLButtonElement
  const button = that.closest('button')
  // lastSelectedIndex.value = items.value.findIndex(item => item.value === Number(button?.value))
  const tar = [...vtabButtons.value].find((item) => item.value === button?.value)
  focusedButton.value = tar
  // const tar = vtabButtons.value.item(lastSelectedIndex.value)
  triggerMouseDown(tar, e.x, e.y)
}
const onMove = (e: MouseEvent) => {
  // const tar = vtabButtons.value[lastSelectedIndex.value]
  // triggerMouseMove(tar, e.x, e.y)
}
const onUp = (e: MouseEvent) => {
  console.log("up")
  const that = e.target as HTMLButtonElement
  const button = that.closest('button')
  // const selectIndex = items.value.findIndex(item => item.value === Number(button?.value))
  // if(lastSelectedIndex.value != selectIndex) return
  // const tar = [...vtabButtons.value].find((item) => item.value === button?.value)
  // const tar = vtabButtons.value.item(lastSelectedIndex.value)
  const tar = focusedButton.value
  triggerMouseUp(tar, e.x, e.y) // 失焦事件 blur
  tar?.click() // 點擊事件 tab.value
}
const onLeave = (e: MouseEvent) => {
  if(!islastDragged.value) return
  const that = e.target as HTMLButtonElement
  const button = that.closest('button')
  const tar = focusedButton.value
  triggerMouseUp(tar, e.x, e.y) // 失焦事件 blur
  // tar?.click() // 點擊事件 tab.value
}
const vtab = ref()
const vtabButtons = computed<NodeListOf<HTMLButtonElement>>(() => {
  return vtab.value?.querySelectorAll('button')
})
const position = computed(() => {
  const rect = vtabButtons.value[0].getClientRects()
  console.log(rect)
  return rect
})
const el = ref()
const draggable = useDraggable(el, items, {
  animation: 150,
  onStart() {
    console.log('start')
    isUpdate.value = false
    islastDragged.value = true
  },
  onEnd() {
    console.log('end')
    islastDragged.value = false
  },
  onUpdate() {
    console.log('update')
    isUpdate.value = true
  }
})


// 模擬 mousedown 事件
function triggerMouseDown(element: HTMLElement | undefined, x: number, y: number) {
  if(element == undefined) return
  const mouseDownEvent = new MouseEvent('mousedown', {
    bubbles: true,
    cancelable: true,
    clientX: x,  // 鼠標點擊位置的 x 坐標
    clientY: y,  // 鼠標點擊位置的 y 坐標
    view: window,
  });
  element.dispatchEvent(mouseDownEvent);
}

// 模擬 mousemove 事件
function triggerMouseMove(element: HTMLElement | undefined, x: number, y: number) {
  if(element == undefined) return
  const mouseMoveEvent = new MouseEvent('mousemove', {
    bubbles: true,
    cancelable: true,
    clientX: x,
    clientY: y,
    view: window,
  });
  element.dispatchEvent(mouseMoveEvent);
}

// 模擬 mouseup 事件
function triggerMouseUp(element: HTMLElement | undefined, x: number, y: number) {
  if(element == undefined) return
  const mouseUpEvent = new MouseEvent('mouseup', {
    bubbles: true,
    cancelable: true,
    clientX: x,
    clientY: y,
    view: window,
  });
  element.dispatchEvent(mouseUpEvent);
}

// 模擬 mouseleave 事件
function triggerMouseLeave(element: HTMLElement) {
  const mouseLeaveEvent = new MouseEvent('mouseleave', {
    bubbles: true,        // 設為 true，使事件可以冒泡
    cancelable: true,     // 允許取消事件的默認行為
    view: window,         // 事件所屬的視窗
    relatedTarget: null,  // 離開的目標元素
  });
  element.dispatchEvent(mouseLeaveEvent);
}

</script>

<style scoped>
.breadcrumb-enter {
  animation: fadeIn 1.5s forwards;
}
.breadcrumb{
  transition: all 1s;
}
.breadcrumb-leave {
  animation: fadeOut 0.5s forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}


</style>