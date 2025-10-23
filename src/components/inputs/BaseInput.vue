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
        :class="labelClass"
        class="label !flex gap-2 capitalize items-center"
      >
        <svg-icon v-if="labelIcon" :name="labelIcon" classes="text-xl" />

        {{ label }}
        <span v-if="optional" class="text-sub"
          >({{ $t("LABELS.optional") }})</span
        >
      </label>
      <div class="relative" :class="icon ? 'with_icon' : ''">
        <!-- <img class="icon" v-if="icon" :src="`/icons/${icon}`" alt="icon" /> -->
        <svg-icon v-if="icon" :name="icon" classes="text-xl icon text-sub" />

        <textarea
          v-if="type == 'textarea'"
          :id="id"
          v-bind="field"
          :placeholder="placeholder"
          @input="$emit('update:value', $event.target.value)"
          class="resize-none"
          :rows="rows"
        ></textarea>

        <input
          :disabled="disabled"
          :step="step"
          v-else
          :type="type"
          :id="id"
          v-bind="field"
          :placeholder="placeholder"
          :minlength="minlength"
          :maxlength="maxlength"
          :size="size"
          :pattern="pattern"
          @input="$emit('update:value', $event.target.value)"
          @change="$emit('change')"
          :autocomplete="autocomplete"
          :readonly="lockInput"
          @focus="lockInput = false; $emit('focus')"
        />
        <div v-if="prepend" class="prepend">
          <slot name="prepend"></slot>
        </div>
      </div>
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
import { useField } from "vee-validate";
import { watch, ref } from "vue";

const lockInput = ref(true);

const props = defineProps({
  id: {
    required: true,
  },
  disabled: {
    required: false,
  },
  name: {
    required: true,
  },
  classes: {
    required: false,
  },
  rows: {
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
  minlength: {
    required: false,
  },
  maxlength: {
    required: false,
  },
  size: {
    required: false,
  },
  pattern: {
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
  labelClass: {
    required: false,
  },
  type: {
    required: false,
    default: "text",
  },
  optional: {
    required: false,
    default: false,
  },
  autocomplete: {
    required: false,
    default: "off",
  },
});

const inputFiled = useField(props.name);

watch(
  () => props.value,
  (value) => {
    if (value || value == 0) {
      inputFiled.setValue(value);
    }
  },
  { immediate: true }
);
</script>

<style></style>
