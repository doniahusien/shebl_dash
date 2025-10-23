<template>
  <v-data-table-virtual
    :headers="headers"
    :items="items"
    :loading="loading"
    item-value="id"
    class="project-table"
    item-key="id"
  >
    <template v-slot:loading>
      <loader class="py-7" />
    </template>
    <template v-slot:no-data>
      <div
        class="text-center"
        v-if="!$route.query.keyword && !$route.query.status"
      >
        <!-- <img
              class="mx-auto"
              src="@/assets/images/icons/brand/orders.png"
              alt=""
            /> -->
        <h3 class="mt-4 font-semibold text-text text-center">
          {{
            $t("TITLES.No have been added yet", {
              name: $t("LABELS.orders"),
            })
          }}
        </h3>
      </div>
      <h3 v-else class="mt-4 font-semibold text-text text-center">
        {{ $t("TITLES.No Search result") }}
      </h3>
    </template>

    <template v-slot:[`item.order_num`]="{ item }">
      <div class="flex gap-2 items-center flex-wrap">
        <small-details-card :title="`#${item.id}`" />
      </div>
    </template>
    <template v-slot:[`item.order_type`]="{ item }">
      <small-details-card :title="t('order_type.' + item.order_type)" />
    </template>
    <template v-slot:[`item.shipping_company`]="{ item }">
      <small-details-card :title="item.shipping_company?.name ?? null" />
    </template>
    <template v-slot:[`item.pay_type`]="{ item }">
      <small-details-card
        :title="item.pay_type ? $t(`LABELS.${item.pay_type}`) : null"
      />
    </template>
    <template v-slot:[`item.status_trans`]="{ item }">
      <p
        class="font-semibold text-sm capitalize rounded-md px-1 py-2 mb-2 text-center"
        :class="getStatusColor(item.status)"
      >
        {{ $t(`STATUS.${item.status}`) }}
      </p>
      <div
        class="flex justify-center items-center gap-2"
        v-if="item.status == 'pending' && item.pay_type === 'cash'"
      >
        <button
          type="button"
          class="bg-red-500 rounded-full p-2 w-[32px] h-[32px]"
          @click="openCancelModel = item.id"
        >
          <svg-icon name="refuse" class="m-auto" />
        </button>
        <button
          type="button"
          class="bg-collected rounded-full w-[32px] h-[32px] p-1"
          @click="openConfirmModel = item.id"
        >
          <svg-icon name="accept" class="m-auto" />
        </button>
        <Teleport to="body">
          <ConfirmModal
            :disabled="btnConfirmLoading"
            v-if="openConfirmModel == item.id"
            message=""
            @cancel="openConfirmModel = ''"
            btn-confirm="base-btn py-4 rounded-xl"
            button-name="BUTTONS.Yes Accept"
            @confirm="acceptOrder(item.id)"
          />
        </Teleport>
        <teleport to="body">
          <modal
            :persist="true"
            v-if="openCancelModel == item.id"
            :title="t('LABELS.Reject order')"
            @close="resetCancelForm"
          >
            <VeeForm
              :validation-schema="schema"
              @submit="(values) => cancelOrder(values, item.id)"
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
                  @click="openCancelModel = ''"
                >
                  {{ $t("BUTTONS.cancel") }}
                </button>
                <button
                  class="base-btn rounded-lg py-3"
                  :disabled="btnLoading"
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
    <template v-slot:[`item.client`]="{ item }">
      <small-details-card :title="item.client?.full_name" />
    </template>

    <template v-slot:[`item.price_detail`]="{ item }">
      <small-details-card :title="item.total.toFixed(2) + ' ' + $t('SAR')" />
    </template>
    <template v-slot:[`item.created_at`]="{ item }">
      <small-details-card
        :title="
          new Date(item.created_at).toLocaleDateString(
            locale == 'ar' ? 'ar-eg' : 'en-us',
            {
              day: 'numeric',
              month: '2-digit',
              year: 'numeric',
            }
          )
        "
        :text="
          new Date(item.created_at).toLocaleTimeString(
            locale == 'ar' ? 'ar-eg' : 'en-us',
            {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            }
          )
        "
      />
    </template>

    <template v-slot:[`item.actions`]="{ item }">
      <router-link :to="`/orders/show/${item.id}`">
        <svg-icon class="text-primary" name="eye2" filled />
      </router-link>
    </template>
  </v-data-table-virtual>
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
</template>
<script setup>
import axios from "axios";
import getStatusColor from "@/utils/getStatusColor.ts";
import { useI18n } from "vue-i18n";
import { toRef, ref, reactive, watch } from "vue";
import * as yup from "yup";
import { toast } from "vue3-toastify";
const props = defineProps({
  orders: {
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const openConfirmModel = ref("");
const btnConfirmLoading = ref(false);
const openCancelModel = ref("");
const btnCancelLoading = ref(false);
const failmodal = ref(false);
const failmessage = ref("");
const items = ref([]);

const { t, locale } = useI18n();
const btnLoading = ref(false);

const headers = [
  {
    title: t("LABELS.Order") + " #",
    align: "start",
    sortable: false,
    key: "order_num",
  },
  {
    title: t("LABELS.Client"),
    align: "start",
    sortable: false,
    key: "client",
  },
  {
    title: t("LABELS.Order Date"),
    align: "start",
    sortable: false,
    key: "created_at",
  },
  {
    title: t("LABELS.Order Type"),
    align: "start",
    sortable: false,
    key: "order_type",
  },
  {
    title: t("LABELS.Shipping"),
    align: "start",
    sortable: false,
    key: "shipping_company",
  },
  {
    title: t("LABELS.Payment"),
    align: "start",
    sortable: false,
    key: "pay_type",
  },
  {
    title: t("LABELS.orderStatus"),
    align: "start",
    sortable: false,
    key: "status_trans",
  },

  {
    title: t("LABELS.total"),
    align: "start",
    sortable: false,
    key: "price_detail",
  },

  {
    title: t("LABELS.Actions"),
    align: "start",
    sortable: false,
    key: "actions",
  },
];
const initialValues = reactive({
  reject_reason: "",
});

const schema = yup.object().shape({
  reject_reason: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.Rejection reason") })),
});

function resetCancelForm() {
  initialValues.reject_reason = "";
  openCancelModel.value = "";
}

function cancelOrder(values, id) {
  btnCancelLoading.value = true;
  const frmData = new FormData();

  frmData.append("status", "admin_rejected");
  frmData.append("_method", "PUT");
  frmData.append("rejected_reason", values.reject_reason);

  axios
    .post(`order/${id}/change_status`, frmData)
    .then((res) => {
      btnCancelLoading.value = false;
      toast.success(res.data.message);
      resetCancelForm();
      items.value.map((el) => {
        if (el.id == id) {
          el.status = res.data.data.status;

          return el;
        }
      });
    })
    .catch((err) => {
      btnCancelLoading.value = false;
      toast.error(err.response.data.message);
    });
}

function acceptOrder(id) {
  btnConfirmLoading.value = true;

  axios
    .put(`order/${id}/change_status`, {
      status: "admin_accept",
    })
    .then((res) => {
      btnConfirmLoading.value = false;
      openConfirmModel.value = "";
      toast.success(res.data.message);
      items.value.map((el) => {
        if (el.id == id) {
          el.status = res.data.data.status;

          return el;
        }
      });
    })
    .catch((err) => {
      openConfirmModel.value = "";
      btnConfirmLoading.value = false;

      failmodal.value = true;
      failmessage.value = err.response.data.message;
      setTimeout(() => {
        failmodal.value = false;
        failmessage.value = "";
      }, 3000);
    });
}

watch(
  () => props.orders,
  (value) => (items.value = value),
  {
    immediate: true,
    deep: true,
  }
);
</script>
<style lang="postcss" scoped></style>
