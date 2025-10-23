<template>
  <div class="rounded-xl border border-line bg-white px-5 pb-4 pt-7">
    <router-link v-if="deal" :to="`/deals/${deal.id}`">
      <div class="mb-6 flex items-start justify-between">
        <div>
          <p class="text-sm text-sub-text">
            {{ $t("TEXT.Number of products") }}
          </p>
          <p class="text-lg text-text">
            {{ deal.products_count }} {{ $t("LABELS.Products") }}
          </p>
        </div>
        <p class="text-sm text-sub-text">{{ deal.created_at }}</p>
      </div>
      <div v-if="deal.first_product" class="mb-3 h-[180px]">
        <img
          :src="deal.first_product.main_image"
          :alt="deal.first_product.name"
          height="180"
          class="h-[180px] w-full rounded-lg object-cover"
        />
      </div>
      <div class="mb-4">
        <p class="text-sm text-sub-text">
          {{ $t("TEXT.Trial price of products") }}
        </p>
        <p class="text-lg text-text">{{ deal.sub_total }} {{ $t("SAR") }}</p>
      </div>
    </router-link>
    <div class="mb-5 flex flex-wrap items-center gap-2">
      <div
        v-for="category in deal.sub_categories"
        :key="category.id"
        class="flex min-w-[104px] items-center justify-center rounded-full bg-primary/10 px-7 py-3.5 text-sm text-primary"
      >
        {{ category.name }}
      </div>
    </div>
    <div class="">
      <p class="mb-1.5 text-sm">
        {{ $t("TEXT.Offers offered") }}:
        <span>+{{ deal.offers_count }} {{ $t("LABELS.Offer") }}</span>
      </p>
    </div>
    <div class="flex items-center gap-3">
      <p
        class="font-semibold text-sm capitalize rounded-md px-1 py-2 text-center flex-1"
        :class="getStatusColor(deal.status)"
      >
        {{ $t(`STATUS.${deal.status}`) }}
      </p>
      <div class="flex flex-wrap gap-2" v-if="deal.status == 'pending'">
        <button
          type="button"
          class="bg-red-500 rounded-full p-2 w-[32px] h-[32px]"
          @click="openCancelModel = true"
        >
          <svg-icon name="refuse" class="m-auto" />
        </button>
        <button
          type="button"
          class="bg-collected rounded-full w-[32px] h-[32px] p-1"
          @click="openConfirmModel = true"
        >
          <svg-icon name="accept" class="m-auto" />
        </button>
      </div>
    </div>
    <teleport to="body">
      <notify
        @close="failmodal = false"
        v-if="failmodal"
        class="z-[99999]"
        classes=" px-6  py-11 !w-full  !max-w-[350px]"
      >
        <svg-icon name="warning-2" class="mb-4 mx-auto" />
        <h3 class="text-text font-bold mb-2 text-2xl text-center">
          {{ $t("Sorry") }}
        </h3>
        <p class="text-center text-sub">
          {{ failmessage }}
        </p>
      </notify>
    </teleport>
    <teleport to="body">
      <ConfirmModal
        :disabled="btnConfirmLoading"
        v-if="openConfirmModel"
        message=""
        @cancel="openConfirmModel = false"
        btn-confirm="base-btn py-4 rounded-xl"
        button-name="BUTTONS.Yes Accept"
        @confirm="acceptOrder(deal.id)"
      />
    </teleport>
    <teleport to="body">
      <modal
        :persist="true"
        v-if="openCancelModel == true"
        :title="t('LABELS.reject deal')"
        @close="resetCancelForm"
      >
        <VeeForm
          :validation-schema="schema"
          @submit="(values) => cancelOrder(values, deal.id)"
          :initial-values="initialValues"
        >
          <base-input
            id="reject_reason"
            name="reject_reason"
            :placeholder="$t('LABELS.choose')"
            :label="$t('LABELS.Rejection reason')"
            type="textarea"
            rows="4"
          />

          <div class="flex items-center justify-end gap-2">
            <button
              class="white-btn rounded-lg"
              type="button"
              @click="openCancelModel = false"
            >
              {{ $t("BUTTONS.cancel") }}
            </button>
            <button
              class="base-btn rounded-lg py-3"
              :disabled="btnCancelLoading"
              type="submit"
            >
              {{ $t("BUTTONS.save") }}
            </button>
          </div>
        </VeeForm>
      </modal>
    </teleport>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, reactive, toRef } from "vue";
import { object, string } from "yup";
import { useI18n } from "vue-i18n";
const props = defineProps({
  deal: {
    required: true,
    type: Object,
  },
});

const { t } = useI18n();

const deal = toRef(props.deal);
const btnLoading = ref(false);
const failmodal = ref(false);
const failmessage = ref("");
const openConfirmModel = ref(false);
const btnConfirmLoading = ref(false);
const openCancelModel = ref(false);
const btnCancelLoading = ref(false);
const initialValues = reactive({
  reject_reason: "",
});

const schema = object().shape({
  reject_reason: string().required(
    t("ERRORS.isRequired", { name: t("LABELS.Rejection reason") })
  ),
});
function resetCancelForm() {
  initialValues.reject_reason = "";
  openCancelModel.value = false;
}

const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "text-[#FCC230] bg-[#FCC2302D]";
    case "refused":
      return "text-red bg-[#FF445B0D]";
    case "accepted":
      return "text-green-500 bg-[#06D6A01A]";
    default:
      return "text-sub bg-[#9ea1c10D]";
  }
};

function cancelOrder(values, id) {
  btnCancelLoading.value = true;
  const frmData = new FormData();
  frmData.append("status", "refused");
  frmData.append("notes", values.reject_reason);

  axios
    .post(`deals/${id}/update-status`, frmData)
    .then((res) => {
      btnCancelLoading.value = false;

      deal.value.status = res.data.data.status;
      resetCancelForm();
    })
    .catch((err) => {
      btnCancelLoading.value = false;
      toast.error(err.response.data.message);
    });
}

function acceptOrder(id) {
  btnConfirmLoading.value = true;

  axios
    .post(`deals/${id}/update-status`, {
      status: "accepted",
    })
    .then((res) => {
      btnConfirmLoading.value = false;
      deal.value.status = res.data.data.status;
      openConfirmModel.value = false;
    })
    .catch((err) => {
      openConfirmModel.value = false;
      btnConfirmLoading.value = false;

      failmodal.value = true;
      failmessage.value = err.response.data.message;
      setTimeout(() => {
        failmodal.value = false;
        failmessage.value = "";
      }, 3000);
    });
}
</script>

<style lang="scss">
.prgoress {
  @apply relative bg-secondary;
  span {
    @apply absolute inline-flex h-2  w-1/4 rounded-full bg-primary;
  }
}
</style>
