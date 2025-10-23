<template>
  <div
    v-for="(data, index) in formData"
    :key="index"
    :class="data.fullWidth ? 'md:tw-col-span-2' : ''"
  >
    <component
      :is="data.inputType"
      :name="data.name"
      v-model="data.modelValue"
      :placeholder="data.placeholder"
      :label="data.label"
      :rules="data.rules"
      :type="data.type"
      :data="data"
      :modalName="data.modalName"
      :api-url="data.apiUrl"
      @imageDeleted="imageDeleted($event)"
    ></component>
  </div>
</template>

<script setup>
defineProps({
  formData: {
    required: true,
  },
});
</script>

<style></style>
