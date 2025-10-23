<template>
  <button class="base-btn mx-auto py-1" @click="dialog = true">
    {{ btnName ? btnName : t(`BUTTONS.${editable ? "edit" : "create"}`) }}
    <Teleport to="body">
      <modal
        classes="md:!w-full !w-full !max-w-[1200px]"
        v-if="dialog"
        v-model="dialog"
        :persist="true"
        :hide-header="true"
        @close="dialog = false"
      >
        <VeeForm
          :validation-schema="schema"
          @submit="handleSubmit"
          :initial-values="initialValues"
          class="flex flex-col w-full"
          ref="appForm"
        >
          <div>
            <slot />
          </div>

          <div class="mt-auto">
            <div class="mt-4 flex justify-center items-center gap-2">
              <button
                type="submit"
                class="base-btn py-1"
                :disabled="btnLoading"
              >
                {{ t(`BUTTONS.${editable ? "edit" : "create"}`) }}
              </button>
              <button
                class="base-btn-white py-1"
                @click="close"
                :disabled="btnLoading"
              >
                {{ t("BUTTONS.cancel") }}
              </button>
            </div>
          </div>
        </VeeForm>
      </modal>
    </Teleport>
  </button>
</template>

<script lang="ts" setup>
import { ref, toRef, watch } from "vue";
import { useI18n } from "vue-i18n";
import { Values } from "@/components/dynamics/types";
const props = defineProps<{
  editable?: boolean;
  loading?: boolean;
  closeModal?: boolean;
  btnName?: string;
  schema: any;
  initialValues: Values;
}>();

const emit = defineEmits<{
  (event: "submit", initialValues: Values): void;
}>();

const dialog = ref<boolean>(false);
const initialValues = toRef<Values>(props.initialValues);
const btnLoading = ref<boolean>(false);
const { t } = useI18n();
const appForm = ref<any | null>(null);
watch(
  () => props.loading,
  (newVal) => {
    btnLoading.value = newVal;
  }
);
watch(
  () => props.closeModal,
  (newVal) => {
    if (newVal) {
      close();
    }
  }
);

const handleSubmit = (values: Values) => {
  emit("submit", values);
};

const close = () => {
  if (appForm.value) {
    appForm.value.resetForm();
  }
  dialog.value = false;
};
</script>
