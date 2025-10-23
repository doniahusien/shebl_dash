<template>
  <div class="notification p-3 rounded-3">
    <div
      class="flex lg:items-center items-start justify-between lg:flex-row flex-col"
    >
      <div class="lg:flex hidden items-start gap-3">
        <div
          class="notification-icon flex align-items-center justify-content-center rounded-circle"
        >
          <i class="fa-regular fa-bell fs-5 text-primary" />
        </div>

        <div class="flex flex-col gap-3">
          <h5 class="mb-0 flex align-items-center gap-3 fw-semibold">
            <span class="text-primary">{{ notification.title }}</span>

            <v-badge dot color="#52B788" />
          </h5>

          <p class="mb-0 text-text">{{ notification.description }}</p>
        </div>
      </div>

      <div class="lg:hidden mb-5">
        <div class="flex items-center gap-3 mb-3">
          <div
            class="w-[43px] h-[43px] bg-[#edf0f9] flex align-items-center justify-content-center rounded-circle"
          >
            <i class="fa-regular fa-bell fs-5 text-primary" />
          </div>

          <h5 class="mb-0 flex align-items-center gap-3 fw-semibold">
            <span class="text-primary">{{ notification.title }}</span>

            <v-badge dot color="#52B788" />
          </h5>
        </div>

        <p class="mb-0 text-text text-sm ms-3">
          {{ notification.description }}
        </p>
      </div>

      <div class="flex lg:items-center lg:flex-row flex-col gap-3 lg:ms-0 ms-3">
        <div
          class="flex align-items-center gap-1 text-text lg:text-base text-sm"
        >
          <i class="fa-solid fa-cloud-sun" />

          <span>{{ notification.day }}</span>
        </div>

        <div
          class="flex align-items-center gap-1 text-text lg:text-base text-sm"
        >
          <i class="fa-regular fa-calendar-days" />

          <span>{{ notification.date }}</span>
        </div>

        <div
          class="flex align-items-center gap-1 text-text lg:text-base text-sm"
        >
          <i class="fa-solid fa-clock" />

          <span>{{ notification.time }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  notification: {
    type: Object,
    required: true,
    default: null,
  },
});
</script>

<style lang="scss" scoped>
.notification {
  background-color: #f2f5ff80;
  .notification-icon {
    width: 47px;
    height: 47px;
    background-color: #edf0f9;
  }
}
</style>
