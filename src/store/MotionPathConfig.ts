// stores/pathConfig.js
import { defineStore } from 'pinia'

export const useMotionPathConfig = defineStore('MotionPathConfig', () => {
  // 用普通變數來管理狀態
  let linear = -1
  let easein = 0
  let easeout = 2
  let leapLinear = 0
  let leapEasein = -2
  let leapEaseout = 2

  // 設定動畫路徑的權重
  function resetPath(linearValue = 1, easeinValue = 0, easeoutValue = 0) {
    if (linearValue + easeinValue + easeoutValue !== 1) {
      console.warn("sum of parameters is recommended to be 1")
    }
    linear = linearValue
    easein = easeinValue
    easeout = easeoutValue
  }

  // 設定跳躍動畫的權重
  function resetLeap(linearValue = 0, easeinValue = 0, easeoutValue = 0) {
    leapLinear = linearValue
    leapEasein = easeinValue
    leapEaseout = easeoutValue
  }

  // 取得動畫路徑的值
  function getPath() {
    return [linear, easein, easeout]
  }

  // 取得跳躍動畫的值
  function getLeap() {
    return [leapLinear, leapEasein, leapEaseout]
  }

  return {
    resetPath,
    resetLeap,
    getPath,
    getLeap,
  }
})

