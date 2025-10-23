<template>
  <div>
    <div class="flex gap-2 justify-between">
      <h3 class="text-lg font-bold font-inter text-text">
        {{ item.title }}
      </h3>

      <div class="flex items-center gap-2">
        <action-menu
          class="ms-2"
          :edit="true"
          :remove="true"
          :item="item"
          name="pages"
          @reload="fetchData"
          @edit="emit('edit')"
          @remove="remove(item.id)"
        />
      </div>
    </div>
    <p class="font-inter text-text">
      {{ item.desc }}
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  item: { required: false, type: Object },
});

const emit = defineEmits(["remove", "reload", "edit"]);
function remove(id) {
  emit("remove", id);
}
function fetchData() {
  emit("reload");
}
</script>

<style lang="scss"></style>
