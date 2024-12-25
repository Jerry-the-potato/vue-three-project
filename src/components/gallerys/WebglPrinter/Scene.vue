<template>
  <div
    ref="div"
    class="absolute w-full h-full"
  />
</template>

<script lang="ts" setup>
import { useBitmapDatas } from "@/stores/bitmap"
import addResize from "@/composables/addResize"
import getShaderMaterial from "@/composables/shader"

import { onMounted, onBeforeUnmount, ref, toRefs, watchEffect } from "vue"
import { onActivated, onDeactivated } from "vue"

import * as THREE from "three"
import CameraControls from "camera-controls"
CameraControls.install({ THREE: THREE })

/* 可以用來傳入的 props */
const props = defineProps({
  order: {
    type: String,
    default: "XYZ", // 如果沒有從父元件傳入 order，預設為 "XYZ"
  },
  position: {
    type: Array<number>,
    default: [50, 50, 50]
  },
  target: {
    type: Array<number>,
    default: [50, 50, 0]
  },
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
addResize(renderer, camera)

const material = getShaderMaterial(props.order)

// 利用 pinia store 共享狀態
const bitmapData = useBitmapDatas()
bitmapData.loadImage()
const { maxPixel, width, height, boxes, positions, colors, alphas } =
  toRefs(bitmapData)

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
  if(order == 'XZY') return new THREE.Vector3(x, Number.isNaN(z) ? 0 : 0, y)
  if(order == 'XYZ') return new THREE.Vector3(x, -y, Number.isNaN(z) ? 0 : 0)
  return new THREE.Vector3(0, 0, 0)
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
  }
  // 更新 InstancedMesh 來應用變更
  instancedMesh.instanceMatrix.needsUpdate = true
  instancedMesh.count = count
  console.log(instancedMesh.count)

  // geometry.instanceCount = width * height
  //   geometry.setAttribute('offset', new THREE.Float32BufferAttribute(positions.value, 3))
  //   geometry.setAttribute('color', new THREE.InstancedBufferAttribute(colors.value, 3))
  //   geometry.setAttribute('alpha', new THREE.InstancedBufferAttribute(alphas.value, 1))
  //   geometry.setAttribute('height', new THREE.InstancedBufferAttribute(boxes.value, 1))

  if(props.order == "XYZ"){
    controls.setPosition(width.value / 2, -height.value / 2, 50)
    controls.setTarget(width.value / 2, -height.value / 2, 0)
  }
  else if(props.order == "XZY"){
    controls.setPosition(width.value / 2, 50, -height.value / 2)
    controls.setTarget(width.value / 2, 0, -height.value / 2)
  }
})
watchEffect(() => {
  if (positions.value) {
    geometry.setAttribute(
      "offset",
      new THREE.Float32BufferAttribute(positions.value, 3)
    )

    console.log(positions.value)
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

// 渲染循環
// function animate() {
//     requestAnimationFrame(animate);
//     renderer.render(scene, camera);
// }
// animate();

const frame = ref(0)
const render = () => {
  const delta = clock.getDelta()
  const hasControlsUpdated = controls.update(delta)
  frame.value = requestAnimationFrame(render)

  if (hasControlsUpdated) renderer.render(scene, camera)
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
    renderer.domElement.width = div.value.clientWidth
    renderer.domElement.height = div.value.clientHeight
  }
  frame.value = requestAnimationFrame(render)
})

// 組件卸載前清理
onBeforeUnmount(() => {
  cleanup()
})
</script>

<style scoped>
.full {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
