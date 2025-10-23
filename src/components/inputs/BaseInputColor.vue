<template>
  <VeeField :type="type" :name="name" v-slot="{ field, meta }">
    <div
      class="input_wrapper"
      :class="[
        {
          error: !meta.valid && meta.touched,
          prepend: prepend,
        },
        classes,
      ]"
    >
      <label
        :for="id"
        v-if="label"
        class="label !flex gap-2 capitalize items-center"
      >
        <input-icon classes=" icon" v-if="labelIcon" :name="labelIcon" />

        {{ label }}</label
      >
      <label
        v-if="id"
        class="relative !w-full h-[54px] border !flex items-center border-line rounded-xl"
        :class="icon ? 'with_icon' : ''"
      >
        <svg-icon classes=" icon" v-if="icon" :name="icon" />

        <div
          class="flex w-full relative gap-1 justify-between items-center ps-14 pe-1"
        >
          <input
            v-bind="field"
            @input="updteValue($event.target.value)"
            :placeholder="placeholder"
            class="!text-start !px-0 !border-0 !shadow-none !text-text !font-medium"
          />

          <input
            class="!w-20 h-11 !p-0 !rounded-lg !overflow-hidden"
            type="color"
            :id="id"
            v-bind="field"
            :placeholder="placeholder"
            :autocomplete="false"
            @input="updteValue($event.target.value)"
          />
        </div>
        <div v-if="prepend" class="prepend">
          <slot name="prepend"></slot>
        </div>
      </label>
      <VeeErrorMessage
        v-if="!meta.valid && meta.touched"
        :name="name"
        as="div"
        class="text-red-500"
      />
    </div>
  </VeeField>
</template>

<script setup>
const props = defineProps({
  id: {
    required: true,
  },
  name: {
    required: true,
  },
  classes: {
    required: false,
  },

  label: {
    required: false,
  },
  step: {
    required: false,
  },
  prepend: {
    required: false,
  },
  icon: {
    required: false,
  },
  placeholder: {
    required: true,
  },
  labelIcon: {
    required: false,
  },
  value: {
    required: false,
  },
  type: {
    required: false,
    default: "color",
  },
});

const emit = defineEmits(["update:value", "input"]);

function updteValue(value) {
  emit("update:value", value);
  emit("input", value);
}
</script>

<style>
input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}
input[type="color"]::-webkit-color-swatch {
  border: none;
}
</style>
