<template>
  <div>
    <button @click="showDateTime = true" :class="classes">
      <template v-if="selectedTime">
        {{
          new Date(
            selectedTime.date + " " + selectedTime.time
          ).toLocaleDateString("en-GB", formatter)
        }}
        <svg-icon name="calendar" />
      </template>

      <span v-else> {{ label }}</span>
    </button>
    <Teleport to="body">
      <modal :hide-header="true" v-if="showDateTime" class="z-[9999]">
        <div v-if="step == 1" class="mx-auto w-fit">
          <Calendar v-model="date" inline showWeek :minDate="minDate" />
        </div>

        <div v-else class="mb-3">
          <div class="w-full grid grid-cols-3">
            <div
              class="border border-border border-e-0"
              :class="
                locale == 'en'
                  ? 'rounded-tl-xl rounded-bl-xl'
                  : 'rounded-tr-xl rounded-br-xl'
              "
            >
              <h3 class="text-center text-xl py-2">{{ $t("LABELS.hours") }}</h3>
              <div class="h-[220px] overflow-auto">
                <button
                  @click="timeForm.hour = i"
                  v-for="i in 12"
                  :key="i"
                  class="text-xl block w-full py-2"
                  :class="timeForm.hour == i && 'text-primary font-semibold'"
                >
                  {{ i }}
                </button>
              </div>
            </div>

            <div class="border border-border border-e-0">
              <h3 class="text-center text-xl py-2">
                {{ $t("LABELS.minutes") }}
              </h3>

              <div class="h-[220px] overflow-auto">
                <button
                  @click="timeForm.minute = i"
                  v-for="i in 59"
                  :key="i"
                  class="text-xl block w-full py-2"
                  :class="timeForm.minute == i && 'text-primary font-semibold'"
                >
                  <span> {{ i < 10 ? `0${i}` : i }}</span>
                </button>
              </div>
            </div>

            <div
              class="border border-border"
              :class="
                locale == 'en'
                  ? 'rounded-tr-xl rounded-br-xl'
                  : 'rounded-tl-xl rounded-bl-xl'
              "
            >
              <button
                @click="timeForm.AmPm = 'am'"
                class="text-xl block w-full py-2"
                :class="timeForm.AmPm == 'am' && 'text-primary font-semibold'"
              >
                {{ $t("LABELS.AM") }}
              </button>

              <button
                @click="timeForm.AmPm = 'pm'"
                class="text-xl block w-full py-2"
                :class="timeForm.AmPm == 'pm' && 'text-primary font-semibold'"
              >
                {{ $t("LABELS.PM") }}
              </button>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end w-full gap-3">
          <button
            class="base-btn-white rounded-lg py-4 px-7"
            @click="
              showDateTime = false;
              step = 1;
            "
          >
            {{ $t("BUTTONS.cancel") }}
          </button>

          <button @click="changeStep" class="base-btn rounded-lg py-4 px-7">
            {{ $t("BUTTONS.continue") }}
          </button>
        </div>
      </modal>
    </Teleport>
  </div>
</template>

<script setup>
import Calendar from "primevue/calendar";
import { watch } from "vue";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  minDate: {
    type: Date,
    required: false,
  },
  formatter: {
    required: false,
    default: {
      day: "numeric",
      month: "short",
    },
  },
  maxDate: {
    type: Date,
    required: false,
  },
  cart: {
    required: false,
  },
  classes: {
    required: false,
    default: "base-btn-white rounded-md !min-w-0 px-1 w-full py-4",
  },
});

const { locale } = useI18n();

const showDateTime = ref(false);

const date = ref(new Date());

const timeForm = ref({
  hour:
    new Date().getHours() > 12
      ? new Date().getHours() - 12
      : new Date().getHours(),
  minute: new Date().getMinutes(),
  AmPm: new Date().getHours() > 12 ? "pm" : "am",
});

const step = ref(1);

const selectedTime = ref(null);

const changeStep = () => {
  if (1 == step.value) {
    step.value = 2;
  } else {
    const time = new Date();

    if (timeForm.value.AmPm == "am" && +timeForm.value.hour != 12) {
      time.setHours(+timeForm.value.hour);
    } else if (timeForm.value.AmPm == "am" && +timeForm.value.hour == 12) {
      time.setHours(0);
    }

    if (timeForm.value.AmPm == "pm" && +timeForm.value.hour != 12) {
      time.setHours(+timeForm.value.hour + 12);
    } else if (timeForm.value.AmPm == "pm" && +timeForm.value.hour == 12) {
      time.setHours(12);
    }

    time.setMinutes(timeForm.value.minute);

    selectedTime.value = {
      date: formattedDate(date.value),
      time: time.toLocaleTimeString(),
    };

    emits("submit", selectedTime.value);

    step.value = 1;
    showDateTime.value = false;
  }
};

const emits = defineEmits(["submit"]);

function formattedDate(value) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

watch(
  () => props.cart,
  () => {
    if (props.cart) {
      if (props.cart.order_date) {
        selectedTime.value = {
          date: props.cart.order_date,
          time: props.cart.order_time,
        };
      }
    }
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>

<style lang="scss">
.popup-date-time {
  @apply fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl p-7;
  box-shadow: 0px 7px 58px 0px #b1b1b11a;

  .p-datepicker table td {
    padding: unset !important;
    border: 1px solid #f1f1ff;
  }
  .p-datepicker table td > span {
    width: 3rem;
    height: 3rem;
    border-radius: unset !important;
    transition: none;
    border: 1px solid transparent;

    &.p-highlight {
      color: #fff !important;
      background: #fdb933 !important;
    }
    &.p-disabled {
      color: #828aba !important;
      background: #f1f1f9 !important;
    }
  }
}
</style>
