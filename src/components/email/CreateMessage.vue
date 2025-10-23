<template>
  <div>
    <button
      class="create-message btn bg-primary flex items-center justify-content-center mb-5 gap-2 text-white rounded-3 lg:min-h-[74px] min-h-[57px] min-w-[251px] lg:mx-0 mx-auto"
      type="button"
      @click="createNewMessage = true"
    >
      <i class="fa-solid fa-edit" />

      <span>{{ $t("BUTTONS.createNewMessage") }}</span>
    </button>
    <Teleport to="body">
      <v-dialog v-model="createNewMessage" persistent width="auto">
        <div class="lg:w-[780px] w-[98%] bg-white rounded-2xl p-5">
          <button type="button" @click="createNewMessage = false">
            <i class="fa-solid fa-close text-2xl text-[#D1D1EC]" />
          </button>

          <div class="p-5">
            <h5
              class="text-center lg:text-2xl text-lg text-primary lg:font-semibold mb-7"
            >
              {{ $t("BUTTONS.createNewMessage") }}
            </h5>

            <VeeForm
              as="div"
              @submit="handleCreateMessage"
              v-slot="{ meta }"
              :validation-schema="schema"
            >
              <form>
                <div class="mb-4">
                  <base-select :item="item" />
                </div>

                <div class="mb-6">
                  <BaseInput
                    id="topic"
                    :placeholder="$t('INPUTS.topicPlaceholder')"
                    name="topic"
                    :label="$t('LABELS.topic')"
                  />
                </div>

                <BaseEditor :placeholder="$t('INPUTS.messageContent')" />

                <div class="mt-5 flex items-center justify-end">
                  <button
                    type="submit"
                    :disabled="!meta.valid"
                    class="flex items-center justify-center h-[47px] w-[100px] rounded-md !text-white gap-2 bg-primary"
                  >
                    <i class="fa-solid fa-share" />

                    <span>{{ $t("BUTTONS.send") }}</span>
                  </button>
                </div>
              </form>
            </VeeForm>
          </div>
        </div>
      </v-dialog>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from "vue";
import * as yup from "yup";
import { useI18n } from "vue-i18n";
const i18n = useI18n();
const schema = yup.object().shape({
  topic: yup.string().required(),
  sendTo: yup.tuple().required(),
});

const item = {
  label: i18n.t("LABELS.recipient"),
  name: "sendTo",
  placeholder: i18n.t("TEXTS.sendTo"),
  icon: "",
  url: "dashboard/all_country",
  filter: null,
  multiple: true,
  options: [
    { id: 1, name: "First" },
    { id: 2, name: "Second" },
    { id: 3, name: "Third" },
  ],
};

const createNewMessage = ref(false);

function handleCreateMessage() {}
</script>

<style></style>
