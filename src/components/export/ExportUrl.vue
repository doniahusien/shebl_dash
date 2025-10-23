<script lang="ts" setup>
import axios from "axios";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import JsonExcel from "vue-json-excel3";
import { useRoute } from "vue-router";
import ProgressSpinner from "primevue/progressspinner";
import { useAppAuth } from "@/store/auth";
const appAuth = useAppAuth();
const doctorUrl = import.meta.env.VITE_DOCTOR_URL;
const adminUrl = import.meta.env.VITE_BASE_URL;
interface Props {
  url: string;
  fields?: {};
  query?: {};
  customUrl?: string;
  specificFields?: {};
}
const { t } = useI18n();
const route = useRoute();
const props = defineProps<Props>();
const loading = ref(false);

const json_fields = ref({
  Client: "client.full_name",
});

const downloadExcel = async () => {
  if (loading.value) return;
  loading.value = true;
  const params = new URLSearchParams();
  const queries = { ...route.query, ...props.query };
  (<any>Object).entries(queries).forEach((element: any) => {
    if (element[0] !== "page") {
      if (element[1]) params.append(element[0], element[1]);
    }
  });
  const response = await axios.get(appAuth.user_type === 'doctor' ? doctorUrl + '/' + props.url : adminUrl + '/' + props.url, {
    params,
  });
  
  if (response.data.data.length) {
    json_fields.value = Object.keys(response.data.data[0]).reduce(
      (acc: any, item: any) => {
        acc[t(`LABELS.${String(item)}`)] = String(item);
        return acc;
      },
      {}
    );

    if (props.fields) {
      json_fields.value = {
        ...json_fields.value,
        ...props.fields,
      };
    }
  }
  else if(props.customUrl){
    json_fields.value = Object.keys(response.data.data[props.customUrl][0]).reduce(
      (acc: any, item: any) => {
        acc[t(`LABELS.${String(item)}`)] = String(item);
        return acc;
      },
      {}
    );
    if (props.fields) {
      json_fields.value = {
        ...json_fields.value,
        ...props.fields,
      };
    }
    if(props.specificFields){
      json_fields.value = {
        ...props.specificFields,
      };
    }
    response.data.data = response.data.data[props.customUrl];
  }
  loading.value = false;
  return response.data.data;
};
</script>

<template>
  <JsonExcel
    :fields="json_fields"
    :fetch="downloadExcel"
    :title="t('LABELS.download_excel')"
    class="cursor-pointer"
    >
    <!-- class="flex items-center gap-1 py-2 px-4 text-text cursor-pointer mb-4 rounded-full justify-center w-fit border border-primary" -->
    <ProgressSpinner
      v-if="loading"
      style="width: 30px; height: 30px"
      strokeWidth="5"
      fill="var(--surface-ground)"
      animationDuration=".5s"
      aria-label="Custom ProgressSpinner"
    />
    <svg-icon v-else name="excel" class="size-[28px]"  />
    <!-- {{ t("BUTTONS.import") }} -->
  </JsonExcel>
</template>

<style lang="postcss" scoped></style>
