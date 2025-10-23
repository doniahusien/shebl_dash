<template>
  <button
    @click="confirmSwith"
    class="flex items-center gap-1 text-primary text-lg ms-4 capitalize"
  >
    <span class="w-[20px]">
      <i class="fa-regular fa-folder-open"></i>
    </span>
    <span>{{ btnName }}</span>
  </button>

  <Teleport to="body">
    <Modal
      :title="$t('TITLES.confirmProcess')"
      v-if="openModal"
      @close="openModal = false"
      class="z-[1009]"
    >
      <img
        width="60"
        class="mx-auto"
        src="@/assets/images/icons/check.png"
        alt="check"
      />
      <h4 class="text-center font-bold text-lg mt-4">
        {{ message }}
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
          :disabled="disabled"
          type="button"
          class="capitalize base-btn-red"
          @click="confirm"
        >
          {{
            url == "delete_ids" || url == "employee/archive-all"
              ? $t("BUTTONS.archive")
              : $t("BUTTONS.restore")
          }}
        </button>
      </div>
    </Modal>
  </Teleport>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import { toast } from "vue3-toastify";
import { useI18n } from "vue-i18n";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const { t } = useI18n();

const props = defineProps({
  model: {
    required: true,
  },
  items: {
    required: true,
  },
  url: {
    required: true,
  },
  message: {
    required: true,
  },
  btnName: {
    required: true,
  },
});

const disabled = ref(false);
const openModal = ref(false);

const emit = defineEmits(["reload"]);

function confirmSwith() {
  openModal.value = true;
}

function confirm() {
  disabled.value = true;
  const frmData = new FormData();
  frmData.append("model", props.model);
  if (props.url == "restore_ids") {
    frmData.append("_method", "PUT");
  }

  props.items.map((el, indx) => frmData.append(`ids[${indx}]`, el));
  axios
    .post(props.url, frmData)
    .then((res) => {
      toast.success(res.data.message);
      disabled.value = false;
      openModal.value = false;
      emit("reload");
      router
        .push({
          query: Object.assign({}, route.query, {
            page: 1,
          }),
        })
        .catch(() => {});
    })
    .catch((err) => {
      disabled.value = false;
      toast.error(t(err.response.data.message));
    });
}
</script>
