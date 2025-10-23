<template>
  <div class="flex gap-5 mb-4">
    <router-link v-if="back" :to="back" class="text-xl text-primary">
      <i
        class="fas"
        :class="$i18n.locale == 'ar' ? 'fa-arrow-right' : 'fa-arrow-left'"
      ></i>
    </router-link>
    <div v-if="icon">
      <img
        @error="imgError"
        width="55"
        class="rounded-full w-[55px] h-[55px] object-cover"
        height="55"
        :src="icon"
        :alt="title"
      />
    </div>
    <div class="flex flex-col justify-between">
      <div class="flex items-center gap-3">
        <h1 class="font-bold text-text text-xl md:text-2xl">
          {{ title }}
        </h1>
      </div>

      <ul class="flex items-center flex-wrap gap-2 mt-2 breadcrumb-list">
        <li v-for="(item, i) in items" :key="i" class="flex items-center gap-1">
          <img v-if="item.imgIcon" :src="fetchIcon(item.imgIcon)" alt="" />

          <router-link
            :to="item.path"
            class="text-decoration-none text-primary opacity-75 flex lg:flex-row flex-col items-center gap-3"
          >
            <span>{{ item.name }}</span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: {
    required: false,
  },
  back: {
    required: false,
  },
  icon: {
    required: false,
  },
  title: {
    required: false,
    default: "",
  },
});

const fetchIcon = (name) =>
  new URL(`../../assets/images/icons/sidebar/${name}`, import.meta.url).href;
</script>
<style lang="scss">
.breadcrumb-list {
  li {
    &:not(:last-child) {
      &::after {
        content: "\f105";
        font-family: "Font Awesome 6 Free";
        font-weight: 900;
        @apply inline-block text-primary ms-1;
      }
    }

    a.router-link-active.router-link-exact-active {
      @apply font-bold text-primary;
    }
  }
}
.v-locale--is-rtl {
  .breadcrumb-list {
    li {
      &:not(:last-child) {
        &::after {
          content: "\f104";
        }
      }
    }
  }
}
</style>
