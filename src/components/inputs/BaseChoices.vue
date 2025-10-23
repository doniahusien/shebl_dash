<template>
  <!-- field -->
  <VeeField :name="name" v-slot="{ meta }">
    <div
      class="select_wrapper"
      :class="{
        error: !meta.valid && meta.touched,
      }"
    >
      <RadioGroup v-model="currentValue">
        <!-- <RadioGroupLabel class="sr-only">size</RadioGroupLabel> -->
        <RadioGroupLabel class="text-sub font-medium">{{
          label
        }}</RadioGroupLabel>
        <div class="space-y-2 mt-2">
          <RadioGroupOption
            as="template"
            v-for="option in options"
            :key="option.name"
            :value="option"
            v-slot="{ active, checked }"
            @click="selectOption(option)"
          >
            <div
              :class="[
                active ? 'shadow-md bg-gray-400' : '',
                checked ? 'bg-sky-900/75 text-primary ' : 'bg-white ',
              ]"
              class="relative flex cursor-pointer rounded-xl px-5 py-2 border border-[#F1F1FF] focus:outline-none"
            >
              <div class="flex w-full items-center justify-between">
                <div class="flex items-center">
                  <div class="text-sm">
                    <RadioGroupLabel
                      as="p"
                      :class="checked ? 'text-primary' : 'text-gray-900'"
                      class="font-medium"
                    >
                      {{ option.name }} ({{ option.price }})
                    </RadioGroupLabel>
                    <RadioGroupDescription
                      as="span"
                      :class="checked ? 'text-sky-100' : 'text-gray-500'"
                      class="inline"
                    >
                      <span class="!text-primary">({{ option.size }} gm)</span>
                    </RadioGroupDescription>
                  </div>
                </div>
              </div>
            </div>
          </RadioGroupOption>
        </div>
      </RadioGroup>
      <VeeErrorMessage
        v-if="!meta.valid && meta.touched"
        :name="name"
        as="div"
        class="text-red-500 text-sm"
      />
    </div>
  </VeeField>
</template>

<script setup>
import { ref, onMounted, reactive, watch } from "vue";
// import { useField } from "vee-validate";
const emit = defineEmits(["update:itemValue"]);

import {
  RadioGroup,
  RadioGroupLabel,
  RadioGroupDescription,
  RadioGroupOption,
} from "@headlessui/vue";
const props = defineProps({
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
  optionLabel: {
    default: "name",
    required: false,
  },
  id: {
    type: String,
    required: true,
  },
  placeholder: {
    required: true,
  },
  itemValue: {
    requred: true,
  },
});
const currentValue = ref(null);
const optionName = ref(null);

// const filedValue = useField(props.name);

const selectOption = (option) => {
  // filedValue.setValue(option.id);
  // currentValue.value = option.id;
  currentValue.value = option.name;
  emit("update:itemValue", currentValue.value);

  optionName.value = option.name;
};
</script>
<style lang="scss">
.select_wrapper {
  &.error {
    .p-dropdown {
      @apply border-[red];
    }
  }
}
</style>
