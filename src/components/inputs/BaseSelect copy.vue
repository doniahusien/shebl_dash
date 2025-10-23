<template>
  <VeeField :name="name" v-slot="{ field, meta }">
    <div
      class="select_wrapper"
      :class="{
        error: !meta.valid && meta.touched,
      }"
    >
      <div class="mb-3">
        <label class="text-third block mb-3 lg:!text-lg !text-sm">{{
          label
        }}</label>
      </div>

      <MultiSelect
        v-bind="field"
        :options="options"
        optionLabel="name"
        :placeholder="placeholder"
        display="chip"
        class="w-full min-h-[60px]"
      >
        <template #option="slotProps">
          <div class="flex align-items-center" style="z-index: 9999999999999">
            {{ slotProps.option.name }}
          </div>
        </template>
      </MultiSelect>

      <VeeErrorMessage
        v-if="!meta.valid && meta.touched"
        :name="name"
        as="div"
        class="text-red-500 mt-2"
      />
    </div>
  </VeeField>
</template>

<script setup>
import MultiSelect from "primevue/multiselect";

defineProps({
  options: {
    required: true,
  },
  name: {
    required: true,
  },
  label: {
    type: String,
    required: false,
  },
  placeholder: {
    required: true,
  },
});
</script>
