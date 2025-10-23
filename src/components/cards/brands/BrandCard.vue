<template>
  <div class="brands border border-line rounded-[15px] p-3">
    <div class="flex items-center flex-wrap gap-3">
      <img
        @error="imgError"
        :src="item.image"
        class="w-[136px] h-[128px] object-cover rounded-lg"
        :alt="item.name"
      />

      <div class="flex-grow flex items-start flex-col gap-3">
        <div class="flex w-full items-center justify-between gap-2">
          <h3 class="text-text font-semibold text-lg">
            {{ item.name }}
          </h3>

          <div class="flex items-center gap-2 flex-wrap">
            <div class="flex gap-3 items-center">
              <label class="capitalize text-sub mb-1"
                >{{ $t("LABELS.status") }}:</label
              >
              <global-switcher
                :id="item.id"
                :url="activate"
                v-model:modalValue="item.is_active"
              />
            </div>
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

        <div class="flex items-center flex-wrap gap-2" v-if="item.created_at">
          <p class="capitalize text-sub text-sm">
            {{ $t("TITLES.createdAt") }} :
          </p>
          {{ item.created_at }}
        </div>
        <div v-if="item.categories.length" class="flex-1">
          <p class="text-sub">{{ $t("LABELS.Categories") }} :</p>
          <div class="mt-1 flex items-center gap-2 flex-wrap">
            <div
              class="label-selected !py-1"
              v-for="item in item.categories"
              :key="item.id"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  item: { required: false, type: Object },
  trashed: { required: false, type: Boolean },
  url: { required: false },
  activate: { required: false },
  sub: {
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
.brands {
  .order_type {
    @apply py-2 px-4 text-center border border-line font-medium text-text rounded-xl;
    box-shadow: 0px 7px 58px 0px #b1b1b11a;
  }
}
</style>
