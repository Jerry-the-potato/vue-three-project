<script lang="ts" setup>
import { onMounted, ref, reactive, type PropType } from "vue"
import { type MotionPath } from "@/composables/useMotionPath"
import ParticleSystem from '@/composables/particleSystem';
import useAverager from "@/composables/averager";
import { useMotionPathConfig } from '@/store/MotionPathConfig.js';
const props = defineProps({
  mouseMotion: {
    type: Object as PropType<MotionPath>,
    required: true,
  },
  max: {
    type: Number,
    required: true,
  },
  ratio: {
    type: Number,
    required: true,
  },
})

const config = useMotionPathConfig()

// 定義 ParticleSystem 類型
interface ParticleSystemState {
  sort: ParticleSystem;
  ctx: CanvasRenderingContext2D | null;
  columns: number;
}

const frame = useAverager(60);

// 設置為響應式狀態
const system = reactive<ParticleSystemState>({
  sort: new ParticleSystem(window.innerWidth / 2, window.innerHeight / 2),
  ctx: null,
  columns: 10,
});

const timer = ref<number>(0); // 用於將來的時間管理或控制

// 設定畫布
const setCanvas = (canvas: HTMLCanvasElement, log: HTMLDivElement): void => {
  // system.sort.log = log;
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

const log = ref<HTMLDivElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
onMounted(() => {
  if(canvas.value && log.value)
  setCanvas(canvas.value, log.value)
})

</script>

<template>
  <Box>
    <v-container class="pa-0" ref="section" id="S3">
      <v-row>
        <!-- Canvas Section -->
        <v-col cols="12" sm="8">
          <v-card>
            <v-card-title>
              <h3>粒子系統</h3>
            </v-card-title>
            <v-card-text>
              <canvas
                ref="canvas"
                :width="max * ratio"
                :height="ratio * max * ratio"
              ></canvas>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Control Panel -->
        <v-col cols="12" sm="4">
          <v-card>
            <v-card-title>
              <h3>控制面板</h3>
            </v-card-title>
            <v-card-text>
              <!-- Path Configuration -->
              <v-form>
                <v-text-field
                  label="linear"
                  type="number"
                  @change="setPath"
                  id="leapLinear"
                  v-model="pathConfig.linear"
                />
                <v-text-field
                  label="easein"
                  type="number"
                  @change="setPath"
                  id="leapEasein"
                  v-model="pathConfig.easein"
                />
                <v-text-field
                  label="easeout"
                  type="number"
                  @change="setPath"
                  id="leapEaseout"
                  v-model="pathConfig.easeout"
                />
              </v-form>

              <!-- Sorting Algorithms Controls -->
              <v-btn @click="start" id="bubbleSort" block
                >泡沫排序</v-btn
              >
              <v-btn @click="start" id="selectionSort" block
                >選擇排序</v-btn
              >
              <v-btn @click="start" id="insertionSort" block
                >插入排序</v-btn
              >
              <v-btn @click="start" id="quickSort" block>快速排序</v-btn>
              <v-btn @click="start" id="mergeSort" block>合併排序</v-btn>
              <v-btn @click="start" id="heapSort" block>堆排序</v-btn>
              <v-btn @click="start" id="shellSort" block>希爾排序</v-btn>
              <v-btn @click="start" id="countingSort" block
                >計數排序</v-btn
              >
              <v-btn @click="start" id="randomSort" block>打亂</v-btn>
              <v-btn @click="start" id="instantRandomSort" block
                >立刻打亂</v-btn
              >
              <v-btn @click="cancel" id="cancelSort" block>取消</v-btn>
              <v-btn @click="stepByStep" id="stepByStep" block
                >一步一步來</v-btn
              >
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Log Section -->
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>
              <h3>排序紀錄</h3>
            </v-card-title>
            <v-card-text>
              <div ref="log" id="sortLog">
                <p>碰撞模擬和重力引擎</p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </Box>
</template>

<script lang="ts" setup>
//
</script>

<style scoped>
section {
  position: relative;
  width: 100%;
  height: 100%;
}
canvas {
  position: absolute;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
