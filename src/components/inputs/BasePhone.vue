<template>
  <div>
    <VeeField :name="name" v-slot="{ field, meta }">
      <div
        class="phone_wrapper rounded-full"
        @click.stop
        :class="{
          error: !meta.valid && meta.touched,
        }"
      >
        <label v-if="topLabel" for="phone_nubmer" class="text-sub block">{{
          topLabel
        }}</label>
        <div class="phone_wrapper_content relative flex items-center !py-3">
          <div class="phone_input flex-1 border-text-dark ps-2">
            <input
              class="appearance-none"
              v-bind="field"
              @click.stop="show = false"
              :id="id"
              :pattern="pattern"
              type="number"
              :name="name"
              autocomplete="off"
              :placeholder="placeholder"
            />
          </div>
          <div class="relative">
            <VeeField :name="phoneCode">
              <Menu as="div" class="z-50" v-slot="{ open }">
                <MenuButton>
                  <div class="font-normal" v-if="country">
                    ({{ country.phone_code }}+)

                    <i
                      class="fa-solid text-sm m-auto text-text mx-1"
                      :class="open ? 'fa-angle-up' : 'fa-angle-down'"
                    ></i>
                  </div>
                </MenuButton>
                <transition
                  enter-active-class="transition duration-100 ease-out"
                  enter-from-class="transform scale-95 opacity-0"
                  enter-to-class="transform scale-100 opacity-100"
                  leave-active-class="transition duration-75 ease-in"
                  leave-from-class="transform scale-100 opacity-100"
                  leave-to-class="transform scale-95 opacity-0"
                >
                  <MenuItems
                    class="absolute left-0 m-auto cursor-pointer overflow-y-scroll max-h-[200px] w-[100px] origin-top-right divide-y z-50 divide-gray-100 rounded bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    :class="$i18n.locale == 'ar' ? 'left-0' : ' right-0'"
                  >
                    <MenuItem v-for="option in countries" :key="option.id">
                      <button
                        type="button"
                        @click="selectOption(option)"
                        class="block w-[100%] text-black h-12 hover:bg-[#EEE] pl-3 text-left"
                      >
                        <div class="flex items-center">
                          + {{ option.phone_code }}
                        </div>
                      </button>
                    </MenuItem>
                  </MenuItems>
                </transition>
              </Menu>
            </VeeField>
          </div>
        </div>
      </div>
      <VeeErrorMessage
        v-if="!meta.valid && meta.touched"
        :name="name"
        as="div"
        class="text-red-500"
      />
      <VeeErrorMessage
        v-if="!meta.valid && meta.touched"
        :name="phoneCode"
        as="div"
        class="text-red-500"
      />
    </VeeField>
  </div>
</template>

<script setup>
const pattern = "\\d{3}-\\d{3}-\\d{3}";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import { ref, onMounted } from "vue";
import { useField } from "vee-validate";
import axios from "axios";

// Add the directive to the component's setup context

const props = defineProps({
  name: {
    required: false,
  },
  label: {
    required: false,
  },
  topLabel: {
    required: false,
  },
  placeholder: {
    required: false,
  },
  phoneCode: {
    required: false,
    default: "phoneCode",
  },
  url: {
    required: false,
  },
  phone_code: {
    required: false,
  },
  id: {
    required: false,
  },
});

const phoneCodeValue = useField(props.phoneCode ?? "phoneCode");

const countries = ref([]);
const loading = ref(false);
const country = ref();

function selectOption(e) {
  country.value = e;

  phoneCodeValue.setValue(e);
}

function getStatics() {
  axios({
    method: "GET",
    url: props.url,
  })
    .then((res) => {
      countries.value = res.data.data;
      if (props.phone_code) {
        country.value = props.phone_code;
      } else {
        country.value = countries.value[0];
      }
      phoneCodeValue.setValue(country.value);
      loading.value = false;
    })
    .catch(() => (loading.value = false));
}
onMounted(() => {
  if (props.url) {
    getStatics();
  }
});
</script>

<style lang="scss">
.phone_wrapper {
  label {
    @apply text-sub text-sm block mb-1;
  }
  .phone_wrapper_content {
    @apply rounded-lg py-5 px-2 border border-line  focus:border-primary;
    transition: border 0.3s ease-in;
    input {
      @apply focus:outline-none focus:shadow-none w-full caret-primary font-normal text-base;
    }
    &:focus,
    &:focus-within {
      @apply border-primary;
      .phone_input {
        @apply border-primary;
      }
    }
  }

  &.error {
    .phone_wrapper_content {
      @apply border-orange-500;
    }
    label {
      @apply text-red-500;
    }
    .phone_input {
      @apply border-orange-500;
    }
  }
}
</style>
