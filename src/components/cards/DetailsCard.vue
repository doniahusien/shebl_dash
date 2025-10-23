<template>
  <div class="border border-line rounded-[15px] p-3">
    <div class="flex items-center flex-wrap gap-3">
      <img
        v-if="item.image"
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
          <action-menu
            class="ms-2"
           
            :item="item"
            :name="url"
            @reload="fetchData"
            @edit="emit('edit')"
            @remove="remove(item.id)"
          />
        </div>
        <p
          class="font-light text-sm mb-2 leading-6 text-text max-w-[260px] line-clamp-2"
          v-if="item.desc || item.tag"
        >
          {{ item.desc || item.tag }}
        </p>
        <div class="flex items-center flex-wrap gap-2" v-if="item.parent">
          <p class="capitalize text-sub">{{ $t("LABELS.category") }} :</p>
          {{ item.parent?.name }}
        </div>
        <div class="flex items-center flex-wrap gap-2" v-if="item.type">
          <p class="capitalize text-sub">{{ $t("LABELS.type") }} :</p>
          {{ item.type }}
        </div>
        <div class="flex gap-3 items-center" v-if="showAcivate">
          <label class="capitalize text-sub mb-2"
            >{{ $t("LABELS.status") }}:</label
          >
          <global-switcher
            :id="item.id"
            :url="activate"
            :disabled="!checkPermission(permissionKey, 'update')"
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
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  item: { required: false, type: Object },
  showAcivate: { required: false, type: Boolean },
  url: { required: false },
  activate: { required: false },
  sub: {
    required: false,
  },
  permissionKey: {
    required: false,
    type: String,
  },
});

const emit = defineEmits(["remove", "reload", "edit"]);
function remove(id) {
  emit("remove", id);
}
function fetchData() {
  emit("reload");
}
</script>
