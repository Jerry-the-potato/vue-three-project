import { ref, onMounted, onBeforeUnmount, watchEffect } from 'vue'
import { type Ref } from 'vue'
// 使用 Vue 的命名方式定义 composable
export function useContainerSize(containerRef : Ref<HTMLElement | null>, margin : number = 0) {
  const width = ref(0);
  const height = ref(0);

  const updateSize = () => {
    width.value = containerRef.value?.clientWidth ?? width.value - margin * 2
    height.value = containerRef.value?.offsetHeight ?? height.value - margin * 2
  };

  updateSize()

  onMounted(() => {
    containerRef.value?.addEventListener('resize', updateSize)
  });

  onBeforeUnmount(() => {
    containerRef.value?.removeEventListener('resize', updateSize)
  });

  // Watch for margin changes and update the size accordingly
  watchEffect(() => {
    updateSize()
  });

  return [ width, height ];
}