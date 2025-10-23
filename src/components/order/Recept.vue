<template>
  <div>
    <base-card class="space-y-7 mb-7 rounded-3xl" id="invice" v-if="invoice">
      <div
        class="top_header border-b border-placeholder pb-2 flex justify-between items-center gap-3"
      >
        <img src="/logo.svg" class="w-[87px]" alt="logo" />

        <div class="space-y-1">
          <h3 class="text-xl font-bold text-primary">{{ $t("INVOICE") }}</h3>
          <p class="text-[9px] text-text">{{ invoice.store?.complete_name }}</p>
          <p class="text-[9px] text-sub">
            <span>{{ $t("Tel No") }} :</span>
            {{ invoice.store.phone_code + " " + invoice.store.phone }}
          </p>
        </div>
      </div>

      <div class="border border-placeholder">
        <ul class="flex justify-between items-center">
          <li class="w-5/12 py-2 px-3">
            <ul class="text-sub text-[12px]">
              <li>
                <span>{{ $t("Order Id") }} : </span>
                <span class="text-text font-bold">#{{ invoice.id }}</span>
              </li>
              <li>
                <span>{{ $t("LABELS.Staff") }} : </span>
                <span>{{ invoice.employee?.full_name }}</span>
              </li>
              <li
                class="flex items-center gap-1 flex-wrap"
                v-if="invoice.payment_type?.length"
              >
                <span>{{ $t("LABELS.Payment Method") }} : </span>
                <p v-if="invoice.payment_type">
                  <span
                    v-for="(pay, index) in invoice.payment_type"
                    :key="index"
                    >{{ pay }}
                  </span>
                </p>
              </li>
            </ul>
          </li>
          <li class="border-x flex-1 px-3 border-placeholder py-2">
            <ul class="text-sub text-[12px]">
              <li class="mb-3">
                <p>{{ $t("LABELS.Invoice no") }} :</p>
                <p>#{{ invoice.order_num }}</p>
              </li>
              <li>
                <p>{{ $t("LABELS.dateTime") }} :</p>
                <p>{{ invoice.order_date + "," + invoice.order_time }}</p>
              </li>
            </ul>
          </li>
          <li class="w-4/12 px-3">
            <ul class="text-sub text-[12px]">
              <li class="mb-1">
                <span> {{ $t("LABELS.Order Type") }} : </span>
                <span class="text-text font-bold text-sm">{{
                  $t(invoice.order_type)
                }}</span>
              </li>
              <li>
                <span>{{ $t("TOTAL DUE") }} : </span>
                <span class="text-text font-bold text-lg uppercase">{{
                  invoice.price_detail.total_price +
                  " " +
                  invoice.price_detail.currency
                }}</span>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <table class="w-full rounded-md">
        <thead class="bg-[#EFF0FD99]">
          <th
            class="text-start rounded-s-lg p-[10px] text-[12px] max-w-[250px]"
          >
            {{ $t("LABELS.Items") }}
          </th>
          <th class="text-start p-[10px] text-[12px]">
            {{ $t("LABELS.Unit Price") }}
          </th>
          <th class="text-start p-[10px] text-[12px]">
            {{ $t("LABELS.Qty") }}
          </th>
          <th class="text-start rounded-e-lg p-[10px] text-[12px]">
            {{ $t("LABELS.amount") }}
          </th>
        </thead>
        <tbody>
          <tr
            class="border-b border-placeholder"
            v-for="item in invoice.item"
            :key="item.id"
          >
            <td class="text-[12px] p-[10px] text-[#777790] w-[300px]">
              {{ item.name }}
              <div
                v-if="item.combo.length"
                class="bg-[#FCC23014] rounded-lg flex items-center gap-x-2 gap-y-1 flex-wrap my-2"
              >
                <span class="text-[#FCC230]">{{ $t("LABELS.Combo") }}:</span>
                <span v-for="(compo, i) in item.combo" :key="compo.id">
                  {{ compo.qty }}x {{ compo.name }}
                  <span v-if="i != item.combo.length - 1">,</span>
                </span>
              </div>

              <div
                v-if="item.sub_modifiers.length"
                class="bg-[#FCC23014] rounded-lg flex items-center gap-x-2 gap-y-1 flex-wrap my-2"
              >
                <span class="text-[#FCC230]">{{ $t("LABELS.Topping") }}:</span>
                <div
                  v-for="sub_modifier in item.sub_modifiers"
                  :key="sub_modifier.id"
                >
                  <span
                    v-for="(item_modifier, i) in sub_modifier.item_modifiers"
                    :key="item_modifier.id"
                  >
                    <template v-if="item_modifier.qty">
                      {{ item_modifier.qty }}x {{ item_modifier.name }}

                      <span v-if="i != sub_modifier.item_modifiers.length - 1"
                        >,</span
                      >
                    </template>
                  </span>
                </div>
              </div>
            </td>
            <td class="text-[12px] p-[10px] text-[#777790]">
              {{ item.sub_total ?? item.item_price }}
            </td>
            <td class="text-[12px] p-[10px] text-[#777790]">
              {{ item.qty }}
            </td>
            <td class="text-[12px] p-[10px] text-[#777790]">
              {{ item.total_price }}
            </td>
          </tr>
          <tr
            class="border-b border-placeholder"
            v-for="item in invoice.open_items"
            :key="item.id"
          >
            <td class="text-[12px] p-[10px] text-[#777790]">
              {{ item.name }}
            </td>
            <td class="text-[12px] p-[10px] text-[#777790]">
              {{ item.price }}
            </td>
            <td class="text-[12px] p-[10px] text-[#777790]">
              {{ $t("TITLES.Open Item") }}
            </td>
            <td class="text-[12px] p-[10px] text-[#777790]">
              {{ item.price }}
            </td>
          </tr>
        </tbody>
      </table>

      <div class="grid grid-cols-2">
        <div>
          <h3
            class="text-text border-b pb-1 w-fit pe-3 border-placeholder font-bold text-[12px] mb-4"
          >
            {{ $t("Payment Method We Accept") }}
          </h3>
          <ul class="space-y-1">
            <li class="font-medium text-[12px] text-sub">
              {{ $t("LABELS.cash") }}
            </li>
            <li class="font-medium text-[12px] text-sub">
              {{ $t("LABELS.Loyalty Card") }}
            </li>
            <li class="font-medium text-[12px] text-sub">
              {{ $t("LABELS.Credit Card") }}
            </li>
            <li class="font-medium text-[12px] text-sub">
              {{ $t("LABELS.Gift Card") }}
            </li>
            <li class="font-medium text-[12px] text-sub">
              {{ $t("LABELS.Customer Card") }}
            </li>
          </ul>
        </div>
        <div>
          <table class="w-full rounded-md">
            <tbody>
              <tr class=" ">
                <td class="text-[12px] uppercase p-[10px] text-[#777790]">
                  {{ $t("ORDER.Sub total") }} :
                </td>
                <td class="text-[12px] p-[10px] text-[#777790] uppercase">
                  {{
                    invoice.price_detail.total_item_price_before_discount +
                    " " +
                    invoice.price_detail.currency
                  }}
                </td>
              </tr>
              <tr class=" ">
                <td class="text-[12px] p-[10px] text-[#777790]">
                  {{
                    $t("ORDER.Tax (VAT)", {
                      value: invoice.price_detail.tax_rate_percentage + "%",
                    })
                  }}
                </td>
                <td class="text-[12px] p-[10px] text-[#777790] uppercase">
                  {{
                    invoice.price_detail.tax_rate_value +
                    " " +
                    invoice.price_detail.currency
                  }}
                </td>
              </tr>

              <tr class=" " v-if="invoice.price_detail.surcharge_value">
                <td class="text-[12px] p-[10px] text-[#777790]">
                  {{ $t("LABELS.Surcharge") }}
                </td>
                <td class="text-[12px] p-[10px] text-[#777790] uppercase">
                  {{
                    invoice.price_detail.surcharge_value +
                    " " +
                    invoice.price_detail.currency
                  }}
                </td>
              </tr>
              <tr class=" ">
                <td class="text-[12px] p-[10px] text-[#777790]">
                  {{ $t("ORDER.Tips amount") }}
                </td>
                <td class="text-[12px] p-[10px] text-[#777790] uppercase">
                  {{
                    invoice.price_detail.tips_amount +
                    " " +
                    invoice.price_detail.currency
                  }}
                </td>
              </tr>
              <tr class=" ">
                <td class="text-[12px] p-[10px] text-[#777790]">
                  {{
                    $t("ORDER.Discount") +
                    " (" +
                    invoice.price_detail.coupon_percentage +
                    "%" +
                    ")"
                  }}
                </td>
                <td class="text-[12px] p-[10px] text-[#777790] uppercase">
                  {{
                    invoice.price_detail.discount_value +
                    " " +
                    invoice.price_detail.currency
                  }}
                </td>
              </tr>
            </tbody>
            <tfoot class="bg-[#EFF0FD99]">
              <td class="text-start font-bold rounded-md p-[10px] text-[12px]">
                {{ $t("ORDER.Total Amount") }}
              </td>
              <td
                class="text-start font-bold rounded-md p-[10px] text-[12px] uppercase"
              >
                {{
                  invoice.price_detail.total_price +
                  " " +
                  invoice.price_detail.currency
                }}
              </td>
            </tfoot>
          </table>
        </div>
      </div>
      <div class="text-center font-medium text-[12px]">
        {{ $t("THANK YOU FOR YOUR ORDER! PLEASE VISIT us AGAIN") }}
      </div>
    </base-card>

    <div class="flex justify-end items-center gap-2 buttons">
      <base-button
        @click="printInvoice"
        type="button"
        name="print"
        :loading="invoiceLoading"
        icon="printer"
        classes="capitalize base-btn min-w-[120px] rounded-lg py-3"
      />

      <base-button
        @click="printPDF"
        type="button"
        name="PDF"
        :loading="downloadLoading"
        icon="arrow-bottom"
        icon1="download"
        classes="capitalize text-text export-btn min-w-[120px] rounded-lg py-3"
      />

      <router-link
        v-if="!hideDetails"
        :to="`/pos/orders/${invoice.id}`"
        class="capitalize export-btn text-sub min-w-[120px] rounded-lg py-3"
      >
        {{ $t("BUTTONS.View Details") }}
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { onMounted, ref } from "vue";
import JsPDF from "jspdf";
import html2canvas from "html2canvas";
const props = defineProps({
  invoice: {
    required: true,
    type: Object,
  },
  hideDetails: {
    required: false,
    default: false,
  },
  print: {
    required: false,
    default: false,
  },
});

const { t } = useI18n();

const invoiceLoading = ref(false);
const downloadLoading = ref(false);
const emit = defineEmits(["printed"]);
function printPDF() {
  downloadLoading.value = true;
  const contentPrint = document.querySelector("#invice");
  html2canvas(contentPrint, { scale: 2 }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new JsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
    });
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("invoice.pdf");
    downloadLoading.value = false;
  });
}

// function printInvoice() {
//   window.print();
// }

function printInvoice() {
  invoiceLoading.value = true;
  const element = document.getElementById("invice");
  html2canvas(element, { scale: 1.5 }).then((canvas) => {
    const printWindow = window.open("", "_blank");
    const img = printWindow.document.createElement("img");
    img.src = canvas.toDataURL("image/png");
    printWindow.document.body.appendChild(img);

    img.onload = function () {
      printWindow.print();
      invoiceLoading.value = false;
      printWindow.close();
      emit("printed");
    };
  });
}

onMounted(() => {
  if (props.print) {
    printInvoice();
  }
});
</script>

<style></style>
