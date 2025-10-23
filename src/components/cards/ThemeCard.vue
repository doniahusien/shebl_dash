<template>
  <base-card1>
    <div class="space-y-4">
      <div class="flex w-full items-center justify-between gap-2">
        <div>
          <p>{{ $t("LABELS.Name", { name: $t("LABELS.Theme") }) }}</p>
          <h3 class="text-text font-semibold text-lg">
            {{ item.name }}
          </h3>
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
      <div class="w-full">
        <img
          v-if="item.image"
          @error="imgError"
          :src="item.image"
          class="w-full h-[250px] object-cover rounded-lg"
          :alt="item.name"
        />
      </div>

      <div class="flex gap-3 items-center">
        <label class="capitalize text-sub mb-2"
          >{{ $t("LABELS.status") }}:</label
        >
        <global-switcher
          :id="item.id"
          :url="activate"
          v-model:modalValue="item.is_active"
        />
      </div>
      <div class="flex items-center flex-wrap gap-2" v-if="item.created_at">
        <p class="capitalize text-sub text-sm">
          {{ $t("TITLES.createdAt") }} :
        </p>
        {{ item.created_at }}
      </div>
    </div>
  </base-card1>
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
