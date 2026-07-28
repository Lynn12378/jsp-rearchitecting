<template>
  <WaterMaker
      :show="true"
      :default-display="true"
      :input-text="inputText"
  ></WaterMaker>
  <RouterView></RouterView>
</template>
<script setup>
import { ref } from "vue";
import WaterMaker from "@/components/common/WaterMaker.vue";
const inputText = ref('demo');
</script>