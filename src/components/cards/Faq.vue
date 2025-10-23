<template>
  <div class="flex items-start flex-wrap gap-5 py-4 px-2">
    <img src="@/assets/images/brand/question.png" alt="question-image" />

    <div class="flex-1">
      <div class="flex gap-2 justify-between mb-4">
        <h3 class="text-lg font-bold font-inter text-text">
          {{ item[$i18n.locale].question }}
        </h3>

        <div class="flex items-center gap-2">
          <div class="flex items-center gap-5" v-if="trashed">
            <action-menu
              class="ms-2"
              :restore="true"
              :item="item"
              name="faq"
              @reload="fetchData"
              @edit="emit('edit')"
              @remove="remove(item.id)"
              @restore="showArchive = true"
            />
            <Teleport to="body">
              <Restore
                v-if="showArchive"
                :url="`faq/restore/${item.id}`"
                @remove="
                  remove(item.id);
                  showArchive = false;
                "
                @close="showArchive = false"
              />
            </Teleport>
          </div>

          <action-menu
            v-else
            class="ms-2"
            :edit="true"
            :archive="true"
            :item="item"
            name="faq"
            @reload="fetchData"
            @edit="emit('edit')"
            @remove="remove(item.id)"
          />
        </div>
      </div>

      <ul class="package_details space-y-4">
        <li v-if="trashed">
          <p class="name">
            <svg-icon name="calendar" />
            {{ $t("TITLES.archived date") + " :" }}
          </p>
          <p class="value">{{ item.deleted_at }}</p>
        </li>

        <li v-if="!trashed">
          <label for="is_active" class="flex items-center gap-2 name">
            <svg-icon name="folder-open" />

            {{ $t("LABELS.Availability") + " :" }}
          </label>
          <global-switcher
            :id="item.id"
            model="faqs"
            v-model:modalValue="item.is_active"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  item: { required: false, type: Object },
  trashed: { required: false, type: Boolean },
});

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
.package_details {
  li {
    .name {
      @apply w-[160px];
    }
  }
}
</style>
