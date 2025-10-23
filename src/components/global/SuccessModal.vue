<template>
  <notify
    class="z-[99999]"
    classes=" px-6  py-11 !w-full h-full max-h-[500px] flex flex-col justify-center  !max-w-[600px]"
  >
    <img
      src="@/assets/images/icons/success.gif"
      class="mx-auto mb-7"
      width="150"
      alt=""
    />
    <h3 v-if="title" class="text-text font-bold mb-4 text-2xl text-center">
      {{ title }}
    </h3>
    <p v-if="description" class="text-center text-sub">
      {{ description }}
    </p>
  </notify>
</template>

<script setup>
defineProps(["title", "description"]);
</script>

<style></style>
