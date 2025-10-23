<template>
  <div class="flex min-h-[100vh]">
    <div
      class="auth_bg w-[650px] 3xl:w-[800px] hidden xl:flex flex-col relative"
    >
      <Navbar />
      <img
        src="@/assets/images/bg/logo.png"
        alt=""
        class="m-auto min-w-[130px]"
      />
    </div>
    <div
      class="max-w-[600px] px-10 p-4 w-full auth_wrapper flex flex-col mx-auto space-y-9 overflow-y-auto"
    >
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import Navbar from "@/layouts/auth/Navbar.vue";
</script>
<style lang="scss" scoped>
.auth_bg {
  background: url("@/assets/images/bg/logo_background.png");
  @apply bg-no-repeat bg-cover bg-sub/50;

}
.auth_wrapper {
  @media (max-width: 1200px) {
    @apply mx-auto p-4;
  }
}
</style>
