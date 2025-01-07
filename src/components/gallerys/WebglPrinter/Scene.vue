<template>
  <div ref="div" class="w-full h-full" />
</template>

<script lang="ts" setup>
import { useBitmapDatas } from "@/stores/bitmap"
import getShaderMaterial from "@/composables/shader"

import { onMounted, onBeforeUnmount, ref, toRefs, watchEffect } from "vue"
import { onActivated, onDeactivated } from "vue"

import * as THREE from "three"
import CameraControls from "camera-controls"
import { CameraViewType } from "@/types/CameraViewType"
import { useContainerSize } from "@/composables/useContainerSize"
CameraControls.install({ THREE: THREE })

/* 可以用來傳入的 props */
const props = defineProps({
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
    default: undefined,
  }
})

const div = ref<HTMLElement | null>(null)
const group = ref(new THREE.Group())

const clock = new THREE.Clock()
const scene = new THREE.Scene()
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

const axis = new THREE.AxesHelper(300)
scene.add(axis)
scene.add(group.value)
const isUpdate = ref(false)

const material = getShaderMaterial(props.order)

// 利用 pinia store 共享狀態
const bitmapData = useBitmapDatas()
bitmapData.loadImage(props.url)
const { maxPixel, width, height, boxes, positions, colors, alphas } = toRefs(bitmapData.bitmap)

// const geometry = new THREE.InstancedBufferGeometry()

const geometry = new THREE.BoxGeometry(1, 1, 1)
// geometry.setAttribute('position', baseGeometry.getAttribute('position'))
// 創建 InstancedMesh
const instancedMesh = new THREE.InstancedMesh(
  geometry,
  material,
  Math.pow(maxPixel.value, 2)
)
scene.add(instancedMesh)

const transform = (order: string, position: Array<number>): THREE.Vector3 => {
  const [x, y, z] = position
  if (order == "XZY") return new THREE.Vector3(x, Number.isNaN(z) ? 0 : 0, y)
  if (order == "XYZ") return new THREE.Vector3(x, -y, Number.isNaN(z) ? 0 : 0)
  return new THREE.Vector3(0, 0, 0)
}

const getTransform = (
  x: number,
  y: number,
  z: number
): [number, number, number] => {
  if (props.order == "XYZ") return [x, y, z]
  if (props.order == "XZY") return [x, z, y]
  return [0, 0, 0]
}

bitmapData.onImageLoaded(() => {
  // 創建一個臨時的變換矩陣
  const matrix = new THREE.Matrix4()
  // 設置每個實例的位置
  const count = width.value * height.value
  for (let i = 0; i < count; i++) {
    const position = transform(props.order, bitmapData.getPosition(i))
    matrix.setPosition(position)
    instancedMesh.setMatrixAt(i, matrix)

    instancedMesh.frustumCulled = false;


  }
  // 更新 InstancedMesh 來應用變更
  instancedMesh.instanceMatrix.needsUpdate = true
  instancedMesh.count = count

  // geometry.instanceCount = width * height
  //   geometry.setAttribute('offset', new THREE.InstancedBufferAttribute(positions.value, 3))
  //   geometry.setAttribute('color', new THREE.InstancedBufferAttribute(colors.value, 3))
  //   geometry.setAttribute('alpha', new THREE.InstancedBufferAttribute(alphas.value, 1))
  //   geometry.setAttribute('height', new THREE.InstancedBufferAttribute(boxes.value, 1))

  //Default
  let pos = getTransform(...props.position as [number, number, number])
  let tar = getTransform(...props.target as [number, number, number])
  const x = width.value / 2;
  const y = -height.value / 2;
  const z = 50;
  if(props.view == CameraViewType.FrontView){
    pos = getTransform(x, y, z);
    tar = getTransform(x, y, 0);
  }else if(props.view == CameraViewType.BackView){
    pos = getTransform(x, y, -z);
    tar = getTransform(x, y, 0);
  }else if(props.view == CameraViewType.SideView){
    pos = getTransform(x * 1.5, -y * 1.5, z);
    tar = getTransform(x, -y, 0);
  }else if(props.view == CameraViewType.FrontView){

  }
  controls.setPosition(...pos)
  controls.setTarget(...tar)
})
watchEffect(() => {
  if (positions.value) {
    geometry.setAttribute(
      "offset",
      new THREE.InstancedBufferAttribute(positions.value, 3)
    )
  } // offset 是因為要改變 XYZ 軸向，請查看 shader
  if (colors.value) {
    geometry.setAttribute(
      "color",
      new THREE.InstancedBufferAttribute(colors.value, 3)
    )
  }
  if (alphas.value) {
    geometry.setAttribute(
      "alpha",
      new THREE.InstancedBufferAttribute(alphas.value, 1)
    )
  }
  if (boxes.value) {
    geometry.setAttribute(
      "height",
      new THREE.InstancedBufferAttribute(boxes.value, 1)
    )
  }
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
  
  if(isUpdate.value){
    const w = offsetWidth.value
    const h = offsetHeight.value
    renderer.setSize(w, h)
    camera.aspect = w/h
    camera.updateProjectionMatrix()
  }
  if (hasControlsUpdated || isUpdate.value) renderer.render(scene, camera)
  isUpdate.value = false;

}
onActivated(() => {
  frame.value = requestAnimationFrame(render)
})

onDeactivated(() => {
  cancelAnimationFrame(frame.value)
})

// 清理事件
const cleanup = () => {}

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
