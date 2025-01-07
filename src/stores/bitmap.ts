import { ref } from 'vue'
import { defineStore } from 'pinia'
import productImage from '@/assets/產品.jpg';

export const useBitmapDatas = defineStore('bitmap', () => {

  let lastUrl = ""
  const bitmap = reactive(
    {
      maxPixel: 64,
      width: 50,
      height: 50,
      boxes: new Float32Array(),
      colors: new Float32Array(),
      alphas: new Float32Array(),
      positions: new Float32Array(),
    }
  )
  
  const { maxPixel, width, height, boxes, colors, alphas, positions } = toRefs(bitmap);
  // const maxPixel = ref(64)
  // const width = ref(50)
  // const height = ref(50)
  // const boxes = ref(new Float32Array())
  // const colors = ref(new Float32Array())
  // const alphas = ref(new Float32Array())
  // const positions = ref(new Float32Array())
  const reRender = () => {
    // 原本是 React 要用 setRenderCount
    // 自行判斷是否要手動觸發渲染
  }
  
  let isWarn = false
  const warn = () => {
      console.warn("z is NaN because data is missing. data listed below: ")
      console.log(boxes.value)
  }
  const getPosition = (i : number, order : string = 'XYZ') => {
    const x = i % width.value;
    const y = Math.floor(i / width.value);
    const z = -boxes.value[i]/2;
    if(Number.isNaN(z) && isWarn == false){
      isWarn = true
      warn()
    }
    if(order == 'XYZ') return [x, y, z]
    // default
    return [0, 0, 0]
  }
  const eventHandlers = ref<(() => void)[]>([])
  const onImageLoaded = (handler: () => void) => {
    eventHandlers.value.push(handler)
  }

  // 讀取圖片的點陣圖
  const loadImage = (url = productImage) => {
    if(lastUrl == url) return
    lastUrl = url
    const image = new Image();
    // 載入圖片，並在圖片加載完成後處理
    image.onload = () => {
        // 創建 canvas 和 2D 上下文
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // 設定畫布大小為圖片的大小
        canvas.width = image.width;
        canvas.height = image.height;
        
        // 將圖片繪製到畫布上
        ctx?.drawImage(image, 0, 0);
        
        // 獲取畫布的像素數據
        const imageData = ctx?.getImageData(0, 0, image.width, image.height);

        if (!imageData) {
            console.error('Failed to get image data');
            return; // 或者進行其他錯誤處理
        }

        const data = imageData?.data; // 獲取 RGBA 數據 (每四個值為一個像素：r, g, b, a)
        
        // 灰階處理：將 RGB 轉換為灰度值，並填充到 colors
        function getGap(width: number, height: number){
            const max = Math.max(width, height);
            for(let i = Math.floor(max / maxPixel.value); i < max; i++){
                if(width % i == 0){
                    return i;
                }
            }
        }
        const gap = getGap(image.width, image.height) ?? 1;
        const w = Math.floor(image.width / gap);
        const h = Math.floor(image.height / gap);
        console.log(w,h)
        width.value = w;
        height.value = h;
        boxes.value = new Float32Array(w * h);
        colors.value = new Float32Array(w * h * 3);
        alphas.value = new Float32Array(w * h).fill(1);
        positions.value = new Float32Array(w * h * 3);

        for (let i = 0; i < w * h; i++) {
            const x = (i % w) * gap; // 依照新的寬度計算 x 座標
            const y = Math.floor(i / w) * gap; // 依照新的高度計算 y 座標        
            const pixelIndex = (y * image.width + x) * 4; // 每個像素有 4 個值 (r, g, b, a)
            const r = data[pixelIndex] ?? 0; // 紅色值
            const g = data[pixelIndex + 1] ?? 0; // 綠色值
            const b = data[pixelIndex + 2] ?? 0; // 藍色值
            
            // 計算灰度值 (用公式轉換 RGB 為灰度)
            const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            
            // 把灰度值填入 colors (使用灰度值填充 RGB)
            // colors.value.set([gray / 255, gray / 255, gray / 255], i * 3);
            colors.value.set([r / 255, g / 255, b / 255], i * 3);
            
            // 用來填充 boxes 的邏輯 (這裡我們可以根據灰度值來設置箱子的大小)
            boxes.value[i] = gray / 255 * 9 + 1; // 根據灰度值設置大小
        }
        for (let i = 0; i < boxes.value.length; i++) {
            positions.value.set(getPosition(i, 'XYZ'), i * 3); // 設置 x, y, z 的值
        }
        reRender();
        eventHandlers.value.forEach((handler) => handler())
    }
    image.src = url; // 替換為你的圖片路徑
  }

  return {
    bitmap,
    getPosition,
    loadImage,
    onImageLoaded,
  }
})
