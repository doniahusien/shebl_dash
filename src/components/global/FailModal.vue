<template>
  <notify class="z-[99999]" classes=" px-6  py-11 !w-full  !max-w-[350px]">
    <svg-icon name="warning-2" class="mb-4 mx-auto" />
    <h3 class="text-text font-bold mb-2 text-2xl text-center">
      {{ $t("Sorry") }}
    </h3>
    <p class="text-center text-sub">
      {{ failmessage }}
    </p>
  </notify>
</template>

<script setup>
defineProps(["failmessage"]);
</script>

<style></style>
