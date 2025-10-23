<template>
  <base-card class="bg-white" v-if="items">
    <section-title
      :title="title"
      :link="link"
      :icon="`fa-solid ps-1 ${
        locale == 'en' ? ' fa-arrow-right' : ' fa-arrow-left'
      }`"
    >
      <template #actions>
        <slot name="actions"></slot>
      </template>
    </section-title>
    <data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      hide-footer
    >
      <!-- :sort-by="sortBy"
            :sort-type="sortType"
            @update:sort-type="onSortTypeChange"
            @update:sort-by="onSortChange" -->
      <template #header-created_at>
        <span
          @click="toggleSort('created_at')"
          :title="
            sortType === 'asc' ? $t('LABELS.latest') : $t('LABELS.oldest')
          "
          style="cursor: pointer; user-select: none"
          class="flex items-center gap-2"
        >
          {{ $t("LABELS.createdAt") }}
          <span v-if="sortBy === 'created_at'">
            <span v-if="sortType === 'asc'">
              <!-- ⬆️ -->
              <svg-icon name="arrow-up"
            /></span>
            <span v-else>
              <!-- ⬇️ -->
              <svg-icon name="arrow-up" class="rotate-180" />
            </span>
          </span>
          <span v-else>⇅</span>
        </span>
      </template>
      <template #loading>
        <loader class="py-7" />
      </template>
      <template #empty-message>
        <div
          v-if="
            !$route.query.keyword &&
            !$route.query.doctor_name &&
            !$route.query.status &&
            !$route.query.date &&
            !$route.query.specialty
          "
          class="h-full flex flex-col items-center justify-center space-y-6"
        >
          <div class="text-center">
            <h3 class="mt-4 font-semibold text-text text-center">
              {{
                $t("TITLES.No have been added yet", {
                  name: $t("LABELS.client-appointments"),
                })
              }}
            </h3>
          </div>
        </div>

        <div
          v-else
          class="h-full flex flex-col items-center justify-center space-y-6"
        >
          <img src="@/assets/images/search.png" alt="no data" class="mx-auto" />
          <h3 class="mt-4 font-semibold text-text text-center">
            {{ $t("TITLES.No Search result") }}
          </h3>
        </div>
      </template>

      <template #item-id="{ id }">
        <small-details-card :title="`#${id}`" />
      </template>

      <template
        #item-name="{ client, client_id, client_phone_code, client_phone }"
      >
        <router-link
          :to="`/users/show/${client_id}`"
          v-if="checkPermission('clients', 'show') || user_type === 'doctor'"
        >
          <small-details-card :title="client" />
          <div class="flex gap-2 items-center flex-wrap">
            <bdi>
              <small-details-card
                :text="'+' + client_phone_code + ' ' + client_phone"
              />
            </bdi>
          </div>
        </router-link>
        <template v-else>
          <small-details-card :title="client" />
          <div class="flex gap-2 items-center flex-wrap">
            <bdi>
              <small-details-card
                :text="'+' + client_phone_code + ' ' + client_phone"
              />
            </bdi>
          </div>
        </template>
      </template>

      <template #item-doctor="{ doctor }">
        <router-link
          :to="`/doctors/show/${doctor?.id}`"
          v-if="checkPermission('doctors', 'show') || user_type === 'doctor'"
        >
          <small-details-card
            :title="doctor?.name"
            :text="doctor?.code ? `${$t('LABELS.code')}: ${doctor?.code}` : ''"
            :subText="`${doctor?.specialty?.name} ${
              doctor?.sub_specialty ? ` - ${doctor?.sub_specialty?.name}` : ''
            }`"
          />
        </router-link>
        <template v-else>
          <small-details-card
            :title="doctor?.name"
            :text="doctor?.code ? `${$t('LABELS.code')}: ${doctor?.code}` : ''"
            :subText="`${doctor?.specialty?.name} ${
              doctor?.sub_specialty ? ` - ${doctor?.sub_specialty?.name}` : ''
            }`"
          />
        </template>
      </template>
      <template #item-specialty="{ doctor }">
        <small-details-card
          :title="doctor?.specialty?.name"
          :text="doctor?.sub_specialty ? doctor?.sub_specialty?.name : ''"
        />
      </template>
      <template #item-reservation_time="{ day, time }">
        <small-details-card
          :title="
            new Date(day).toLocaleDateString(locale == 'ar' ? 'ar-eg' : 'en-us')
          "
          :text="time"
        />
      </template>
      <template #item-consultation_fee="{ doctor }">
        <small-details-card :title="doctor?.price + ' ' + $t('LABELS.SAR')" />
      </template>
      <template #item-created_at="{ created_at }">
        <small-details-card
          :title="new Date(created_at).toLocaleDateString()"
          :text="
            new Date(created_at).toLocaleTimeString(
              locale == 'ar' ? 'ar-eg' : 'en-us'
            )
          "
        />
      </template>

      <template #item-status="{ status, cancelled_by }">
        <p
          v-if="status == 'canceled'"
          class="font-semibold text-sm capitalize rounded-md px-1 mx-2 py-2 mb-2 text-center"
          :class="
            getStatusColor(status) +
            ' ' +
            (locale == 'ar' ? 'font-neo-sans' : 'font-switzer')
          "
        >
          {{ $t(`STATUS.${status}`) }}
          <span v-if="cancelled_by"
            >{{ $t("LABELS.by") }} {{ $t(`LABELS.${cancelled_by}`) }}</span
          >
        </p>
        <p
          v-else
          class="font-semibold text-sm capitalize rounded-md px-1 mx-2 py-2 mb-2 text-center"
          :class="
            getStatusColor(status) +
            ' ' +
            (locale == 'ar' ? 'font-neo-sans' : 'font-switzer')
          "
        >
          {{ $t(`STATUS.${status}`) }}
        </p>
      </template>

      <template #item-actions="{ id }">
        <div class="flex items-center gap-4 justify-center">
          <router-link :to="`/reservations/show/${id}`">
            <svg-icon class="text-primary" name="eye2" filled />
          </router-link>
        </div>
      </template>
    </data-table>
  </base-card>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { checkPermission } from "@/utils/permissions";
import getStatusColor from "@/utils/getStatusColor.ts";
defineProps({
  items: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
});

const { t, locale } = useI18n();

const headers = [
  {
    text: t("LABELS.reservation id"),
    align: "start",
    sortable: false,
    value: "id",
  },
  {
    text: t("LABELS.Client"),
    align: "start",
    sortable: false,
    value: "name",
  },
  {
    text: t("LABELS.reservation time"),
    align: "start",
    sortable: false,
    value: "reservation_time",
  },
  {
    text: t("TITLES.createdAt"),
    align: "start",
    sortable: false,
    value: "created_at",
  },
  {
    text: t("LABELS.Status"),
    align: "start",
    sortable: false,
    value: "status",
  },
  {
    text: t("TITLES.actions"),
    align: "start",
    sortable: false,
    value: "actions",
  },
];
</script>
<style lang="postcss" scoped></style>
