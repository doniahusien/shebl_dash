<template>
  <div class="flex flex-col items-center justify-center gap-3 text-center">
    <img
      src="@/assets/images/403.png"
      alt="unauthorized"
      class="w-[400px] h-[300px]"
    />
    <h1 class="font-semibold text-2xl">{{ $t("LABELS.too_many_request") }}</h1>
    <p class="text-sub">{{ $t("LABELS.access_exceed") }}.</p>

    <button
      :disabled="seconds != 0 || minutes != 0"
      class="base-btn"
      @click="router.back()"
    >
      {{ $t("LABELS.reload") }}
    </button>
    <span class="text-primary font-medium">
      <bdi>00:{{ seconds < 10 ? "0" : "" }}{{ seconds }}</bdi>
    </span>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";

const router = useRouter();

const seconds = ref(60);
const minutes = ref(0);

function countDown() {
  seconds.value = 60;
  let secondsInterval = setInterval(() => {
    if (seconds.value <= 0) {
      clearTimeout(secondsInterval);
      router.back();
      if (minutes.value == 0) return;
    }
    seconds.value--;
  }, 1000);
}

onMounted(() => {
  countDown();
});
</script>
