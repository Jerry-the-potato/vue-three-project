<script lang="ts" setup>
import { computed } from "vue"
import { useWindowSize } from "@/composables/useWindowSize"
import { useMotionPath, type MotionPath } from "@/composables/useMotionPath"

const props = defineProps({
  margin: {
    type: Number,
    default: 0, // 或者設置 default: null
  },
  enableMouse: {
    type: Boolean,
    default: false,
  },
})

const [width, height] = useWindowSize(props.margin)
const max = computed(() => getMax(width.value, height.value))
const breakpoint = 992
const ratio = computed(() => (width.value > breakpoint ? 1 : 2))
const layoutStyle = computed(() => ({
  width: `${max.value}px`,
  height: `${max.value * ratio.value}px`,
  margin: `${props.margin}px auto`,
}))
const styleVars = computed(() => ({
  "--max": `${max.value}px`,
  "--height": `${max.value * ratio.value}px`,
  "--margin": `${props.margin}px auto`,
}))
function getMax(w: number, h: number) {
  if (w > breakpoint) return w < h ? w : h
  else return w * 2 < h ? w : h / 2
}

const mouseMotion: MotionPath = useMotionPath()
function handleMouseMove(e: MouseEvent) {
  const rect = (e.target as HTMLElement).getBoundingClientRect()
  const a = ratio.value * (e.pageX - rect.x) // / (rect.width);
  const b = ratio.value * (e.pageY - rect.y) // / (rect.height);
  const frames = 30
  mouseMotion.newTarget(a, b, frames)
}
</script>

<template>
  <div
    class="box"
    v-if="enableMouse"
    :style="layoutStyle"
    @mousemove="handleMouseMove"
  >
    <slot :mouseMotion :max="max" :ratio="ratio" />
  </div>

  <!-- 如果 enableMouse 為 false，則渲染這個沒有滑鼠事件的區塊 -->
  <div class="box" v-else :style="layoutStyle">
    <slot :max="max" :ratio="ratio" />
  </div>
</template>

<style scoped>
.box {
  width: var(--max);
  height: var(--height);
  margin: var(--margin);
  background-color: bisque;
  position: relative;
  aspect-ratio: 1/1;
  margin: 20px auto;
  /* background-color: #000; */
  border-radius: 2rem;
  overflow: hidden;
  scroll-behavior: smooth;
  transition: all 0.5 ease-out;
}
</style>
