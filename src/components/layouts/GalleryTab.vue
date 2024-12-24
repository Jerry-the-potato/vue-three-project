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
        :class="{'tab': true, ' opacity-0': item.value == Number(draggedButton?.value)}"
      />
    </v-tabs>
  </div>

  <v-tabs-window
    v-model="tab"
    direction="vertical"
    selected-class="breadcrumb-enter"
  >
    <v-tabs-window-item
      v-for="(item) in items"
      :key="useKey ? item.value : undefined"
      :value="item.value"
      class="pa-4 breadcrumb"
      leave-class="breadcrumb-leave"
    >
      我是麵包屑 > 的小孩 > 孫子 > {{ item.value }}
      <v-btn @click="addTab">
        Add Tab
      </v-btn>
    </v-tabs-window-item>
  </v-tabs-window>
</template>

<script lang="ts" setup>
import { VTabsWindow } from "vuetify/components/VTabs";
import { useDraggable, type SortableEvent } from "vue-draggable-plus";
import { useAppStore } from "@/stores/app";
import { storeToRefs } from "pinia";

const store = useAppStore();
const { items, tab } = storeToRefs(store);
const { addTab } = store;

const slideGroupContentRef = ref<HTMLElement | null>();
const slideGroupContent = ref<HTMLElement | null>();

onMounted(() => {
  slideGroupContentRef.value = vtab.value.querySelector(
    ".v-slide-group__container"
  );
  slideGroupContent.value = vtab.value.querySelector(".v-slide-group__content");
});

const useKey = ref(false); // 暫時不使用 key 因為會干擾分頁動畫

const draggedButton = ref<HTMLButtonElement | null>();
const islastDragged = ref(false)
const isUpdate = ref(false)
const vtab = ref()

const draggable = ref()
draggable.value = useDraggable(slideGroupContent, items, {
  animation: 250,
  onStart(event: SortableEvent) {
    draggedButton.value = event.item as HTMLButtonElement
    console.log("start", draggedButton.value);
    isUpdate.value = false
    islastDragged.value = true
  },
  onEnd() {
    console.log("end");
    islastDragged.value = false
    draggedButton.value = null
  },
  onUpdate() {
    console.log("update");
    isUpdate.value = true;
  },
  chosenClass: 'tab-chosen',
  easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
});
</script>

<style scoped>
.breadcrumb-enter {
  animation: fadeIn 1.5s forwards;
}
.breadcrumb {
  transition: all 1s;
}
.breadcrumb-leave {
  animation: fadeOut 0.5s forwards;
}
.tab{
  /* 清空 transform 時間，draggable 元件才有控制權 */
  transition: transform;
  transition: opacity 1s;
}
.tab-chosen{
  opacity: 0;
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
