<template>
  <div class="border rounded-lg p-5">
    <div
      class="flex items-start justify-between lg:flex-row flex-col-reverse lg:gap-5 gap-2 mb-5"
    >
      <p class="lg:leading-9 mb-0 lg:text-[16px] text-sm leading-7">
        {{ message.message }}
      </p>

      <p
        class="mb-0 flex items-center gap-2 text-green-500 min-w-[fit-content]"
        v-if="copied"
      >
        <i class="fa-solid fa-check-circle" />

        <span>{{ $t("TEXTS.copied") }}</span>
      </p>

      <button
        v-else
        class="flex items-center gap-2 text-fourth"
        @click="copyMessage"
      >
        <i class="fa-solid fa-copy"></i>

        <span>{{ $t("BUTTONS.copy") }}</span>
      </button>
    </div>

    <div class="mb-3 flex items-center gap-2">
      <h5 class="text-third mb-0">{{ $t("TEXTS.time") }}:</h5>

      <h5 class="mb-0 text-third">{{ message.time }}</h5>
    </div>

    <div class="flex items-center gap-2 mb-0">
      <h5 class="text-third mb-0">{{ $t("TEXTS.date") }}:</h5>

      <h5 class="mb-0 text-third">{{ message.date }}</h5>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  message: {
    required: false,
    default: "TITLES.finalDelete",
  },
});

const copied = ref(false);

function copyMessage() {
  navigator.clipboard.writeText(props.message.message);

  copied.value = true;
  setTimeout(() => (copied.value = false), 1000);
}
</script>
