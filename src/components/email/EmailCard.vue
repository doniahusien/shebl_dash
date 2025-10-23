<template>
  <button
    type="button"
    class="email w-100 lg:p-6 p-3 rounded-3 d-flex align-items-start gap-3"
    :class="active && 'active'"
    @click="$emit('openEmail', email)"
  >
    <div class="lg:block hidden flex-grow-1">
      <div
        class="w-[56px] h-[56px] bg-[#edf0f9] flex-grow-1 d-flex align-items-center justify-content-center rounded-circle"
      >
        <i class="fa-regular fa-envelope text-primary text-lg" />
      </div>
    </div>

    <div class="lg:block hidden text-start">
      <h5 class="title text-primary !text-lg !font-semibold mb-4">
        {{ email.title }}
      </h5>

      <p class="text-text description mb-7 text-[16px]">
        {{ email.description }}
      </p>

      <div class="d-flex align-items-center gap-5">
        <div class="d-flex align-items-center gap-2 text-text text-sm">
          <i class="fa-regular fa-calendar-days" />

          <span class="d-inline-block mt-1">{{ email.date }}</span>
        </div>

        <div class="d-flex align-items-center gap-2 text-text text-sm">
          <i class="fa-solid fa-clock" />

          <span class="d-inline-block mt-1">{{ email.time }}</span>
        </div>
      </div>
    </div>

    <div class="lg:hidden block">
      <div class="flex items-center gap-2.5 mb-3">
        <div
          class="w-[47px] h-[47px] bg-[#edf0f9] d-flex align-items-center justify-content-center rounded-circle"
        >
          <i class="fa-regular fa-envelope text-primary" />
        </div>

        <h5 class="text-primary !font-medium text-[18px]">
          {{ email.title }}
        </h5>
      </div>

      <div class="ps-2">
        <p class="text-text mb-3 leading-7 font-light text-[16px] text-start">
          {{ email.description }}
        </p>

        <div class="border-t pt-3 font-light">
          <div class="d-flex align-items-center gap-2 text-text text-sm mb-3">
            <i class="fa-regular fa-calendar-days" />

            <span class="d-inline-block mt-1">{{ email.date }}</span>
          </div>

          <div class="d-flex align-items-center gap-2 text-text text-sm">
            <i class="fa-solid fa-clock" />

            <span class="d-inline-block mt-1">{{ email.time }}</span>
          </div>
        </div>
      </div>
    </div>
  </button>
</template>

<script setup>
defineProps({
  email: {
    type: Object,
    required: true,
    default: null,
  },
  active: {
    type: Boolean,
    required: true,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.email {
  &:hover,
  &.active {
    background-color: #f8faff;
  }
  .title {
    font-size: 24px;
  }
  .description {
    line-height: 37px;
  }
}
</style>
