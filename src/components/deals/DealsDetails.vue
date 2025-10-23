<template>
  <div class="deal-details">
    <ul class="top-header">
      <li>
        <p class="title">{{ $t("TEXT.Deal Number") }}</p>
        <p class="value">#{{ deal.serial_number }}</p>
      </li>
      <li>
        <p class="title">{{ $t("TEXT.deal date and time") }}</p>
        <p class="value">
          {{
            new Date(deal.created_at)
              .toLocaleDateString(locale == "ar" ? "ar-eg" : "en-us", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })
              .replace("at", "-")
              .replace("pm", "PM")
              .replace("am", "AM")
          }}.
        </p>
      </li>
      <li>
        <p class="title">{{ $t("TEXT.Offers offered") }}</p>
        <p class="value">
          +{{ deal.offers_count }} {{ $t("TEXT.Offer offered") }}
        </p>
      </li>
      <li>
        <p class="title">{{ $t("TEXT.Total order") }}</p>
        <p class="value">{{ deal.total }}</p>
      </li>
    </ul>
    <h3 class="mb-3 text-text font-bold text-xl">
      {{ $t("LABELS.Client Details") }}
    </h3>
    <ul class="top-header" v-if="deal.user">
      <li>
        <p class="title">{{ $t("LABELS.facility type") }}</p>
        <p class="value">{{ deal.user.facility_type.name }}</p>
      </li>
      <li>
        <p class="title">{{ $t("LABELS.Client Name") }}</p>
        <p class="value">{{ deal.user.full_name }}</p>
      </li>
      <li v-if="deal.user?.email">
        <p class="title">{{ $t("LABELS.emailAddress") }}</p>
        <p class="value">
          {{ deal.user.email }}
        </p>
      </li>
      <li>
        <p class="title">{{ $t("LABELS.Member From") }}</p>
        <p class="value">
          {{ deal.user.created_at }}
        </p>
      </li>
    </ul>
    <ul class="top-header address">
      <li>
        <p class="title">{{ $t("TITLES.Delivery Address") }}</p>
        <p class="value">{{ deal.address?.address ?? "-" }}</p>
      </li>

      <li v-if="deal.address">
        <a
          target="_blank"
          :href="`https://www.google.com/maps/dir/?api=1&origin=${
            location ? `${location?.lat},${location?.lng}` : 'Cuurent Location'
          },&destination=${deal.address.lat},${deal.address.lng}`"
          class="location"
        >
          {{ $t("TEXT.Show Location") }}
          <svg-icon name="location" />
        </a>
      </li>
    </ul>

    <ul class="top-header order-summary">
      <li>
        <p class="title">{{ $t("TEXT.Subtotal") }}</p>
        <p class="value">{{ deal.sub_total }}</p>
      </li>
      <li>
        <p class="title">
          {{ $t("LABELS.delivery") }}
          <template v-if="deal.shipping_type">
            <span class="shipping_type text-red-500">
              {{ deal.shipping_type }}</span
            >
          </template>
          <span class="text-sm">( {{ deal.date }} )</span>
        </p>
        <p class="value">{{ deal.shipping_price }}</p>
      </li>
      <li>
        <p class="title font-bold">{{ $t("TEXT.Total order") }}</p>
        <p class="value font-bold">{{ deal.total }}</p>
      </li>
    </ul>
    <ul class="top-header order-summary">
      <li>
        <p class="title">{{ $t("LABELS.Notes") }}</p>
        <p class="value">{{ deal.notes }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();
defineProps({
  deal: {
    required: true,
    type: Object,
  },
});
const location = ref(null);

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      location.value = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };
    });
  }
}

onMounted(() => getLocation());
</script>

<style lang="scss">
@font-face {
  font-display: swap;
  font-family: "Aclonica";
  font-style: normal;
  font-weight: 400;
  src: url("@/styles/fonts/Aclonica-Regular.ttf") format("woff2");
}

.deal-details {
  .top-header {
    @apply mb-7 grid grid-cols-1 gap-3 border-b border-line pb-7 last:mb-0 last:border-0 last:pb-0 sm:grid-cols-2 lg:grid-cols-4;
    .title {
      @apply mb-2 text-sm text-sub;
    }
    .value {
      @apply text-lg text-text;
    }
  }
  .address {
    @apply flex flex-wrap items-center justify-between;
    .location {
      @apply inline-flex items-center gap-2 rounded-full bg-[#F8FBFD] px-5 py-3 text-[#BBBDBF];
    }
  }
  .order-summary {
    @apply flex flex-col;
    li {
      @apply flex flex-wrap items-center justify-between;
      .title {
        @apply mb-0 text-lg;
      }
      .shipping_type {
        font-family: "Aclonica";
      }
    }
  }
}
</style>
