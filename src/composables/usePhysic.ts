import { ref, reactive } from 'vue';
import ParticleSystem from './particleSystem';
import Averager from "./averager.js";
import { useMotionPathConfig } from '@/store/MotionPathConfig.js';
const config = useMotionPathConfig()

// 定義 ParticleSystem 類型
interface ParticleSystemState {
  sort: ParticleSystem;
  ctx: CanvasRenderingContext2D | null;
  columns: number;
}

// 定義方法返回的型別
interface ParticleSystemMethods {
  setCanvas: (canvas: HTMLCanvasElement, log: boolean) => void;
  update: () => void;
  render: () => void;
  start: (e: Event) => void;
  cancel: () => void;
  stepByStep: () => void;
  setEase: (leapLinear: number, leapEasein: number, leapEaseout: number) => void;
}

export function useParticleSystem(): ParticleSystemState & ParticleSystemMethods {
  const frame = new Averager(60);

  // 設置為響應式狀態
  const system = reactive<ParticleSystemState>({
    sort: new ParticleSystem(window.innerWidth / 2, window.innerHeight / 2),
    ctx: null,
    columns: 10,
  });

  const timer = ref<number>(0); // 用於將來的時間管理或控制

  // 設定畫布
  const setCanvas = (canvas: HTMLCanvasElement, log: boolean): void => {
    system.sort.log = log;
    system.ctx = canvas.getContext("2d");
    if (system.ctx) {
      system.ctx.lineCap = 'butt';
      system.ctx.textAlign = 'center';
    }
  };

  // 更新粒子系統
  const update = (): void => {
    system.sort.update();
  };

  // 渲染粒子系統
  const render = (): void => {
    if (system.ctx) {
      system.sort.getRender(system.ctx);
    }
  };

  // 開始排序
  const start = (e: Event): void => {
    const ID = (e.target as HTMLElement).id;
    if (!system.sort[ID]) {
      console.warn("invalid function name. Button id " + ID + " is not any of sortFunctions");
      return;
    }
    system.sort.start(ID, system.columns);
  };

  // 取消排序
  const cancel = (): void => {
    system.sort.isSorting = false;
    system.sort.send("Sorting is interrupted!");
  };

  // 逐步進行排序
  const stepByStep = (): void => {
    system.sort.isSorting = true;
    system.sort.isStoping = true;
    system.sort.send("Sorting is proceeding step by step. Click again!");
  };

  // 設定路徑
  const setEase = (leapLinear: number, leapEasein: number, leapEaseout: number): void => {
    config.resetLeap(leapLinear, leapEasein, leapEaseout)
  };

  return {
    ...system,
    setCanvas,
    update,
    render,
    start,
    cancel,
    stepByStep,
    setEase,
  };
}
