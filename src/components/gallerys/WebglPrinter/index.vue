<template>
  <v-container fluid class="gallery w-full">
    <v-row>
      <v-col cols="4 scene gallery">
        <Scene :id="usual" order="XYZ" :view="CameraViewType.FrontView"/>
      </v-col>
      <v-col cols="4 scene gallery">
        <Scene :id="usual" order="XYZ" :view="CameraViewType.BackView"/>
      </v-col>
      <v-col cols="4 scene gallery">
        <Scene :id="mirror" order="XZY" :view="CameraViewType.SideView" :url="landscapeImg"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { CameraViewType } from "@/types/CameraViewType"
import landscapeImg from '@/assets/A breathtaking landscape.webp'

const usual = Symbol("usual");
const mirror = Symbol("mirror");

</script>

<style lang="css">
.gallery {
  padding: 0;
  margin: 0;
}
.scene {
  height: 500px;
}
</style>
