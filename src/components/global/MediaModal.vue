<template>
  <div
    @click="$emit('close')"
    class="!fixed !top-0 !left-0 !w-screen !h-screen bg-[#00000057] z-50 flex justify-center items-center"
  >
    <div class="max-w-[600px] bg-white rounded-3xl" @click.stop>
      <video controls v-if="type == 'video'">
        <source :src="preview" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <img :src="preview" v-if="type == 'image'" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  preview: {
    required: false,
  },
  type: {
    required: true,
  },
});
</script>
