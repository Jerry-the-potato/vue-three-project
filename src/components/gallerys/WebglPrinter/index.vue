<template>
  <v-container fluid class="gallery w-full">
    <v-row>
      <v-col cols="4 scene gallery">
        <Scene order="XYZ" :view="CameraViewType.FrontView"/>
      </v-col>
      <v-col cols="4 scene gallery">
        <Scene order="XYZ" :view="CameraViewType.BackView"/>
      </v-col>
      <v-col cols="4 scene gallery">
        <Scene order="XZY" :view="CameraViewType.SideView"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { CameraViewType } from "@/types/CameraViewType"
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
