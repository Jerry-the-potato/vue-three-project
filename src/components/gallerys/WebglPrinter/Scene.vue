<template>
  <div ref="div" class="w-full h-full" />
</template>

<script lang="ts" setup>
import { useBitmapDatas } from "@/stores/bitmap"
import getShaderMaterial from "@/composables/shader"
import defaultUrl from '@/assets/產品.jpg';

import { onMounted, onBeforeUnmount, ref, toRefs, watchEffect } from "vue"
import { onActivated, onDeactivated } from "vue"

import * as THREE from "three"
import CameraControls from "camera-controls"
import { CameraViewType } from "@/types/CameraViewType"
import { useContainerSize } from "@/composables/useContainerSize"
CameraControls.install({ THREE: THREE })

/* 可以用來傳入的 props */
const props = defineProps({
  id: {
    type: Symbol,
    default: Symbol("unique"),
  },
  order: {
    type: String,
    default: "XYZ", // 如果沒有從父元件傳入 order，預設為 "XYZ"
  },
  position: {
    type: Array<number>,
    default: [50, 50, 50],
  },
  target: {
    type: Array<number>,
    default: [50, 50, 0],
  },
  view: {
    type: Number,
    default: CameraViewType.Default,
    validator(value: number) {
      // 確保值符合列舉中的值
      return Object.values(CameraViewType).includes(value)
    },
  },
  url: {
    type: String,
    default: defaultUrl,
  }
})

const div = ref<HTMLElement | null>(null)

const clock = new THREE.Clock()
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
const renderer = new THREE.WebGLRenderer({ alpha: true })

// const controls = new OrbitControls( camera, renderer.domElement )
const controls = new CameraControls(camera, renderer.domElement)
const controlProps = {
  // enableDamping: true,
  // dampingFactor: 0.05,
  // zoomSpeed: 2,
  dollyToCursor: true,
} as Partial<CameraControls>
Object.assign(controls, controlProps)

const isUpdate = ref(false)


// 利用 pinia store 共享狀態
const bitmapData = useBitmapDatas()
const bitmap = bitmapData.getOrCreateBitmap(props.id, props.order)
bitmap.loadImage(props.url)
const { width, height } = toRefs(bitmap)

// const geometry = new THREE.InstancedBufferGeometry()

const getTransform = (
  x: number,
  y: number,
  z: number
): [number, number, number] => {
  if (props.order == "XYZ") return [x, y, z]
  if (props.order == "XZY") return [x, z, y]
  return [0, 0, 0]
}

bitmap.onImageLoaded(() => {

  //Default: CameraViewType.Custom
  let pos = getTransform(...props.position as [number, number, number])
  let tar = getTransform(...props.target as [number, number, number])
  const x = width.value / 2;
  const y = -height.value / 2;
  const z = 50;
  if (props.view == CameraViewType.FrontView) {
    pos = getTransform(x, y, z);
    tar = getTransform(x, y, 0);
  } else if (props.view == CameraViewType.BackView) {
    pos = getTransform(x, y, -z);
    tar = getTransform(x, y, 0);
  } else if (props.view == CameraViewType.SideView) {
    pos = getTransform(x * 1.5, -y * 1.5, z);
    tar = getTransform(x, -y, 0);
  }
  controls.setPosition(...pos)
  controls.setTarget(...tar)
})

const [offsetWidth, offsetHeight] = useContainerSize(div)
watch([offsetWidth, offsetHeight], () => {
  isUpdate.value = true
})
const frame = ref(0)
const render = () => {
  const delta = clock.getDelta()
  const hasControlsUpdated = controls.update(delta)
  frame.value = requestAnimationFrame(render)

  if (isUpdate.value) {
    const w = offsetWidth.value
    const h = offsetHeight.value
    renderer.setSize(w, h)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }
  if (hasControlsUpdated || isUpdate.value) renderer.render(bitmap.scene, camera)
  isUpdate.value = false;

}
onActivated(() => {
  frame.value = requestAnimationFrame(render)
})

onDeactivated(() => {
  cancelAnimationFrame(frame.value)
})

// 清理事件
const cleanup = () => { }

onMounted(() => {
  if (div.value) {
    div.value.appendChild(renderer.domElement)
    // renderer.domElement.width = div.value.clientWidth
    // renderer.domElement.height = div.value.clientHeight
    // renderer.domElement.style.width = div.value.clientWidth + "px"
    // renderer.domElement.style.height = div.value.clientHeight + "px"
  }
  frame.value = requestAnimationFrame(render)
})

// 組件卸載前清理
onBeforeUnmount(() => {
  cleanup()
})
</script>

<style scoped></style>
