<template>
  <div
    class="float_date bg-white relative w-full h-[50px] rounded-md border p-1 flex items-center border-[#d1dee1]"
  >
    <div dir="lrt">
      <VueDatePicker
        v-model="date"
        :enable-time-picker="false"
        :max-date="maxDate"
        no-today
        model-type="yyyy-MM-dd"
        :id="id"
        :placeholder="placeholder"
        auto-apply
        :month-picker="monthPicker"
        :year-picker="yearPicker"
        :range="dateRange ? true : false"
        @clear="clearDates"
      >
        <template #arrow-left>
          <i class="fa-solid" :class="{'fa-angle-left': locale == 'en', 'fa-angle-right': locale == 'ar'}" />
        </template>
        <template #arrow-right>
          <i class="fa-solid" :class="{'fa-angle-right': locale == 'en', 'fa-angle-left': locale == 'ar'}" />
        </template>
      </VueDatePicker>
    </div>

    <svg-icon
      name="calendar"
      class="absolute top-1/2 -translate-y-1/2 insest-xe-4 text-primary"
    />
  </div>
</template>

<script setup>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { ref, watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();
const props = defineProps({
  id: {
    type: String,
    required: true,
    default: null,
  },
  placeholder: {
    type: String,
    required: true,
    default: null,
  },
  icon: {
    type: Boolean,
    required: false,
    default: false,
  },
  monthPicker: {
    required: false,
    default: false,
  },
  defaultDate: {
    required: false,
  },
  itemValue: {
    required: true,
  },
  maxDate: {
    required: false,
  },
  dateRange: {
    required: false,
    default: false,
  },
  yearPicker: {
    required: false,
    default: false,
  },
});

const date = ref(
  props.dateRange ? props.itemValue || [null, null] : props.itemValue || ""
);

onMounted(() => {
  if (props.itemValue) {
    date.value = props.dateRange ? props.itemValue : props.itemValue;
  }
});

const emit = defineEmits(["update:itemValue", "change"]);

const updateValue = (newRange) => {
  emit("update:itemValue", newRange);
  emit("change", newRange);
};

const clearDates = () => {
  if (props.dateRange) {
    date.value = [null, null];
    updateValue([null, null]);
  } else {
    date.value = "";
    updateValue("");
  }
};

watch(
  () => props.dateRange,
  (newRange) => {
    date.value = newRange
      ? props.itemValue || [null, null]
      : props.itemValue || "";
  }
);

watch(
  () => date.value,
  (value) => {
    if (props.dateRange) {
      const formattedRange = value?.map((date) => {
        if (date) {
          const d = new Date(date);
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, "0");
          const day = String(d.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        }
        return null;
      });
      updateValue(formattedRange);
    } else if (value) {
      let formattedDate = "";

      const d = new Date(value);
      if (!isNaN(d)) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");

        formattedDate = `${year}-${month}-${day}`;
      }

      updateValue(value);
    } else {
      updateValue(props.dateRange ? [null, null] : "");
    }
  }
);
</script>

<style lang="scss">
.float_date {
  .p-calendar.p-component.p-inputwrapper {
    width: 100%;
    input {
      border: none !important;
      box-shadow: none !important;
      background-color: transparent !important;
      padding-inline-start: 0.95rem !important;
      padding-inline-end: 1.6rem !important;
      z-index: 10;
     
    }
  }
  .dp__icon.dp__input_icon {
    display: none;
  }
  .dp__input {
    border: 0 !important;

    @apply py-0 ps-1 pe-7 placeholder:text-sub placeholder:font-neo-sans placeholder:text-sm;
  }
  .dp__clear_icon {
    inset-inline-end: 1rem;
  }
}
</style>
