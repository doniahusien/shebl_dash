<template>
  <base-card1>
    <div class="space-y-2">
      <div class="flex items-center gap-2 justify-between">
        <div class="flex items-center gap-3">
          <div class="flex gap-1 items-center">
            <p class="capitalize text-sub mb-2">
              {{
                $t(
                  item.is_published ? "LABELS.published" : "LABELS.notPublished"
                )
              }}
            </p>
          </div>
        </div>
        <action-menu
          :edit="true"
          :remove="true"
          :item="item"
          :name="url"
          @reload="fetchData"
          @edit="emit('edit')"
          @remove="remove(item.id)"
        />
      </div>

      <div class="w-full rounded-lg overflow-hidden">
        <!-- <video
          v-if="item.image_object?.media_type == 'file'"
          width="100%"
          height="80vh"
          class="w-full h-[250px] object-contain rounded-lg"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
        >
          <source :src="item.image_object.media" type="video/mp4" />
          <source :src="item.image_object.media" type="video/webm" />
        </video> -->
        <!-- v-else-if="item.image_object?.media_type == 'image'" -->
        <img
          @error="imgError"
          :src="item.image"
          class="w-full h-[250px] object-contain rounded-lg"
          :alt="item.title"
        />
      </div>
      <div class="flex gap-4 py-2 text-primary text-sm">
        <p class="flex items-center gap-1">
          <svg-icon name="user1" /> {{ item.by }}
        </p>
        <p class="flex items-center gap-1">
          <svg-icon name="calendar" /> {{ item.date }}
        </p>
        <!-- <p class="flex items-center gap-1">
          <svg-icon name="eye2" /> {{ item.views }}
        </p> -->
      </div>
      <div>
        <h3 class="text-text font-semibold">
          {{ item.title }}
        </h3>
        <p class="text-sub text-sm line-clamp-3">
          {{ item.short_desc }}
        </p>
      </div>

      <!-- <div class="flex items-center flex-wrap gap-2" v-if="item.date">
        <p class="capitalize text-sub text-sm">
          {{ $t("LABELS.publishDate") }} :
        </p>
        {{ item.date }}
      </div> -->
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
  activate1: { required: false },
  sub: {
    required: false,
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
