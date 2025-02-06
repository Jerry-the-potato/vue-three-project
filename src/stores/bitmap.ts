import { ref } from 'vue'
import { defineStore } from 'pinia'
import productImage from '@/assets/產品.jpg';
import * as THREE from "three"
import getShaderMaterial from "@/utils/shader"

// 定義 Bitmap 的型別
interface Bitmap {
  id: symbol;
  scene: THREE.Scene;
  maxPixel: number;
  width: number;
  height: number;
  boxes: Float32Array;
  colors: Float32Array;
  alphas: Float32Array;
  positions: Float32Array;
  isWarn: boolean;
  eventHandlers: (() => void)[];
  onImageLoaded: (handler: () => void) => void;
  loadImage: (url: string) => void;
  image: HTMLImageElement;
}
const getPosition = (bitmap: Bitmap, i : number, order : string = 'XYZ') => {
  const x = i % bitmap.width;
  const y = Math.floor(i / bitmap.width);
  const z = -bitmap.boxes[i]/2;
  if(Number.isNaN(z) && bitmap.isWarn == false){
    bitmap.isWarn = true
    console.warn("z is NaN because data is missing. data listed below: ")
    console.log(bitmap.boxes)
  }
  if(order == 'XYZ') return [x, y, z]
  // default
  return [0, 0, 0]
}
// 定義模板
const createBitmapTemplate = (uniqueId: symbol) => {
  const bitmap: Bitmap = reactive({
    id: uniqueId,
    scene: shallowReactive(new THREE.Scene()),
    maxPixel: 64,
    width: 50,
    height: 50,
    boxes: new Float32Array(),
    colors: new Float32Array(),
    alphas: new Float32Array(),
    positions: new Float32Array(),
    isWarn: false,
    eventHandlers: [] as (() => void)[],
    onImageLoaded: function(handler){
      this.eventHandlers.push(handler)
    },
    image: new Image(),
    loadImage: function(url = productImage){
      console.log(url)
      if(this.image.src == url) return
      console.log(this.image.src)
      this.image.src = url;
    }
  })
  
      // 載入圖片，並在圖片加載完成後處理
  bitmap.image.onload = () => {
    
    // 創建 canvas 和 2D 上下文
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // 設定畫布大小為圖片的大小
    canvas.width = bitmap.image.width;
    canvas.height = bitmap.image.height;
    
    // 將圖片繪製到畫布上
    ctx?.drawImage(bitmap.image, 0, 0);
    
    // 獲取畫布的像素數據
    const imageData = ctx?.getImageData(0, 0, bitmap.image.width, bitmap.image.height);

    if (!imageData) {
        console.error('Failed to get image data');
        return; // 或者進行其他錯誤處理
    }

    const data = imageData?.data; // 獲取 RGBA 數據 (每四個值為一個像素：r, g, b, a)
    
    // 灰階處理：將 RGB 轉換為灰度值，並填充到 colors
    const getGap = (width: number, height: number) =>{
        const max = Math.max(width, height);
        for(let i = Math.floor(max / bitmap.maxPixel); i < max; i++){
            if(width % i == 0){
                return i;
            }
        }
    }
    const gap = getGap(bitmap.image.width, bitmap.image.height) ?? 1;
    const w = Math.floor(bitmap.image.width / gap);
    const h = Math.floor(bitmap.image.height / gap);
    console.log(w,h)
    bitmap.width = w;
    bitmap.height = h;
    bitmap.boxes = new Float32Array(w * h);
    bitmap.colors = new Float32Array(w * h * 3);
    bitmap.alphas = new Float32Array(w * h).fill(1);
    bitmap.positions = new Float32Array(w * h * 3);

    for (let i = 0; i < w * h; i++) {
        const x = (i % w) * gap; // 依照新的寬度計算 x 座標
        const y = Math.floor(i / w) * gap; // 依照新的高度計算 y 座標        
        const pixelIndex = (y * bitmap.image.width + x) * 4; // 每個像素有 4 個值 (r, g, b, a)
        const r = data[pixelIndex] ?? 0; // 紅色值
        const g = data[pixelIndex + 1] ?? 0; // 綠色值
        const b = data[pixelIndex + 2] ?? 0; // 藍色值
        
        // 計算灰度值 (用公式轉換 RGB 為灰度)
        const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        
        // 把灰度值填入 colors (使用灰度值填充 RGB)
        // bitmap.colors.set([gray / 255, gray / 255, gray / 255], i * 3);
        bitmap.colors.set([r / 255, g / 255, b / 255], i * 3);
        
        // 用來填充 boxes 的邏輯 (這裡我們可以根據灰度值來設置箱子的大小)
        bitmap.boxes[i] = gray / 255 * 9 + 1; // 根據灰度值設置大小
    }
    for (let i = 0; i < bitmap.boxes.length; i++) {
        bitmap.positions.set(getPosition(bitmap, i, 'XYZ'), i * 3); // 設置 x, y, z 的值
    }
    bitmap.eventHandlers.forEach((handler) => handler())
  }
  return bitmap
};

