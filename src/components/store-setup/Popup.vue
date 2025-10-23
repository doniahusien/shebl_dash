<template>
  <div
    class="popup-modal absolute flex flex-col justify-center items-center top-0 left-0 w-full h-[100vh] bg-[#FFFFFFDB]"
  >
    <button
      type="button"
      @click.stop="$emit('close')"
      class="p-4 absolute top-3 close-btn w-[58px] h-[58px] rounded-full border border-[#FDB933] text-[#FDB933] flex items-center justify-center"
    >
      <i class="fas fa-times text-xl"></i>
    </button>
    <div>
      <slot />
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.popup-modal {
  .close-btn {
    inset-inline-end: 1rem;
  }
}
</style>
