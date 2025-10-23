<template>
  <VeeField :name="name" v-slot="{ field, meta }">
    <div
      class="input_wrapper"
      :class="{
        error: !meta.valid && meta.touched,
      }"
    >
      <label :for="id" class="label" v-if="label">{{ label }}</label>

      <div :class="icon ? 'with_icon' : ''">
        <VueDatePicker
          :disabled="disabled"
          v-model="date"
          :enable-time-picker="enableTimePicker"
          :max-date="maxDates"
          :min-date="minDates"
          :max-time="maxTime"
          :min-time="minTime"
          no-today
          :time-picker="timePicker"
          :model-type="
            enableTimePicker
              ? 'yyyy-MM-dd HH:mm'
              : timePicker
              ? is24
                ? sharpHours?'HH' :'HH:mm'
                : 'hh:mm aa'
              : 'yyyy-MM-dd'
          "
          :select-text="$t('BUTTONS.apply')"
          :cancel-text="$t('BUTTONS.cancel')"
          :date-select="dateSelect"
          :id="id"
          :placeholder="placeholder"
          :auto-apply="autoApply"
          :month-picker="monthPicker"
          :year-picker="yearPicker"
          v-bind="field"
          :teleport="true"
          @clear="date = ''"
          :is-24="is24"
          :dir="locale == 'ar' ? 'rtl' : 'ltr'"
        >
          <template #input-icon>
            <svg-icon
              classes="z-30 icon !relative !translate-y-0 icon"
              v-if="icon"
              :name="icon"
            />
          </template>
          <template #arrow-left>
            <i class="fa-solid" :class="{'fa-angle-left': locale == 'en', 'fa-angle-right': locale == 'ar'}" />
        </template>
        <template #arrow-right>
            <i class="fa-solid" :class="{'fa-angle-right': locale == 'en', 'fa-angle-left': locale == 'ar'}" />
        </template>
        </VueDatePicker>
      </div>

      <VeeErrorMessage
        v-if="!meta.valid && meta.touched"
        :name="name"
        as="div"
        class="text-error"
      />
    </div>
  </VeeField>
</template>

<script setup>
import { useField } from "vee-validate";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { ref, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();
const props = defineProps({
  id: {
    required: true,
  },
  name: {
    required: true,
  },
  dateSelect: {
    required: false,
  },
  disabled: {
    required: false,
    default: false,
  },

  label: {
    required: false,
  },
  placeholder: {
    required: true,
  },
  is24: {
    required: false,
  },
  itemValue: {
    required: false,
  },
  icon: {
    required: false,
  },
  timePicker: {
    required: false,
    default: false,
  },
  autoApply: {
    required: false,
    default: true,
  },
  enableTimePicker: {
    required: false,
    default: false,
  },
  maxDate: {
    required: false,
  },
  minDate: {
    required: false,
  },
  maxTime: {
    required: false,
  },
  minTime: {
    required: false,
  },
  monthPicker: {
    required: false,
  },
  yearPicker: {
    required: false,
  },
  timeOnly: {
    required: false,
  },
  sharpHours: {
    required: false,
    default: false,
  },
});

const fieldValue = useField(props.name);

const date = ref("");
onMounted(() => {
  if (props.itemValue) {
    date.value = props.itemValue;
  }
});

const minDates = ref(null);
const maxDates = ref(null);

const emit = defineEmits(["update:itemValue", "change"]);

const updateValue = (event) => {
  fieldValue.setValue(event);
  emit("update:itemValue", event ?? "");

  emit("change", event ?? "");
};

watch(
  () => date.value,
  (value) => {
    let formattedDate = "";
    const date = new Date(value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const hour = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    if (props.enableTimePicker) {
      formattedDate = `${year}-${month}-${day} ${hour}:${minutes}`;
    } else if (props.timeOnly) {
      formattedDate = value;
    } else {
      formattedDate = `${year}-${month}-${day}`;
    }

    updateValue(formattedDate);
  }
);

watch(
  () => props.minDate,
  (value) => {
    if (value) {
      minDates.value = value;
    }
  },
  {
    immediate: true,
    deep: true,
  }
);
watch(
  () => props.maxDate,
  (value) => {
    if (value) {
      maxDates.value = value;
    }
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>

<style>
.dp__theme_light {
  --dp-primary-color: #45a5a0;
}
</style>
