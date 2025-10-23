<template>
  <v-pagination
    v-if="item && item.last_page > 1"
    v-model="page"
    :pages="item.last_page"
    variant="text"
    @update:modelValue="pushQuery"
    class="mt-auto"
    active-color="#6A449A"
  >
  </v-pagination>
</template>

<script setup>
import VPagination from "@hennge/vue3-pagination";
import "@hennge/vue3-pagination/dist/vue3-pagination.css";
import { useRoute, useRouter } from "vue-router";
import { ref, watch } from "vue";
const props = defineProps({
  item: {
    required: true,
  },
});

const route = useRoute();
const router = useRouter();

function changePage(e) {
  router.push({
    query: Object.assign({}, route.query, {
      page: page,
    }),
  });
}

const page = ref(1);
function pushQuery(page) {
  router.push({
    query: Object.assign({}, route.query, {
      page: page,
    }),
  });
}

watch(
  () => route.query.page,
  (value) => {
    if (value) {
      page.value = +route.query.page || 1;
    }
  },
  {
    immediate: true,
  }
);
</script>

<style lang="scss">
.v-pagination__next,
.v-pagination__prev {
  @apply flex items-center;
}
.Pagination {
  @apply justify-center;
  .Page {
    border: 1px solid var(--shadow_color);
    border-radius: 8px;
    width: 2.5rem;
    height: 2.5rem;
    font-weight: 500;
    @media (max-width: 576px) {
      width: 2.2rem !important;
      height: 2.2rem !important;
      margin: 2px !important;
    }

    @apply flex items-center text-sub justify-center;

    &.Page-active {
      // background: var(--main_color) !important;
      @apply text-[#f1f1ff];
    }
  }
}
.v-pagination__next {
  margin-inline-start: auto !important;
  button {
    @apply text-primary;

    &:disabled {
      @apply text-sub;
    }
  }
}
.v-pagination__prev {
  margin-inline-end: auto !important;
  button {
    @apply text-primary;
    &:disabled {
      @apply text-sub;
    }
  }
}

.v-btn--icon.v-btn--density-default {
  width: 2.5rem !important;
  height: 2.5rem !important;
  @media (max-width: 576px) {
    width: 2.2rem !important;
    height: 2.2rem !important;
    margin: 2px !important;
  }
}

[dir="rtl"] .PaginationControl svg {
  transform: rotate(180deg);
}
</style>