export const useBitmapDatas = defineStore('bitmap', () => {

  const bitmaps: Bitmap[] = ([]);

  // 新增功能
  function getOrCreateBitmap(uniqueId: symbol, order: string = "XYZ") {
    const existingBitmap = bitmaps.find(bitmap => bitmap.id == uniqueId);
    if(existingBitmap) return existingBitmap;

    const bitmap = createBitmapTemplate(uniqueId);
    bitmaps.push(bitmap);
  
    const group = ref(new THREE.Group())
    const axis = new THREE.AxesHelper(300)
    bitmap.scene.add(axis)
    bitmap.scene.add(group.value)
    
    const material = getShaderMaterial(order)
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    // 創建 InstancedMesh
    const instancedMesh = new THREE.InstancedMesh(
      geometry,
      material,
      Math.pow(bitmap.maxPixel, 2)
    )
    bitmap.scene.add(instancedMesh)
    
    watchEffect(() => {
      if (bitmap.positions) {
        geometry.setAttribute(
          "offset",
          new THREE.InstancedBufferAttribute(bitmap.positions, 3)
        )
      } // offset 是因為要改變 XYZ 軸向，請查看 shader
      if (bitmap.colors) {
        geometry.setAttribute(
          "color",
          new THREE.InstancedBufferAttribute(bitmap.colors, 3)
        )
      }
      if (bitmap.alphas) {
        geometry.setAttribute(
          "alpha",
          new THREE.InstancedBufferAttribute(bitmap.alphas, 1)
        )
      }
      if (bitmap.boxes) {
        geometry.setAttribute(
          "height",
          new THREE.InstancedBufferAttribute(bitmap.boxes, 1)
        )
      }
    })
    
    bitmap.onImageLoaded(() => {
      // 創建一個臨時的變換矩陣
      const matrix = new THREE.Matrix4()
      // 設置每個實例的位置
      const count = bitmap.width * bitmap.height
      for (let i = 0; i < count; i++) {
        const position = transform(order, getPosition(bitmap, i))
        matrix.setPosition(position)
        instancedMesh.setMatrixAt(i, matrix)
    
        instancedMesh.frustumCulled = false;
      }
      // 更新 InstancedMesh 來應用變更
      instancedMesh.instanceMatrix.needsUpdate = true
      instancedMesh.count = count
    })


    return bitmap;
  }
  
  const transform = (order: string, position: Array<number>): THREE.Vector3 => {
    const [x, y, z] = position
    if (order == "XZY") return new THREE.Vector3(x, Number.isNaN(z) ? 0 : 0, y)
    if (order == "XYZ") return new THREE.Vector3(x, -y, Number.isNaN(z) ? 0 : 0)
    return new THREE.Vector3(0, 0, 0)
  }

  return {
    getOrCreateBitmap,
  }
})
