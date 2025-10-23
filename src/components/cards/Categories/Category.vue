<template>
  <div class="border border-line rounded-[15px] p-3">
    <div class="flex items-center gap-3">
      <img
        @error="imgError"
        :src="item.image"
        class="w-[136px] h-[128px] object-cover rounded-lg"
        :alt="item.name"
      />

      <div class="flex-grow flex items-start flex-col gap-3">
        <div class="flex w-full items-center flex-wrap justify-between gap-2">
          <h3 class="text-text font-semibold text-lg">
            {{ item.name }}
          </h3>
          <div class="flex items-center gap-2">
            <action-menu
              class="ms-2"
              :edit="checkPermission('categories', 'update')"
              :remove="checkPermission('categories', 'destroy')"
              :item="item"
              :name="url"
              @reload="fetchData"
              @edit="emit('edit')"
              @remove="remove(item.id)"
            />
          </div>
        </div>
        <!-- <p
          class="font-light text-sm mb-2 leading-6 text-text max-w-[260px] line-clamp-2"
          v-if="!sub"
        >
          {{ item.desc }}
        </p> -->
        <div
          class="flex items-center flex-wrap gap-2"
          v-if="item.facility_type"
        >
          <p class="capitalize text-sub">{{ $t("LABELS.Facility") }} :</p>
          {{ item.facility_type?.name }}
        </div>
        <div class="flex items-center flex-wrap gap-2" v-if="item.parent">
          <p class="capitalize text-sub">{{ $t("LABELS.main-category") }} :</p>
          {{ item.parent?.name }}
        </div>
        <div class="flex items-center flex-wrap gap-2" v-else>
          <p class="capitalize text-sub">{{ $t("LABELS.subCategories") }} :</p>
          {{ item.numb_children ?? 0 }}
          <router-link
            :to="{
              name: 'sub-categories',
              params: { id: item.id },
            }"
          >
            <i class="text-blue fa-solid fa-link"></i>
          </router-link>
        </div>
        <div class="w-full flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center flex-wrap gap-2" v-if="item.created_at">
            <p class="capitalize text-sub text-sm">
              {{ $t("TITLES.createdAt") }} :
            </p>
            {{ item.created_at }}
          </div>
          <div class="flex gap-3 items-center">
            <label class="capitalize text-sub mb-1"
              >{{ $t("LABELS.status") }}:</label
            >
            <global-switcher
              :id="item.id"
              :url="activate"
              :disabled="!checkPermission('categories', 'update')"
              v-model:modalValue="item.is_active"
            />
          </div>
          <div class="flex gap-3 items-center">
            <label class="capitalize text-sub mb-1"
              >{{ $t("LABELS.showInHome") }}:</label
            >
            <global-switcher
              :disabled="!checkPermission('categories', 'update')"
              :id="item.id"
              :url="`categories/${item.id}/toggle-latest-category`"
              v-model:modalValue="item.is_latest"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { checkPermission } from "@/utils/permissions";
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
