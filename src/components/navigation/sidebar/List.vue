<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { ListType } from "./types";
interface Props {
  list: ListType;
}
defineProps<Props>();

const route = useRoute();

const { t } = useI18n();

const escapeRegExpMatch = (s: string) =>
  s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");

const isExactMatch = (str: string, match: string) => {
  const escapedMatch = escapeRegExpMatch(match);
  const regex = new RegExp(`(^|[\\/])${escapedMatch}($|[\\/])`);
  return regex.test(str);
};
</script>

<template>
  <li
    :class="{
      active:
        isExactMatch(route.path, list.active) ||
        (route.path === '/' && list.active === 'home-page'),
    }"
    class="flex items-center"
  >
    <router-link :to="`/${list.path}`" exact class="flex items-center gap-1 w-full">
      <span>
        <svg-icon path="sidebar" class="size-6" :name="list.icon" />
      </span>
      {{ list.title }}
      <span
        v-if="list.count"
        class="bg-red-500 size-4 rounded-full text-[10px] text-white flex items-center justify-center"
      >
        {{ list.count }}
      </span>
    </router-link>
  </li>
</template>

<style lang="scss" scoped>
li {
  @apply mb-0 text-sub text-sm p-2 rounded-md overflow-hidden relative font-medium;
  /* Optionally style inner content here */
  &::before {
    content: "";
    @apply w-1 h-full absolute left-0 bg-white;
  }
  &.active {
    @apply bg-gradient-to-r from-primary/30 to-white text-primary;
    &::before {
      @apply bg-primary;
    }
  }
}

body[dir="rtl"] {
  li.active {
    @apply bg-gradient-to-l;
  }
}
</style>
