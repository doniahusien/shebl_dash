<script lang="ts" setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { useI18n } from "vue-i18n";
import { ListType } from "./types";
import List from "./List.vue";
interface Props {
  label: string;
  lists: ListType[];
}

defineProps<Props>();

const { t } = useI18n();
</script>

<template>
  <template v-if="label">
    <Disclosure v-slot="{ open }" :defaultOpen="true">
      <DisclosureButton
        class="flex items-center justify-between text-sub w-full mb-1"
      >
        <p class="text-sm">
          <span>{{ label }}</span>
        </p>
        <i :class="`fa-solid ${open ? 'fa-angle-up' : 'fa-angle-down'}`" />
      </DisclosureButton>

      <DisclosurePanel as="ul">
        <template v-for="(list, index) in lists">
          <List :list="list" :key="`list-${index}`" v-if="!list.permission" />
        </template>
      </DisclosurePanel>
    </Disclosure>
  </template>
  <template v-else>
    <ul>
      <List
        v-for="(list, index) in lists"
        :key="`single-list-${index}`"
        :list="list"
      />
    </ul>
  </template>
</template>

<style lang="scss" scoped></style>
