import * as THREE from 'three';
import { useWindowSize } from './useWindowSize'
import { watch } from 'vue';
export default function addResize(renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera){
    const [width, height] = useWindowSize()
    const w = width.value
    const h = height.value
    renderer.setSize(w, h)
    camera.aspect = w/h
    camera.updateProjectionMatrix()
    
    watch([width, height], () => {
        renderer.setSize(w, h)
        camera.aspect = w/h
        camera.updateProjectionMatrix()
    })
}