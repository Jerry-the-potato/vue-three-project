<template>
  <div ref="vtab" id="vtab">
    <v-tabs
      show-arrows
      v-model="tab"
      color="white"
      height="60"
      slider-color="#f78166"
      :update="updateTab()"
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
import { useWorkStore } from "@/stores/workStore";
import { storeToRefs } from "pinia";
import useRouter from "@/utils/routerUtils"

const workStore = useWorkStore()
const router = useRouter()
const { items, tab } = storeToRefs(workStore)
const { addTab } = workStore;

const updateTab = async () => {
  const item = workStore.items.find((item) => item.value == workStore.tab)
  if(item == undefined) return
  await router.setRouter(item.id, item.url, item.value)
}

const slideGroupContentRef = ref<HTMLElement | null>();
const slideGroupContent = ref<HTMLElement | null>();

onMounted(() => {
  slideGroupContentRef.value = vtab.value.querySelector(".v-slide-group__container");
  slideGroupContent.value = vtab.value.querySelector(".v-slide-group__content");
});

const useKey = ref(true); // 暫時不使用 key 因為會干擾分頁動畫

const draggedButton = ref<HTMLButtonElement | null>();
const islastDragged = ref(false)
const isUpdate = ref(false)
const vtab = ref()

const draggable = ref()
draggable.value = useDraggable(slideGroupContent, items, {
  animation: 250,
  onChoose(event: SortableEvent) {
    tab.value = Number((event.item as HTMLButtonElement).value)
    console.log("choose", tab.value)
    isUpdate.value = false
  },
  onStart(event: SortableEvent) {
    draggedButton.value = event.item as HTMLButtonElement
    console.log("start", draggedButton.value);
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

const show = ref(false)
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
