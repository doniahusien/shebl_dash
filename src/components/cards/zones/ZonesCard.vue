<template>
  <div class="zone_card" :class="{ active: item.is_active }">
    <img
      v-if="item.is_active"
      src="@/assets/images/map1.png"
      class="w-[230px] h-[184px] absolute top-1/2 -translate-y-1/2 end-2"
      width="230"
      height="184"
    />
    <img
      v-else
      src="@/assets/images/map.png"
      class="w-[230px] h-[184px] absolute top-1/2 -translate-y-1/2 end-2"
      width="230"
      height="184"
    />

    <div class="z-10 relative space-y-3">
      <h3 class="name">{{ item.name }}</h3>
      <div class="flex items-center">
        <p class="city">{{ $t("LABELS.Zone space") }}:</p>
        <div class="flex gap-3 items-center ms-auto flex-shrink-0">
          <global-switcher
            :id="item.id"
            :url="`features/${item.id}/toggle-active-item`"
            v-model:modalValue="item.is_active"
          />
          <action-menu
            class="ms-2"
            :edit="true"
            :remove="true"
            :item="item"
            :name="url"
            @reload="fetchData"
            @edit="emit('edit')"
            @remove="remove(item.id)"
          />
        </div>
      </div>
      <p class="city">{{ $t("LABELS.city") }} : {{ item.city?.name }}</p>
      <p class="city">
        {{ $t("LABELS.District") }} : {{ item.district?.name }}
      </p>
      <p class="postal_code">
        {{ item.postal_code }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  item: { required: true, type: Object },
  trashed: { required: false, type: Boolean },
  url: { required: true },
  activate: { required: false },
  name: {
    required: false,
  },
});
const switchValue = ref(true);
const showArchive = ref(false);

const emit = defineEmits(["remove", "reload", "edit"]);
function remove(id) {
  emit("remove", id);
}
function fetchData() {
  emit("reload");
}
</script>

<style lang="scss">
.zone_card {
  @apply bg-[#D1D1D1] rounded-3xl p-6 relative min-h-[184px];
  &::before {
    content: "";
    @apply absolute start-0 top-0 w-full h-full bg-[#d1d1d156]  rounded-3xl;
    transform-origin: top left; /* Set the origin to the top right */
    transform: rotate(2deg);
  }
  .name {
    @apply text-[#757575] mb-4 font-bold text-xl;
  }
  .city {
    @apply text-[#757575];
  }
  .postal_code {
    @apply text-[#4E5356];
  }
  .fa-ellipsis {
    color: #4e5356 !important;
  }

  &.active {
    @apply bg-primary;
    &::before {
      @apply bg-primary/30;
    }
    .name,
    .city,
    .postal_code {
      @apply text-white;
    }

    .fa-ellipsis {
      color: #fff !important;
    }
  }
  .v-switch__track {
    background-color: #fff !important;
  }
}
</style>
