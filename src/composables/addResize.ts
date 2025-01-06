import * as THREE from 'three';
import { watch } from 'vue';
import { type Ref } from 'vue';
import { useContainerSize } from './useContainerSize';
export default function addResize(renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera, containerRef : Ref<HTMLElement | null>){
    const [width, height] = useContainerSize(containerRef)
    const w = width.value
    const h = height.value
    renderer.setSize(w, h)
    camera.aspect = w/h
    camera.updateProjectionMatrix()
    
    watch([width, height], () => {
        const w = width.value
        const h = height.value
        console.log(w, h)
        renderer.setSize(w, h)
        camera.aspect = w/h
        camera.updateProjectionMatrix()
    })
}