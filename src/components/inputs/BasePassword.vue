<template>
  <div>
    <VeeField v-model="value" :name="name" v-slot="{ field, meta }">
      <div
        class="input_wrapper"
        :class="{
          error: !meta.valid && meta.touched,
        }"
      >
        <label
          v-if="label"
          :for="label"
          class="label !flex gap-2 capitalize items-center"
          :class="value ? 'label_active' : ''"
        >
          <input-icon v-if="labelIcon" :name="labelIcon" />

          {{ label ? $t(`LABELS.${label}`) : $t(`LABELS.${name}`) }}</label
        >
        <div class="relative">
          <div :class="icon ? 'with_icon' : ''">
            <svg-icon v-if="icon" class="icon" :name="icon" />

            <input
              v-bind="field"
              autocomplete="off"
              :placeholder="placeholder ? placeholder : $t('LABELS.password')"
              :type="!showPassword ? 'password' : 'text'"
            />
          </div>
          <button
            type="button"
            class="far absolute top-1/2 end-3 -translate-y-1/2 text-sub"
            :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"
            @click="showPassword = !showPassword"
          ></button>
          <button
            v-if="showCopy"
            type="button"
            class="far fa-copy absolute top-1/2 end-12 -translate-y-1/2 text-sub"
            @click="copyPassword(field.value)"
          ></button>
        </div>
        <VeeErrorMessage
          v-if="!meta.valid && meta.touched"
          :name="name"
          as="div"
          class="text-red-500"
        />
      </div>
    </VeeField>
  </div>
</template>

<script>
export default {
  // props: ["modelValue", "name", "label", "placeholder", "icon", "labelIcon","showCopy"],
  props: {
    modelValue: {
      required: false,
    },
    name: {
      required: false,
    },
    label: {
      required: false,
    },
    placeholder: {
      required: false,
    },
    icon: {
      required: false,
    },
    labelIcon: {
      required: false,
    },
    showCopy: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      showPassword: false,
    };
  },
  methods: {
    async copyPassword(password) {
      try {
        await navigator.clipboard.writeText(password);
        console.log("Password copied to clipboard!");
      } catch (error) {
        console.error("Failed to copy password: ", error);
      }
    },
  },

  computed: {
    value: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
  },
};
</script>

<style lang="scss"></style>
