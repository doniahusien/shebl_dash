<template>
  <div
    class="relative w-10 h-10 border border-line rounded-full flex items-center justify-center"
  >
    <Menu>
      <MenuButton>
        <i class="fa-solid fa-ellipsis text-primary text-xl" />
      </MenuButton>

      <MenuItems
        class="absolute z-50 end-0 min-w-[130px] bg-white border border-[#F6F5FA] rounded-lg px-2 py-2"
      >
        <slot name="top" />
        <MenuItem
          v-if="add"
          as="button"
          class="flex items-center gap-1 pe-7 text-primary text-sm mb-3 capitalize"
        >
          <span class="w-[20px]">
            <i class="fa-solid fa-plus-circle" />
          </span>
          <span>{{ $t("BUTTONS.add") }}</span>
        </MenuItem>
        <MenuItem
          v-if="show"
          @click="$emit('show')"
          as="button"
          class="flex items-center gap-1 pe-7 text-primary text-sm mb-3 capitalize"
        >
          <span class="w-[20px]">
            <i class="fa-solid fa-eye" />
          </span>
          <span>{{ $t(`BUTTONS.${showTitle}`) }}</span>
        </MenuItem>
        <MenuItem
          v-if="edit"
          @click="$emit('edit')"
          as="button"
          class="flex items-center gap-1 pe-7 text-primary text-sm mb-3 capitalize"
        >
          <span class="w-[20px]">
            <i class="fa-solid fa-edit" />
          </span>
          <span>{{ $t("BUTTONS.edit") }}</span>
        </MenuItem>
        <MenuItem
          v-if="remove"
          @click="confirmSwith('delete')"
          as="button"
          class="flex items-center gap-1 pe-5 text-red-500 text-sm capitalize"
        >
          <span class="w-[20px]">
            <i class="fa-solid fa-trash-alt" />
          </span>
          <span>{{ $t("BUTTONS.delete") }}</span>
        </MenuItem>
        <MenuItem
          v-if="archive"
          @click="confirmSwith('archive')"
          as="button"
          class="flex items-center gap-1 pe-5 text-primary text-sm capitalize"
        >
          <span class="w-[20px]">
            <i class="fa-regular fa-folder-open"></i>
          </span>
          <span>{{ $t("BUTTONS.archive") }}</span>
        </MenuItem>
        <MenuItem
          as="button"
          v-if="restore"
          @click="emit('restore')"
          class="flex items-center gap-2 pe-5 text-primary text-sm capitalize"
        >
          <svg-icon name="restore" />

          <span>{{ $t("BUTTONS.restore") }}</span>
        </MenuItem>
        <slot name="bottom" />
      </MenuItems>
    </Menu>
    <Teleport to="body">
      <Modal
        :title="$t('TITLES.confirmProcess')"
        v-if="openModal"
        @close="openModal = false"
      >
        <img
          width="60"
          class="mx-auto"
          src="@/assets/images/icons/delete.png"
          alt="delete"
        />
        <h4 class="text-center font-bold text-lg mt-4">
          {{ $t("TITLES.areYouSureToDelete") }}
        </h4>

        <div class="flex items-center justify-center gap-2 mt-5">
          <button
            type="button"
            class="capitalize base-btn-white"
            @click="openModal = false"
          >
            {{ $t("BUTTONS.cancel") }}
          </button>
          <button
            type="button"
            class="capitalize base-btn-red"
            @click="confirm"
          >
            {{ $t("BUTTONS.Yes Delete") }}
          </button>
        </div>
      </Modal>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref } from "vue";
import { toast } from "vue3-toastify";
import { useI18n } from "vue-i18n";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";

const { t } = useI18n();

const props = defineProps({
  item: {
    required: false,
    type: Object,
  },
  edit: {
    required: false,
    default: false,
  },
  show: {
    required: false,
    default: false,
  },
  add: {
    required: false,
    default: false,
  },
  showTitle: {
    required: false,
    default: "show",
  },
  remove: {
    required: false,
    default: false,
  },
  restore: {
    required: false,
    default: false,
  },
  archive: {
    required: false,
    default: false,
  },
  name: {
    required: false,
    type: String,
  },
});

const removeForEver = ref(false);

const disabled = ref(false);
const openModal = ref(false);

const emit = defineEmits([
  "update:modalValue",
  "close",
  "remove",
  "edit",
  "show",
  "restore",
]);

const archiveType = ref(false);

function confirmSwith(type: any) {
  if (type == "archive") {
    archiveType.value = true;
  }
  openModal.value = true;
}

function confirm() {
  disabled.value = true;
  let url;
  if (props.item?.id) {
    url = `${props.name}/${props.item?.id}`;

    axios
      .delete(url)
      .then((res) => {
        toast.success(res.data.messages ?? res.data.message);
        disabled.value = false;
        openModal.value = false;
        emit("remove");
      })
      .catch((err) => {
        disabled.value = false;
        toast.error(err.response.data.message);
      });
  } else {
    disabled.value = false;
    openModal.value = false;
    emit("remove");
  }
}
</script>

<style></style>
