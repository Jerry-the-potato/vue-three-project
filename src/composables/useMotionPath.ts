import { ref } from "vue"
import { useMotionPathConfig } from "@/store/MotionPathConfig"

const config = useMotionPathConfig()
export interface MotionPath {
  getMotionPoint: () => { pointX: number; pointY: number; timer: number }
  newTarget: (targetX: number, targetY: number, frames: number) => void
  resetTo: (x: number, y: number) => void
  nextFrame: () => void
}
export function useMotionPath(x = 0, y = 0): MotionPath {
  // 去除多餘的 ref，只保留 timer 作為響應式狀態
  let pointX = x
  let pointY = y
  let originX = x
  let originY = y
  let targetX = x
  let targetY = y
  let period = 90
  const timer = ref(0) // 唯一需要響應式的 ref

  function newTarget(targetX: number, targetY: number, frames: number) {
    targetX = targetX
    targetY = targetY
    originX = pointX
    originY = pointY
    timer.value = frames
    period = frames
  }

  function resetTo(x = 0, y = 0) {
    pointX = x
    pointY = y
    timer.value = 0
  }

  function nextFrame() {
    if (timer.value < 0) return

    timer.value--
    if (timer.value === 0) {
      // 校正避免誤差
      pointX = targetX
      pointY = targetY
      return
    }

    const dX = targetX - originX
    const dY = targetY - originY
    const t = timer.value
    const p = period
    const linear = 1 / p
    const easeout = Math.pow((t + 1) / p, 2) - Math.pow(t / p, 2)
    const easein = Math.pow(1 - (t - 1) / p, 2) - Math.pow(1 - t / p, 2)

    const [a, b, c] = config.getPath()
    const [d, e, f] = config.getLeap()

    pointX += (a * linear + b * easein + c * easeout) * dX
    pointY +=
      (a * linear + b * easein + c * easeout) * dY +
      (d * linear + e * easein + f * easeout) *
        (-dX / 5 + (10 * -dX) / Math.abs(dX === 0 ? 1 : dX))
  }
  // 提供 getter 函數來取得最新的 pointX 和 pointY 值
  function getMotionPoint(): { pointX: number; pointY: number; timer: number } {
    return { pointX, pointY, timer: timer.value }
  }

  return {
    getMotionPoint,
    newTarget,
    resetTo,
    nextFrame,
  }
}
